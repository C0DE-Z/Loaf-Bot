const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: {
        name: "ban",
        description: "Ban a user from the server",
        dm_permissions: "0",
        default_member_permissions: PermissionFlagsBits.BanMembers,
        options: [
            {
                name: "user",
                description: "The user to ban",
                type: 6, // USER type
                required: true
            },
            {
                name: "reason",
                description: "Reason for the ban",
                type: 3, // STRING type
                required: false
            },
            {
                name: "delete_messages",
                description: "Delete message history (in days)",
                type: 4, // INTEGER type
                required: false,
                choices: [
                    { name: "Don't delete any", value: 0 },
                    { name: "Last 24 hours", value: 1 },
                    { name: "Last 7 days", value: 7 }
                ]
            }
        ]
    },
    async execute(interaction, client) {
        try {
            const targetUser = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason") || "No reason provided";
            const deleteMessageDays = interaction.options.getInteger("delete_messages") || 0;

            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            if (!targetMember.bannable) {
                return interaction.reply({
                    content: "I cannot ban this user! They may have higher permissions than me.",
                    ephemeral: true
                });
            }

            if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
                return interaction.reply({
                    content: "You cannot ban this user as they have equal or higher roles than you!",
                    ephemeral: true
                });
            }

            await targetMember.ban({
                deleteMessageDays: deleteMessageDays,
                reason: `${reason} (Banned by ${interaction.user.tag})`
            });

            const embed = new EmbedBuilder()
                .setTitle("User Banned")
                .setColor("#FF0000")
                .addFields([
                    { name: "Banned User", value: `${targetUser.tag} (${targetUser.id})` },
                    { name: "Banned By", value: interaction.user.tag },
                    { name: "Reason", value: reason },
                    { name: "Message History Deleted", value: `${deleteMessageDays} days` }
                ])
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            try {
                await targetUser.send({
                    content: `You have been banned from ${interaction.guild.name}\nReason: ${reason}`
                });
            } catch (error) {
                console.log(`Could not DM user ${targetUser.tag}`);
            }

        } catch (error) {
            console.error('Ban command error:', error);
            await interaction.reply({
                content: "There was an error while executing the ban command!",
                ephemeral: true
            });
        }
    },
};
