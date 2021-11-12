const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Shows information about the bot',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Information'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle('Nimbus')
        .setTimestamp()
        .setDescription('Nimbus is a hub for selling your roblox products/commissions.\n\nSupport Server: https://discord.gg/YJBDaYWD5s')

        message.reply(embed)
    }
}