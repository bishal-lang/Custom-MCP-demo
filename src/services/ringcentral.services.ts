import RingCentral from "@ringcentral/sdk";
import { config } from "../config.js";

const rcsdk = new RingCentral.SDK({
  clientId: config.ringcentral.clientId,
  clientSecret: config.ringcentral.clientSecret,
  server: config.ringcentral.server
});

const platform = rcsdk.platform();

let initialized = false;
let initPromise: Promise<void> | null = null;
let lastAuthTime = 0;

async function init(force = false) {
  if (initialized && !force) return;

  if (!initPromise || force) {
    initPromise = (async () => {
      if (!config.ringcentral.jwt) {
        throw new Error("Missing RingCentral JWT");
      }

      await platform.login({
        jwt: config.ringcentral.jwt
      });

      initialized = true;
      lastAuthTime = Date.now();
    })();
  }

  await initPromise;
}

async function rcRequest<T>(
  fn: () => Promise<T>,
  retry = true
): Promise<T> {
  try {
    await init();
    return await fn();
  } catch (err: any) {
    const status = err?.response?.status;

    const isAuthError =
      status === 401 || status === 403;

    /**
     * 🔁 AUTO-REFRESH FLOW
     */
    if (isAuthError && retry) {
      await init(true); // force re-login

      return rcRequest(fn, false); // retry once
    }

    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Unknown RingCentral error";

    throw new Error(
      `RingCentral Error (${status ?? "no-status"}): ${message}`
    );
  }
}

/* ---------------- SMS / MMS ---------------- */

export async function sendSmsMms(phone: string, message: string) {
  return rcRequest(() =>
    platform.post(
      "/restapi/v1.0/account/~/extension/~/sms",
      {
        from: { phoneNumber: config.ringcentral.fromNumber },
        to: [{ phoneNumber: phone }],
        text: message
      }
    ).then(r => r.json())
  );
}

/* ---------------- Contacts ---------------- */

export async function createContact(
  firstName: string,
  lastName: string,
  phone: string
) {
  return rcRequest(() =>
    platform.post(
      "/restapi/v1.0/account/~/extension/~/address-book/contact",
      {
        firstName,
        lastName,
        businessPhone: phone
      }
    ).then(r => r.json())
  );
}

export async function updateContact(contactId: string, payload: any) {
  return rcRequest(() =>
    platform
      .put(
        `/restapi/v1.0/account/~/extension/~/address-book/contact/${contactId}`,
        payload
      )
      .then(r => r.json())
  );
}

export async function findContact(query: string) {
  return rcRequest(() =>
    platform
      .get(
        `/restapi/v1.0/account/~/extension/~/address-book/contact?searchText=${encodeURIComponent(
          query
        )}`
      )
      .then(r => r.json())
  );
}

/* ---------------- Other primitives ---------------- */

export async function createPost(text: string) {
  return rcRequest(() =>
    platform.post("/restapi/v1.0/glip/posts", { text }).then(r => r.json())
  );
}

export async function createVideoMeeting(topic: string) {
  return rcRequest(() =>
    platform.post("/restapi/v1.0/account/~/extension/~/meeting", {
      topic
    }).then(r => r.json())
  );
}

export async function sendFax(to: string, fileUrl: string) {
  return rcRequest(() =>
    platform.post("/restapi/v1.0/account/~/extension/~/fax", {
      to: [{ phoneNumber: to }],
      attachments: [{ uri: fileUrl }]
    }).then(r => r.json())
  );
}

/* ---------------- Generic API ---------------- */

export async function apiRequest(
  method: string,
  endpoint: string,
  body?: any
) {
  return rcRequest(() =>
    (platform as any)[method.toLowerCase()](endpoint, body).then((r: any) =>
      r.json()
    )
  );
}

export async function generateRingout(from: string, to: string) {
  return rcRequest(() =>
    platform
      .post("/restapi/v1.0/account/~/extension/~/ring-out", {
        from: { phoneNumber: from },
        to: { phoneNumber: to },
        playPrompt: false
      })
      .then(r => r.json())
  );
}