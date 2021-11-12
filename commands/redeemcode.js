const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Redeem your code.',
    aliases: [],
    usage: '[code]',
    rolesRequired: [],
    category: 'Setup'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if (!args[0]) {
            const embed1 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a code to redeem!")
                return message.reply(embed1)
        }

        const input = args[0]

        let codeInfo = await client.databases.codes.findOrCreate({
            where: {
                code: args[0]
            },
        });

        if (codeInfo[0].dataValues.valid == true) {
            const affectedRows = await client.databases.codes.update({ valid: true, used: true }, { where: { code: args[0] } });
            const moreRows = await client.databases.owns.update({ codeUsed: args[0], owns: true, daysLeft: codeInfo[0].dataValues.days }, { where: { serverId: codeInfo[0].dataValues.serverId } });
            message.reply("Successfully redeemed code.")

        } else {
            return message.reply('That code is not valid!')
        }
    }
}