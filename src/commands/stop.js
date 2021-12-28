const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'stop',
            description: 'Stop current queue.',
            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        const { client } = require('..');
        const guild = client.guilds.cache.get(ctx.guildID);
        const member = guild.members.cache.get(ctx.member.id);
        const queue = client.player.getQueue(guild.id);

        if (!queue || !queue.playing) return ctx.sendFollowUp({ content: `No music currently playing ${member}... try again ? ❌` });

        queue.destroy();

        return ctx.sendFollowUp({ content: `Music stopped into this server, see you next time ✅` });
    }
}
