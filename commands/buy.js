
const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();
const filter = m => !m.author.bot
const config = {
    description: 'Allows you to buy if you\'re in a ticket.',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Tickets'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if (!message.guild.id == "898027706946568263") return
        if(!message.channel.name.includes('ticket-')) return
        let embed = new Discord.MessageEmbed()
            embed.setTitle('Buy Prompt')
            embed.setColor("RANDOM")
            embed.setTimestamp()
        embed.setDescription("What is your group ID?")
        message.reply(embed)
        const collector1 = message.channel.createMessageCollector(filter, { time: 15000, max: 1 });
        collector1.on('collect', m => {
            const groupID = m.content
            const collector2 = message.channel.createMessageCollector(filter, { time: 15000, max: 1 });
            embed.setDescription('What is your server ID?')
            message.reply(embed)
            collector2.on('collect', m2 => {
                const serverId = m2.content
                message.channel.send(`This client is ready to order!\n\nGroup ID: ${groupID}\nServer ID: ${serverId}\n<@&899318900762755104>`)
                message.channel.send('In the meantime, please ')
                //message.reply(serverId + " " + groupID)
            });
        });

    }
}