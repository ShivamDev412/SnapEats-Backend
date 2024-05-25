import z from "zod";
import { VALIDATION_MESSAGES } from "../utils/Constant";
import { passwordComplexity } from "../utils/Validations";

const LoginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});
const SignupSchema = z.object({
  firstName: z
    .string()
    .min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED)
    .refine((val) => typeof val === "string", {
      message: VALIDATION_MESSAGES.INVALID_FIRST_NAME,
    }),
  lastName: z
    .string()
    .min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED)
    .refine((val) => typeof val === "string", {
      message: VALIDATION_MESSAGES.INVALID_LAST_NAME,
    }),
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .refine(passwordComplexity, {
      message: VALIDATION_MESSAGES.INVALID_PASSWORD,
    }),
});
export { LoginSchema, SignupSchema };
