import { purgeChannel, purgeChannelById, purgeChannelOnOff } from "./purgeChannel.js";
import { keepAlive } from "./server.js";
import Discord from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

// Importing this allows you to access the environment variables of the running node process
dotenv.config();

const client = new Discord.Client();

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
    (msg.content.startsWith("!ccs-delete-off") || msg.content.startsWith("!ccs-delete-on")) &&
    msg.member.hasPermission("ADMINISTRATOR")
  ) {
    const turnOn = msg.content.startsWith("!ccs-delete-on");
    purgeChannelOnOff(msg, turnOn);
  }

});

export const SERVER_ID_CCS = "186674984847015936";
export const CHANNEL_ID_CCS_TEST = "851879663503409152";
export const CHANNEL_ID_CCS_LFG = "726588620529598577";
export const CHANNEL_ID_CCS_SCRIM = "675808497988009986";

const THREE_MINUTES_MS = 180000;
const TEN_HOURS_MS = 36000000;
const FOURTEEN_DAYS_MS = 1209600000;

// ******************************
// test bot channel
// ******************************

setInterval(() => {
  console.log("Hello, aplan interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    if (
      fileData[SERVER_ID_CCS].on && fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].ttl +
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].lastDelete <
      timeNow
    ) {
      const newFileData = {
        ...fileData,
        [SERVER_ID_CCS]: {
          ...fileData[SERVER_ID_CCS],
          [CHANNEL_ID_CCS_TEST]: {
            ...fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST],
            lastDelete:
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].ttl +
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].lastDelete,
          },
        },
      };
      fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
        if (err) throw err;
        purgeChannelById(
          client,
          CHANNEL_ID_CCS_TEST,
          THREE_MINUTES_MS,
          timeNow,
        );
        console.log(
          `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_TEST].name} channel just checked`,
        );
      });
    }
  });
}, 60000); // check every minute


// ******************************
// // LFG CCS channel
// ******************************

setInterval(() => {
  console.log("Hello, lfg interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    // !!!! off for now !!!!
    if (
      false && fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].ttl +
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].lastDelete <
      timeNow
    ) {
      const newFileData = {
        ...fileData,
        [SERVER_ID_CCS]: {
          ...fileData[SERVER_ID_CCS],
          [CHANNEL_ID_CCS_LFG]: {
            ...fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG],
            lastDelete:
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].ttl +
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].lastDelete,
          },
        },
      };
      fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
        if (err) throw err;
        purgeChannelById(client, CHANNEL_ID_CCS_LFG, TEN_HOURS_MS, timeNow);
        console.log(
          `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].name} channel just checked`,
        );
      });
    }
  });
}, 180000); // check every 3 minutes

// ******************************
// // SCRIM channel
// ******************************

setInterval(() => {
  console.log("Hello, scrim channel interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    // !!!! off for now !!!
    if (
      false && fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].ttl +
        fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].lastDelete <
      timeNow
    ) {
      const newFileData = {
        ...fileData,
        [SERVER_ID_CCS]: {
          ...fileData[SERVER_ID_CCS],
          [CHANNEL_ID_CCS_SCRIM]: {
            ...fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM],
            lastDelete:
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].ttl +
              fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].lastDelete,
          },
        },
      };
      fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
        if (err) throw err;
        purgeChannelById(
          client,
          CHANNEL_ID_CCS_SCRIM,
          FOURTEEN_DAYS_MS,
          timeNow,
        );
        console.log(
          `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].name} channel just checked`,
        );
      });
    }
  });
}, 210000); // check every 3.5 minutes

// Here you can login the bot. It automatically attempts to login the bot
// with the environment variable you set for your bot token ("DISCORD_TOKEN")
const token = process.env.DISCORD_TOKEN;
keepAlive();
client.login(token);
