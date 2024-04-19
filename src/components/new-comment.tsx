'use client'

import Link from "next/link";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

export default function NewComment({ post_id, session }: { post_id: string, session : any }) {
    const form = useRef<any>( null );
    
    const { mutate } = useSWRConfig()

    if( !session ){
        return <div className=" text-center p-4 bg-slate-50 rounded-xl text-xs">Faça <Link href={`/auth/login?callback=${ encodeURI(`/post/${ post_id }`) }`}>login</Link> para comentar</div>
    }

    async function handleSubmit( formdata : FormData ) {
        const result = await fetch(`/api/post/${ post_id }/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ description: formdata.get('description') }),
        }).then( async (data) => {
            return await data.json()
        } );
    
        if (result.data) {    
            toast("Comentário enviado")
            mutate(['post','comments', post_id])
            form.current?.reset()
        }
    }

    return (
        <form ref={ form } className="flex flex-col gap-2" action={ handleSubmit }>
            <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">Seu comentário</span>
                <textarea 
                    name="description"
                    className="rounded-2xl min-h-20 resize-none text-xs p-4 outline-none"
                    maxLength={256}
                    required></textarea>
            </label>
            <button type="submit" className="button-styled">Enviar</button>
        </form>
    );
}
