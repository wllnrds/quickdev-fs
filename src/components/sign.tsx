import { auth, signOut } from "@/lib/auth"
import Link from "next/link"
 
export async function Sign() {
  const session = await auth()

  async function handleSignOut(){
    "use server"
    await signOut()
  }

  if( session ){
    return <div className="flex flex-row gap-4">
      <div>Oi <strong>{ session.user?.name }</strong></div>
      <form action={ handleSignOut } >
        <button type="submit">Sair</button>
      </form>
  </div>
  }

  return (
    <Link href="/auth/login">Fazer login</Link>
  )
}