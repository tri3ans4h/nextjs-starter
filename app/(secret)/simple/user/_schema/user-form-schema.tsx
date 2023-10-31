

import { TypeOf, coerce, object, string } from "zod";


export const userFormSchema = object({
    name: string({
        required_error: "Please enter your name",
    }),
    email: string().email("Please enter a valid email"),
    //message: string().min(10).max(1000),
    role: coerce.number({
        required_error: "Please pick user's role"
    }),
    org: coerce.number({
        required_error: "Please pick user's organization"
    }),
    password: string({ required_error: "Please enter password" }).min(6).max(255),
    ver_password: string({ required_error: "Please enter password confirmation" }).min(6).max(255)
}).refine(
    (values) => {
        return values.password === values.ver_password;
    },
    {
        message: "\nPasswords must match!",
        path: ["ver_password"],
    }
);


export type UserFormInputs = TypeOf<typeof userFormSchema>;