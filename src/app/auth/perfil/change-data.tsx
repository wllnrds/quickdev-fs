'use client'

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export const dynamic = 'force-dynamic'

export default function ChangeProfile({ session } : { session : any }) {
  const router = useRouter()
  const { update } = useSession();

  async function handleSubmit(formdata: FormData) {
    const result = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: formdata.get("name") }),
    }).then(async (data) => await data.json());

    if (result.data) {
      await update({
        name: result.data.name,
        email: result.data.email,
      });

      toast("Perfil salvo")

      router.refresh()
    }
  }

  return (
    <main className="flex flex-col flex-1 gap-4">
      <h2 className="text-3xl font-bold">Alterar perfil</h2>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span>Nome</span>
          <input
            name="name"
            type="text"
            className="input-styled outlined"
            defaultValue={session?.user?.name || ""}
          />
        </label>
        <div>
          <button className="button-styled">Salvar</button>
        </div>
      </form>
    </main>
  );
}
