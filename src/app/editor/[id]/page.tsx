import Post from "@/controller/post"
import PostEditor from "../editor"

import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export default async function Page({ params }:{ params: any }){
    const session = await auth()
    
    if(!session || !session?.user || !session?.user?.id ){
        return <></>
    }
    
    let post = await Post.getPost( params.id, session?.user?.id )

    if( post?.user_id.toString() !== session.user.id ){
        return <></>
    }

    return <>
        <main className="flex flex-col flex-1 gap-4">
            <header>
                <h2 className="text-3xl font-bold">Novo post</h2>
            </header>
            <PostEditor initialData={ post } />
        </main>
    </>
}