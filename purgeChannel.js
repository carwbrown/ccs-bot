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

export function purgeChannelById(client, channelId, ttlMsg) {
  const channelObj = client.channels.cache.get(channelId);

  console.log(channelObj.messages);
  // channelObj.bulkDelete(99, true);
}
