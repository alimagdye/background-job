import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import { sayHello, makeReport } from "./inngest/functions.js";
import { inngest } from "./inngest/client.js";
import { randomUUID } from "node:crypto";
import { reports } from "./reports/store.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.post("/reports", async (req, res) => {
  const { topic } = req.body;

  const id = randomUUID();

  reports.set(id, {
    id,
    topic,
    status: "pending",
  });

  await inngest.send({
    name: "report/requested",
    data: {
      id,
      topic,
    },
  });

  return res.status(202).json({
    id,
    status: "pending",
  });
});

app.get("/reports/:id", (req, res) => {
  const report = reports.get(req.params.id);

  if (!report) {
    return res.status(404).json({
      error: "Report not found",
    });
  }

  return res.status(200).json(report);
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [sayHello, makeReport],
  }),
);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
