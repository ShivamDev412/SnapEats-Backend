import speakeasy from 'speakeasy';
// @ts-ignore
import QRCode from 'qrcode';

export const generate2FASecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret;
};

export const getQRCode = async (otpauth_url: string) => {
  const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);
  return qrCodeDataURL;
};

export const verify2FAToken = (token: string, secret: string) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token
  });
};
