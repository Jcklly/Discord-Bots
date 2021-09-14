//const { Client, Intents } = require('discord.js');

const Client = require('./Structures/Client.js');
const config = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');

const client = new Client();

const PREFIX = '!';
var version = '1.1';
var servers = {};

fs.readdirSync('./src/commands/').filter(file => file.endsWith(".js")).forEach(file => {

    const command = require(`./commands/${file}`);
    console.log(`Command ${command.name} triggered`);
    client.commands.set(command.name, command);

});

// Bot is online
client.on('ready', () => {
    console.log('Sounds in online!\nVersion: ' + version);
});

// Handle user messages
client.on('messageCreate', message => {
    // Default case no prefix and prevent looping
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    
    const args = message.content.substring(PREFIX.length).split(/ +/);
    //const command = args.shift().toLowerCase();
    const command = client.commands.find(cmd => cmd.name == args[0]);

    if(!command) {
        return message.reply('Invalid Command!');
    }

    command.run(message, args, client);
    
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

