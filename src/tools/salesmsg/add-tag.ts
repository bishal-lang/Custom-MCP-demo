import type { MCPTool } from "../../types/mcp.js";
import { addTag } from "../../services/salesmsg.services.js";

export const addTagTool: MCPTool = {
  name: "salesmsg_add_tag",
  description: "Add tag to contact",
  inputSchema: {
    type: "object",
    properties: {
      contactId: { type: "string" },
      tag: { type: "string" }
    },
    required: ["contactId", "tag"],
    additionalProperties: false
  },
  handler: async (args) => {
    return addTag(args.contactId, args.tag);
  }
};