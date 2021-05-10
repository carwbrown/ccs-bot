import { purgeChannel } from "./purgeChannel.js";
import Discord from "discord.js";
import dotenv from "dotenv";

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
client.login(token);
