import * as z from "zod";

export const LogInSchema = z.object({
    email: z.string().min(1, { message: "Required" }).email({ message: "Invalid email address" }),
    password: z
        .string()
        .refine((value) => !!value, {
            message: "Password is required",
        }),
});


export const SignUpSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }),
    email: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, "Required"),
    confirmPassword: z.string().min(1, "Required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});