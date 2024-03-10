"use client";

import useSWR from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Fetcher, ToAed } from "@/lib/common";

const ProcessedSalariesTable = () => {

    const headers = ['Employee', 'Basic Salary', 'Salary Allowance', 'Additions', 'Deductions', 'Total Salary']

    const { data: processedSalaries, error: processedSalariesError, isLoading: processedSalariesIsLoading } = useSWR<any[] | null>(
        "/api/salary/processed",
        Fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    console.log("🚀 ~ ProcessedSalariesTable ~ processedSalaries:", processedSalaries)

    // if (!processedSalaries || processedSalariesIsLoading) {
    //     return (
    //         <Table>
    //             <TableHeader>
    //                 <TableRow>
    //                     {
    //                         headers.map((header, i) => {
    //                             return (
    //                                 <TableHead key={`header-loader-${i}`}>{header}</TableHead>
    //                             )
    //                         })
    //                     }
    //                 </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //                 {
    //                     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => {
    //                         return (
    //                             <TableRow key={`loader-${i}`}>
    //                                 <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
    //                                 <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
    //                                 <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
    //                                 <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
    //                                 <TableCell><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
    //                             </TableRow>
    //                         )
    //                     })
    //                 }
    //             </TableBody>
    //         </Table >
    //     )
    // }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            headers.map((header, i) => {
                                return (
                                    <TableHead key={`header-employee-${i}`}>{header}</TableHead>
                                )
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        <TableRow>
                            <TableCell>wqdwq</TableCell>
                        </TableRow>
                        // processedSalaries.map((processedSalary, i) => {
                        //     return (
                        //         <TableRow key={`employee-${i}`}>
                        //             <TableCell className="w-40">{processedSalary.employee.name}</TableCell>
                        //             <TableCell className="w-28">{ToAed.format(+processedSalary.basicSalary)}</TableCell>
                        //             <TableCell className="w-28">{ToAed.format(+processedSalary.salaryAllowance)}</TableCell>
                        //             <TableCell className="w-28">{ToAed.format(+processedSalary.additions)}</TableCell>
                        //             <TableCell className="w-28">{ToAed.format(+processedSalary.deductions)}</TableCell>
                        //             <TableCell className="w-28">{ToAed.format(+processedSalary.totalSalary)}</TableCell>
                        //         </TableRow>
                        //     )
                        // })
                    }
                </TableBody>
            </Table>

        </div>
    );
};

export default ProcessedSalariesTable;
