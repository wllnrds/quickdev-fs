import Prisma from "@/lib/prisma"

async function createPost( data : {
    user_id : number,
    title: string,
    text: string,
    published_at?: Date | string | null
}){
    try {
        const post = await Prisma.post.create({
            data: {
                user_id: data.user_id,
                title: data.title,
                text: data.text,
                published_at: data.published_at,
                visit: {
                    create: {
                        counter: 0,
                    }
                }
            }
        })
        return post
    } catch (error) {
        return {
            error: {
                message: "Falha ao criar postagem."
            }
        }   
    }
}

async function updatePost( data : {
    id: string,
    user_id : string,
    title: string,
    text: string,
    published_at?: Date | string | null
}){
    try {
        const current = await Prisma.post.findFirst({
            where:{
                id: parseInt(data.id),
                user_id: parseInt(data.user_id)
            }
        })

        if( !current ){
            throw new Error("Post não encontrado.")
        }

        if( current.deleted_at ){
            throw new Error("Este post foi deletado.")
        }

        const post = await Prisma.post.update({
            where: {
                id: parseInt(data.id),
                user_id: parseInt(data.user_id)
            },
            data: {
                title: data.title,
                text: data.text,
                published_at: data.published_at,
            }
        })

        await Prisma.postHistory.create({
            data: {
                post_id: current.id,
                old_title: current.title,
                new_title: data.title,
                old_text: current.text,
                new_text: data.text
            }
        })

        return post
    } catch (error) {
        
    }
}

async function deletePost( data : {
    id : string,
    user_id: string
} ){
    try {
        const post = await Prisma.post.update({
            where: {
                id: parseInt(data.id),
                user_id: parseInt(data.user_id)
            },
            data: {
                deleted_at: new Date()
            }
        })

        return !!post.id
    } catch (error) {
        
    }
}

async function getPostById( id : string ){
    try {
        const post = await Prisma.post.findFirst({
            where: {
                id: parseInt(id),
                deleted_at : null,
                published_at : { gte: new Date(0) }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            }
        })
        return post
    } catch (error) {
        return null
    }
}

async function getPost( id : string, user_id : string, registerVisit : boolean = false ){
    try {
        const post = await Prisma.post.findFirst({
            where: {
                id: parseInt(id),
                deleted_at : null, 
                OR: [
                    { user_id : parseInt(user_id) }, // Se o post for do usuário pode mostrar mesmo que não tenha sido postado
                    { published_at : { gte: new Date(0) } } // Se não, o post precisa estar publicado
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            }
        })

        if(!post){
            throw new Error("Post não encontrado")
        }

        
        if(registerVisit){
            console.log("visitou")
            await Prisma.postVisit.upsert({
                where: {
                    post_id: post?.id
                },
                update:{
                    counter: {
                        increment: 1
                    }
                },
                create:{
                    post_id: post?.id,
                    counter: 1,
                }
            })
        }

        return post
    } catch (error) {
        
    }
}

async function getPostExtras( data: {
    post_id : string,
    user_id : string
}){
    try {
        const extra = await Prisma.post.findFirst({
            where: { 
                id: parseInt(data.post_id),
                user_id: parseInt(data.user_id),
            },
            include: {
                _count: {
                    select: {
                        comments: true,
                        history: true,
                    }
                },
                reactions: {
                    orderBy: [
                        { verb :  'asc' },
                    ],
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                visit: true,
            }
        })
        return {
            published_at: extra?.published_at,
            changes: extra?._count.history,
            comments: extra?._count.comments,
            visits: extra?.visit?.counter,
            reactions: {
                likes: extra?.reactions.filter( item => item.verb === 'LIKE' ).length,
                dislikes: extra?.reactions.filter( item => item.verb === 'DISLIKE' ).length
            }
        }
    } catch (error) {
        return null
    }
}

async function getPostComments( id : string ){
    try {
        const comments = await Prisma.comment.findMany({
            where: { 
                post_id: parseInt(id),
                deleted: false,
                disabled: false
            },
            orderBy:{
                created_at: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        })
        return comments
    } catch (error) {
        return []
    }
}

async function getPostReactions( id : string ){
    try {
        const reactions = await Prisma.reaction.findMany({
            where: { 
                post_id: parseInt(id),
                post: {
                    deleted_at: null,
                    published_at: {
                        gte: new Date(0)
                    }
                }
            },
            orderBy:{
                created_at: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
        })
        
        return reactions.reduce( (acc : any, crr) => {  
            acc[ crr.verb ].push(crr);
            return acc
        }, { 'LIKE' : [], 'DISLIKE' : [] })
    } catch (error) {
        return { 'LIKE' : [], 'DISLIKE' : [] }
    }
}

async function getPosts( 
    user_id? : string, 
    options : { 
        skip : number,
        limit : number
    } = { skip: 0, limit: 10 }
){
    try {
        const whereClauses : any = {
            deleted_at : null,
            published_at : { gte: new Date() }
        }

        if( user_id ){
            whereClauses.user_id = parseInt(user_id)
        }

        const posts = await Prisma.post.findMany({
            where: whereClauses,
            orderBy: {
                created_at: "asc"
            },
            skip: options.skip,
            take: options.limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true
                    }
                }
            }
        })

        return posts
    } catch (error) {
        return []
    }
}

async function getMyPostsId(
    used_id : string,
    options : { 
        skip : number,
        limit : number
    } = { skip: 0, limit: 10 }
){
    try {

        const posts = await Prisma.post.findMany({
            where: {
                deleted_at : null,
                user_id: parseInt(used_id)
            },
            orderBy: {
                created_at: "asc"
            },
            // skip: options.skip,
            // take: options.limit,
            select: {
                id: true
            }
        })

        return posts
    } catch (error) {
        return []
    }
}

async function getPostsId(
    options : { 
        skip : number,
        limit : number
    } = { skip: 0, limit: 10 }
){
    try {
        const whereClauses : any = {
            deleted_at : null,
            published_at : { gte: new Date( 0 ) }
        }

        const posts = await Prisma.post.findMany({
            where: whereClauses,
            orderBy: {
                published_at: "desc"
            },
            // skip: options.skip,
            // take: options.limit,
            select: {
                id: true
            }
        })

        return posts
    } catch (error) {
        return []
    }
}

const Post = {
    createPost,
    updatePost,
    deletePost,
    getPost,

    getPosts,

    getPostExtras,
    getPostComments,

    getPostsId,
    getPostById,
    getMyPostsId,

    getPostReactions
}

export default Post