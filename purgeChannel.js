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

export async function purgeChannelById(client, channelId, ttlMsg, timeNow) {
  const channelObj = client.channels.cache.get(channelId);

  const messages = await channelObj.messages.fetch();

  for (let value of messages.values()) {
    if(value.createdTimestamp + ttlMsg < timeNow){
      channelObj.messages.delete(value.id)
    }
  }
}
