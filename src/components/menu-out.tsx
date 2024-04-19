'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MenuOut() {
  const pathname = usePathname()

  return <div className="flex flex-row gap-4 flex-1 items-center justify-center">
    <Link className={ pathname == '/' ? 'font-bold' : '' } href="/">inicio</Link>
    { pathname != "/auth/cadastro" && <Link href="/auth/cadastro" className="custom-button border-blue-500 bg-blue-500 hover:bg-blue-600 text-white">Cadastrar</Link> }   
    { pathname != "/auth/login" && <Link href="/auth/login" className="action-button-alt">Fazer login</Link> }    
  </div>
}
