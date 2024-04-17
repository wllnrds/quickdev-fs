import { createTransport } from 'nodemailer'

export async function sendMail( data : any ){
    if(!process.env.EMAIL_SERVER_HOST){
        throw new Error("Missing email host config as EMAIL_SERVER_HOST")
    }

    const transporter = createTransport({ 
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        secure: process.env.EMAIL_SERVER_PORT == "465" ? true : false,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
        }
    });

    const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
    })

    const failed = result.rejected.concat( result.pending ).filter( Boolean )
    if( failed.length ){
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}