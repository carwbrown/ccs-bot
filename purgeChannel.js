async function clear(msg, generalChannel) {
  console.log("deleting messages");
  msg.delete();
  const fetched = await generalChannel.fetchMessages({ limit: 99 });
  generalChannel.bulkDelete(fetched);
}

export function purgeChannel(msg) {
  const args = msg.content.split(/ +/);
  console.log("args: ", args);
  const generalChannel = bot.channels.find("name", "general");
  console.log("generalChannel: ", generalChannel);
  clear(msg, generalChannel);
  msg.reply("purge");
}
