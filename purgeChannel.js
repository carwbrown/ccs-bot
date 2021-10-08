import { SERVER_ID_CCS } from "./index.js";
import fs from "fs";

async function clear(msg, generalChannel) {
  msg.delete();
  generalChannel.bulkDelete(99, true);
}

export function purgeChannel(client, msg) {
  const args = msg.content.split(/ +/);

  const generalChannel = msg.guild.channels.cache.find((channel) => {
    return channel.name === args[1];
  });
  if (!generalChannel) return;
  const generalObj = client.channels.cache.get(generalChannel.id);

  clear(msg, generalObj);
  msg.author.send(`${generalChannel.name} channel has been cleaned out`);
}

export async function purgeChannelById(
  client,
  channelId,
  ttlMsg,
  timeNow,
  permanentMessageId,
) {
  const channelObj = client.channels.cache.get(channelId);
  try {
    const messages = await channelObj.messages.fetch();

    for (let value of messages.values()) {
      if (
        value.createdTimestamp + ttlMsg < timeNow &&
        permanentMessageId !== value.id
      ) {
        channelObj.messages.delete(value.id);
      }
    }
  } catch (err) {
    console.log('err: ', err)
  }
}

export async function purgeChannelOnOff(msg, turnOn) {
  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);

    const newFileData = {
      ...fileData,
      [SERVER_ID_CCS]: {
        ...fileData[SERVER_ID_CCS],
        on: turnOn,
      },
    };
    fs.writeFile("./css.json", JSON.stringify(newFileData), (err) => {
      if (err) throw err;
      console.log(
        `${fileData[SERVER_ID_CCS].name}'s automatic delete: ${turnOn}`,
      );
    });
  });
  msg.reply(`Automatic delete: ${turnOn ? "on" : "off"}`);
}

export async function purgeChannelStatus(msg) {
  fs.readFile("./css.json", (err, data) => {
    if (err) throw err;
    let fileData = JSON.parse(data);
    msg.reply(
      `Automatic delete is currently ${
      fileData[SERVER_ID_CCS].on ? "on" : "off"
      }`,
    );
  });
}
