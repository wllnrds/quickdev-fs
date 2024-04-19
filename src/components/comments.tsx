import NewComment from "./new-comment"
import { CommentList } from "./comment-list"

export async function Comments({ post_id, session }:{ post_id : any, session : any }){
    return <aside className="flex flex-col p-6 rounded-2xl bg-slate-100 gap-4">
        <header>
            <h2 className="text-xl">Comentários</h2>
        </header>
        <div className="h-[2px] block bg-slate-300"></div>
        <CommentList post_id={ post_id } session={ session } />
        <div className="h-[2px] block bg-slate-300"></div>
        <NewComment post_id={ post_id } session={ session } />
    </aside>
}