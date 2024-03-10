'use server';

import { db } from '@/lib/db';

import { ApiResponse } from '@/types/api-respose';
import { EmployeeSalaryProcess } from '@/types/employee-salary-process';
import { ToLocaleDateTime } from '@/lib/common';

export async function CreateSalaryProcess(_salaryProcess: EmployeeSalaryProcess): Promise<ApiResponse<any>> {
    console.log("🚀 ~ CreateSalaryProcess ~ _salaryProcess:", _salaryProcess)
    const salaryProcess = {
        additions: _salaryProcess.additions.toString(),
        deductions: _salaryProcess.deductions.toString(),
        basicSalary: _salaryProcess.basicSalary,
        processingDate: ToLocaleDateTime(new Date()),
        salaryAllowance: _salaryProcess.salaryAllowance,
        employeeId: _salaryProcess.id,
        totalSalary: _salaryProcess.totalSalary
    }
    console.log("🚀 ~ CreateSalaryProcess ~ salaryProcess:", salaryProcess)
    try {
        await db.salaryProcess.create({
            data: salaryProcess
        })
        return { message: `Salary processed successfully`, isSuccess: true };
    } catch (e) {
        return { message: "Failed to process salary", isSuccess: false };
    }
}