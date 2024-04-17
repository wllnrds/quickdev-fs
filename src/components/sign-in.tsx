import { auth, signIn } from "@/lib/auth"
import { redirect } from 'next/navigation';
 
export async function SignIn() {
  const session = await auth()

  async function handleSignIn( formData : FormData ){
    "use server"
    await signIn("credentials", formData)
    returnHome()
  }

  function returnHome(){
    return redirect("/")
  }

  if( session ){
    returnHome()
  }

  return (
    <form action={ handleSignIn } className="flex flex-col gap-4 bg-slate-100 p-8 rounded-3xl">
      <label className="flex flex-col gap-2">
        <span>E-mail</span>
        <input name="email" type="email" className="input-styled" />
      </label>
      <label className="flex flex-col gap-2">
        <span>Senha</span>
        <input name="password" type="password" className="input-styled" />
      </label>
      <button className="button-styled">Entrar</button>
    </form>
  )
}