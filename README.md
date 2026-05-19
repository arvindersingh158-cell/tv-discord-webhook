# TradingView to Discord Webhook Relay

Receives alerts from TradingView and forwards them to Discord.

## Setup on Railway

1. Deploy this repo to Railway
2. Add environment variable: `DISCORD_WEBHOOK_URL` = your Discord webhook URL
3. Use the Railway public URL + `/webhook` as your TradingView webhook URL

Example: `https://your-app.up.railway.app/webhook`
