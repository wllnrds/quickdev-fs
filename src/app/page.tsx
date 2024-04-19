import Post from "@/controller/post";
import { Suspense } from "react";
import { PostFallback, PostItem } from "@/components/post";

export default async function Page() {
  const postsId = await Post.getPostsId();

  return <>
    <main className="flex flex-col flex-1 gap-4">
        <header>
            <h2 className="text-3xl font-bold">Ultimas postagens</h2>
        </header>
        <div className="flex flex-col flex-1 gap-4">
          { postsId.map( (post : any) => <Suspense key={ `post-${ post.id }` } fallback={ <PostFallback /> }><PostItem id={ post.id } mode={ "short" } /></Suspense>) }
        </div>
    </main>
  </>
}
