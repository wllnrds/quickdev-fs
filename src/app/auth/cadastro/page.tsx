import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth';
import NewUser from "./new-user";

export default async function Page(){
  const session = await auth()

  if( session ){
    console.log( session )

    return redirect("/")
  }

  return <NewUser />
}
