# vxnrk Discord Bot

A modern Discord bot built with Node.js and discord.js v14.

## Commands

**Utility:** `/ping`, `/help`, `/avatar`, `/userinfo`, `/serverinfo`, `/botinfo`, `/membercount`, `/roleinfo`, `/channelinfo`

**Fun:** `/coinflip`, `/dice`, `/eightball`, `/poll`

**Management:** `/say`, `/announce`, `/clear`, `/slowmode`, `/lock`, `/unlock`, `/nick`

**Moderation:** `/warn`, `/warnings`, `/timeout`, `/untimeout`, `/kick`, `/ban`, `/unban`

> Warnings are stored in memory and reset whenever the bot restarts.

## Setup

1. Install Node.js 18 or newer.
2. Clone this repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add your bot token, application ID, and test server ID.
6. Run `npm run deploy` to register slash commands.
7. Run `npm start`.

Never upload your real `.env` or bot token to GitHub.
