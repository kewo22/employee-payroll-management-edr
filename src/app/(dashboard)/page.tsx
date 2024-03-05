import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth-options";

const Dashboard = async () => {

    const session = await getServerSession(authOptions);
    console.log("🚀 ~ Page ~ session:", session);

    if (!session || !session.user) {
        redirect("/login");
    }

    return (
        <div className="w-96">
            DASHBOARD
        </div>
    );
};

export default Dashboard;
