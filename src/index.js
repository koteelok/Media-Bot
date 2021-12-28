require('dotenv').config();
const path = require('path');
const { SlashCreator, GatewayServer } = require('slash-create');
const { Player } = require('discord-player');
const { Client, Intents } = require('discord.js');
const { registerPlayerEvents } = require('./events');

global.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

global.client.player = new Player(client, {
    ytdlOptions: {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});
registerPlayerEvents(client.player);

const creator = new SlashCreator({
    applicationID: process.env.APPLICATION_ID,
    token: process.env.BOT_TOKEN,
});

creator
    .withServer(
        new GatewayServer(
            (handler) => client.ws.on('INTERACTION_CREATE', handler)
        )
    )
    .registerCommandsIn(path.join(__dirname, 'commands'));

if (process.env.DISCORD_GUILD_ID) creator.syncCommandsIn(process.env.DISCORD_GUILD_ID);
else creator.syncCommands();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

module.exports = {
    client,
    creator
};