import type { Employee } from "@prisma/client";

export type EmployeeTableProps = {
    employees: Employee[] | undefined
    isLoading: boolean
}