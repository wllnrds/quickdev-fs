import Comment from '@/controller/actions'
import { auth } from '@/lib/auth'

export async function PUT( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'update comment',
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
        const comments : any = await Comment.updateComment({
            id: params.comment_id,
            post_id: params.post_id,
            user_id: session.user.id,
            description: data.description
        })

        if( comments?.error ){
            return Response.json({
                meta: {
                    "action": 'update comments',
                    "timestamp": Date.now(),
                    "time": Date.now() - sprint_start + "ms"
                },
                error: comments
            },{
                status: 400
            })
        }

        return Response.json({
            meta: {
                "action": 'update comments',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: comments
        })
    }
}

export async function DELETE( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'delete comment',
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
        const comment : any = await Comment.deleteComment({
            id: params.comment_id,
            post_id: params.post_id,
            user_id: session.user.id
        })

        if( comment?.error ){
            return Response.json({
                meta: {
                    "action": 'delete comment',
                    "timestamp": Date.now(),
                    "time": Date.now() - sprint_start + "ms"
                },
                error: comment
            },{
                status: 400
            })
        }

        return Response.json({
            meta: {
                "action": 'delete comment',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: comment
        })
    }
}

export async function PATCH( req: Request, { params } : { params : any } ){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'disabling comment',
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
        const comment : any = await Comment.disableComment({
            id: params.comment_id,
            post_id: params.post_id,
            user_id: session.user.id
        })

        if( comment?.error ){
            return Response.json({
                meta: {
                    "action": 'disabling comment',
                    "timestamp": Date.now(),
                    "time": Date.now() - sprint_start + "ms"
                },
                error: comment
            },{
                status: 400
            })
        }

        return Response.json({
            meta: {
                "action": 'disabling comment',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: comment
        })
    }
}