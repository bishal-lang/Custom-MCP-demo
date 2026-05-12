import {
  createSalesmsgContact,
  listSalesmsgMessages,
  sendSalesmsgSMS
} from "../services/salesmsg.services.js";

export async function salesmsgSendSmsTool(
  args: {
    phone: string;
    message: string;
  }
) {
  return await sendSalesmsgSMS(
    args.phone,
    args.message
  );
}

export async function salesmsgCreateContactTool(
  args: {
    firstName: string;
    lastName: string;
    phone: string;
  }
) {
  return await createSalesmsgContact(
    args.firstName,
    args.lastName,
    args.phone
  );
}

export async function salesmsgListMessagesTool() {
  return await listSalesmsgMessages();
}