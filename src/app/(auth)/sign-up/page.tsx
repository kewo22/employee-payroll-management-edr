"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
    FormDescription
} from "@/components/ui/form";

import { SignUpSchema } from "@/lib/validation-schemas";
import { createOrganization } from "@/actions/create-organization";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import AuthTemplate from "../_template";

export type CreateOrganizationValidatePayload = z.infer<typeof SignUpSchema>;

const SignUp = (props: LoginProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<CreateOrganizationValidatePayload>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
        const res = await createOrganization(values);
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
                email: "",
                name: "",
                password: "",
                confirmPassword: ""
            })
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-500 text-white"
                ),
                title: "Success",
                description: res.message,
                variant: "default",
            });
        }

    };

    const onLoginClick = () => {
        router.push('/login')
    }

    return (
        <AuthTemplate type="sign-up">
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
                                <FormLabel>Organization Name</FormLabel>
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
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
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between items-center">
                        <Button variant="outline" type="submit">Sign up</Button>
                        <Button type="button" variant="link" className="text-slate-700" onClick={onLoginClick}>Already have an account? Login</Button>
                    </div>
                </form>
            </Form>
        </AuthTemplate>
    );
};

export default SignUp;
