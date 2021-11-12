const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();
const generateApiKey = require('generate-api-key');


const config = {
    description: 'Tests the provided code.',
    aliases: [''],
    usage: '[code]',
    rolesRequired: [],
    category: 'Utilities'
}

module.exports = {
    config,
    run: async (client, message, args) => {

        if (!args[0]) {
            const embed1 = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Whoops!")
                .setDescription("Please provide a code to test!")
                return message.reply(embed1)
        }
        let gen = await generateApiKey();

        let codeInfo = await client.databases.codes.findOrCreate({
            where: {
                code: args[0]
            },
        });
        if (codeInfo[0].dataValues.used == true) {
            message.reply('That code is valid and has been redeemed by server ' + codeInfo[0].dataValues.serverId + '.')
        } else {
            message.reply('That code is not valid or has not been used!')
        }
    }
}