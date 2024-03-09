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
import AuthTemplate from "../_template";

const Login = (props: LoginProps) => {
    const router = useRouter();

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
            callbackUrl: "/employees",
        });
    };

    const onSignUpClick = async () => {
        router.push('/sign-up')
    };

    return (
        <AuthTemplate type="login">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="mb-4 relative">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="example@mail.com"
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
                    <div className="mb-4 relative">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Password</FormLabel>
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
                    <div className="flex justify-between items-center">
                        <Button variant="outline" type="submit">Submit</Button>
                        <Button type="button" variant="link" className="text-slate-700" onClick={onSignUpClick}>Don&apos;t have an account? SignUp</Button>
                    </div>
                    {
                        props && props.searchParams && props.params.error &&
                        <div className="text-destructive font-bold">
                            {props.searchParams.error}
                        </div>

                    }
                </form>
            </Form>
        </AuthTemplate>

    );
};

export default Login;
