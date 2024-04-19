import { auth } from "@/lib/auth";
import { MenuIn } from "./menu-in";
import { MenuOut } from "./menu-out";

export async function Menu() {
  const session = await auth();

  if (session) {
    return <MenuIn />;
  }

  return <MenuOut />;
}
