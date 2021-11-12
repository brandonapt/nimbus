const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Sets the group.',
    aliases: [],
    usage: '[group id]',
    rolesRequired: [],
    category: 'Setup'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_SERVER")) return message.reply('You don\'t have enough permissons to do this!')
        if (!args[0]) {
            const embed1 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a group ID!")
                return message.reply(embed1)
        }

        const moreRows = await client.databases.owns.update({ groupId: args[0] }, { where: { serverId: message.guild.id } });

        const success = new Discord.MessageEmbed()
            .setTitle('Success!')
            .setColor("GREEN")
            .setTimestamp()
            .setDescription(`Successfully set the group ID to **${args[0]}**.`)
        
        message.reply(success)

    }
}