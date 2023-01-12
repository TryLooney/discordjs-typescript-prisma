import { Command } from '../../structures/Command';
import { ExtendedEmbedBuilder, Type } from '../../structures/Embed';

export default new Command({
  name: 'ping',
  description: "replies with Clara's latency",
  run: async ({ interaction }) => {
    const time = Date.now();
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new ExtendedEmbedBuilder()
          .setUser(interaction.user)
          .setType(Type.Info)
          .setDescription('Ping! Calculating...'),
      ],
    });
    await interaction.editReply({
      embeds: [
        new ExtendedEmbedBuilder()
          .setUser(interaction.user)
          .setType(Type.Success)
          .setDescription(`Pong! Latency: ${Date.now() - time}ms`),
      ],
    });
  },
});
