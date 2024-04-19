import { PostItem } from "@/components/post";
import SWRProvider from "@/app/swr-provider";

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: any }) {
  if (!params.id) {
    <main>
      <p>Postagem não encontrada</p>
    </main>;
  }

  return (
    <SWRProvider>
      <main className="flex flex-col flex-1 gap-4">
        <PostItem id={params.id} mode={"full"} />
      </main>
    </SWRProvider>
  );
}
