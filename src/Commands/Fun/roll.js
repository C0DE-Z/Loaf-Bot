const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "roll",
    description: "Dice Roll",
    dm_permissions: "0",
  },
  async execute(interaction, client) {


    const embed = new EmbedBuilder()
      .setTitle("The magic 8ball says:")
      .setDescription(Math.floor(Math.random() * 8))
      .setColor("#00FFAA");

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
