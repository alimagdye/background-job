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
    retries: 2,
    triggers: [{ event: "report/requested" }],
  },
  async ({ event, step }) => {
    const { id, topic } = event.data;

    await step.sleep("do-the-slow-work", "8s");

    const result = await step.run("build-report", async () => {
      if (topic === "fail") {
        throw new Error("The report oven is broken!");
      }

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

export const heartbeat = inngest.createFunction(
  {
    id: "heartbeat",
    triggers: [{ cron: "* * * * *" }], // every minute
  },
  async () => {
    let pending = 0;
    let done = 0;
    let failed = 0;

    for (const report of reports.values()) {
      if (report.status === "pending") {
        pending++;
      } else if (report.status === "done") {
        done++;
      } else if (report.status === "failed") {
        failed++;
      }
    }

    console.log(`[heartbeat] pending=${pending} done=${done} failed=${failed}`);

    return {
      pending,
      done,
      failed,
    };
  },
);
