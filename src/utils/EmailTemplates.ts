const ForgotPasswordTemplate = (name: string, token: string) => {
    return `
      <div style="background-color: #f4f4f4; padding: 20px 0; font-family: Arial, sans-serif;">
        <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://yourdomain.com/logo.png" alt="Company Logo" style="width: 150px;">
          </div>
          <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Hello ${name},</h1>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We received a request to reset your password. Click the link below to reset your password.
          </p>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/reset-password/${token}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you did not request a password reset, please ignore this email or contact support if you have questions.
          </p>
          <p style="font-size: 14px; color: #666;">
            Thank you,<br>The Company Team
          </p>
        </div>
      </div>
    `;
  };
  
  export { ForgotPasswordTemplate };
  