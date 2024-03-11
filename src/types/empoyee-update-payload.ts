export type EmployeeUpdatePayload = {
    name: string;
    joiningDate: Date;
    basicSalary: string;
    salaryAllowance: string;
    processingDate: Date | null;
    isEndOfService: boolean;
}