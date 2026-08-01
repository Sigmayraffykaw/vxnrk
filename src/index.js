import 'dotenv/config';
import {
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits
} from 'discord.js';

const { DISCORD_TOKEN, LOG_CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is missing. Copy .env.example to .env and add your token.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

async function sendLog(guild, embed) {
  if (!LOG_CHANNEL_ID) return;
  const channel = await guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
  if (channel?.isTextBased()) await channel.send({ embeds: [embed] }).catch(() => null);
}

client.once(Events.ClientReady, readyClient => {
  console.log(`vxnrk is online as ${readyClient.user.tag}`);
  readyClient.user.setActivity('/help • vxnrk');
});

client.on(Events.GuildMemberAdd, member => {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Member Joined')
    .setDescription(`${member.user.tag} joined the server.`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  sendLog(member.guild, embed);
});

client.on(Events.GuildMemberRemove, member => {
  const embed = new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle('Member Left')
    .setDescription(`${member.user.tag} left the server.`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();
  sendLog(member.guild, embed);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'ping') {
      return interaction.reply(`Pong! ${client.ws.ping}ms`);
    }

    if (interaction.commandName === 'userinfo') {
      const user = interaction.options.getUser('user') ?? interaction.user;
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(user.tag)
        .setThumbnail(user.displayAvatarURL({ size: 256 }))
        .addFields(
          { name: 'User ID', value: user.id, inline: true },
          { name: 'Account created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Joined server', value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === 'serverinfo') {
      const guild = interaction.guild;
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ size: 256 }))
        .addFields(
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === 'clear') {
      const amount = interaction.options.getInteger('amount', true);
      const deleted = await interaction.channel.bulkDelete(amount, true);
      return interaction.reply({ content: `Deleted ${deleted.size} messages.`, ephemeral: true });
    }

    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? `Action by ${interaction.user.tag}`;

    if (!target) {
      return interaction.reply({ content: 'That member could not be found.', ephemeral: true });
    }

    if (interaction.commandName === 'kick') {
      if (!target.kickable) return interaction.reply({ content: 'I cannot kick that member.', ephemeral: true });
      await target.kick(reason);
      await interaction.reply(`Kicked **${target.user.tag}**.`);
    }

    if (interaction.commandName === 'ban') {
      if (!target.bannable) return interaction.reply({ content: 'I cannot ban that member.', ephemeral: true });
      await target.ban({ reason });
      await interaction.reply(`Banned **${target.user.tag}**.`);
    }

    if (interaction.commandName === 'timeout') {
      const minutes = interaction.options.getInteger('minutes', true);
      if (!target.moderatable) return interaction.reply({ content: 'I cannot timeout that member.', ephemeral: true });
      await target.timeout(minutes * 60_000, reason);
      await interaction.reply(`Timed out **${target.user.tag}** for ${minutes} minute(s).`);
    }

    const logEmbed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('Moderation Action')
      .addFields(
        { name: 'Action', value: interaction.commandName, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Member', value: target.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();
    await sendLog(interaction.guild, logEmbed);
  } catch (error) {
    console.error(error);
    const response = { content: 'Something went wrong while running that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(response);
    else await interaction.reply(response);
  }
});

client.login(DISCORD_TOKEN);
