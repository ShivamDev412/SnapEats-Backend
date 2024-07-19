import {
  getTwoFactorSecret,
  getTwoFactorStatus,
  updateUser,
} from "../../dbConfig/queries/User.query";
import { generate2FASecret, getQRCode, verify2FAToken } from "../../utils/2fa";

class TwoFAService {
  async enableTwoFactorAuthentication(userId: string) {
    const appName = "SnapEats";
    const secret = generate2FASecret() as {
      base32: string;
      otpauth_url: string;
    };
    const otpauth_url = `otpauth://totp/${appName}:${userId}?secret=${secret.base32}&issuer=${appName}`;

    const qrCode = await getQRCode(otpauth_url);
    await updateUser(userId, {
      twoFactorAuthSecret: secret.base32,
      twoFactorAuthEnabled: true,
    });
    return qrCode;
  }
  async verifyTwoFactorAuthentication(userId: string, token: string) {
    const secret = await getTwoFactorSecret(userId);
    const verified = verify2FAToken(
      token,
      secret?.twoFactorAuthSecret as string
    );
    verified && (await updateUser(userId, { twoFactorVerifiedAt: new Date() }));
    return verified;
  }
  async disableTwoFactorAuthentication(userId: string) {
    await updateUser(userId, {
      twoFactorAuthSecret: null,
      twoFactorAuthEnabled: false,
      twoFactorVerifiedAt: null,
    });
  }
  async getTwoFactorStatus(userId: string) {
    const user = await getTwoFactorStatus(userId);
    const currentTime = new Date();
    const verifiedTime = new Date(user?.twoFactorVerifiedAt as Date);
    const timeDifference =
      (currentTime.getTime() - verifiedTime.getTime()) / 60000;
    return {
        twoFactorStatus: user?.twoFactorAuthEnabled,
        is2FAExpired: timeDifference > 30,
    }
  }
}
export default TwoFAService;
