"use client"

import useSWR from "swr";

import type { Employee } from "@prisma/client";

import { Fetcher } from "@/lib/common";
import SalariesTable from "./_components/table";

const Salaries = () => {

    const { data: employees, error, isLoading } = useSWR<Employee[] | null>(
        "/api/employee",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Salaries</h1>
            <SalariesTable employees={employees} isLoading={isLoading} />
        </div>
    );
};

export default Salaries;
