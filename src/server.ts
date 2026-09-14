import express from "express";

const app = express();

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
