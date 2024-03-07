"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { Employee } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ShowToast, ToAed } from "@/lib/common";
import { EmployeeTableProps } from "@/types/employee-tale-props";
import { DeleteEmployee } from "@/actions/employee";

const EmployeeTable = (props: EmployeeTableProps) => {
    const { employees, isLoading } = props;


    const { toast } = useToast();
    const router = useRouter();

    const [deleteConfirmationDialogIsOpen, setDeleteConfirmationDialogIsOpen] =
        useState(false);

    const [employeesView, setEmployeesView] = useState<Employee[] | null | undefined>(employees);

    const employeeRef = useRef<Employee | null>(null);

    const headers = ['Name', 'Joining Date', 'Basic Salary', 'Salary Allowance', 'Actions']

    useEffect(() => {
        setEmployeesView(employees)
    }, [employees])

    if (!employees || !employeesView || isLoading) {
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

    const onDeleteClick = (employee: Employee) => {
        employeeRef.current = employee
        setDeleteConfirmationDialogIsOpen(true)
    }

    const onDeleteConfirm = async () => {
        if (!employeeRef || !employeeRef.current) return;
        const res = await DeleteEmployee(employeeRef.current.id);
        const title = res.isSuccess ? "Success" : "Error"
        const type = res.isSuccess ? "success" : "fail"
        ShowToast(toast, title, res.message, type)
        setDeleteConfirmationDialogIsOpen(false)
        if (res.isSuccess) {
            const employeeClone = [...employeesView];
            const index = employeesView.findIndex((e) => {
                return e.id === employeeRef!.current!.id;
            });
            if (index > -1) {
                employeeClone.splice(index, 1);
                setEmployeesView(employeeClone)
            }
        }
    }

    return (
        <div className="w-full">

            <Dialog open={deleteConfirmationDialogIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete employee ?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mb-5">
                        Are you sure you want to delete
                        <span className="font-bold text-destructive">
                            &nbsp;{employeeRef?.current?.name}&nbsp;
                        </span>
                        ?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationDialogIsOpen(false);
                            }}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        employeesView.map((employee, i) => {
                            return (
                                <TableRow key={`employee-${i}`}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{new Date(employee.joiningDate).toDateString()}</TableCell>
                                    <TableCell>{ToAed.format(+employee.basicSalary)}</TableCell>
                                    <TableCell>{ToAed.format(+employee.salaryAllowance)}</TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" onClick={() => { onEditClick(employee) }}><PencilIcon className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => { onDeleteClick(employee) }}><TrashIcon className="h-4 w-4" /></Button>
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
