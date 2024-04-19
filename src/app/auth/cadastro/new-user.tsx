'use client'

import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export default function NewUser() {
  const router = useRouter()

  async function handleSubmit(formdata: FormData) {
    const result = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: formdata.get("name"),
        email: formdata.get("email"),
        password: formdata.get("password"),
      }),
    }).then(async (data) => await data.json());

    if (result.data) {
      toast("Você agora esta cadastrado")
      router.push('/auth/login')
    }
  }

  return (
    <main className="flex flex-col flex-1 gap-4 max-w-96 mx-auto">
      <h2 className="text-3xl font-bold">Novo usuário</h2>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span>Nome</span>
          <input name="name" type="text" className="input-styled outlined" />
        </label>
        <label className="flex flex-col gap-2">
          <span>E-mail</span>
          <input name="email" type="text" className="input-styled outlined" />
        </label>
        <label className="flex flex-col gap-2">
          <span>Senha</span>
          <input name="password" type="password" className="input-styled outlined" />
        </label>
        <div>
          <button className="button-styled">Cadastrar</button>
        </div>
      </form>
    </main>
  );
}
