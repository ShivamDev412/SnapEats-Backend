import { passwordComplexity } from "../utils/Validations";
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
      .min(1, VALIDATION_MESSAGES.NEW_PASSWORD_REQUIRED)
      .refine(passwordComplexity, {
        message: VALIDATION_MESSAGES.INVALID_PASSWORD,
      }),
    confirmPassword: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED }),
    token: z.string().min(1, VALIDATION_MESSAGES.TOKEN_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });
const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.CURRENT_PASSWORD_REQUIRED),
    newPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.NEW_PASSWORD_REQUIRED)
      .refine(passwordComplexity, {
        message: VALIDATION_MESSAGES.INVALID_PASSWORD,
      }),
    confirmNewPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: VALIDATION_MESSAGES.CURRENT_AND_NEW_PASSWORDS_CANNOT_MATCH,
    path: ["newPassword"],
  });
export { UserProfileSchema, ResetPasswordSchema, ChangePasswordSchema };
