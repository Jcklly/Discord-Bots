const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const config = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');

client.commands = new Client.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endswith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

const PREFIX = '!';

var version = '1.0';
var servers = {};


client.on('ready', () => {
    console.log('Sounds in online!\nVersion: ' + version);
});

client.on('message', message => {
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.substring(PREFIX.length).split(" ");
    const command = args.shift().toLowerCase();
    
    switch (command) {
        case 'play':

            function play(connection, message) {
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }              
                });


            }


            if(!args[0]) {
                message.channel.send('You need to provide a name/url!');
                return;
            }

            if (!message.member.voice.channel) {
                message.channel.send("Join a voice channel to play music!");
                return;
            }

            if(!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            var server = servers[message.guild.id];

            server.queue.push(args[0]);

            if(!message.guild.voiceConnection) {
                message.member.voice.channel.join().then(function(connection){
                    play(connection, message);
                });
            }

        break;
    }

});












client.login(config.token);

