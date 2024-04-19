import Post from "@/controller/post"
import { auth } from "@/lib/auth"

export async function POST(req:Request){
    const sprint_start = Date.now()
    
    const session = await auth()

    if( !session?.user || !session.user.email ){
        return Response.json({
            meta: {
                "action": 'create post',
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
        const post = await Post.createPost({
            user_id: parseInt(session.user.id || ''),
            title: data.title,
            text: data.text,
            published_at: data.published_at
        })

        return Response.json({
            meta: {
                "action": 'create post',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: post
        })
    } catch ( error : any ) {
        return Response.json({
            meta: {
                "action": 'create post',
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

export async function PUT(req:Request){
    const sprint_start = Date.now()
    
    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'update post',
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
        const post = await Post.updatePost({
            id: data.id,
            user_id: session.user.id,
            title: data.title,
            text: data.text,
            published_at: data.published_at,
        })

        return Response.json({
            meta: {
                "action": 'update post',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: post
        })
    } catch ( error : any ) {
        return Response.json({
            meta: {
                "action": 'update post',
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

export async function DELETE(req:Request){
    const sprint_start = Date.now()

    const session = await auth()

    if( !session?.user || !session.user.id ){
        return Response.json({
            meta: {
                "action": 'delete post',
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
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if(!id){
            throw new Error("Falta informação do post a ser deletado")
        }

        const post = await Post.deletePost({
            id: id,
            user_id: session.user.id
        })

        return Response.json({
            meta: {
                "action": 'delete post',
                "timestamp": Date.now(),
                "time": Date.now() - sprint_start + "ms"
            },
            data: post
        })
    } catch ( error : any ) {
        return Response.json({
            meta: {
                "action": 'delete post',
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