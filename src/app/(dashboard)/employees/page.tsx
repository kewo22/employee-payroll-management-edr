'use client';

import { useRouter } from "next/navigation";
import useSWR from "swr";

import type { Employee } from "@prisma/client";

import EmployeeTable from "./_components/table";
import Template from "../_components/Template";

import { Fetcher } from "@/lib/common";

const Employees = () => {
    const router = useRouter();

    const { data: employees, error, isLoading } = useSWR<Employee[] | null>(
        "/api/employee",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const onAddEmployeeClick = () => {
        router.push('/employees/add')
    }

    return (
        <Template title="Employees" actionBtnText="Add Employee" onActionClick={onAddEmployeeClick}>
            <EmployeeTable employees={employees} isLoading={isLoading}  />
        </Template>
    );
};

export default Employees;
