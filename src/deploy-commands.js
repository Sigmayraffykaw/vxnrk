require('dotenv').config();
const { REST, Routes } = require('discord.js');
const commands = require('./commands.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  throw new Error('DISCORD_TOKEN and CLIENT_ID are required in .env');
}

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  const route = GUILD_ID
    ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
    : Routes.applicationCommands(CLIENT_ID);

  try {
    console.log(`Deploying ${commands.length} slash commands...`);
    await rest.put(route, { body: commands });
    console.log(GUILD_ID ? 'Guild commands deployed.' : 'Global commands deployed.');
  } catch (error) {
    console.error('Command deployment failed:', error);
    process.exitCode = 1;
  }
}

deployCommands();
