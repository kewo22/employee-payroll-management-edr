'use server';

import { db } from '@/lib/db';

import { EmployeeValidatePayload } from '@/app/(dashboard)/employees/_components/form';
import { StringToDate } from '@/lib/common';
import { ApiResponse } from '@/types/api-respose';

export async function createEmployee(employee: EmployeeValidatePayload): Promise<ApiResponse> {
    const employeeObj = {
        name: employee.name,
        joiningDate: StringToDate(employee.joiningDate),
        basicSalary: employee.basicSalary,
        salaryAllowance: employee.salaryAllowance,
    }
    try {
        await db.employee.create({
            data: employeeObj
        })
        return { message: `Employee created successfully`, isSuccess: true };
    } catch (e) {
        return { message: "Failed to create employee", isSuccess: false };
    }
}

export async function editEmployee(id: string, employee: EmployeeValidatePayload): Promise<ApiResponse> {
    try {
        await db.employee.update({
            where: {
                id
            },
            data: {
                name: employee.name,
                joiningDate: StringToDate(employee.joiningDate),
                basicSalary: employee.basicSalary,
                salaryAllowance: employee.salaryAllowance
            }
        })
        return { message: `Employee edited successfully`, isSuccess: true };
    } catch (e) {
        return { message: "Failed to edit employee", isSuccess: false };
    }
}