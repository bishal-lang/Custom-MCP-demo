import type { MCPTool } from "../../types/mcp.js";
import { addTag } from "../../services/salesmsg.services.js";
import { config } from "process";

export const addTagTool: MCPTool = {
  name: "salesmsg_add_tag",
  description: "Add tag to contact",
  inputSchema: {
    type: "object",
    properties: {
      contactId: { type: "string" },
      tag: { type: "string" }
    },
    required: ["contactId", "tag"]
  },
  handler: async (args) => {
    console.log("CONFIG:", config);
    return addTag(args.contactId, args.tag);
  }
};