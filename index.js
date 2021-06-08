import { purgeChannel, purgeChannelById } from "./purgeChannel.js";
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
});

// client.on("guildMemberAdd", (member) => {
//   // Send the message to a designated channel on a server:
//   const channel = member.guild.channels.cache.find(
//     (ch) => ch.name === "general",
//   );
//   // Do nothing if the channel wasn't found on this server
//   if (!channel) return;
//   // Send the message, mentioning the member
//   channel.send(`!dadjoke`);
// });

// const SERVER_ID_APLAN = "334921100582715403";
// const CHANNEL_ID_APLAN = "334921100582715403";

// setInterval(() => {
//   console.log("Hello, interval has started");

//   fs.readFile("./css.json", (err, data) => {
//     if (err) throw err;
//     let fileData = JSON.parse(data);
//     const timeNow = new Date().getTime();
//     if (
//       fileData[SERVER_ID_APLAN][CHANNEL_ID_APLAN].ttl +
//         fileData[SERVER_ID_APLAN][CHANNEL_ID_APLAN].lastDelete <
//       timeNow
//     ) {
//       const newFileData = {
//         ...fileData,
//         [SERVER_ID_APLAN]: {
//           ...fileData[SERVER_ID_APLAN],
//           [CHANNEL_ID_APLAN]: {
//             ...fileData[SERVER_ID_APLAN][CHANNEL_ID_APLAN],
//             lastDelete: timeNow,
//           },
//         },
//       };
//       fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
//         if (err) throw err;
//         purgeChannelById(client, CHANNEL_ID_APLAN);
//         console.log(
//           `${fileData[SERVER_ID_APLAN].name}'s ${fileData[SERVER_ID_APLAN][CHANNEL_ID_APLAN].name} channel just purged`,
//         );
//       });
//     }
//   });
// }, 180000);

const SERVER_ID_CCS = "186674984847015936";
const CHANNEL_ID_CCS_LFG = "851879663503409152";
const FOURTEEN_DAYS_MS = 1209600000;
// LFG CCS channel
setInterval(() => {
  console.log("Hello, interval has started");

  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    const timeNow = new Date().getTime();
    if (
      fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].ttl +
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
        purgeChannelById(client, CHANNEL_ID_CCS_LFG, 180000);
        console.log(
          `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].name} channel just purged`,
        );
      });
    }
  });
}, 3000);

// const CHANNEL_ID_CCS_SCRIM = "675808497988009986";
// const TEN_HOURS_MS = 36000000;

// setInterval(() => {
//   console.log("Hello, interval has started");

//   fs.readFile("./css.json", (err, data) => {
//     if (err) throw err;
//     let fileData = JSON.parse(data);
//     const timeNow = new Date().getTime();
//     if (
//       fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].ttl +
//         fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].lastDelete <
//       timeNow
//     ) {
//       const newFileData = {
//         ...fileData,
//         [SERVER_ID_CCS]: {
//           ...fileData[SERVER_ID_CCS],
//           [CHANNEL_ID_CCS_SCRIM]: {
//             ...fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM],
//             lastDelete:
//               fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].ttl +
//               fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_LFG].lastDelete,
//           },
//         },
//       };
//       fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
//         if (err) throw err;
//         purgeChannelById(client, CHANNEL_ID_CCS_SCRIM, TEN_HOURS_MS);
//         console.log(
//           `${fileData[SERVER_ID_CCS].name}'s ${fileData[SERVER_ID_CCS][CHANNEL_ID_CCS_SCRIM].name} channel just purged`,
//         );
//       });
//     }
//   });
// }, 200000);

// Here you can login the bot. It automatically attempts to login the bot
// with the environment variable you set for your bot token ("DISCORD_TOKEN")
const token = process.env.DISCORD_TOKEN;
keepAlive();
client.login(token);
