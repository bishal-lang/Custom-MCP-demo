import { findMember } from "../../services/salesmsg.services.js";
import type { MCPTool } from "../../types/mcp.js";

export const findMemberTool: MCPTool = {
  name: "salesmsg_find_member",
  description: "Find member (placeholder - depends on Salesmsg plan)",
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
  handler: async (args: any) => {
    return await findMember(args);
  }
};