export type MCPTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;

    [key: string]: any;
  };
  handler: (args: any) => Promise<any>;
};