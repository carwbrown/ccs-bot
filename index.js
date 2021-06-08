import { purgeChannel } from "./purgeChannel.js";
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

  setInterval(() => {
    console.log("Hello, interval has started");

    fs.readFile("./css.json", (err, data) => {
      if (err) throw err;
      let fileData = JSON.parse(data);
      const timeNow = new Date().getTime();
      console.log("fileData: ", fileData);
      if (fileData[TEST_ID].ttl + fileData[TEST_ID].lastDelete < timeNow) {
        const newFileData = {
          ...fileData,
          [TEST_ID]: {
            ...fileData[TEST_ID],
            lastDelete: timeNow,
          },
        };
        console.log("newFileData: ", newFileData);
        fs.writeFile("./css.json", newFileData, (err) => {
          if (err) throw err;
          console.log("Now, please delete me");
        });
      }
    });
  }, 3000);
});

client.on("guildMemberAdd", (member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "general",
  );
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`!dadjoke`);
});

// Here you can login the bot. It automatically attempts to login the bot
// with the environment variable you set for your bot token ("DISCORD_TOKEN")
const token = process.env.DISCORD_TOKEN;
keepAlive();
client.login(token);
