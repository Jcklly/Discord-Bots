const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once('ready', () => {
    console.log('Sounds in online!')
})












client.login('ODg0NTE4MDcxMjY2NTk0ODY2.YTZppQ.j65zhS2GbOOT1yqZOQz2T7QND68')

