import { inngest } from "./client.js";

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
