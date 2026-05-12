//salesmsg-client.ts
import axios from "axios";
import { config } from "../config.js";
import { string } from "zod/v4";

export const salesmsgClient = axios.create({
  baseURL:
    "https://api.salesmessage.com/pub/v2.2",

  headers: {
    Authorization: `Bearer ${config.salesmsgApiKey}`,
    "Content-Type": "application/json"
  }
});

// export async function sendSalesmsgSMS(
//   phone: string,
//   message: string
// ) {
//   const response =
//     await salesmsgClient.post("/message", {
//       phoneNumber: phone,
//       message: string,
//     });

//   return response.data;
// }

// export async function createSalesmsgContact(
//   firstName: string,
//   lastName: string,
//   phone: string
// ) {
//   const response =
//     await salesmsgClient.post("/contacts", {
//       firstName,
//       lastName,
//       phoneNumber: phone
//     });

//   return response.data;
// }

// export async function listSalesmsgMessages() {
//   const response =
//     await salesmsgClient.get("/message");

//   return response.data;
// }

//Testing Functions

export async function sendSalesmsgSMS(
  phone: string,
  message: string
) {
  return {
    success: true,
    provider: "Salesmsg",
    action: "send_sms",
    phone,
    message
  };
}

export async function createSalesmsgContact(
  firstName: string,
  lastName: string,
  phone: string
) {
  return {
    success: true,
    provider: "Salesmsg",
    action: "create_contact",
    contact: {
      firstName,
      lastName,
      phone
    }
  };
}

export async function listSalesmsgMessages() {
  return {
    success: true,
    provider: "Salesmsg",
    messages: [
      {
        id: "1",
        phone: "+15555555555",
        message: "Hello world"
      }
    ]
  };
}

