import { VALIDATION_MESSAGES } from "../utils/Constant";
import z from "zod";

const UserProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED)
    .regex(/^[a-zA-Z]+$/, VALIDATION_MESSAGES.INVALID_FIRST_NAME),
  lastName: z
    .string()
    .min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED)
    .regex(/^[a-zA-Z]+$/, VALIDATION_MESSAGES.INVALID_LAST_NAME),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  profilePicture: z.string().optional(),
});
const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.PASSWORD_REQUIRED }),
    confirmPassword: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED }),
    token: z.string().min(1, VALIDATION_MESSAGES.TOKEN_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });
export { UserProfileSchema, ResetPasswordSchema };
