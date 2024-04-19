import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth';
import ChangeProfile from './change-data';

export default async function Page() {
  const session = await auth()

  if( !session || !session.user || !session.user.id ){
    redirect("/auth/login")
  }

  return <ChangeProfile session={ session } />;
}
