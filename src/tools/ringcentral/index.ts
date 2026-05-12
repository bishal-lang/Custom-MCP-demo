import { sendSmsMmsTool } from "./send-sms.js";
import { createContactTool } from "./create-contact.js";
import { updateContactTool } from "./update-contact.js";
import { findContactTool } from "./find-contact.js";
import { createPostTool } from "./create-post.js";
import { createVideoMeetingTool } from "./create-video-meeting.js";
import { sendFaxTool } from "./send-fax.js";
import { apiRequestTool } from "./api-request.js";
import { MCPTool } from "../../types/mcp.js";
import { generateRingoutTool } from "./generate-ringout.js";

export const ringcentralTools: MCPTool[] = [
  sendSmsMmsTool,
  createContactTool,
  updateContactTool,
  findContactTool,
  createPostTool,
  createVideoMeetingTool,
  sendFaxTool,
  apiRequestTool,
  generateRingoutTool
];