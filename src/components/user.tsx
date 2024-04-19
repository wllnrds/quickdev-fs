import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from 'next/navigation'

export async function UserInfo(){
    const session = await auth()

    async function handleSignOut() {
        "use server";
        await signOut();
        redirect('/')
    }

    if( !session ){
        return <></>
    }

    return <>
        <div className="flex flex-row gap-4">
            <span>
                Oi <Link href="/auth/perfil"><strong>{session.user?.name}</strong></Link>
            </span>
            <form action={handleSignOut}>
                <button type="submit">Sair</button>
            </form>
        </div>
    </>
}