import { VALIDATION_MESSAGES } from "../utils/Constant";
import { z } from "zod";

const StoreProfileSchema = z.object({
  name: z.string().min(3, VALIDATION_MESSAGES.STORE_NAME_REQUIRED),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  image: z.string().optional(),
});
export { StoreProfileSchema };
