import Post from "@/controller/post";
import Link from "next/link";
import { Comments } from "@/components/comments";
import Reactions from "./reactions";
import { auth } from "@/lib/auth"
import moment from 'moment'
import 'moment/locale/pt-br'
moment.locale('pt-br');

export async function PostItem({ id, mode = 'short' }:{ id:any, mode : "short" | "mini" | "full" }){
    const post = await Post.getPost(id, '0', mode === "full")
    const session = await auth()

    if( !post ){
        return <div>Post não encontrado</div>
    }

    if( mode == 'full' ){
        return <div className="flex flex-row gap-8 items-start">
            <section className="flex flex-col gap-4 rounded-3xl flex-1">
                <header className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{ post.title }</h1>
                    <p>por { post.user.name || "Alguem sem nome" }</p>
                </header>
                <hr />
                <article suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: post.text }}></article>
            </section>
            <div className="flex flex-col gap-4 w-3/12">
                <Reactions post_id={ post.id } session={ session }  />
                <Comments post_id={ post.id } session={ session }  />
            </div>
        </div>
    }else if( mode == 'short' ){
        return <div className="flex flex-row gap-8">
            <section className="flex flex-col gap-4 flex-1">
                <header>
                    <Link href={` /post/${ post.id } `}>
                        <h1 className="text-xl font-bold">{ post.title }</h1>
                    </Link>
                    <p className="text-sm">postado { moment( post.published_at ).fromNow() } por { post.user.name || "Alguem sem nome" }</p>
                </header>
            </section>
        </div>
    }else if( mode == 'mini' ){
        return <div className="flex flex-row gap-8">
            <section className="flex flex-row gap-4 lex-1">
                <div className="flex flex-wrap gap-4">
                    <Link href={`/editor/${ post.id }`} className="min-custom-button border-indigo-500 text-indigo-500 hover:bg-indigo-600 hover:text-white">Editar</Link>
                </div>
                <header>
                    <Link href={` /post/${ post.id } `}>
                        <h2 className="text-xl">{ post.title }</h2>
                    </Link>
                </header>
            </section>
        </div>
    }
}

export function PostFallback(){
    return <section className="p-4 rounded-2xl bg-slate-200 animate-pulse">Carregando post</section>
}