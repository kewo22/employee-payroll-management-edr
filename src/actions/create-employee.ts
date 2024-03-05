'use server';

import { db } from '@/lib/db';

import { EmployeeValidatePayload } from '@/app/(dashboard)/employees/_components/form';
import { StringToDate } from '@/lib/common';

export async function createEmployee(employee: EmployeeValidatePayload) {

    const employeeObj = {
        name: employee.name,
        joiningDate: StringToDate(employee.joiningDate),
        basicSalary: employee.basicSalary,
        salaryAllowance: employee.salaryAllowance,
    }
    try {
        const user = await db.employee.create({
            data: employeeObj
        })
        return { message: `Employee created successfully` };
    } catch (e) {
        return { error: "Failed to create employee" };
    }
}