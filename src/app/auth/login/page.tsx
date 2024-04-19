import { SignIn } from "@/components/sign-in";

export default function Page({
  searchParams
}:{
  searchParams: any
}) {
    return (
      <main className="flex flex-1 justify-center items-start">
        <SignIn callback={ searchParams?.callback } />
      </main>
    );
  }
  