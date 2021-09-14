const Command = require('../Structures/Command.js');

module.exports = new Command({
    name: "ping",
    description: "Shows the ping",

    async run(message, args, client) {
        message.reply(`Ping: ${client.ws.ping} ms.`);
    }
});