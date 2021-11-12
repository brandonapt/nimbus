const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
const _ = require('lodash');
require('dotenv').config();
const sourcebin = require('sourcebin_js');

const config = {
    description: 'Closes your open ticket.',
    aliases: [],
    usage: '',
    rolesRequired: [],
    category: 'Tickets'
}

module.exports = {
    config,
    run: async (client, message, args) => {
        if (!message.guild.id == "898027706946568263") return
        if(message.channel.name.includes('ticket-')) {
			const member = message.guild.members.cache.get(message.channel.name.split('ticket-').join(''));
			if(message.member.hasPermission('ADMINISTRATOR') || message.channel.name === `ticket-${message.author.id}`) {
				message.channel.messages.fetch().then(async (messages) => {
					const output = messages.array().reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

					let response;
					try {
						response = await sourcebin.create([
							{
								name: ' ',
								content: output,
								languageId: 'text',
							},
						], {
							title: `Chat transcript for ${message.channel.name}`,
							description: ' ',
						});
					}
					catch(e) {
						return message.channel.send('An error occurred, please try again!');
					}

					const embed = new Discord.MessageEmbed()
						.setDescription(`[\`📄 View\`](${response.url})`)
						.setColor('GREEN');
					member.send('Here is a transcript of your ticket, please click the link below to view the transcript', embed);
				}).then(() => {
					try {
                        message.channel.delete();
					}
					catch(e) {
                        console.log(e)
					}
				});
			}
		}
		else {
			return message.reply('You cannot use this command here. Please use this command when you\'re closing a ticket.');
		}
    }
}