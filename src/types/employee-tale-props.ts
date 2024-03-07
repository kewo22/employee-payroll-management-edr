import type { Employee } from "@prisma/client";

export type EmployeeTableProps = {
    employees: Employee[] | undefined | null
    isLoading: boolean
}