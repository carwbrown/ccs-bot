import express from "express";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

const server = express();
server.all("/", (req, res) => {
  res.send("Your bot is alive!");
});

export function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is Ready!");
  });
}

// https://www.streamweasels.com/support/convert-twitch-username-to-user-id/
const RAKA = 479927329;

const clientId = process.env.TW_CLIENT_ID;
const clientSecret = process.env.TW_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const middleware = new EventSubMiddleware({
  apiClient,
  hostName: "ccs-bot.mesostables.repl.co",
  pathPrefix: "/twitch",
  secret: process.env.TW_CWB_SECRET,
});

await middleware.apply(server);
server.listen(3001, async () => {
  await middleware.markAsReady();
  await middleware.subscribeToStreamOnlineEvents(RAKA, (event) => {
    console.log(`${event.broadcasterDisplayName} just went live!`);
    console.log("event: ", event);
  });
});
