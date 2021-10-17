const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Shows your subscription status.',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Information'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        message.reply('Locating in database...')
        
        let doesOwnInfo = await client.databases.owns.findOrCreate({
            where: {
                serverId: message.guild.id
            },
            defaults: {
                serverId: message.guild.id,
                owns: false
            }
        });
        let owns = Number(doesOwnInfo[0].dataValues.owns);
        message.reply(owns)
    }
    
}