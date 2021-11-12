const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'View your settings',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Information'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        let doesOwnInfo = await client.databases.owns.findOrCreate({
            where: {
                serverId: message.guild.id
            },
        });
        let groupID =  doesOwnInfo[0].dataValues.groupId
        if (groupID == null) groupID = "Not set."
        let premium = doesOwnInfo[0].dataValues.owns
        if (premium == null) premium = false
        const settingsEmbed = new Discord.MessageEmbed()
            .setTitle('Information')
            .setColor("RANDOM")
            .setTimestamp()
            .addField('Group ID', groupID)
            .addField('Premium?', premium)
        if (premium == true) {
            settingsEmbed.addField('Days Left', doesOwnInfo[0].dataValues.daysLeft)
        }

        message.reply(settingsEmbed)
    }
}