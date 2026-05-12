import {
  createRingCentralContact,
  getRingCentralCallLogs,
  sendRingCentralSMS
} from "../services/ringcentral.services.js";

export async function ringcentralSendSmsTool(
  args: {
    phone: string;
    message: string;
  }
) {
  return await sendRingCentralSMS(
    args.phone,
    args.message
  );
}

export async function ringcentralCallLogsTool() {
  return await getRingCentralCallLogs();
}

export async function ringcentralCreateContactTool(
  args: {
    firstName: string;
    lastName: string;
    phone: string;
  }
) {
  return await createRingCentralContact(
    args.firstName,
    args.lastName,
    args.phone
  );
}