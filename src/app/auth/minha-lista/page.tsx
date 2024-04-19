import Post from "@/controller/post";
import { Suspense } from "react";
import { PostFallback, PostItem } from "@/components/post";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if(!session || !session?.user || !session?.user?.id ){
    return <>Não logado?</>
  }

  const postsId = await Post.getMyPostsId( session?.user?.id );

  return <>
    <main className="flex flex-col flex-1 gap-4">
        <header>
            <h2 className="text-3xl font-bold">Minhas publicações</h2>
        </header>
        <div className="flex flex-col flex-1 gap-4">
        { postsId.map( (post : any) => <Suspense key={ `post-${ post.id }` } fallback={ <PostFallback /> }><PostItem id={ post.id } mode={ 'mini' } /></Suspense>) }
        </div>
    </main>
  </>
}
