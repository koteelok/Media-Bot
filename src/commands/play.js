const { SlashCommand, CommandOptionType } = require('slash-create');
const { QueryType } = require('discord-player');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'play',
            description: 'Play a audio from query.',
            options: [
                {
                    name: 'query',
                    type: CommandOptionType.STRING,
                    description: 'Link/Name of song you want to play.',
                    required: true
                }
            ],
            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        const { client } = require('..');
        const guild = client.guilds.cache.get(ctx.guildID);
        const textChannel = guild.channels.cache.get(ctx.channelID);
        const member = guild.members.cache.get(ctx.member.id);
        const voiceChannel = member.voice.channel;
        const query = ctx.options.query;

        const res = await client.player.search(query, {
            requestedBy: member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return ctx.sendFollowUp({ content: `No results found ${member}... try again ? ❌` });

        const queue = await client.player.createQueue(member, {
            metadata: textChannel
        });

        try {
            if (!queue.connection) await queue.connect(voiceChannel);
        } catch {
            await client.player.deleteQueue(ctx.guildID);
            return ctx.sendFollowUp({ content: `I can't join the voice channel ${member}... try again ? ❌` });
        }

        await ctx.sendFollowUp({ content: `Loading your ${res.playlist ? 'playlist' : 'track'}... 🎧` });

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
    }
}