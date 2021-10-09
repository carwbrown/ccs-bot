import express from "express";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { EventSubMiddleware } from "@twurple/eventsub";
import { client as discordClient } from "./index.js";

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
const VALK = 141728236;
const KRUSH = 137355398;
const BRAINER = 59023461;

const clientId = process.env.TW_CLIENT_ID;
const clientSecret = process.env.TW_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const middleware = new EventSubMiddleware({
  apiClient,
  hostName: "ccs-bot.mesostables.repl.co",
  pathPrefix: "/twitch",
  secret: `${process.env.TW_CWB_SECRET}${Date.now()}`,
});

try {
  await middleware.apply(server);
} catch (err) {
  console.log("apply middleware error: ", err);
}

const streamListenersMap = new Map();
const castingCaptivatingStreamsId = "714675982442692661";

// https://www.streamweasels.com/support/convert-twitch-username-to-user-id/
const RAKA = 479927329;
const VALK = 141728236;
const KRUSH = 137355398;
const BRAINER = 59023461;
const streamers = [RAKA, VALK, KRUSH, BRAINER];

server.listen(3001, async () => {
  try {
    await middleware.markAsReady();
    discordClient.on("ready", async () => {
      const channel = await discordClient.channels.fetch(
        castingCaptivatingStreamsId,
      );

      await Promise.all(
        streamers.map((streamer) => {
          const onlineSub = await middleware.subscribeToStreamOnlineEvents(
            streamer,
            (event) => {
              console.log(`${event.broadcasterDisplayName} just went live!`);
              channel.send(
                `Hype! ${event.broadcasterDisplayName} is live. "${
                  event.getStream().title || ""
                }" https://www.twitch.tv/${event.broadcasterName}`,
              );
            },
          );

          streamListenersMap.set(streamer, onlineSub);
          return onlineSub;
        }),
      );
    });
  } catch (err) {
    console.log("listening error: ", err);
  }
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  server.close(() => {
    debug("HTTP server closed");
  });

  if (twitchEventListeners && twitchEventListeners.length > 0) {
    streamListenersMap.forEach((value) => await value.stop());
  }
}
