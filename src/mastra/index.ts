import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { studyAssistantWorkflow } from "./workflows/study-assistant-workflow";
import { studyAssistantAgentDeepSeek } from "./agents/study-assistant-agent-deepseek";

export const mastra = new Mastra({
  workflows: { studyAssistantWorkflow },
  agents: { studyAssistantAgentDeepSeek },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Study Assistant Mastra (DeepSeek)",
    level: "info",
  }),
});
