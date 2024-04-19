import PostEditor from "./editor"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export default async function Page(){
    const session = await auth()

    if(!session || !session?.user ){
        return <></>
    }

    return <>
        <main className="flex flex-col flex-1 gap-4">
            <header>
                <h2 className="text-3xl font-bold">Novo post</h2>
            </header>
            <PostEditor initialData={ null } />
        </main>
    </>
}