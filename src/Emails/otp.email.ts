import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import { CustomError } from "../errors/CustomError";

dotenv.config();

interface EmailParams {
  email: string;
  name: string;
  otp: string;
}

const apiKey: string = process.env.BRAVO_SMTP_API_KEY as string;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.apiClient.authentications["api-key"].apiKey = apiKey;

const sendOTP = async ({ email, name, otp }: EmailParams): Promise<void> => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [
      {
        email: email,
        name: name,
      },
    ];
    sendSmtpEmail.templateId = 14;
    sendSmtpEmail.params = {
      userName: name,
      otp: otp,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new CustomError("Email sending failed", 500);
  }
};

export default sendOTP;
