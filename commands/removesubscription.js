const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Force removes a server\'s subscription',
    aliases: [],
    usage: '[server id]',
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
                .setDescription("Please provide a server ID!")
                return message.reply(embed1)
        }

        
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

        const affectedRows = await client.databases.owns.update({ owns: false, daysLeft: 0 }, { where: { serverId: args[0] } });
         const success = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Success!")
            .setDescription("Removed the subscription!")

        message.channel.send(success)

    }
}