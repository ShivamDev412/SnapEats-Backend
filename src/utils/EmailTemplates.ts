const ForgotPasswordTemplate = (name: string, token: string) => {
  return `
      <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
        <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
          </div>
          <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We received a request to reset your password. Click the link below to reset your password.
          </p>
          <div style="text-align: center;">
            <a href="${process.env.CORS_ORIGIN_USER}/reset-password/${token}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>This email will be valid for 10 min.</p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you did not request a password reset, please ignore this email or contact support if you have questions.
          </p>
          <p style="font-size: 14px; color: #666;">
            Thank you,<br>Snap Eats Team
          </p>
        </div>
      </div>
    `;
};
const EmailVerificationTemplate = (name: string, otp: string) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
      <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
        </div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Thank you for registering with SnapEats! Please use the following OTP to verify your email address:
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${otp}</span>
        </div>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          This OTP is valid for 10 minutes. If you did not request this verification, please ignore this email or contact our support team.
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Thank you,<br>Snap Eats Team
        </p>
      </div>
    </div>
  `;
};
const StoreAccountRequestTemplate = (
  name: string,
  storeName: string,
  storeEmail: string,
  storeAddress: string,
  storePhoneNumber: string
) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
      <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
        </div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Thank you for requesting to register your store, <strong>${storeName}</strong>, with SnapEats! We have received your details and our team will review them shortly.
        </p>
        <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Store Details</h2>
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;"><strong>Store Name:</strong> ${storeName}</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;"><strong>Store Email:</strong> ${storeEmail}</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;"><strong>Store Address:</strong> ${storeAddress}</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;"><strong>Store Phone Number:</strong> ${storePhoneNumber}</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          You will receive a confirmation email regarding the success of your store registration within the next 12-24 hours.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          If you have any questions or need assistance, please feel free to contact our support team at <a href="mailto:support@snapeats.com">support@snapeats.com</a>.
        </p>
        <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Next Steps</h2>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Once your store is approved, you will receive an email with instructions on how to access your store dashboard and start managing your store. You can then add menu items, track orders, and much more.
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Thank you for choosing SnapEats. We look forward to helping you grow your business!
        </p>
        <p style="font-size: 14px; color: #666;">
          Best regards,<br>SnapEats Team
        </p>
      </div>
    </div>
  `;
};
const StoreVerificationSuccessTemplate = (name: string, storeName: string) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
      <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
        </div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          We are pleased to inform you that your store, <strong>${storeName}</strong>, has been successfully verified!
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          You can now access your store dashboard and start managing your store. To get started, please log in to your SnapEats account and select "Manage Store" from the menu dropdown.
        </p>
        <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Next Steps</h2>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          In your store dashboard, you can add menu items, track orders, and utilize various tools to manage and grow your business. We are excited to support you in this journey!
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          If you have any questions or need assistance, please do not hesitate to contact our support team at <a href="mailto:support@snapeats.com">support@snapeats.com</a>.
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Thank you for choosing SnapEats. We look forward to seeing your store thrive!
        </p>
        <p style="font-size: 14px; color: #666;">
          Best regards,<br>SnapEats Team
        </p>
      </div>
    </div>
  `;
};
const StoreRegistrationRejectionTemplate = (
  name: string,
  storeName: string
) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
      <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
        </div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          We regret to inform you that we could not verify the details for your store, <strong>${storeName}</strong>.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Please ensure that all the provided information is accurate and complete. If you believe this is an error, or if you have any questions, feel free to contact our support team.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          You can reach our support team at <a href="mailto:support@snapeats.com">support@snapeats.com</a>. We are here to assist you with any issues you might have.
        </p>
        <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Next Steps</h2>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          We encourage you to review your store details and submit a new registration request. We look forward to having you as a part of the SnapEats community.
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Thank you,<br>SnapEats Team
        </p>
      </div>
    </div>
  `;
};
const CancelOrderNotificationTemplate = (name: string, orderId: string) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
      <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://snapeats-assets.s3.us-west-2.amazonaws.com/snap_Eats_logo.png" alt="SnapEats" style="width: 150px;">
        </div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          We regret to inform you that your order with ID ${orderId} has been cancelled.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          If you have any questions or concerns, please feel free to contact our support team at <a href="mailto:support@snapeats.com">support@snapeats.com</a>.
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Thank you,<br>SnapEats Team
        </p>
      </div>
    </div>
  `;
};
export {
  ForgotPasswordTemplate,
  EmailVerificationTemplate,
  StoreAccountRequestTemplate,
  StoreVerificationSuccessTemplate,
  StoreRegistrationRejectionTemplate,
  CancelOrderNotificationTemplate
};
