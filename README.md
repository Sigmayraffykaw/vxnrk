# vxnrk Discord Bot

A clean Discord.js bot starter with slash commands, moderation, server utilities, member logging, and secure environment variables.

## Commands

- `/ping`
- `/userinfo [user]`
- `/serverinfo`
- `/clear <amount>`
- `/kick <user> [reason]`
- `/ban <user> [reason]`
- `/timeout <user> <minutes> [reason]`

## Setup

1. Install [Node.js 20+](https://nodejs.org/).
2. Clone this repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Open the [Discord Developer Portal](https://discord.com/developers/applications), create an application and bot, then copy its token and application ID into `.env`.
6. Enable **Server Members Intent** under **Bot → Privileged Gateway Intents**.
7. Put a test server ID in `GUILD_ID` for instant command deployment.
8. Run `npm run deploy` once.
9. Run `npm start`.

## Invite permissions

Invite the bot with the `bot` and `applications.commands` scopes. Give it only the permissions needed for the commands you plan to use, such as Manage Messages, Kick Members, Ban Members, and Moderate Members.

## Security

Never upload `.env` or your Discord bot token. If a token is exposed, reset it immediately in the Discord Developer Portal.

## Development

```bash
npm run dev
```

## License

MIT
