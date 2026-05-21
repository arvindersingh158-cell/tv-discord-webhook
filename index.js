const express = require("express");
const app = express();

// Parse all incoming bodies as text
app.use(express.text({ type: "*/*" }));

// Discord webhook URLs — set these in Railway environment variables
const WEBHOOKS = {
  'ema-signals': process.env.DISCORD_WEBHOOK_EMA,
  'inside-bars': process.env.DISCORD_WEBHOOK_IB,
  // Fallback — original single webhook
  'default': process.env.DISCORD_WEBHOOK_URL,
};

app.get("/", (req, res) => {
  res.send("TradingView to Discord relay is running! Routes: /webhook/ema-signals, /webhook/inside-bars");
});

// Original route — still works as before
app.post("/webhook", async (req, res) => {
  res.status(200).send("OK");
  const message = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  console.log("Alert received (default):", message);
  await sendToDiscord(WEBHOOKS['default'], message);
});

// Route 1 — EMA signals
app.post("/webhook/ema-signals", async (req, res) => {
  res.status(200).send("OK");
  const message = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  console.log("Alert received (ema-signals):", message);
  await sendToDiscord(WEBHOOKS['ema-signals'], message);
});

// Route 2 — Inside bars
app.post("/webhook/inside-bars", async (req, res) => {
  res.status(200).send("OK");
  const message = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  console.log("Alert received (inside-bars):", message);
  await sendToDiscord(WEBHOOKS['inside-bars'], message);
});

// Send to Discord helper
async function sendToDiscord(webhookUrl, message) {
  if (!webhookUrl) {
    console.error("Discord webhook URL not set for this route!");
    return;
  }
  try {
    const response = await fetch(webhookUrl, {
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
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Webhook relay running on port " + PORT);
  console.log("Routes: /webhook (default), /webhook/ema-signals, /webhook/inside-bars");
});
