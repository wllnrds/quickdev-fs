'use client';

import moment from 'moment'
import 'moment/locale/pt-br'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

export function Comment({ data, session }:{ data : any, session : any }){
    moment.locale('pt-br');
    const { mutate } = useSWRConfig()

    const [ self, setSelf ] = useState(false)
    const [ postAuthor, setPostAuthor ] = useState(false)

    const [ mode, setMode ] = useState('view')

    useEffect(()=>{
        if( session ){
            if( session?.user?.id ){
                setSelf(session?.user?.id === data?.user?.id.toString())
                setPostAuthor(session?.user?.id === data?.post?.user_id.toString())
            }
        }else{
            setSelf( false )
            setPostAuthor( false )
        }
    },[session, data])

    function changeMode(mode: 'view' | 'edit'){
        setMode( mode )
    }

    async function handleDisable() {
        if( confirm("Você deseja desabilitar o comentário? A ação não poderá ser desfeita.") ){
            const result = await fetch(`/api/post/${ data.post_id }/comment/${ data.id }`, {
                method: "PATCH"
            }).then( async (data) => {
                return await data.json()
            } );
        
            if (result.data) {    
                toast("Comentário removido")
                mutate(['post','comments', data.post_id])
            }
        }
    }

    async function handleDelete() {
        if( confirm("Você deseja apagar seu comentário? A ação não poderá ser desfeita.") ){
            const result = await fetch(`/api/post/${ data.post_id }/comment/${ data.id }`, {
                method: "DELETE"
            }).then( async (data) => {
                return await data.json()
            } );
        
            if (result.data) {    
                toast("Comentário apagado")
                mutate(['post','comments', data.post_id])
            }
        }
    }

    async function handleSubmit( formdata : FormData ) {
        const result = await fetch(`/api/post/${ data.post_id }/comment/${ data.id }`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ 
                id: formdata.get('id'),
                description: formdata.get('description')
            }),
        }).then( async (data) => {
            return await data.json()
        } );
    
        if (result.data) {    
            toast("Comentário alterado")
            changeMode('view')
            mutate(['post','comments', data.post_id])
        }
    }

    if( mode === 'edit' ){
        return <form className="flex flex-col gap-2" action={ handleSubmit }>
            <label className="flex flex-col gap-2">
                <span className="text-sm font-bold">Seu comentário</span>
                <textarea 
                    name="description"
                    className="rounded-2xl min-h-20 resize-none text-xs p-4 outline-none"
                    maxLength={256}
                    defaultValue={ data.description }
                    required></textarea>
            </label>
            <button type="submit" className="button-styled">Enviar</button>
        </form>
    }

    if( data.deleted || data.disabled ){
        return <div className={ ` text-sm flex flex-col gap-1 p-2 rounded-xl bg-slate-50 opacity-55 text-center` }>{data?.description}</div>
    }

    return <div className={ ` text-sm flex flex-col gap-1 p-2 rounded-xl ${ self ? 'bg-slate-200' : '' }` }>
        <div className='text-xs flex flex-row gap-2'>
            { 
                self && <>
                    <button onClick={ handleDelete } className='text-rose-500'>apagar</button>
                    <button onClick={ () => changeMode('edit') } className='text-indigo-500'>editar</button>
                </>
            }
            {
                postAuthor && <>
                    <button onClick={ handleDisable } className='text-rose-500'>desabilitar comentário</button>
                </>
            }
        </div>
        <div className=''><strong>{ self ? 'Você' : data?.user?.name }</strong> comentou { moment(data?.created_at).fromNow() }:</div>
        <div className=''>
            {data?.description}
        </div>
    </div>
}