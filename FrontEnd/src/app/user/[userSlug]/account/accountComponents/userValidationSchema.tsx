import { z } from 'zod';

export const ProfileSchema = z.object({
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" })
        .regex(/^[A-Za-z'-]+$/, { message: "First name can only contain letters, hyphens, and apostrophes" }),

    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" })
        .regex(/^[A-Za-z'-]+$/, { message: "Last name can only contain letters, hyphens, and apostrophes" }),

    email: z.string()
        .email({ message: "Invalid email address" }),

    phoneNumber: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
        .optional()
});

// Password Validation Schema
export const PasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, { message: "Current password must be at least 8 characters" }),

    newPassword: z.string()
        .min(8, { message: "New password must be at least 8 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must include uppercase, lowercase, number, and special character"
        }),

    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
});