

import { TypeOf, coerce, object, string } from "zod";


export const profileFormSchema = object({
    firstName: string({
        required_error: "Please enter your first name",
    }),
    lastName: string({
        required_error: "Please enter your last name",
    }),
    email: string({
        required_error: "Please enter your email"
    }).email("Please enter a valid email"),

    birthDate: coerce.date({
        required_error: "Please enter your birth date"
    }),

    address: string({
        required_error: "Please enter your address",
    }),
    phone: string({
        required_error: "Please enter your phone",
    })
});


export type ProfileFormInputs = TypeOf<typeof profileFormSchema>;