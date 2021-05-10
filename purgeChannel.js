async function clear(msg, generalChannel) {
  console.log("deleting messages");
  msg.delete();
  generalChannel.bulkDelete(99, true);
}

export function purgeChannel(client, msg) {
  const args = msg.content.split(/ +/);
  console.log("args: ", args);

  const generalChannel = msg.guild.channels.cache.find(channel => {
    return channel.name === args[1]
  });
  if(!generalChannel) return;
  const generalObj = client.channels.cache.get(generalChannel.id);

  console.log("generalObj: ", generalObj);
  clear(msg, generalObj);
  msg.author.send(`${generalChannel.name} channel has been cleaned out`}
}
