import { Employee } from "@prisma/client";

export type EmployeeSalaryProcess = {
    additions: number
    deductions: number
    totalSalary: string
} & Employee