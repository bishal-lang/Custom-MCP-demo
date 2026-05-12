import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

import { allTools } from "./tools/index.js";
import { createTextResponse } from "./utils/response.js";

/* ---------------- Tool Map ---------------- */

const toolMap = new Map(
  allTools.map((t) => [
    t.name,
    t.handler
  ])
);

/* ---------------- MCP Server ---------------- */

const server = new Server(
  {
    name: "custom-crm-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/* ---------------- List Tools ---------------- */

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: allTools.map(
      (t) => t
    )
  })
);

/* ---------------- Call Tool ---------------- */

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {
    try {
      const handler = toolMap.get(
        request.params.name
      );

      if (!handler) {
        throw new Error(
          `Unknown tool: ${request.params.name}`
        );
      }

      const result = await handler(
        request.params.arguments || {}
      );

      return createTextResponse(result);

    } catch (err) {
      console.error(err);

      return createTextResponse({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown error"
      });
    }
  }
);

/* ---------------- Start Server ---------------- */

const transport =
  new StdioServerTransport();

await server.connect(transport);