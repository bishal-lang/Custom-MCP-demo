import type { MCPTool } from "../../types/mcp.js";
import { findContact } from "../../services/ringcentral.services.js";

export const findContactTool: MCPTool = {
  name: "ringcentral_find_contact",
  description: "Search RingCentral contacts",
  inputSchema: {
    type: "object",
    properties: {
      name: {type: "string"},
      email: {type: "string"},
      phone: {type: "string"}
    },
    additionalProperties: false,
    anyOf: [
    { required: ["name"] },
    { required: ["email"] },
    { required: ["phone"] }
  ]
  },
  handler: async (args) => {
    return findContact(args.name);
  }
};