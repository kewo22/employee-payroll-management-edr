"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import type { Employee } from "@prisma/client";
import debounce from "lodash/debounce";
import { MoreHorizontal } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import TableLoading from "../../_components/TableLoading";

import { updateEmployee } from "@/actions/employee";
import { CreateSalaryProcess } from "@/actions/salary";

import { EmployeeTableProps } from "@/types/employee-tale-props";
import { EmployeeUpdatePayload } from "@/types/empoyee-update-payload";

import { EmployeeSalaryProcess } from "@/types/employee-salary-process";
import { ShowToast, ToAed, ToLocaleDateTime } from "@/lib/common";
import { addToSalary, deductFromSalary } from "@/lib/utils";

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
            <TableLoading headers={headers} />
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
        const employeeUploadPayload: EmployeeUpdatePayload = {
            ...employeeRef.current,
            processingDate: ToLocaleDateTime(processingDate),
        }
        const res = await updateEmployee(employeeRef.current.id, employeeUploadPayload)
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
            const valueToAdd = e.target.value ? parseFloat(e.target.value) : 0
            totalSalary = addToSalary(foundEmployeeClone.basicSalary, foundEmployee.salaryAllowance, valueToAdd, foundEmployeeClone.deductions)
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
            totalSalary = deductFromSalary(foundEmployeeClone.basicSalary, foundEmployee.salaryAllowance, valueToDeduct, foundEmployeeClone.additions)
            foundEmployeeClone = { ...foundEmployeeClone, deductions: parseFloat(e.target.value || "0"), totalSalary }
            employeeClone.splice(index, 1, foundEmployeeClone)
            setEmployeesView(employeeClone)
        }
    }
    const deductionsDebouncedOnChange = debounce(onDeductionsChange, 1000);

    const onSalaryProcessClick = async (employee: EmployeeSalaryProcess) => {
        if (employee.isEndOfService) {
            ShowToast(toast, 'Info', 'Employee has already been granted gratuity.', 'success')
            return
        }
        const res = await CreateSalaryProcess(employee)
        const title = res.isSuccess ? "Success" : "Error"
        const type = res.isSuccess ? "success" : "fail"
        ShowToast(toast, title, res.message, type)
    }

    const onEndOfServiceClick = async (employee: EmployeeSalaryProcess) => {
        const employeeUploadPayload: EmployeeUpdatePayload = {
            ...employee,
            isEndOfService: true,
        }
        const res = await updateEmployee(employee.id, employeeUploadPayload)
        const title = res.isSuccess ? "Success" : "Error"
        const type = res.isSuccess ? "success" : "fail"
        ShowToast(toast, title, res.message, type)
    }

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
                                        <Button variant="link" size="sm" onClick={() => { onSetClick(employee) }}>
                                            {employee.processingDate ? new Date(employee.processingDate).toDateString() : 'Set date'}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="w-20">
                                        <Input type="number" disabled={employee.isEndOfService} inputMode="numeric" onChange={(e) => { additionsDebouncedOnChange(employee, e, i) }} />
                                    </TableCell>
                                    <TableCell className="w-20">
                                        <Input type="number" disabled={employee.isEndOfService} inputMode="numeric" onChange={(e) => { deductionsDebouncedOnChange(employee, e, i) }} />
                                    </TableCell>
                                    <TableCell className="w-28">
                                        {ToAed.format(+employee.totalSalary)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>More actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => { onSalaryProcessClick(employee) }}>
                                                    Process Salary
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { onEndOfServiceClick(employee) }}>
                                                    End of service
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
