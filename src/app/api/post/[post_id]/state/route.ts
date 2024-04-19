import Post from "@/controller/post"
import { auth } from "@/lib/auth"


export async function GET( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'react to post',
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

    if(params.post_id){
        const extras = await Post.getPostExtras({
            post_id: params.post_id,
            user_id: session.user.id
        })

        console.log({
            post_id: params.post_id,
            user_id: session.user.id
        })

        return Response.json({
            meta: {
                "action": 'post extras',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: extras
        })
    }
}