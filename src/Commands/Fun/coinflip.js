const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "cf",
    description: "toss a coin!",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const responses=[
        "Heads", 
        "Tails", 
    ];

    const embed = new EmbedBuilder()
      .setTitle("The coin landed on:")
      .setDescription(responses[Math.floor(Math.random() * responses.length)])
      .setColor("#00FFAA");

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
