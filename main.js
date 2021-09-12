const { Client, Intents, VoiceChannel} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


const config = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

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

            async function play(connection, message) {
                var server = servers[message.guild.id];
                const stream = ytdl(server.queue[0], {filter: "audioonly"});
                const player = createAudioPlayer();
                const resource = createAudioResource(stream);


                //server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.dispatcher = player.play(resource);
                connection.subscribe(player);
                server.queue.shift();
                /*
                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }              
                });
                */
            }

            function channelJoin(channel) {
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                return connection;
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
                
                /*
                channelJoin(message.member.voice.channel).then(function(connection){
                    play(connection, message);
                });
                */
               
               play(channelJoin(message.member.voice.channel), message);
            }

        break;
    }

});












client.login(config.token);

