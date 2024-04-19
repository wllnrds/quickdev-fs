'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { useSWRConfig } from "swr"

export default function Reactions({ post_id, session }:{ post_id : any, session : any }){    
    const { mutate } = useSWRConfig()

    const { data, error } = useSWR(['post','reactions', post_id], loadReactions)
    const [userReaction, setUserReaction] = useState<any>(null)

    useEffect(()=>{
        if( data && session ){
            const isLIKE = data.LIKE.find( (item : any) => item.user_id.toString() === session?.user?.id )
            if( isLIKE ){
                setUserReaction("LIKE")
            }else{
                const isDISLIKE = data.DISLIKE.find( (item : any) => item.user_id.toString() === session?.user?.id )
                if( isDISLIKE ){
                    setUserReaction("DISLIKE")
                }
            }
        }else{
            setUserReaction("")
        }
    },[session, data])
    
    async function loadReactions(){
        const result = await fetch(`/api/post/${ post_id }/reaction`).then( async (result) => {
            return await result.json()
        }).catch( err => [] )

        return result.data
    }

    async function handleAction( verb : "LIKE" | "DISLIKE" ){
        const result = await fetch(`/api/post/${ post_id }/reaction`, {
            method: "POST",
            body: JSON.stringify({ verb })
        }).then( async (data) => {
            if( data.status == 200 ){
                mutate(['post','reactions', post_id])
                const r = await data.json()
                if( r.data ){
                    setUserReaction( r.data.verb )
                }else{
                    setUserReaction( null )
                }
            }else if( data.status === 401 ){
                toast.error("Você precisa estar autenticado para fazer login")   
            }
        });
    }

    if( error ){
        return <div className="flex flex-row gap-2 text-center">
            Falha ao carregar reações
        </div>
    }

    if( !data ){
        return <div className="flex flex-row gap-2 text-center flex-1">
            Carregando reações
        </div>
    }

    return <div className="flex flex-row gap-2">
        <button 
            onClick={ ()=>{ handleAction("LIKE") }}
            className={`px-3 py-2 flex-1 rounded-lg items-center justify-center text-xs border border-lime-400 ${ userReaction === 'LIKE' && 'bg-lime-400' }`}>
            Gostei <span>{ data.LIKE.length }</span>
        </button>
        <button
            onClick={ ()=>{ handleAction("DISLIKE") } }
            className={`px-3 py-2 flex-1 rounded-lg items-center justify-center text-xs border border-rose-400 ${ userReaction === 'DISLIKE' && 'bg-rose-400' }`}>
            Não Gostei <span>{ data.DISLIKE.length }</span>
        </button>
    </div>
}