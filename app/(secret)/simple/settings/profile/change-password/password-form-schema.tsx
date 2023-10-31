

import { TypeOf, coerce, object, string } from "zod";


export const passwordFormSchema = object({
    currentPassword: string({ required_error: "Please enter current password" }).min(6).max(255),
    newPassword: string({ required_error: "Please enter password" }).min(6).max(255),
    verNewPassword: string({ required_error: "Please enter password confirmation" }).min(6).max(255)
}).refine(
    (values) => {
        return values.newPassword === values.verNewPassword;
    },
    {
        message: "\nPasswords must match!",
        path: ["verNewPassword"],
    }
);


export type PasswordFormInputs = TypeOf<typeof passwordFormSchema>;