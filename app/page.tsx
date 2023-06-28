import { getCurrentUser } from "@/lib/session";

import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();
  if (user)
    return (
      <div>
        {JSON.stringify(user)}
        <br />
        <Link href={"/api/auth/signout"}>sign out</Link>
      </div>
    );
  return <Link href={"/api/auth/signin"}>sign up</Link>;
}
