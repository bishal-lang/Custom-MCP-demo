import { salesmsgTools } from "./salesmsg/index.js";
import { ringcentralTools } from "./ringcentral/index.js";
import type { MCPTool } from "../types/mcp.js";

export const allTools: MCPTool[] = [
  ...salesmsgTools,
  ...ringcentralTools
];