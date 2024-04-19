import Prisma from "@/lib/prisma"
import { ReactionVerb } from "@prisma/client"
import NewCommentMail from '@/mailer/newComment'
import { sendMail } from "@/lib/email"


async function getPostComments( post_id : string ){
    try {
        const comments : any = await Prisma.comment.findMany({
            where: {
                post_id: parseInt(post_id)
            },
            include:{
                user: true,
                post: {
                    select: {
                        user_id: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        for(const comment of comments){
            if(comment.deleted){
                comment.description = "Comentário apagado."
                comment.user = null
            }else if(comment.disabled){
                comment.description = "Comentário removido pelo autor do post."
                comment.user = null
            }
        }

        return comments
    } catch (error) {
        return {
            error: {
                message: "Falha ao pegar comentarios."
            }
        }   
    }
}

async function getPostReactions( post_id : string ){
    try {
        const reactions = await Prisma.reaction.findMany({
            where: { 
                post_id: parseInt(post_id),
                post: {
                    deleted_at: null,
                    published_at: {
                        gte: new Date(0)
                    }
                }
            },
            orderBy:{
                verb: 'desc'
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

async function createComment(data : {
    post_id: string,
    user_id: string,
    description: string,
}){
    try {
        const comment = await Prisma.comment.create({
            data: {
                user_id: parseInt(data.user_id),
                description: data.description,
                post_id: parseInt(data.post_id)
            },
            include: {
                post: {
                    include: {
                        user: true
                    }
                },
                user: true
            }
        })

        if( comment ){
            try {
                const email = NewCommentMail({
                    postLink: `${process.env.VERCEL_URL}/post/${comment.post_id}`,
                    commentId: comment.id + "",
                    title: comment.post.title,
                    comment: comment.description,
                    user_name: comment.user.name
                })
                await sendMail({
                    to: comment.post.user.email,
                    text: email.text,
                    html: email.html,
                    subject: email.subject,
                })
            } catch (error) {
                console.log( "Falha ao enviar email" )
            }
        }

        return comment
    } catch (error) {
        return {
            error: {
                message: "Falha ao criar comentario."
            }
        }   
    }
}

async function updateComment( data : {
    id: string,
    post_id: string,
    user_id: string,
    description: string
}){
    try {
        const comment = await Prisma.comment.update({
            where:{
                id: parseInt(data.id),
                user_id: parseInt(data.user_id),
                post_id: parseInt(data.post_id),
                deleted: false
            },
            data: {
                description: data.description
            }
        })
        return comment
    } catch (error) {
        return {
            error: {
                message: "Falha ao alterar comentario."
            }
        }   
    }
}

async function deleteComment( data : {
    id: string,
    post_id: string,
    user_id: string
}){
    try {
        const comment = await Prisma.comment.update({
            where:{
                id: parseInt(data.id),
                user_id: parseInt(data.user_id),
                post_id: parseInt(data.post_id)
            },
            data: {
                deleted: true,
            }
        })
        return comment
    } catch (error) {
        return {
            error: {
                message: "Falha ao apagar comentario."
            }
        }   
    }
}

async function disableComment( data : {
    id: string,
    post_id: string,
    user_id: string
}){
    try {
        const comment = await Prisma.comment.update({
            where:{
                id: parseInt(data.id),
                post_id: parseInt(data.post_id),
                post:{
                    user_id: parseInt(data.user_id)
                }
            },
            data: {
                disabled: true,
            }
        })
        return comment
    } catch (error) {
        return {
            error: {
                message: "Falha ao apagar comentario."
            }
        }   
    }
}

async function reactTo(data : {
    post_id: string,
    user_id: string,
    verb: "LIKE" | "DISLIKE"
}){
    try {
        let reaction = null
        
        reaction = await Prisma.reaction.findFirst({
            where: {
                post_id: parseInt(data.post_id),
                user_id: parseInt(data.user_id) 
            }
        })

        if( reaction ){
            if( reaction?.verb == data.verb ){
                reaction = await Prisma.reaction.delete({
                    where: {
                        id: reaction.id
                    }
                })

                reaction = null;
            }else{
                reaction = await Prisma.reaction.update({
                    where: {
                        id: reaction.id
                    },
                    data: {
                        verb: data.verb as ReactionVerb
                    }
                })
            }
        }else{
            reaction = await Prisma.reaction.create({
                data: {
                    post_id: parseInt(data.post_id),
                    user_id: parseInt(data.user_id),
                    verb: data.verb as ReactionVerb
                }
            })
        }
        
        return reaction
    } catch (error) {
        return {
            error: {
                message: "Falha ao reagir."
            }
        }   
    }
}

const Comment = {
    createComment,
    updateComment,
    deleteComment,
    disableComment,
    reactTo,
    getPostComments,
    getPostReactions
}

export default Comment