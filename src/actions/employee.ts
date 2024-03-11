'use server';

import { db } from '@/lib/db';

import { EmployeeValidatePayload } from '@/app/(dashboard)/employees/_components/form';
import { StringToDate } from '@/lib/common';
import { ApiResponse } from '@/types/api-respose';
import { Employee } from '@prisma/client';
import { EmployeeUpdatePayload } from '@/types/empoyee-update-payload';

export async function createEmployee(employee: EmployeeValidatePayload): Promise<ApiResponse> {
    const employeeObj = {
        name: employee.name,
        joiningDate: StringToDate(employee.joiningDate),
        basicSalary: employee.basicSalary,
        salaryAllowance: employee.salaryAllowance,
        isEndOfService: false
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

export async function updateEmployee(employee: Employee, formValues: EmployeeUpdatePayload): Promise<ApiResponse<Employee>> {
    try {
        const updatedEmployee = await db.employee.update({
            where: {
                id: employee.id
            },
            data: {
                name: formValues.name,
                joiningDate: formValues.joiningDate,
                basicSalary: formValues.basicSalary,
                salaryAllowance: formValues.salaryAllowance,
                isEndOfService: employee.isEndOfService
            }
        })
        return { message: `Employee edited successfully`, isSuccess: true, data: updatedEmployee };
    } catch (e) {
        return { message: "Failed to edit employee", isSuccess: false };
    }
}

export async function DeleteEmployee(id: string): Promise<ApiResponse> {
    try {
        await db.employee.delete({
            where: {
                id
            }
        })
        return { message: `Employee deleted successfully`, isSuccess: true };
    } catch (e) {
        return { message: "Failed to delete employee", isSuccess: false };
    }
}

// export async function UpdateEmployee(id: string, data: EmployeeUpdatePayload): Promise<ApiResponse<Employee>> {
//     try {
//         const employee = await db.employee.update({
//             where: {
//                 id
//             },
//             data: {
//                 name: data.name,
//                 joiningDate: data.joiningDate,
//                 basicSalary: data.basicSalary,
//                 salaryAllowance: data.salaryAllowance,
//                 processingDate: data.processingDate,
//             }
//         })
//         return { message: `Employee updated successfully`, isSuccess: true, data: employee };
//     } catch (e) {
//         return { message: "Failed to delete employee", isSuccess: false };
//     }
// }