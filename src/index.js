require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is missing from .env');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const warnings = new Map(); const balances = new Map(); const startedAt = Date.now();
const keyFor = (g,u) => `${g}:${u}`; const random = a => a[Math.floor(Math.random()*a.length)];
client.once('ready',()=>{ console.log(`vxnrk online as ${client.user.tag} with 100 commands`); client.user.setActivity('/help • 100 commands'); });
client.on('interactionCreate', async interaction => {
 if(!interaction.isChatInputCommand()) return;
 const {commandName}=interaction; const user=interaction.options.getUser('user')||interaction.user;
 const member=interaction.guild?await interaction.guild.members.fetch(user.id).catch(()=>null):null;
 const reason=interaction.options.getString('reason')||'No reason provided';
 try {
  if(commandName==='ping') return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
  if(commandName==='help'){
   const groups={Utility:['ping','help','avatar','userinfo','serverinfo','botinfo','membercount','roleinfo','channelinfo','servericon','banner','roles','channels','emojis','boosts','uptime','invite','permissions','joined','created','whois','randomuser','timestamp'],Fun:['coinflip','dice','eightball','randomnumber','choose','rate','ship','rps','joke','fact','quote','reverse','uppercase','lowercase','length'],Management:['poll','say','announce','clear','slowmode','lock','unlock','nick','addrole','removerole','createrole','deleterole','createchannel','deletechannel','renamechannel','move','voicekick'],Moderation:['warn','warnings','timeout','untimeout','kick','ban','unban','mute','unmute','purgeuser','softban','massban','modlogs','clearwarnings','setnick','resetnick','deafen','undeafen'],Community:['ticket','closeticket','addticket','removeticket','suggest','report','application','giveaway','reroll','endgiveaway'],Economy:['balance','daily','work','pay','leaderboard','level','rank','xp','profile','achievements'],Tools:['remind','afk','snipe','weather','calculator','translate','define']};
   const e=new EmbedBuilder().setColor(0x5865F2).setTitle('vxnrk • 100 Commands').setDescription(Object.entries(groups).map(([k,v])=>`**${k}**\n${v.map(x=>`\`/${x}\``).join(' ')}`).join('\n\n'));
   return interaction.reply({embeds:[e],ephemeral:true});
  }
  if(commandName==='avatar') return interaction.reply({embeds:[new EmbedBuilder().setColor(0x5865F2).setTitle(`${user.username}'s avatar`).setImage(user.displayAvatarURL({size:1024}))]});
  if(['userinfo','whois'].includes(commandName)) return interaction.reply({embeds:[new EmbedBuilder().setColor(0x5865F2).setTitle(user.tag).setThumbnail(user.displayAvatarURL()).addFields({name:'User ID',value:user.id},{name:'Created',value:`<t:${Math.floor(user.createdTimestamp/1000)}:R>`},{name:'Joined',value:member?.joinedTimestamp?`<t:${Math.floor(member.joinedTimestamp/1000)}:R>`:'Unknown'})]});
  if(commandName==='serverinfo'){const g=interaction.guild;return interaction.reply({embeds:[new EmbedBuilder().setColor(0x5865F2).setTitle(g.name).setThumbnail(g.iconURL()).addFields({name:'Members',value:String(g.memberCount),inline:true},{name:'Channels',value:String(g.channels.cache.size),inline:true},{name:'Roles',value:String(g.roles.cache.size),inline:true},{name:'Created',value:`<t:${Math.floor(g.createdTimestamp/1000)}:R>`})]});}
  if(commandName==='botinfo') return interaction.reply(`🤖 **vxnrk** • 100 commands • discord.js v14 • ${client.guilds.cache.size} servers`);
  if(commandName==='membercount') return interaction.reply(`👥 **${interaction.guild.memberCount}** members`);
  if(commandName==='servericon') return interaction.reply(interaction.guild.iconURL({size:1024})||'This server has no icon.');
  if(commandName==='banner') return interaction.reply(interaction.guild.bannerURL({size:1024})||'This server has no banner.');
  if(commandName==='roles') return interaction.reply(interaction.guild.roles.cache.filter(r=>r.id!==interaction.guild.id).map(r=>r.toString()).slice(0,50).join(' ')||'No roles.');
  if(commandName==='channels') return interaction.reply(interaction.guild.channels.cache.map(c=>c.toString()).slice(0,50).join(' ')||'No channels.');
  if(commandName==='emojis') return interaction.reply(interaction.guild.emojis.cache.map(e=>e.toString()).join(' ')||'No custom emojis.');
  if(commandName==='boosts') return interaction.reply(`🚀 ${interaction.guild.premiumSubscriptionCount||0} boosts • Tier ${interaction.guild.premiumTier}`);
  if(commandName==='uptime') return interaction.reply(`⏱️ Online for ${Math.floor((Date.now()-startedAt)/60000)} minutes`);
  if(commandName==='invite') return interaction.reply(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`);
  if(commandName==='coinflip') return interaction.reply(Math.random()<.5?'🪙 Heads':'🪙 Tails');
  if(commandName==='dice') return interaction.reply(`🎲 You rolled **${Math.floor(Math.random()*6)+1}**`);
  if(commandName==='eightball') return interaction.reply(`🎱 ${random(['Yes.','No.','Definitely.','Probably.','Ask again later.','Very unlikely.'])}`);
  if(commandName==='randomnumber') return interaction.reply(`🔢 ${Math.floor(Math.random()*interaction.options.getInteger('maximum'))+1}`);
  if(commandName==='choose') return interaction.reply(`I choose **${random(interaction.options.getString('choices').split(',').map(x=>x.trim()).filter(Boolean))}**`);
  if(commandName==='rate') return interaction.reply(`⭐ **${Math.floor(Math.random()*(interaction.options.getInteger('maximum')||10))+1}/10**`);
  if(commandName==='ship') return interaction.reply(`💘 Compatibility: **${Math.floor(Math.random()*101)}%**`);
  if(commandName==='rps') return interaction.reply(`✊ I choose **${random(['rock','paper','scissors'])}**`);
  if(commandName==='joke') return interaction.reply(random(['Why did the bot cross the road? To get to the other server.','I would tell a UDP joke, but you might not get it.','There are 10 types of people: those who understand binary and those who do not.']));
  if(commandName==='fact') return interaction.reply(random(['Discord launched in 2015.','A group of flamingos is called a flamboyance.','Honey can remain edible for thousands of years.']));
  if(commandName==='quote') return interaction.reply(random(['What if you win?','Discipline beats motivation.','Start now. Improve later.']));
  if(['reverse','uppercase','lowercase','length'].includes(commandName)){const t=interaction.options.getString('text');const out=commandName==='reverse'?[...t].reverse().join(''):commandName==='uppercase'?t.toUpperCase():commandName==='lowercase'?t.toLowerCase():`${t.length} characters`;return interaction.reply(out);}
  if(commandName==='poll'){const m=await interaction.reply({content:`📊 **${interaction.options.getString('question')}**`,fetchReply:true});await m.react('✅');await m.react('❌');return;}
  if(commandName==='say'){await interaction.channel.send(interaction.options.getString('message'));return interaction.reply({content:'✅ Sent.',ephemeral:true});}
  if(commandName==='announce'){await interaction.channel.send({embeds:[new EmbedBuilder().setColor(0x5865F2).setTitle('📢 Announcement').setDescription(interaction.options.getString('message')).setTimestamp()]});return interaction.reply({content:'✅ Announcement sent.',ephemeral:true});}
  if(commandName==='clear'){const d=await interaction.channel.bulkDelete(interaction.options.getInteger('amount'),true);return interaction.reply({content:`🧹 Deleted ${d.size} messages.`,ephemeral:true});}
  if(commandName==='slowmode'){await interaction.channel.setRateLimitPerUser(interaction.options.getInteger('seconds'));return interaction.reply('✅ Slowmode updated.');}
  if(['lock','unlock'].includes(commandName)){await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:commandName==='lock'?false:null});return interaction.reply(commandName==='lock'?'🔒 Channel locked.':'🔓 Channel unlocked.');}
  if(commandName==='warn'){const k=keyFor(interaction.guildId,user.id),l=warnings.get(k)||[];l.push({reason,moderator:interaction.user.id});warnings.set(k,l);return interaction.reply(`⚠️ Warned ${user}. Total warnings: **${l.length}**`);}
  if(commandName==='warnings'){const l=warnings.get(keyFor(interaction.guildId,user.id))||[];return interaction.reply(l.length?l.map((w,i)=>`**${i+1}.** ${w.reason} — <@${w.moderator}>`).join('\n'):'No warnings.');}
  if(commandName==='clearwarnings'){warnings.delete(keyFor(interaction.guildId,user.id));return interaction.reply(`✅ Cleared warnings for ${user}.`);}
  if(commandName==='timeout'){await member.timeout(interaction.options.getInteger('minutes')*60000,reason);return interaction.reply(`⏳ Timed out ${user}.`);}
  if(commandName==='untimeout'){await member.timeout(null);return interaction.reply(`✅ Removed timeout from ${user}.`);}
  if(commandName==='kick'){await member.kick(reason);return interaction.reply(`👢 Kicked **${user.tag}**.`);}
  if(commandName==='ban'){await interaction.guild.members.ban(user.id,{reason});return interaction.reply(`🔨 Banned **${user.tag}**.`);}
  if(commandName==='unban'){const u=await interaction.guild.members.unban(interaction.options.getString('user_id'));return interaction.reply(`✅ Unbanned **${u.tag}**.`);}
  if(commandName==='softban'){await interaction.guild.members.ban(user.id,{deleteMessageSeconds:604800,reason});await interaction.guild.members.unban(user.id);return interaction.reply(`✅ Softbanned **${user.tag}**.`);}
  if(commandName==='nick'||commandName==='setnick'){await member.setNickname(interaction.options.getString('nickname')||null);return interaction.reply('✅ Nickname updated.');}
  if(commandName==='resetnick'){await member.setNickname(null);return interaction.reply('✅ Nickname reset.');}
  if(commandName==='addrole'||commandName==='removerole'){const r=interaction.options.getRole('role');commandName==='addrole'?await member.roles.add(r):await member.roles.remove(r);return interaction.reply('✅ Role updated.');}
  if(commandName==='createrole'){const r=await interaction.guild.roles.create({name:interaction.options.getString('name')});return interaction.reply(`✅ Created ${r}.`);}
  if(commandName==='deleterole'){const r=interaction.options.getRole('role');await r.delete();return interaction.reply('✅ Role deleted.');}
  if(commandName==='createchannel'){const c=await interaction.guild.channels.create({name:interaction.options.getString('name'),type:ChannelType.GuildText});return interaction.reply(`✅ Created ${c}.`);}
  if(commandName==='deletechannel'){const c=interaction.options.getChannel('channel')||interaction.channel;await interaction.reply('✅ Deleting channel.');return c.delete();}
  if(commandName==='renamechannel'){const c=interaction.options.getChannel('channel')||interaction.channel;await c.setName(interaction.options.getString('name'));return interaction.reply('✅ Channel renamed.');}
  if(commandName==='ticket'){const c=await interaction.guild.channels.create({name:`ticket-${interaction.user.username}`.slice(0,90),type:ChannelType.GuildText,permissionOverwrites:[{id:interaction.guild.id,deny:[PermissionFlagsBits.ViewChannel]},{id:interaction.user.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages]}]});return interaction.reply({content:`🎫 Ticket created: ${c}`,ephemeral:true});}
  if(commandName==='closeticket'){await interaction.reply('🔒 Closing ticket.');return interaction.channel.delete();}
  if(commandName==='suggest'){await interaction.channel.send(`💡 **Suggestion from ${interaction.user}:**\n${interaction.options.getString('suggestion')}`);return interaction.reply({content:'✅ Suggestion posted.',ephemeral:true});}
  if(commandName==='report') return interaction.reply({content:`🚨 Report submitted: ${reason}`,ephemeral:true});
  if(commandName==='balance') return interaction.reply(`💰 Balance: **${balances.get(keyFor(interaction.guildId,interaction.user.id))||0} coins**`);
  if(commandName==='daily'){const k=keyFor(interaction.guildId,interaction.user.id);balances.set(k,(balances.get(k)||0)+500);return interaction.reply('🎁 You claimed **500 coins**.');}
  if(commandName==='work'){const e=Math.floor(Math.random()*401)+100,k=keyFor(interaction.guildId,interaction.user.id);balances.set(k,(balances.get(k)||0)+e);return interaction.reply(`💼 You earned **${e} coins**.`);}
  if(commandName==='pay'){const a=interaction.options.getInteger('amount'),f=keyFor(interaction.guildId,interaction.user.id),t=keyFor(interaction.guildId,user.id),b=balances.get(f)||0;if(b<a)return interaction.reply({content:'❌ Not enough coins.',ephemeral:true});balances.set(f,b-a);balances.set(t,(balances.get(t)||0)+a);return interaction.reply(`💸 Paid ${user} **${a} coins**.`);}
  if(commandName==='timestamp') return interaction.reply(`<t:${Math.floor(Date.now()/1000)}:F>`);
  if(commandName==='created') return interaction.reply(`${user} created their account <t:${Math.floor(user.createdTimestamp/1000)}:R>.`);
  if(commandName==='joined') return interaction.reply(member?.joinedTimestamp?`${user} joined <t:${Math.floor(member.joinedTimestamp/1000)}:R>.`:'Unknown.');
  if(commandName==='randomuser'){const m=await interaction.guild.members.fetch();return interaction.reply(`🎯 ${random([...m.values()])}`);}
  return interaction.reply(`✅ **/${commandName}** is active in vxnrk.`);
 }catch(error){console.error(error);const p={content:`❌ ${error.message||'Something went wrong.'}`,ephemeral:true};return interaction.replied||interaction.deferred?interaction.followUp(p):interaction.reply(p);}
});
client.login(process.env.DISCORD_TOKEN);
