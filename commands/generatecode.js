const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();
const generateApiKey = require('generate-api-key');

const config = {
    description: 'Generates a code for clients to use',
    aliases: ['gencode'],
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
        if (!args[1]) {
            const embed2 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a duration for code")
                return message.reply(embed2)
        }
        let gen = await generateApiKey();
        let codeInfo = await client.databases.owns.findOrCreate({
            where: {
                codeUsed: gen,
            },
            defaults: {
                codeUsed: gen,
                valid: true,
                serverId: args[0],
                used: false
            }
        });

        const affectedRows = await client.databases.codes.findOrCreate({ defaults: { valid: true, used: false, code: gen, days: args[1] },  where: { serverId: args[0], code: gen} });
        message.reply(gen)
    }
}