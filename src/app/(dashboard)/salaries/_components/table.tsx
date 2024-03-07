"use client";

import { useEffect, useRef, useState } from "react";
import type { Employee } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ToAed } from "@/lib/common";
import { EmployeeTableProps } from "@/types/employee-tale-props";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { UpdateEmployee } from "@/actions/employee";
import { EmployeeUploadPayload } from "@/types/empoyee-update-payload";

const SalariesTable = (props: EmployeeTableProps) => {
    const { employees, isLoading } = props;

    const { toast } = useToast();

    const [salaryProcessingDialogIsOpen, setSalaryProcessingDialogIsOpen] =
        useState(false);

    const [employeesView, setEmployeesView] = useState<Employee[] | null | undefined>(employees);

    const [processingDate, setProcessingDate] = useState<Date | undefined>(new Date())

    const employeeRef = useRef<Employee | null>(null);

    const headers = ['Name', 'Basic Salary', 'Salary Allowance', 'Processing Date']

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

    const onSetClick = (employee: Employee) => {
        employeeRef.current = employee;
        setSalaryProcessingDialogIsOpen(true)
    }

    const onSelectSalaryProcessingDate = async () => {
        console.log(processingDate)
        if (!employeeRef || !employeeRef.current || !processingDate) return
        const employeeUploadPayload: EmployeeUploadPayload = {
            basicSalary: employeeRef.current.basicSalary,
            joiningDate: employeeRef.current.joiningDate,
            name: employeeRef.current.name,
            processingDate: processingDate,
            salaryAllowance: employeeRef.current.salaryAllowance,
        }
        const res = await UpdateEmployee(employeeRef.current.id, employeeUploadPayload)
        if (res.isSuccess && res.data) {
            const employeeClone = [...employeesView]
            const foundEmployeeIndex = employees.findIndex(employee => {
                return employee.id === res.data!.id
            })
            if (foundEmployeeIndex !== -1) {
                employeeClone.splice(foundEmployeeIndex, 1, res.data)
                setEmployeesView(employeeClone)
                setProcessingDate(undefined)
            }
        }
        setSalaryProcessingDialogIsOpen(false)
    }

    return (
        <div className="w-full">

            <Dialog open={salaryProcessingDialogIsOpen}>
                <DialogContent className="sm:max-w-[330px]">
                    <DialogHeader>
                        <DialogTitle>Select salary processing date ?</DialogTitle>
                    </DialogHeader>
                    <div className="mb-5">
                        <Calendar
                            mode="single"
                            selected={processingDate}
                            onSelect={setProcessingDate}
                            className="rounded-md border"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setSalaryProcessingDialogIsOpen(false);
                            }}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={onSelectSalaryProcessingDate}
                        >
                            Set
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
                                    <TableCell>{ToAed.format(+employee.basicSalary)}</TableCell>
                                    <TableCell>{ToAed.format(+employee.salaryAllowance)}</TableCell>
                                    <TableCell>
                                        {employee.processingDate ? new Date(employee.processingDate).toDateString() : '-'}
                                        <Button variant="link" size="sm" onClick={() => { onSetClick(employee) }}>
                                            {employee.processingDate ? 'Change' : 'Set'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {/* <Button size="icon" variant="ghost" onClick={() => { onEditClick(employee) }}><PencilIcon className="h-4 w-4" /></Button> */}
                                        {/* <Button size="icon" variant="destructive" onClick={() => { onDeleteClick(employee) }}><TrashIcon className="h-4 w-4" /></Button> */}
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

export default SalariesTable;
