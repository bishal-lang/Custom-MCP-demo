import axios from "axios";
import { config } from "../config.js";

function assertConfig() {
  if (!config.salesmsgApiKey) {
    throw new Error("Missing SALESMSG API key in config");
  }
}

assertConfig();

export const salesmsgClient = axios.create({
  baseURL: "https://api.salesmessage.com/pub/v2.2",
  headers: {
    Authorization: `Bearer ${config.salesmsgApiKey}`,
    "Content-Type": "application/json"
  }
});

async function smsRequest<T>(
  fn: () => Promise<T>,
  attempt = 1
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.response?.status;

    const isRetryable =
      status === 429 ||
      status >= 500 ||
      !status;

    /**
     * Retry transient failures
     */
    if (isRetryable && attempt < 3) {
      const delay =
        300 * Math.pow(2, attempt);

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );

      return smsRequest(
        fn,
        attempt + 1
      );
    }

    const data = err?.response?.data;

    const message =
      data?.message ||
      data?.error ||
      err?.message ||
      "Unknown Salesmsg error";

    throw new Error(
      `Salesmsg Error (${status ?? "no-status"}): ${message}`
    );
  }
}

/* ---------------- Messaging ---------------- */

export async function sendTextMessage(phone: string, message: string) {
  return smsRequest(() =>
    salesmsgClient
      .post("/messages", { phoneNumber: phone, message })
      .then(r => r.data)
  );
}

export async function sendGroupText(phones: string[], message: string) {
  return smsRequest(() =>
    salesmsgClient
      .post("/messages/group", {
        phoneNumbers: phones,
        message
      })
      .then(r => r.data)
  );
}

export async function sendRinglessVoicemail(phone: string, audioUrl: string) {
  return smsRequest(() =>
    salesmsgClient
      .post("/voicemail/ringless", {
        phoneNumber: phone,
        audioUrl
      })
      .then(r => r.data)
  );
}

/* ---------------- Contacts ---------------- */

export async function findContact(phone: string) {
  return smsRequest(() =>
    salesmsgClient
      .get("/contacts/search", { params: { phone } })
      .then(r => r.data)
  );
}

export async function createContact(
  firstName: string,
  lastName: string,
  phone: string
) {
  return smsRequest(() =>
    salesmsgClient
      .post("/contacts", {
        firstName,
        lastName,
        phoneNumber: phone
      })
      .then(r => r.data)
  );
}

export async function upsertContact(
  phone: string,
  data: Record<string, unknown>
) {
  return smsRequest(() =>
    salesmsgClient
      .post("/contacts/upsert", {
        phoneNumber: phone,
        ...data
      })
      .then(r => r.data)
  );
}

export async function findMember(params: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  const { phone } = params;

  // 1. Primary lookup (most reliable)
  if (phone) {
    const res = await salesmsgClient.get("/contacts/search", {
      params: { phone }
    });

    return res.data;
  }

  // 2. If API supports email/name search in future, plug here
  // (kept intentionally API-pure; no MCP logic here)

  throw new Error(
    "Salesmsg findMember currently requires at least a phone number"
  );
}

/* ---------------- Tags ---------------- */

export async function addTag(contactId: string, tag: string) {
  return smsRequest(() =>
    salesmsgClient
      .post(`/contacts/${contactId}/tags`, { tag })
      .then(r => r.data)
  );
}

export async function removeTag(contactId: string, tag: string) {
  return smsRequest(() =>
    salesmsgClient
      .delete(
        `/contacts/${contactId}/tags/${encodeURIComponent(tag)}`
      )
      .then(r => r.data)
  );
}

/* ---------------- Notes ---------------- */

export async function createNote(contactId: string, note: string) {
  return smsRequest(() =>
    salesmsgClient
      .post(`/contacts/${contactId}/notes`, { note })
      .then(r => r.data)
  );
}

/* ---------------- Utilities ---------------- */

export async function phoneLookup(phone: string) {
  return smsRequest(() =>
    salesmsgClient
      .get("/lookup", { params: { phone } })
      .then(r => r.data)
  );
}

export async function optOutContact(phone: string) {
  return smsRequest(() =>
    salesmsgClient
      .post("/opt-out", { phoneNumber: phone })
      .then(r => r.data)
  );
}

/* ---------------- Generic ---------------- */

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown
) {
  return smsRequest(() =>
    salesmsgClient
      .request({ method, url: endpoint, data })
      .then(r => r.data)
  );
}