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
import { createEmployee, editEmployee } from "@/actions/employee";

import { cn } from "@/lib/utils";
import { EmployeeFormProps } from "@/types/employee-form-props";
import { DateToShadInputString, ShowToast } from "@/lib/common";
import { ApiResponse } from "@/types/api-respose";

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
        if (!employee) {
            create(values)
        }
        if (employee) {
            edit(values)
        }
    };

    const create = async (values: z.infer<typeof EmployeeSchema>) => {
        const res = await createEmployee(values);
        const title = res.isSuccess ? "Success" : "Error"
        ShowToast(toast, title, res.message, "success")
        if (res.isSuccess) {
            form.reset({
                name: "",
                joiningDate: "",
                basicSalary: "",
                salaryAllowance: ""
            })
            router.push("/employees");
        }
    }

    const edit = async (values: z.infer<typeof EmployeeSchema>) => {
        if (!Object.entries(form.formState.dirtyFields).length) {
            ShowToast(toast, 'Info', "Nothing to edit", "success")
            return;
        }
        if (!employee) return
        const res = await editEmployee(employee.id, values)
        const title = res.isSuccess ? "Success" : "Error"
        const type = res.isSuccess ? "success" : "fail"
        ShowToast(toast, title, res.message, type)
        router.push("/employees");
    }

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
