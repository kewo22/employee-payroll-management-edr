"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function SideMenu() {

    const onLogOut = () => {
        signOut();
    };

    return (
        <div className="flex flex-col py-10 gap-10 h-full">
            <div className="text-2xl font-bold text-center text-white">
                Employee Payroll System
            </div>

            <div className="flex-grow mx-10 text-white">
                <ul>
                    <li className="mb-2">
                        <Link href="/employees">Employees</Link>
                    </li>
                    <li>
                        <Link href="/salaries">Salaries</Link>
                    </li>
                </ul>
            </div>

            <div className="mx-10 text-white">
                <button onClick={onLogOut}>Logout</button>
            </div>
        </div>
    );
}
