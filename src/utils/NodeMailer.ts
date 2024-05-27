import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  export const sendToMail = async (email: string, subject: string, html: any) => {
    const info = await transporter.sendMail({
      from: `"SnapEats "shivam412978143@gmail.com"`,
      to: email,
      subject: subject,
      html,
    });
    return info
  };