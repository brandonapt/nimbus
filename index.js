const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const roblox = require('noblox.js');
const fs = require('fs');
const figlet = require('figlet')
let commandList = [];
require('dotenv').config();
const cooldowns = new Discord.Collection();
client.commandList = commandList;
const fetch = require('node-fetch')
const prefix = ".";
const moment = require('moment')
moment().format(); 
client.databases = {};



var userTickets = new Map(); // Create a JS Map Object.


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
    owns: Sequelize.BOOLEAN,
    daysLeft: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER,
    codeUsed: Sequelize.STRING,
});
database.sync();
client.databases.owns = database;

const codeDB = sequelize.define('codes', {
    code: Sequelize.STRING,
    valid: Sequelize.BOOLEAN,
    serverId: Sequelize.STRING,
    days: Sequelize.INTEGER,
    used: Sequelize.BOOLEAN
});
codeDB.sync();
client.databases.codes = codeDB

let dayCycle = async () => {
    console.log('doing day cycle')
    const thing = await sequelize.models.codes.findAll()
    const thing2 = await sequelize.models.owns.findAll()
    for(i in thing) {
        if (thing[i].dataValues.used == true) {
            //await console.log(thing[i].dataValues.code)
            let eRows = await client.databases.codes.update({ days: thing[i].dataValues.days - 1 }, { where: { code: thing[i].dataValues.code } });
            let codeInfo = await client.databases.codes.findOrCreate({
                where: {
                    code: thing[i].dataValues.code
                }
            })
            let server = codeInfo[0].dataValues.serverId
    }
    for(i in thing2) {
        if (thing2[i].dataValues.owns == true) {
            await console.log(thing2[i].dataValues.codeUsed + " minus one day nerd")
            let moreRows = await client.databases.owns.update({ daysLeft: thing2[i].dataValues.daysLeft - 1 }, { where: { codeUsed: thing2[i].dataValues.codeUsed } });

        }
    }
    }

    return setTimeout(dayCycle, 86400000);

}
//dayCycle()
// Use key check function

let checkKey = async () => {
    console.log('checking keys')
    const thing = await sequelize.models.codes.findAll()
    for(i in thing) {
        if (thing[i].days <= 0)
        {
            if (thing[i].valid == true) {

            
            //await console.log(thing[i].dataValues.code)
            let affectedRows = await client.databases.codes.update({ valid: false, days: 0 }, { where: { code: thing[i].dataValues.code } });
        }
    }
    }

    const thing2 = await sequelize.models.owns.findAll({
        where: {
          daysLeft: 0,
        }
      })
    for(i in thing2) {
            //await console.log(thing2[i].dataValues.codeUsed)
            let affectedRows = await client.databases.owns.update({ owns: false }, { where: { codeUsed: thing2[i].dataValues.codeUsed } });
        
    }

    return setTimeout(checkKey, 86400000);

}

//checkKey()





// Initialize member counter
let currentMemberCount = 0;
let firstCheck = true;

let refreshCount = async () => {
    let channel = await client.channels.fetch("899325848241442826");
    //console.log('Checking members...')
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
require('./server.js')

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendStatus(200);
});

const listener = app.listen(process.env.PORT || 80, () => {
    console.log('Your app is currently listening on port: ' + listener.address().port);
});

app.get('/isKeyValid', (req, res) => {
    let key = req.query.key;
    let serverId = req.query.server;

    if (key == null || serverId == null) return res.send('Invalid Parameters!')

    let validateTest = async function () {
        let doesOwnInfo = await client.databases.codes.findOrCreate({
            where: {
                code: key,
                serverId: serverId,
            },
        });
        
        if (doesOwnInfo[0].dataValues.used == null)
        {
            res.send(false)
        } else {
            res.send(doesOwnInfo[0].dataValues.used)
        }
    }

    validateTest()

});


module.exports.codeDB = codeDB;
module.exports.ownsDB = database