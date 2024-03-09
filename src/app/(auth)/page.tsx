import { getServerSession } from "next-auth";
import { redirect, usePathname } from "next/navigation";

import { authOptions } from "@/lib/auth-options";

export default async function Auth() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    } else {
        redirect("/employees");
    }

}
