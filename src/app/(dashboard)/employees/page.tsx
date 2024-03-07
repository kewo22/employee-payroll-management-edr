"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";

import type { Employee } from "@prisma/client";

import { Button } from "@/components/ui/button";
import EmployeeTable from "./_components/table";
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
    // console.log("🚀 ~ Employees ~ data:", data) 

    const onAddEmployeeClick = () => {
        router.push('/employees/add')
    }

    return (
        <div className="p-10">
            <div className="mb-5 flex flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">Employees</h1>
                <Button onClick={onAddEmployeeClick}> Add Employee </Button>
            </div>
            {
                employees && <EmployeeTable employees={employees} isLoading={isLoading} />
            }

        </div>
    );
};

export default Employees;
