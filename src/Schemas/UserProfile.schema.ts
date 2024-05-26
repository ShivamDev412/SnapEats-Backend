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
});
export { UserProfileSchema };
