import { salesmsgTools } from "../tools/salesmsg/index.js";
import { ringcentralTools } from "../tools/ringcentral/index.js";
import type { MCPTool } from "../types/mcp.js";

/**
 * 1. Single source of truth
 */
const allTools: MCPTool[] = [
  ...salesmsgTools,
  ...ringcentralTools
];

/**
 * 2. Fast lookup map
 */
const toolMap: Record<string, MCPTool> = Object.fromEntries(
  allTools.map((tool) => [tool.name, tool])
);

/**
 * 3. Runtime validation (replace with Zod if available later)
 */
function validateInput(tool: MCPTool, args: unknown) {
  const schema: any = tool.inputSchema;

  if (!schema) return args;

  // minimal JSON-schema validation (safe baseline)
  if (schema.type !== "object") {
    throw new Error(`Invalid schema for tool ${tool.name}`);
  }

  if (typeof args !== "object" || args === null) {
    throw new Error(`Invalid input for tool ${tool.name}`);
  }

  const obj = args as Record<string, any>;

  // required fields check
  if (schema.required?.length) {
    for (const key of schema.required) {
      if (obj[key] === undefined || obj[key] === null) {
        throw new Error(
          `Missing required field '${key}' for tool ${tool.name}`
        );
      }
    }
  }

  return args;
}

/**
 * 4. Error normalization (CRITICAL for MCP stability)
 */
function normalizeError(toolName: string, err: any) {
  const message =
    err?.message ||
    err?.response?.data?.message ||
    "Unknown error";

  return {
    success: false,
    tool: toolName,
    error: message
  };
}

/**
 * 5. Main executor
 */
export async function runTool(name: string, args: unknown) {
  const tool = toolMap[name];

  if (!tool) {
    return {
      success: false,
      error: `Unknown tool: ${name}`
    };
  }

  try {
    /**
     * Step 1: validate input
     */
    const validatedArgs = validateInput(tool, args);

    /**
     * Step 2: execute handler
     */
    const result = await tool.handler(validatedArgs);

    /**
     * Step 3: normalize success response
     */
    return {
      success: true,
      tool: name,
      result
    };
  } catch (err) {
    /**
     * Step 4: NEVER throw raw errors to MCP
     */
    return normalizeError(name, err);
  }
}