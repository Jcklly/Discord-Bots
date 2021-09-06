const config = require('./config.json');
const ytdl = require('ytdl-core');

const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const PREFIX = '!';

var version = '1.0';
var servers = {};


bot.on('ready', () => {
    console.log('Sounds in online!\nVersion: ' + version);
});

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'play':

            function play(connection, messgae) {
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


            if(!args[1]) {
                message.channel.send('You need to prove a name/url!');
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send("Join a voice channel to play music!");
                return;
            }

            if(!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) {
                message.member.voice.channel.join().then(function(connection){
                    play(connection, message);
                });
            }

        break;
    }

});












bot.login(config.token);

