import {
  purgeChannel,
  purgeChannelById,
  purgeChannelOnOff,
  purgeChannelStatus,
} from "./purgeChannel.js";
import { keepAlive } from "./server.js";
import Discord from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

// Importing this allows you to access the environment variables of the running node process
dotenv.config();

export const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "!ping") {
    msg.reply("Pong! test");
  }

  if (
    msg.content.startsWith("!purge") &&
    msg.member.hasPermission("ADMINISTRATOR")
  ) {
    purgeChannel(client, msg);
  }

  if (
    (msg.content.startsWith("!ccs-delete-off") ||
      msg.content.startsWith("!ccs-delete-on")) &&
    (msg.member.hasPermission("ADMINISTRATOR") ||
      msg.member.user.id === "140115046188580865")
  ) {
    const turnOn = msg.content.startsWith("!ccs-delete-on");
    purgeChannelOnOff(msg, turnOn);
  }

  if (
    msg.content.startsWith("!ccs-delete-status") &&
    (msg.member.hasPermission("ADMINISTRATOR") ||
      msg.member.user.id === "140115046188580865")
  ) {
    purgeChannelStatus(msg);
  }
});

export const SERVER_ID_CCS = "186674984847015936";
const CHANNEL_ID_CCS_TEST = "851879663503409152";
const CHANNEL_ID_CCS_LFG = "726588620529598577";
const CHANNEL_ID_CCS_SCRIM = "675808497988009986";

// ******************************
// * test bot channel
// ******************************

setInterval(() => {
  console.log("Hello, mesos-bot-test interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    // fileData[SERVER_ID_CCS].on

    if (false) {
      purgeChannelById(
        client,
        CHANNEL_ID_CCS_TEST,
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].ttl,
        timeNow,
        "855544406152445953", // permanentMessageId
      );
      console.log(
        `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].name} channel just checked`,
      );
    }
  });
}, 6000000); // check every 100 minutes

// ******************************
// * LFG CCS channel
// ******************************

setInterval(() => {
  console.log("Hello, lfg interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    // fileData[SERVER_ID_CCS].on
    if (fileData[SERVER_ID_CCS].on) {
      purgeChannelById(
        client,
        CHANNEL_ID_CCS_LFG,
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].ttl,
        timeNow,
        "860249299354255400", // permanentMessageId
      );
      console.log(
        `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].name} channel just checked`,
      );
    }
  });
}, 180000); // check every 3 minutes

// ******************************
// * SCRIM channel
// ******************************

setInterval(() => {
  console.log("Hello, scrim channel interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    // fileData[SERVER_ID_CCS].on

    if (fileData[SERVER_ID_CCS].on) {
      purgeChannelById(
        client,
        CHANNEL_ID_CCS_SCRIM,
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].ttl,
        timeNow,
        "858394992182427670",
      );
      console.log(
        `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].name} channel just checked`,
      );
    }
  });
}, 210000); // check every 3.5 minutes

// ******************************
// * TWITCH Alert
// ******************************

const clientId = process.env.TW_CLIENT_ID;
const clientSecret = process.env.TW_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

async function getUserStream(userId) {
  return await apiClient.streams.getStreamByUserId(userId);
}

const castingCaptivatingStreamsId = "714675982442692661";
const castingCaptivitatingStreamsChannel = async () => await client.channels.fetch(
  castingCaptivatingStreamsId,
);
// https://www.streamweasels.com/support/convert-twitch-username-to-user-id/
const RAKA = 479927329;
const VALK = 141728236;
const KRUSH = 137355398;
const BRAINER = 59023461;
const streamers = [RAKA, VALK, KRUSH, BRAINER];

const streamerMap = new Map()

streamers.forEach((streamer) => streamerMap.set(streamer, true))

setInterval(async () => {
  for (const [userId, isLive] of streamerMap.entries()) {
    const userStream = await getUserStream(userId)
    if (!isLive && userStream !== null) {
      // console.log('!isLive userStream: ', userStream, userId)
      streamerMap.set(userId, true)
      const discordChannel = await castingCaptivitatingStreamsChannel()

      discordChannel.send(
        `Hype! **${userStream.userDisplayName}** is live, streaming ${userStream.gameName}.
          > ${
        userStream.title || "No title ☹️"
        } https://www.twitch.tv/${userStream.userName}`,
      );
    }
    if (isLive && userStream === null) {
      // console.log('isLive userStream: ', userStream, userId)
      streamerMap.set(userId, false)
    }
  }
  // console.log('streamerMap: ', streamerMap)
}, 60000); // check every 1 minutes


// Here you can login the bot. It automatically attempts to login the bot
// with the environment variable you set for your bot token ("DISCORD_TOKEN")
const token = process.env.DISCORD_TOKEN;
keepAlive();
client.login(token);
