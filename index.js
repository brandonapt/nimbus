const Discord = require('discord.js');
const client = new Discord.Client({ allowedMentions: { parse: [] } });
const chalk = require('chalk');
const fs = require('fs');
const figlet = require('figlet')
let commandList = [];
require('dotenv').config();
const cooldowns = new Discord.Collection();
client.commandList = commandList;
const fetch = require('node-fetch')
const prefix = ".";
client.databases = {};

// Initialize the database
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.data/db.sqlite',
    logging: false
});
console.log('[DB] SQLITE3 Initialized!')

// Set up the servers database (holds servers that own the product)
const database = sequelize.define('owns', {
    serverId: Sequelize.STRING,
    owns: Sequelize.BOOLEAN
});
database.sync();
client.databases.owns = database;

// Initialize member counter
let currentMemberCount = 0;
let firstCheck = true;

let refreshCount = async () => {
    let channel = await client.channels.fetch("899325848241442826");
    console.log('Checking members...')
    let groupResponse = await fetch(`https://groups.roblox.com/v1/groups/12636769`);
    let groupBody = await groupResponse.json();
    let newCount = groupBody.memberCount;
    if(firstCheck === true) {
        firstCheck = false;
        currentMemberCount = newCount;
        return setTimeout(refreshCount, 30000);
    }
    if(newCount !== currentMemberCount) {
        if(newCount > currentMemberCount) {
            channel.send(`The group member count has increased! It is now at ${newCount}.`);
        }
        if(newCount < currentMemberCount) {
            channel.send(`The group member count has decreased! It is now at ${newCount}.`);
        }
    }
    currentMemberCount = newCount;
    setTimeout(refreshCount, 30000);
}

refreshCount();

// Load commands from commands folder.
fs.readdir('./commands/', async (err, files) => {
    if(err){
        return console.log(chalk.red('An error occured when checking the commands folder for commands to load: ' + err));
    }
    files.forEach(async (file) => {
        if(!file.endsWith('.js')) return;
        let commandFile = require(`./commands/${file}`);
        commandList.push({
            file: commandFile,
            name: file.split('.')[0],
            config: commandFile.config
        });
    });
});


// Set status and console.log the server and channel count.
client.on('ready', async () => {
    console.log(`${chalk.hex('#60bf85')('Bot started!')}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`
    + `${chalk.hex('#ffaa2b')('>')} ${chalk.hex('#7289DA')(`Servers: ${chalk.hex('#4e5f99')(`${client.guilds.cache.size}`)}`)}\n`
    + `${chalk.hex('#ffaa2b')('>')} ${chalk.hex('#7289DA')(`Channels: ${chalk.hex('#4e5f99')(`${client.channels.cache.size}`)}`)}`);
    let botstatus = fs.readFileSync('./bot-status.json');
    botstatus = JSON.parse(botstatus);
    if(botstatus.activity == 'false') return;
    if(botstatus.activitytype == 'STREAMING'){
        client.user.setActivity(botstatus.activitytext, {
            type: botstatus.activitytype,
            url: botstatus.activityurl
        });
    } else {
        client.user.setActivity(botstatus.activitytext, {
            type: botstatus.activitytype
        });
    }
});

// Command handler stuff

client.on('message', async (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args[0].toLowerCase();
    args.shift();
    const command = commandList.find((cmd) => cmd.name === commandName || cmd.config.aliases.includes(commandName));
    if(!command) return;

    if(command.config.rolesRequired.length > 0) {
        if(!message.member.roles.cache.some(role => command.config.rolesRequired.includes(role.name))) {
            let embed = new Discord.MessageEmbed();
            embed.setDescription('You do not have permission to use this command.');
            embed.setColor("RED");
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.channel.send(embed);
        }
    }
    
    if(command.config.cooldown) {
        if(!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        let currentDate = Date.now();
        let userCooldowns = cooldowns.get(command.name);
        let cooldownAmount = (command.config.cooldown || 3) * 1000;
        if(userCooldowns.has(message.author.id)) {
            let expirationDate = userCooldowns.get(message.author.id) + cooldownAmount;
            if(currentDate < expirationDate) {
                let timeLeft = Math.round((expirationDate - currentDate) / 1000);
                let embed = new Discord.MessageEmbed();
                embed.setDescription(`This command is currently on cooldown. Please try again in ${timeLeft.toString()} seconds.`);
                embed.setColor("RED");
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                return message.channel.send(embed);
            } else {
                userCooldowns.set(message.author.id, currentDate);
            }
        } else {
            userCooldowns.set(message.author.id, currentDate);
        }
    }

    command.file.run(client, message, args);
});

client.login(process.env.token);