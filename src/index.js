require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');

if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is missing from .env');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const warnings = new Map();
const keyFor = (guildId, userId) => `${guildId}:${userId}`;
const replyError = (interaction, error) => {
  console.error(error);
  const payload = { content: `❌ ${error.message || 'Something went wrong.'}`, ephemeral: true };
  return interaction.replied || interaction.deferred ? interaction.followUp(payload) : interaction.reply(payload);
};

client.once('ready', () => {
  console.log(`vxnrk online as ${client.user.tag}`);
  client.user.setActivity('/help');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const { commandName } = interaction;
    const targetUser = () => interaction.options.getUser('user') || interaction.user;
    const targetMember = async () => interaction.guild.members.fetch(targetUser().id);

    if (commandName === 'ping') {
      return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }

    if (commandName === 'help') {
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('vxnrk Commands')
        .setDescription('**Utility:** `/ping` `/avatar` `/userinfo` `/serverinfo` `/botinfo` `/membercount` `/roleinfo` `/channelinfo`\n\n**Fun:** `/coinflip` `/dice` `/eightball` `/poll`\n\n**Management:** `/say` `/announce` `/clear` `/slowmode` `/lock` `/unlock` `/nick`\n\n**Moderation:** `/warn` `/warnings` `/timeout` `/untimeout` `/kick` `/ban` `/unban`');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (commandName === 'avatar') {
      const user = targetUser();
      return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${user.username}'s avatar`).setImage(user.displayAvatarURL({ size: 1024 })).setColor(0x5865F2)] });
    }

    if (commandName === 'userinfo') {
      const user = targetUser();
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      const embed = new EmbedBuilder().setColor(0x5865F2).setThumbnail(user.displayAvatarURL())
        .setTitle(user.tag)
        .addFields(
          { name: 'User ID', value: user.id },
          { name: 'Account created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
          { name: 'Joined server', value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown' },
          { name: 'Bot', value: user.bot ? 'Yes' : 'No' }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'serverinfo') {
      const g = interaction.guild;
      const embed = new EmbedBuilder().setColor(0x5865F2).setTitle(g.name).setThumbnail(g.iconURL())
        .addFields(
          { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
          { name: 'Members', value: `${g.memberCount}`, inline: true },
          { name: 'Channels', value: `${g.channels.cache.size}`, inline: true },
          { name: 'Roles', value: `${g.roles.cache.size}`, inline: true },
          { name: 'Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'botinfo') {
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('vxnrk').setThumbnail(client.user.displayAvatarURL()).addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.guilds.cache.reduce((n, g) => n + g.memberCount, 0)}`, inline: true },
        { name: 'Latency', value: `${client.ws.ping}ms`, inline: true },
        { name: 'Library', value: 'discord.js v14', inline: true }
      )] });
    }

    if (commandName === 'membercount') return interaction.reply(`👥 **${interaction.guild.memberCount}** members`);

    if (commandName === 'roleinfo') {
      const role = interaction.options.getRole('role');
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(role.color || 0x5865F2).setTitle(role.name).addFields(
        { name: 'ID', value: role.id }, { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Position', value: `${role.position}`, inline: true }, { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true }
      )] });
    }

    if (commandName === 'channelinfo') {
      const channel = interaction.options.getChannel('channel') || interaction.channel;
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle(`#${channel.name}`).addFields(
        { name: 'ID', value: channel.id }, { name: 'Type', value: ChannelType[channel.type] || `${channel.type}` },
        { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>` }
      )] });
    }

    if (commandName === 'coinflip') return interaction.reply(Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails');
    if (commandName === 'dice') return interaction.reply(`🎲 You rolled **${Math.floor(Math.random() * 6) + 1}**`);

    if (commandName === 'eightball') {
      const answers = ['Yes.', 'No.', 'Definitely.', 'Probably.', 'Ask again later.', 'Very unlikely.', 'Without a doubt.', 'I would not count on it.'];
      return interaction.reply(`🎱 ${answers[Math.floor(Math.random() * answers.length)]}`);
    }

    if (commandName === 'poll') {
      const question = interaction.options.getString('question');
      const message = await interaction.reply({ content: `📊 **${question}**`, fetchReply: true });
      await message.react('✅'); await message.react('❌'); return;
    }

    if (commandName === 'say') {
      await interaction.channel.send(interaction.options.getString('message'));
      return interaction.reply({ content: '✅ Sent.', ephemeral: true });
    }

    if (commandName === 'announce') {
      const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('📢 Announcement').setDescription(interaction.options.getString('message')).setTimestamp();
      await interaction.channel.send({ embeds: [embed] });
      return interaction.reply({ content: '✅ Announcement sent.', ephemeral: true });
    }

    if (commandName === 'clear') {
      const amount = interaction.options.getInteger('amount');
      const deleted = await interaction.channel.bulkDelete(amount, true);
      return interaction.reply({ content: `🧹 Deleted ${deleted.size} messages.`, ephemeral: true });
    }

    if (commandName === 'slowmode') {
      const seconds = interaction.options.getInteger('seconds');
      await interaction.channel.setRateLimitPerUser(seconds);
      return interaction.reply(`⏱️ Slowmode set to **${seconds} seconds**.`);
    }

    if (commandName === 'lock' || commandName === 'unlock') {
      const locked = commandName === 'lock';
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: locked ? false : null });
      return interaction.reply(locked ? '🔒 Channel locked.' : '🔓 Channel unlocked.');
    }

    if (commandName === 'nick') {
      const member = await targetMember();
      const nickname = interaction.options.getString('nickname');
      await member.setNickname(nickname || null);
      return interaction.reply(`✅ ${nickname ? `Nickname changed to **${nickname}**.` : 'Nickname reset.'}`);
    }

    if (commandName === 'warn') {
      const user = targetUser();
      const reason = interaction.options.getString('reason');
      const key = keyFor(interaction.guildId, user.id);
      const list = warnings.get(key) || [];
      list.push({ reason, moderator: interaction.user.id, at: Date.now() }); warnings.set(key, list);
      await user.send(`⚠️ You were warned in **${interaction.guild.name}**: ${reason}`).catch(() => {});
      return interaction.reply(`⚠️ Warned ${user}. Total warnings: **${list.length}**`);
    }

    if (commandName === 'warnings') {
      const user = targetUser();
      const list = warnings.get(keyFor(interaction.guildId, user.id)) || [];
      const text = list.length ? list.map((w, i) => `**${i + 1}.** ${w.reason} — <@${w.moderator}>`).join('\n') : 'No warnings.';
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFEE75C).setTitle(`Warnings for ${user.tag}`).setDescription(text)] });
    }

    if (commandName === 'timeout') {
      const member = await targetMember();
      const minutes = interaction.options.getInteger('minutes');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      await member.timeout(minutes * 60_000, reason);
      return interaction.reply(`🔇 Timed out ${member} for **${minutes} minute(s)**. Reason: ${reason}`);
    }

    if (commandName === 'untimeout') {
      const member = await targetMember(); await member.timeout(null);
      return interaction.reply(`🔊 Removed timeout from ${member}.`);
    }

    if (commandName === 'kick') {
      const member = await targetMember(); const reason = interaction.options.getString('reason') || 'No reason provided';
      await member.kick(reason); return interaction.reply(`👢 Kicked **${member.user.tag}**. Reason: ${reason}`);
    }

    if (commandName === 'ban') {
      const user = targetUser(); const reason = interaction.options.getString('reason') || 'No reason provided';
      await interaction.guild.members.ban(user.id, { reason }); return interaction.reply(`🔨 Banned **${user.tag}**. Reason: ${reason}`);
    }

    if (commandName === 'unban') {
      const id = interaction.options.getString('user_id');
      const user = await interaction.guild.members.unban(id);
      return interaction.reply(`✅ Unbanned **${user.tag}**.`);
    }
  } catch (error) {
    return replyError(interaction, error);
  }
});

client.login(process.env.DISCORD_TOKEN);
