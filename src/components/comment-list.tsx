'use client'

import useSWR from "swr"
import { Comment } from "./comment-item"

export function CommentList({ post_id, session }:{ post_id : any, session : any }){
    const { data, error } = useSWR(['post','comments', post_id], loadComments)
    
    async function loadComments(){
        const comments = await fetch(
            `/api/post/${ post_id }/comment`
        ).then( async (result) => {
            return await result.json()
        }).catch( err => [] )

        return comments.data
    }

    if( error ){
        return <div>Falha ao carregar comentários</div>
    }

    if( !data ){
        return <div>Carregando comentários</div>
    }

    return <>
        <div className="flex flex-col gap-2 font-sm">
            { data?.length == 0 && <div>Nenhum comentário</div> }
            { data?.map( (comment : any ) => <Comment key={ comment.id } data={comment} session={ session } />) }
        </div>
    </>
}