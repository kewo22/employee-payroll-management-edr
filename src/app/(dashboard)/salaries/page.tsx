'use client';

import { useState } from "react";
import useSWR from "swr";

import type { Employee } from "@prisma/client";

import { Fetcher } from "@/lib/common";
import SalariesTable from "./_components/salaries-table";
import Template from "../_components/Template";
import ProcessedSalariesTable from "./_components/processed-salaries-table";

const Salaries = () => {

    const [isShowProcessedSalary, setIsShowProcessedSalary] = useState(false)

    const actionBtnText = isShowProcessedSalary ? "Salaries" : "Processed Salaries"

    const { data: employees, error, isLoading } = useSWR<Employee[] | null>(
        "/api/employee",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const onActionClick = () => {
        setIsShowProcessedSalary(val => !val)
    }

    return (
        <Template title="Salaries" actionBtnText={actionBtnText} onActionClick={onActionClick}>
            {!isShowProcessedSalary && <SalariesTable employees={employees} isLoading={isLoading} />}
            {isShowProcessedSalary && <ProcessedSalariesTable />}
        </Template>

    );
};

export default Salaries;
