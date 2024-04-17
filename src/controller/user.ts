import Prisma from "@/lib/prisma"
import BCrypt from 'bcrypt'

async function createUser( data : { name: string, email: string, password: string }){
    try {
        const pass_c = BCrypt.hashSync( data.password, 10)
        const user = await Prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: pass_c
            }
        })
        return user;
    } catch (error) {
        return {
            error: {
                message: "Falha ao criar usuário."
            }
        }   
    }
}

async function updateUser( data : { name: string, email: string }){
    try {
        const user = await Prisma.user.update({
            where: {
                email: data.email
            },
            data: {
                name: data.name
            }
        })
        return user;
    } catch (error) {
        return {
            error: {
                message: "Falha ao editar usuário."
            }
        }   
    }
}

async function login( data : { email: any, password: any }) : Promise<any> {
    try {
        let user = await Prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(!user){
            throw new Error("E-mail não cadastrado")
        }

        const match = await BCrypt.compare( data.password, user.password )

        if(!match){
            throw new Error("Senha incorreta")
        }else{
            user.password = ''
        }

        return user
    } catch (error : any ) {
        return {
            error: {
                message: error.message
            }
        }   
    }
}

const User = {
    createUser,
    updateUser,
    login
}

export default User