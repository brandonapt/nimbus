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
        const embed1 = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTimestamp()
            .setTitle('Hold on...')
            .setDescription('Locating server in our database...')
        let message1 = await message.reply(embed1)
        
        let doesOwnInfo = await client.databases.owns.findOrCreate({
            where: {
                serverId: message.guild.id
            },
            defaults: {
                serverId: message.guild.id,
                owns: false,
                daysLeft: 0,
                groupId: null
            }
        });

        const embed2 = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setTitle('Done!')
        let owns = doesOwnInfo[0].dataValues.owns;
        let daysleft = doesOwnInfo[0].dataValues.daysLeft;

        if (owns == true) {
            embed2.setDescription('Yep! You own a subscription!\nIt expires in ' + daysleft + " days!\n\nKey used: " + doesOwnInfo[0].dataValues.codeUsed)
        } else {
            embed2.setDescription('Sorry man, you do not have a subscription! Join our support server to buy one!')
        }
        message.reply(embed2)
    }
    
}