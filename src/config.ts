import dotenv from "dotenv";

dotenv.config();

function required(value: string | undefined, name: string) {
  if(!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }   
  return value
}

export const config = {
  salesmsgApiKey: required(
    process.env.SALESMESSAGE_API_KEY, "SALESMESSAGE_API_KEY"
  ),

  ringcentral: {
    clientId: required(
      process.env.RINGCENTRAL_CLIENT_ID, "RINGCENTRAL_CLIENT_ID"
    ),

    clientSecret: required(
      process.env.RINGCENTRAL_CLIENT_SECRET, "RINGCENTRAL_CLIENT_SECRET"
    ),

    server: required(
      process.env.RINGCENTRAL_SERVER_URL,"https://platform.ringcentral.com"
    ),

    jwt: required(
      process.env.RINGCENTRAL_JWT, "RINGCENTRAL_JWT"
    ),

    fromNumber: required(
      process.env.RINGCENTRAL_FROM_NUMBER, "RINGCENTRAL_FROM_NUMBER"
    )
  }
};