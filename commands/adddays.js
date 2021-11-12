const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Add days to a server\'s subscription.',
    aliases: [],
    usage: '[days to add] [server id]',
    rolesRequired: [],
    category: 'Developer'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if(message.author.id !== '785248634458996767' && message.author.id !== '798414886886965298') return message.channel.send("You don't meet the permissions required for this command: `This command is reserved for the bot developers.`")
        if (!args[0]) {
            const embed1 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a duration in days!")
                return message.reply(embed1)
        }


        if (!args[1]) {
            const embed2 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a server Id!")
                return message.reply(embed2)
        }
        let doesOwnInfo = await client.databases.owns.findOrCreate({
            where: {
                serverId: args[1]
            },
            defaults: {
                serverId: args[1],
                owns: false,
                daysLeft: 0,
                groupId: null
            }
        });
        if (!doesOwnInfo[0].dataValues.owns == true)
        {
            return message.reply('this server doesnt have a subscription you idiot')
        }
        doesOwnInfo[0].increment('daysLeft', { by: args[0] });
         const success = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Success!")
            .setDescription('Added ' + args[0] + ' days to the server ID of ' + args[1] + '.')

        message.channel.send(success)
    }
}