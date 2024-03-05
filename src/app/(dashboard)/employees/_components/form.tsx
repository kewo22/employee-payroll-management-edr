"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
    FormDescription
} from "@/components/ui/form";

import { EmployeeSchema } from "@/lib/validation-schemas";
import { createEmployee } from "@/actions/create-employee";

import { cn } from "@/lib/utils";
import { EmployeeFormProps } from "@/types/employee-form-props";
import { DateToShadInputString } from "@/lib/common";

export type EmployeeValidatePayload = z.infer<typeof EmployeeSchema>;

const EmployeeForm = (props: EmployeeFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const { employee } = props;

    const form = useForm<EmployeeValidatePayload>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            name: employee?.name || '',
            joiningDate: (employee && employee.joiningDate) ? DateToShadInputString(new Date(employee.joiningDate)) : '',
            basicSalary: employee?.basicSalary || '',
            salaryAllowance: employee?.salaryAllowance || '',
        },
    });

    const onSubmit = async (values: z.infer<typeof EmployeeSchema>) => {
        const res = await createEmployee(values);
        if (res.error) {
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
                ),
                title: "Error from server",
                description: res.error,
                variant: "destructive",
            });
        } else {
            form.reset({
                name: "",
                joiningDate: "",
                basicSalary: "",
                salaryAllowance: ""
            })
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-500 text-white"
                ),
                title: "Success",
                description: res.message,
                variant: "default",
            });
            router.push("/employees");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="joiningDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Joining Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Basic Salary</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="salaryAllowance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Salary Allowance</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-fit">Submit</Button>
            </form>
        </Form>
    );
};

export default EmployeeForm;
