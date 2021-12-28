const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'skip',
            description: 'Skip current playing song.',
            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        const { client } = require('..');
        const guild = client.guilds.cache.get(ctx.guildID);
        const member = guild.members.cache.get(ctx.member.id);
        const queue = client.player.getQueue(guild.id);

        if (!queue || !queue.playing) return ctx.sendFollowUp({ content: `No music currently playing ${member}... try again ? ❌` });

        const success = queue.skip();

        return ctx.sendFollowUp({ content: success ? `Current music ${queue.current.title} skipped ✅` : `Something went wrong ${member}... try again ? ❌` });
    }
}
