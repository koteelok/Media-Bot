const { SlashCommand } = require('slash-create');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'resume',
            description: 'Resume current playing song.',
            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        const { client } = require('..');
        const guild = client.guilds.cache.get(ctx.guildID);
        const member = guild.members.cache.get(ctx.member.id);

        const queue = client.player.getQueue(guild.id);

        if (!queue) return ctx.sendFollowUp({ content: `No music currently playing ${member}... try again ? ❌` });

        const success = queue.setPaused(false);

        return ctx.sendFollowUp({ content: success ? `Current music ${queue.current.title} resumed ✅` : `Something went wrong ${member}... try again ? ❌` });
    }
}
