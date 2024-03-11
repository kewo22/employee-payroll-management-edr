import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addToSalary = (basicSalary: string, salaryAllowance: string, valueToAdd: number, deductions: number) => {
  return ((parseFloat(basicSalary) + parseFloat(salaryAllowance) + valueToAdd) - deductions).toString();
}

export const deductFromSalary = (basicSalary: string, salaryAllowance: string, valueToDeduct: number, additions: number) => {
  return ((parseFloat(basicSalary) + parseFloat(salaryAllowance) - valueToDeduct) + additions).toString()
}