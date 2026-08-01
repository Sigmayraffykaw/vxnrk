const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Check the bot latency'),
  new SlashCommandBuilder().setName('help').setDescription('Show every vxnrk command'),
  new SlashCommandBuilder().setName('avatar').setDescription("Show a user's avatar")
    .addUserOption(o => o.setName('user').setDescription('User to view')),
  new SlashCommandBuilder().setName('userinfo').setDescription('Show information about a user')
    .addUserOption(o => o.setName('user').setDescription('User to view')),
  new SlashCommandBuilder().setName('serverinfo').setDescription('Show server information'),
  new SlashCommandBuilder().setName('botinfo').setDescription('Show bot information'),
  new SlashCommandBuilder().setName('membercount').setDescription('Show the server member count'),
  new SlashCommandBuilder().setName('roleinfo').setDescription('Show information about a role')
    .addRoleOption(o => o.setName('role').setDescription('Role to view').setRequired(true)),
  new SlashCommandBuilder().setName('channelinfo').setDescription('Show information about a channel')
    .addChannelOption(o => o.setName('channel').setDescription('Channel to view')),
  new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
  new SlashCommandBuilder().setName('dice').setDescription('Roll a six-sided die'),
  new SlashCommandBuilder().setName('eightball').setDescription('Ask the magic 8-ball')
    .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
  new SlashCommandBuilder().setName('poll').setDescription('Create a yes/no poll')
    .addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true)),
  new SlashCommandBuilder().setName('say').setDescription('Make the bot send a message')
    .addStringOption(o => o.setName('message').setDescription('Message to send').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName('announce').setDescription('Send an announcement')
    .addStringOption(o => o.setName('message').setDescription('Announcement text').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder().setName('clear').setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('1-100 messages').setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName('slowmode').setDescription('Set channel slowmode')
    .addIntegerOption(o => o.setName('seconds').setDescription('0-21600 seconds').setMinValue(0).setMaxValue(21600).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName('lock').setDescription('Lock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName('unlock').setDescription('Unlock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName('nick').setDescription("Change a member's nickname")
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname; leave empty to reset'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  new SlashCommandBuilder().setName('warn').setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName('warnings').setDescription("View a member's warnings")
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName('timeout').setDescription('Timeout a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Timeout length').setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName('untimeout').setDescription("Remove a member's timeout")
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName('kick').setDescription('Kick a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder().setName('ban').setDescription('Ban a member')
    .addUserOption(o => o.setName('user').setDescription('Member').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder().setName('unban').setDescription('Unban a user by ID')
    .addStringOption(o => o.setName('user_id').setDescription('Discord user ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
].map(command => command.toJSON());

module.exports = commands;
