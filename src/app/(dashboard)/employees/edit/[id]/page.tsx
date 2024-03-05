"use client"

import useSWR from "swr";

import type { Employee } from "@prisma/client";

import EmployeeForm from "../../_components/form";

import { Fetcher } from "@/lib/common";

const EditEmployee = ({ params }: { params: { id: string } }) => {

    const { data: employee, error, isLoading } = useSWR<Employee>(
        `/api/employee/${params.id}`,
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    if (!employee || isLoading) {
        return <>Loading</>
    }

    return (
        <div className="p-10 w-4/5">
            <h1 className="text-2xl font-bold mb-5">Edit Employee</h1>
            <EmployeeForm employee={employee} />
        </div>
    );
};

export default EditEmployee;
