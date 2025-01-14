const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "8ball",
    description: "8Ball",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const responses=[
        "Yes", 
        "No", 
        "Maybe", 
        "No\nChance", 
        "Try\nAgain", 
        "How\nin the heck\nwould I know", 
        "Don't bet\non it",
        "One\nchance in\na million"
    ];

    const embed = new EmbedBuilder()
      .setTitle("The magic 8ball says:")
      .setDescription(responses[Math.floor(Math.random() * responses.length)])
      .setColor("#00FFAA");

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
