'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation'

export function MenuIn() {
  const pathname = usePathname()

  return <div className="flex flex-row gap-4 flex-1 items-center">
    <Link className={ pathname == '/' ? 'font-bold' : '' } href="/">inicio</Link>
    <Link className={ pathname == '/auth/perfil' ? 'font-bold' : '' } href="/auth/perfil">meu perfil</Link>
    <Link className={ pathname == '/auth/minha-lista' ? 'font-bold' : '' } href="/auth/minha-lista">meus posts</Link>
    <Link href="/editor" replace={ true } className="action-button">novo post</Link>
  </div>
}
