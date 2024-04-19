'use client'

import { useEffect, useState } from "react";
import { TextEditor } from "./text-editor";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { PostStates } from "./states";

const emptyPost = {
    id: null,
    title: '',
    text: '',
    create_at: null,
    published_at: null,
    updated_at: null,
}

export default function PostEditor({ initialData } : { initialData? : any }){
    const [ data, changeData ] = useState<any>( initialData || emptyPost )

    useEffect(()=>{
        if(initialData){
            changeData( initialData )
        }else{
            changeData( emptyPost )
        }
    },[initialData])

    function handleTextChange( newText: any ){
        changeData({ ...data, text: newText })
    }

    function handleTitleChange( newTitle: any ){
        changeData({ ...data, title: newTitle })
    }

    async function handleSubmitSave( publish = false ){
        let published_at = null

        if( publish ){
            published_at = new Date()
        }

        const method = data.id ? 'PUT' : 'POST'

        const result = await fetch('/api/post',{
            method,
            body: JSON.stringify({ 
                ...data,
                published_at
            })
        })

        if( result.status === 200 ){
            const newData = await result.json()
            
            changeData({
                ...data,
                create_at: newData.create_at,
                updated_at: newData.updated_at,
                published_at: published_at,
            })

            if( publish ){
                toast.success("Postagem publicada")
            }else if( method == 'PUT' ){
                toast.info("Postagem salvar")
            }
        }else{
            if( publish ){
                toast.error("Falha ao publicar postagem")
            }else if( method == 'PUT' ){
                toast.error("Falha ao atualizar postagem")
            }else{
                toast.error("Falha ao criar nova postagem")
            }
        }
    }

    async function handleSubmitDelete(){
        if(window.confirm('A ação de deletar não é reversível. Deseja continuar?')){
            const result = await fetch(`/api/post?id=${ data.id }`,{
                method: 'DELETE'
            })

            if( result.status == 200 ){
                toast.success("Postagem apagada");
                redirect('/')
            }else{
                toast.error('Falha ao apagar postagem')
            }
        }
    }

    return <form className="flex flex-row gap-8">
        <section className="flex flex-col flex-[8] gap-8">
            <label className="flex flex-col gap-2">
                <span>Titulo</span>
                <input required name="title" className="input-styled outlined" defaultValue={ data.title } onChange={ ( event ) => { handleTitleChange( event.target.value ) } } />
            </label>
            <div className="flex flex-col overflow-clip break-all">
                <TextEditor initialData={ data.text } onChange={ handleTextChange } />
            </div>
        </section>
        <aside className="flex-1 min-w-80">
            <div className="rounded-3xl p-4 bg-slate-50 gap-4 flex flex-col">
                { data.id && <PostStates post_id={ data.id } /> }
                <div className="flex flex-row gap-4">
                    { !data.published_at ? <>
                        <button onClick={ () => handleSubmitSave() } type="button" className="custom-button text-blue-600 border-blue-600 hover:bg-blue-500 hover:text-white">Salvar</button>
                        <button onClick={ () => handleSubmitSave( true ) } type="button" className="custom-button text-white bg-indigo-500 hover:bg-indigo-600">Salvar & Publicar</button>
                    </> : <>
                        <button onClick={ () => handleSubmitSave() } type="button" className="custom-button border bg-indigo-500 hover:bg-indigo-600 text-white">Atualizar</button>
                    </> }
                </div>
                <hr />
                { 
                    (data?.created_at && data?.id) && <div className="flex flex-col gap-4 border border-rose-400 p-4 rounded-2xl">
                        <p className="break-words">Se apagar o post ele não poderá ser recuperado.</p>
                        <button onClick={ handleSubmitDelete } type="button" className="custom-button border-0 bg-rose-500 hover:bg-rose-600 text-white">Apagar</button>
                    </div>
                }
            </div>
        </aside>
    </form>
}