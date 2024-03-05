"use client";

import { useRouter } from "next/navigation";
import type { Employee } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToAed } from "@/lib/common";

import { EmployeeTableProps } from "@/types/employee-tale-props";
import { PencilIcon, TrashIcon } from "lucide-react";

const EmployeeTable = (props: EmployeeTableProps) => {
    const { employees, isLoading } = props;

    const router = useRouter();

    const headers = ['Name', 'Joining Date', 'Basic Salary', 'Salary Allowance', 'Actions']

    if (!employees || isLoading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            headers.map((header, i) => {
                                return (
                                    <TableHead key={`header-loader-${i}`}>{header}</TableHead>
                                )
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => {
                            return (
                                <TableRow key={`loader-${i}`}>
                                    <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table >
        )
    }

    const onEditClick = (employee: Employee) => {
        router.push(`/employees/edit/${employee.id}`)
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
                        employees.map((employee, i) => {
                            return (
                                <TableRow key={`employee-${i}`}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{new Date(employee.joiningDate).toDateString()}</TableCell>
                                    <TableCell>{ToAed.format(+employee.basicSalary)}</TableCell>
                                    <TableCell>{ToAed.format(+employee.salaryAllowance)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" onClick={() => { onEditClick(employee) }}><PencilIcon className="h-5 w-5" /></Button>
                                        <Button variant="ghost"><TrashIcon className="h-5 w-5" /></Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>

        </div>
    );
};

export default EmployeeTable;
