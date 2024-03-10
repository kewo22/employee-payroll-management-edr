'use client';

import useSWR from "swr";

import type { Employee } from "@prisma/client";

import { Fetcher } from "@/lib/common";
import SalariesTable from "./_components/table";
import Template from "../_components/Template";

const Salaries = () => {

    const { data: employees, error, isLoading } = useSWR<Employee[] | null>(
        "/api/employee",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return (
        <Template title="Salaries">
            <SalariesTable employees={employees} isLoading={isLoading} />
        </Template>

    );
};

export default Salaries;
