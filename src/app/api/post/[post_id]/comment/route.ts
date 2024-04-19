import Comment from '@/controller/actions'
import { auth } from '@/lib/auth'

export async function POST( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'create comment',
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
        
        const comments = await Comment.createComment({
            post_id: params.post_id,
            user_id: session.user.id,
            description: data.description
        })

        return Response.json({
            meta: {
                "action": 'post comments',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: comments
        })
    }

    return Response.json({
        meta: {
            "action": 'post comments',
            "timestamp": Date.now(),
            "time": Date.now() - sprint_start + "ms"
        },
        data: []
    })
}

export async function GET( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    if(params.post_id){
        const comments = await Comment.getPostComments( params.post_id )
        return Response.json({
            meta: {
                "action": 'post comments',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: comments
        })
    }

    return Response.json({
        meta: {
            "action": 'post comments',
            "timestamp": Date.now(),
            "time": Date.now() - sprint_start + "ms"
        },
        data: []
    })
}