import bcrypt from "bcryptjs";
import { getUserById, updateUser } from "../../dbConfig/queries/User/User.query";
import { AuthError, NotFoundError } from "../../utils/Error";
import { MESSAGES, SALT_ROUNDS } from "../../utils/Constant";

class SettingsService {
  async changeLanguage(language: string, userId: string) {
    await updateUser(userId, { language });
  }
  async changePassword(
    currentPassword: string,
    newPassword: string,
    userId: string
  ) {
    const user = await getUserById(userId, true);

    if (!user) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    const isMatch = await bcrypt.compare(currentPassword, user?.password as string);

    if (!isMatch) throw new AuthError(MESSAGES.CURRENT_PASSWORD);
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return await updateUser(userId, { password: hashedPassword });
  }
}
export default SettingsService;
