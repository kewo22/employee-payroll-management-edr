import { screen, render } from '@testing-library/react'

import SalariesTable from '@/app/(dashboard)/salaries/_components/SalariesTable'
import { Employee } from '@prisma/client'

import * as utils from '../src/lib/utils';


const employees: Employee[] = [
    {
        id: '1',
        name: 'Kewin',
        joiningDate: new Date(),
        basicSalary: '1000',
        salaryAllowance: '100',
        processingDate: new Date(),
        isEndOfService: false,
    }
]

it('should add 10 to basic and salary allowance', () => {
    expect(utils.addToSalary('1000', '100', 10, 0)).toEqual('1110')
})

it('should add 50 & deduct 20 from basic and salary allowance', () => {
    expect(utils.addToSalary('1000', '100', 50, 20)).toEqual('1130')
})

it('should deduct 20 from basic and salary allowance', () => {
    expect(utils.deductFromSalary('1000', '100', 0, 20)).toEqual('1120')
})

it('should deduct 20 & add 30 to basic and salary allowance', () => {
    expect(utils.deductFromSalary('1000', '100', 20, 30)).toEqual('1110')
})

