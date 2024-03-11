"use client";

import useSWR from "swr";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TableLoading from "../../_components/TableLoading";

import { Fetcher, ToAed } from "@/lib/common";

const ProcessedSalariesTable = () => {

    const headers = ['Employee', 'Basic Salary', 'Salary Allowance', 'Additions', 'Deductions', 'Total Salary']

    const { data: processedSalaries, error: processedSalariesError, isLoading: processedSalariesIsLoading } = useSWR<any[] | null>(
        "/api/salary/processed",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    if (!processedSalaries || processedSalariesIsLoading) {
        return (
            <TableLoading headers={headers} />
        )
    }

    if (!processedSalaries.length) {
        return (
            <div className="flex items-center justify-center h-full font-bold text-slate-700">
                No salaries processed yet !
            </div>
        )
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            headers.map((header, i) => {
                                return (
                                    <TableHead key={`header-employee-${i}`}>{header}</TableHead>
                                )
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        processedSalaries.map((processedSalary, i) => {
                            return (
                                <TableRow key={`employee-${i}`}>
                                    <TableCell>{processedSalary.employee.name}</TableCell>
                                    <TableCell>{ToAed.format(+processedSalary.basicSalary)}</TableCell>
                                    <TableCell>{ToAed.format(+processedSalary.salaryAllowance)}</TableCell>
                                    <TableCell>{ToAed.format(+processedSalary.additions)}</TableCell>
                                    <TableCell>{ToAed.format(+processedSalary.deductions)}</TableCell>
                                    <TableCell>{ToAed.format(+processedSalary.totalSalary)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>

        </div>
    );
};

export default ProcessedSalariesTable;
