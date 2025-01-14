const { EmbedBuilder } = require("discord.js");
const { getDadjoke, getPunchLine, getRandomJoke } = require("random-jokes");


module.exports = {
  data: {
    name: "joke",
    description: "Pulls a random joke!",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const dadJoke = await getDadjoke();
    const punchline = await getPunchLine();
    const embed = new EmbedBuilder()
      .setTitle("The Joke is ")
      .setDescription(dadJoke + "\n" + punchline)
      .setColor("#00FFAA");

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
