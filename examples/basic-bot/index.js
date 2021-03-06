/* eslint-disable camelcase */
// @ts-check
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] })
const { Slash_Chat_Input, Slash_Message, Slash_User } = require('../../lib') // change this to "slash-options-builder" if you installed it via npm

const slash = new Slash_Chat_Input()
  .setName('say')
  .setDescription('say Command')
  .addStringOption({ name: 'text', description: 'Text to send', required: true })
  // . Ctrl + space or ⌘ + space for more options
  .toJSON()

const slashMessage = new Slash_Message()
  .setName('make a message hidden')
  .toJSON()

const slashUser = new Slash_User()
  .setName('hi user')
  .toJSON()

client.once('ready', () => console.log('Ready!'))

client.on('messageCreate', async (message) => {
  if (message.content === '!deploy') {
    if (!message.inGuild()) return
    if (message.author.id !== 'ID') return
    const msg = await message.channel.send('Deploying...')

    message.guild.commands
      .set([slash, slashMessage, slashUser])
      .then(() => msg.edit('Deployed!'))
      .catch((err) => msg.edit('Error!' + err.message))
  }
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'say') {
      const text = interaction.options.getString('text', true)
      interaction.reply(text)
    }
  } else if (interaction.isUserContextMenu()) {
    interaction.reply(`Hello ${interaction.targetUser.tag}`)
  } else if (interaction.isMessageContextMenu()) {
    if (!interaction.channel) return
    const message = await interaction.channel.messages.fetch(interaction.targetId)
    interaction.reply(`||${message.content}||`)
  }
})

client.login(process.env.DISCORD_TOKEN)
