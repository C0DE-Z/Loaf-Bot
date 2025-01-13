const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  presence: {
    activities: [{ name: "I never Die!", type: "PLAYING" }],
    status: "online",
  },
});

client.commands = new Collection();

module.exports.start = async (config) => {
  try {
    client.config = config;

    console.log("loading commands...");
    await require("./commands.js").execute(client);
    console.log("loading handler...");
    await require("./handler.js").execute(client);
    console.log("loading events...");
    await require("./events.js").execute(client);

    await client.login(config.TOKEN);

    // Unregister all existing commands first
    console.log("Unregistering old commands...");
    const existingCommands = await client.application.commands.fetch();
    for (const command of existingCommands.values()) {
      await client.application.commands.delete(command.id);
      console.log(`Unregistered command: ${command.name}`);
    }

    // Register new commands
    console.log("Registering new commands...");
    const commandsArray = Array.from(client.commands.values()).map((cmd) => cmd.data);
    await client.application.commands.set(commandsArray);
    console.log(`Successfully registered ${commandsArray.length} commands!`);
  } catch (error) {
    console.error("Error starting client:", error);
    process.exit(1);
  }
};
