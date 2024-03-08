"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { Employee } from "@prisma/client";
import debounce from "lodash/debounce";

import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { UpdateEmployee } from "@/actions/employee";

import { EmployeeTableProps } from "@/types/employee-tale-props";
import { EmployeeUploadPayload } from "@/types/empoyee-update-payload";

import { ToAed } from "@/lib/common";
import { EmployeeSalaryProcess } from "@/types/employee-salary-process";

const SalariesTable = (props: EmployeeTableProps) => {
    const { employees, isLoading } = props;

    const { toast } = useToast();

    const [salaryProcessingDialogIsOpen, setSalaryProcessingDialogIsOpen] =
        useState(false);

    const [employeesView, setEmployeesView] = useState<EmployeeSalaryProcess[]>([]);

    const [processingDate, setProcessingDate] = useState<Date | undefined>(new Date())

    const employeeRef = useRef<Employee | null>(null);

    const headers = ['Name', 'Basic Salary', 'Salary Allowance', 'Processing Date', 'Additions', 'Deductions', 'Total Salary']


    useEffect(() => {
        if (employees) {
            const employeeSalaryProcess = mapEmployeesToSalaryProcessing(employees)
            setEmployeesView(employeeSalaryProcess)
        }
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

    const mapEmployeesToSalaryProcessing = (employees: Employee[]) => {
        const employeeSalaryProcess: EmployeeSalaryProcess[] = []
        employees.forEach(employee => {
            const totalSalary = (+employee.basicSalary + +employee.salaryAllowance).toString();
            employeeSalaryProcess.push({ ...employee, additions: 0, deductions: 0, totalSalary })
        })
        return employeeSalaryProcess;
    }

    const onSetClick = (employee: Employee) => {
        employeeRef.current = employee;
        setSalaryProcessingDialogIsOpen(true)
    }

    const onSelectSalaryProcessingDate = async () => {
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
                const employeeSalaryProcess: EmployeeSalaryProcess = {
                    ...res.data,
                    additions: 0,
                    deductions: 0,
                    totalSalary: "0"
                }
                employeeClone.splice(foundEmployeeIndex, 1, employeeSalaryProcess)
                setEmployeesView(employeeClone)
                setProcessingDate(undefined)
            }
        }
        setSalaryProcessingDialogIsOpen(false)
    }

    const onAdditionsChange = (_employee: Employee, e: ChangeEvent<HTMLInputElement>, index: number) => {
        const employeeClone = [...employeesView]
        const foundEmployee = employeesView.find(employee => {
            return employee.id === _employee.id
        })
        if (foundEmployee) {
            let foundEmployeeClone = { ...foundEmployee };
            let totalSalary = foundEmployeeClone.basicSalary + foundEmployee.salaryAllowance;
            let additions = 0;
            const valueToAdd = e.target.value ? parseFloat(e.target.value) : 0
            totalSalary = ((parseFloat(foundEmployeeClone.basicSalary) + parseFloat(foundEmployee.salaryAllowance) + valueToAdd) - foundEmployeeClone.deductions).toString();
            foundEmployeeClone = { ...foundEmployeeClone, additions: parseFloat(e.target.value || "0"), totalSalary }
            employeeClone.splice(index, 1, foundEmployeeClone)
            setEmployeesView(employeeClone)
        }
    }

    const additionsDebouncedOnChange = debounce(onAdditionsChange, 1000);

    const onDeductionsChange = (_employee: Employee, e: ChangeEvent<HTMLInputElement>, index: number) => {
        const employeeClone = [...employeesView]
        const foundEmployee = employeesView.find(employee => {
            return employee.id === _employee.id
        })
        if (foundEmployee) {
            let foundEmployeeClone = { ...foundEmployee };
            let totalSalary = foundEmployeeClone.basicSalary + foundEmployee.salaryAllowance;
            const valueToDeduct = e.target.value ? parseFloat(e.target.value) : 0
            totalSalary = ((parseFloat(foundEmployeeClone.basicSalary) + parseFloat(foundEmployee.salaryAllowance) - valueToDeduct) + foundEmployeeClone.additions).toString();
            foundEmployeeClone = { ...foundEmployeeClone, deductions: parseFloat(e.target.value || "0"), totalSalary }
            employeeClone.splice(index, 1, foundEmployeeClone)
            setEmployeesView(employeeClone)
        }
    }
    const deductionsDebouncedOnChange = debounce(onDeductionsChange, 1000);

    return (
        <div className="w-full">

            <Dialog open={salaryProcessingDialogIsOpen}>
                <DialogContent className="sm:max-w-[330px]">
                    <DialogHeader>
                        <DialogTitle>Select salary processing date</DialogTitle>
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
                                    <TableCell className="w-40">{employee.name}</TableCell>
                                    <TableCell className="w-28">{ToAed.format(+employee.basicSalary)}</TableCell>
                                    <TableCell className="w-28">{ToAed.format(+employee.salaryAllowance)}</TableCell>
                                    <TableCell className="w-52">
                                        {/* {employee.processingDate ? new Date(employee.processingDate).toDateString() : '-'} */}
                                        <Button variant="link" size="sm" onClick={() => { onSetClick(employee) }}>
                                            {employee.processingDate ? new Date(employee.processingDate).toDateString() : 'Set date'}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="w-28">
                                        <Input type="number" inputMode="numeric" onChange={(e) => { additionsDebouncedOnChange(employee, e, i) }} />
                                    </TableCell>
                                    <TableCell className="w-28">
                                        <Input type="number" inputMode="numeric" onChange={(e) => { deductionsDebouncedOnChange(employee, e, i) }} />
                                    </TableCell>
                                    <TableCell className="w-28">
                                        {ToAed.format(+employee.totalSalary)}
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
