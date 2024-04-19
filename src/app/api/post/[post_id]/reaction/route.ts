import Comment from '@/controller/actions'
import { auth } from '@/lib/auth'

export async function POST( req: Request, { params } : { params : any } ){
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
        const data = await req.json();
        
        const reaction = await Comment.reactTo({
            post_id: params.post_id,
            user_id: session.user.id,
            verb: data.verb
        })

        return Response.json({
            meta: {
                "action": 'react to post',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: reaction
        })
    }

    return Response.json({
        meta: {
            "action": 'react to post',
            "timestamp": Date.now(),
            "time": Date.now() - sprint_start + "ms"
        },
        error: {
            message: "post não encontrado"
        }
    },{
        status: 404
    })
}

export async function GET( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    if(params.post_id){
        const reactions = await Comment.getPostReactions( params.post_id )
        return Response.json({
            meta: {
                "action": 'post reactions',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: reactions
        })
    }

    return Response.json({
        meta: {
            "action": 'post reactions',
            "timestamp": Date.now(),
            "time": Date.now() - sprint_start + "ms"
        },
        data: []
    })
}