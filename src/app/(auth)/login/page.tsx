"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginProps } from "@/types/login-props";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { LogInSchema } from "@/lib/validation-schemas";

const Login = (props: LoginProps) => {
    console.log("🚀 ~ Login ~ props:", props.searchParams)
    
    const form = useForm<z.infer<typeof LogInSchema>>({
        resolver: zodResolver(LogInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LogInSchema>) => {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: true,
            callbackUrl: "/dashboard",
        });
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-slate-200 p-8 rounded shadow-md w-96">
                <h2 className="text-4xl font-semibold mb-6 text-center text-black-950 uppercase">
                    Employee Payroll Login
                </h2>
                <h1 className="text-sm font-semibold mb-6 text-center">
                    Please enter your Email & Password
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="mb-4 relative">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="example@mail.com"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-center"
                                                    {...field}
                                                // value={email}
                                                // onChange={(e) => setEmail(e.target.value)}
                                                // onClick={handleInputClick}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-950 font-bold" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="password"
                                                    placeholder="your secured password"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-center"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-950 font-bold" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                        {
                            props && props.searchParams &&
                            <div className="text-destructive font-bold">
                                {props.searchParams.error}
                            </div>

                        }
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Login;
