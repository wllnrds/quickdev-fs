import User from "@/controller/user"
import { auth } from "@/lib/auth"

export async function POST(req: Request){
    const sprint_start = Date.now()

    try {
        const data = await req.json()

        const user = await User.createUser({
            name: data.name,
            email: data.email,
            password: data.password
        })

        return Response.json({ 
            meta: {
                "action": 'create user',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            }, 
            data: user
        })
    } catch (error : any ) {
        return Response.json({ 
            meta: {
                "action": 'create user',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            }, 
            error: {
                message: error.message
            }
        },{
            status: 400
        })
    }
}

export async function PUT (req: Request){
    const sprint_start = Date.now()
    
    const session = await auth()

    if( !session?.user || !session.user.email ){
        return Response.json({
            meta: {
                "action": 'update user',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            error: {
                message: "Usuário não autenticado."
            }
        },{
            status: 401
        })
    }

    try {
        const data = await req.json()

        if( !data.name ){
            return Response.json({
                meta: {
                    "action": 'update user',
                    "timestamp": Date.now(),
                    "time": Date.now() - sprint_start + "ms"
                },
                error: {
                    message: "Campo nome ausente."
                }
            },{
                status: 401
            })
        }

        const user = await User.updateUser({
            id: parseInt(session.user.id || ''),
            name: data.name,
            email: session.user.email ,
        })
        
        return Response.json({ 
            meta: {
                "action": 'update user',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            }, 
            data: user
        })
    } catch (error) {
        return Response.json({ 
            meta: {
                "action": 'update user',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            }, 
            error 
        },{
            status: 400
        })
    }
}