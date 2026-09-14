import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import { sayHello } from "./inngest/functions.js";
import { inngest } from "./inngest/client.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [sayHello],
  }),
);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
