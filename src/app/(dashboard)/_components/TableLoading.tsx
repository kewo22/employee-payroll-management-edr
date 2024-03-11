"use client";


import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableLoading } from "@/types/table-loading-props";

const TableLoading = (props: TableLoading) => {
    const { headers } = props;
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {
                        headers.map((header, i) => {
                            return (
                                <TableHead key={`header-loader-${i}`}>{header}</TableHead>
                            )
                        })
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => {
                        return (
                            <TableRow key={`loader-row-${i}`}>
                                {
                                    headers.map((_, i) => {
                                        return (
                                            <TableCell key={`loader-cell-${i}`}><Skeleton className="w-[100px] h-[20px] rounded-full" /></TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table >
    );
};

export default TableLoading;
