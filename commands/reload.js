const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();

const config = {
    description: 'Reloads a command.',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Developer'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if(message.author.id !== '785248634458996767' && message.author.id !== '798414886886965298') return message.channel.send("You don't meet the permissions required for this command: `This command is reserved for the bot developers.`")

        try {
            delete require.cache[require.resolve(`./${args[0]}.js`)];
        } catch (e) {
            return message.channel.send(`Unable to reload: ${args[0]}.js`);
        }
        message.channel.send(`**Successfully reloaded:** ${args[0]}.js`);
        }
    
}