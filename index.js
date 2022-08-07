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
import fetch from "node-fetch";

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
    // scrims id 669378819412459551
   if (msg.content === "!scrims") {
    const role = msg.guild.roles.cache.get("669378819412459551");

    if (msg.member.roles.cache.find(r => r.name === "Scrims")) {
      msg.member.roles.remove(role);
      msg.react('⛔') 
    } else {
      msg.member.roles.add(role);
      msg.react('✅') 
    }
  }

  // lfg 896245649685766164
  if (msg.content === "!lfg") {
    const role = msg.guild.roles.cache.get("896245649685766164");
    
    if (msg.member.roles.cache.find(r => r.name === "LFG")) {
      msg.member.roles.remove(role);
      msg.react('⛔') 
    } else {
      msg.member.roles.add(role);
      msg.react('✅') 
    }
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
    }
  });
}, 6000000); // check every 100 minutes

// ******************************
// * LFG CCS channel
// ******************************

setInterval(() => {
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
    }
  });
}, 180000); // check every 3 minutes

// ******************************
// * SCRIM channel
// ******************************

setInterval(() => {
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
    }
  });
}, 210000); // check every 3.5 minutes

// ******************************
// * TWITCH Alert
// ******************************

const replItDbUrl = process.env.REPLIT_DB_URL;

const getDbValueByKey = async (key) => {
   return await fetch(replItDbUrl + "/" + key)
      .then((e) => e.text())
      .then((strValue) => {
        if (!strValue) {
          return null;
        }

        let value = strValue;
        try {
          // Try to parse as JSON, if it fails, we throw
          value = JSON.parse(strValue);
        } catch (_err) {
          throw new SyntaxError(
            `Failed to parse value of ${key}, try passing a raw option to get the raw value`
          );
        }

        if (value === null || value === undefined) {
          return null;
        }

        return value;
      })
}

const setDbValueByKey = async (key, value) => {
    const strValue = JSON.stringify(value);

    await fetch(replItDbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeURIComponent(key) + "=" + encodeURIComponent(strValue),
    });
  }

const getAllDbValues = async () => {
  return await fetch(
      replItDbUrl + "?encode=true&prefix=")
      .then((r) => r.text())
      .then((t) => {
        if (t.length === 0) {
          return [];
        }
        return t.split("\n").map(decodeURIComponent);
      });
}

const clientId = process.env.TW_CLIENT_ID;
const clientSecret = process.env.TW_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

async function getUserStream(userId) {
  return await apiClient.streams.getStreamByUserId(userId);
}

const castingCaptivatingStreamsId = "714675982442692661";
const castingCaptivitatingStreamsChannel = async () =>
  await client.channels.fetch(castingCaptivatingStreamsId);

// https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/
// Add someone to DB - wildheart_esports
//  curl $REPLIT_DB_URL -d '<STREAMER_ID>={"name":"","isLive":false,"title":""}'
// curl $REPLIT_DB_URL -d '139660583={"name":"","isLive":false,"title":""}'
// curl "$REPLIT_DB_URL?prefix=" list all DB entries
// delete curl -XDELETE $REPLIT_DB_URL/2204384022043840

setInterval(async () => {
  try {
    const allStreamers = await getAllDbValues();
    allStreamers.forEach(async (userId) => {
      const dbEntry = await getDbValueByKey(userId);

      const userStream = await getUserStream(userId);

      const streamerNewlyLive = !dbEntry.isLive && userStream !== null;
      const streamerNewlyOffline = dbEntry.isLive && userStream === null;

      if (streamerNewlyLive) {
        const timeNow = new Date().getTime();
        console.log("newly live userStream: ", userStream.userDisplayName, userId, timeNow);

        const discordChannel = await castingCaptivitatingStreamsChannel();

        let lastMessage = ''
        try{
          const lastMsgId = discordChannel.lastMessageID
          lastMessage = await discordChannel.messages.fetch(lastMsgId);
        } catch (err) {
          console.log(err, 'discord msg error')
        }

        const msgJustSent = lastMessage?.content?.startsWith(`Hype! **${userStream.userDisplayName}**`) && (lastMessage?.createdTimeStamp + 300000 > timeNow);

        if (userStream.title !== dbEntry.title && userStream.gameName === "Heroes of the Storm" && !msgJustSent) {
          discordChannel.send(
            `Hype! **${userStream.userDisplayName}** is live, streaming ${
              userStream.gameName
            }.
            > ${userStream.title || "No title ☹️"} https://www.twitch.tv/${
              userStream.userName
            }`,
          );
        }

        await setDbValueByKey(userId, {
          isLive: true,
          title: userStream.title,
          name: userStream.userDisplayName,
        });
      }

      if (streamerNewlyOffline) {
        console.log("newly offline stream: ", userId);
        await setDbValueByKey(userId, {
          ...dbEntry,
          isLive: false,
        });
      }
    });
  } catch (err){
    console.log(err)
  }
}, 120000); // check every 2 minutes


// Here you can login the bot. It automatically attempts to login the bot
// with the environment variable you set for your bot token ("DISCORD_TOKEN")
const token = process.env.DISCORD_TOKEN;
keepAlive();
client.login(token);
