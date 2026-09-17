import { inngest } from "./client.js";
import { reports } from "../reports/store.js";

export const sayHello = inngest.createFunction(
  {
    id: "say-hello",
    triggers: [{ event: "test/hello" }],
  },
  async ({ step }) => {
    await step.sleep("wait-five-seconds", "5s");

    return "Hello from the background!";
  },
);

export const makeReport = inngest.createFunction(
  {
    id: "make-report",
    triggers: [{ event: "report/requested" }],
  },
  async ({ event, step }) => {
    const { id, topic } = event.data;

    await step.sleep("do-the-slow-work", "8s");

    const result = await step.run("build-report", async () => {
      const report = reports.get(id);

      if (!report) {
        throw new Error(`Report ${id} not found`);
      }

      const updatedReport = {
        ...report,
        status: "done" as const,
        result: `Report about ${topic} is ready.`,
      };

      reports.set(id, updatedReport);

      return updatedReport;
    });

    return result;
  },
);
