const { EmbedBuilder } = require('discord.js');

const BRAND = {
  name: 'vxnrk',
  color: 0xB8BCC2,
  success: 0x57F287,
  warning: 0xFEE75C,
  danger: 0xED4245,
  footer: 'vxnrk • built for your community'
};

function embed(client, { title, description, color = BRAND.color, thumbnail, image, fields = [] } = {}) {
  const e = new EmbedBuilder()
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: BRAND.footer, iconURL: client?.user?.displayAvatarURL?.() });
  if (title) e.setTitle(title);
  if (description) e.setDescription(description);
  if (thumbnail) e.setThumbnail(thumbnail);
  if (image) e.setImage(image);
  if (fields.length) e.addFields(fields);
  return e;
}

const success = (client, text) => embed(client, { title: 'Done', description: `✅ ${text}`, color: BRAND.success });
const error = (client, text) => embed(client, { title: 'Something went wrong', description: `❌ ${text}`, color: BRAND.danger });

module.exports = { BRAND, embed, success, error };
