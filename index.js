const express = require("express");
const app = express();

// Parse all incoming bodies as text
app.use(express.text({ type: "*/*" }));

// Your Discord webhook URL - set this in Railway environment variables
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

app.get("/", (req, res) => {
  res.send("TradingView to Discord relay is running!");
});

app.post("/webhook", async (req, res) => {
  // Respond to TradingView immediately
  res.status(200).send("OK");

  const message = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  console.log("Alert received:", message);

  if (!DISCORD_WEBHOOK) {
    console.error("DISCORD_WEBHOOK_URL not set!");
    return;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      console.error("Discord error:", response.status, await response.text());
    } else {
      console.log("Sent to Discord successfully");
    }
  } catch (err) {
    console.error("Failed to send to Discord:", err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Webhook relay running on port " + PORT);
});
