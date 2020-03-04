const fs            = require('fs');
const config        = require('./config.json');
const con           = require('./db.js');
const Discord       = require('discord.js');
const client        = new Discord.Client();
client.commands     = new Discord.Collection();
const cooldowns     = new Discord.Collection();
const commandFiles  = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const schedule      = require('node-schedule');
const moment        = require('moment');
const momentZone    = require('moment-timezone');




for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
    client.user.setStatus('available');
    client.user.setPresence({
        game: {
            name: 'Project Athena Bot',
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=FeohkopWEn4"
        }
    });
});

client.on("message",(message) => {
    if (!message.content.startsWith(config.discord.prefix) || message.author.bot) return;

	const args = message.content.slice(config.discord.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${config.discord.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


// schedule.scheduleJob('0 0 1 * *', () => {
//     const dayNow        = moment().format('dddd');
//     const dateNow       = moment().format("YYYY-MM-DD HH:mm:ss");
//     const timeNow       = moment().tz('America/Los_Angeles').format('ha z');

//     con.query("SELECT * FROM pa_events WHERE date='"+dayNow+"' OR date='"+dateNow+"'", function (err, result) {
//         if (err) throw err;
//         result.forEach(element => {
//             console.log(element);
            
//             schedule.scheduleJob({hour:element.time}, function(){
//                 console.log(element);
//                 const eventEmbed = new Discord.RichEmbed()
//                         .setColor('#0099ff')
//                         .setTitle('#'+element.id+' '+element.title)
//                         .addField('Date',element.date,true)
//                         .addField('Time',element.time,true)
//                         .addField('Location',element.location,true);
//                 client.channels.get('671028749113753639').send(eventEmbed);
//             });
//         });
//     });
// });



schedule.scheduleJob('daily-schedule','0 0 * * *', () => {
// schedule.scheduleJob('daily-schedule','/5 * * * * *', () => {
    var jobList = schedule.scheduledJobs;
    for(jobName in jobList){
      if(jobName != 'daily-schedule'){
          var job = 'jobList.' + jobName;
          eval(job+'.cancel()');
          console.log(job+' removed.');
      }
    }
    dailyCheck();
});

function dailyCheck(){
    const dayNow        = moment().format('dddd');
    const dateNow       = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(schedule);
    con.query("SELECT * FROM pa_events WHERE  date='"+dayNow+"' OR date='"+dateNow+"'", function (err, result) {
        if (err) throw err;
        hourlyCheck(result);
    });
}

function hourlyCheck(result){
    result.forEach(element => {
        var time = element.time;
        var res = time.split(" ");
        var date = moment().format("YYYY-MM-DD").toString();
        var dt = moment(res[0], ["hA"]).format("HH");
        if(res[1] == "PST"){
            var currentTimeinPST = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToCET = moment(date+' '+currentTimeinPST+' -0900', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToUTC = moment(date+' '+currentTimeinPST+' -0800', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var hourInUTC = moment(date+' '+currentTimeinPST+' +0800', "YYYY-MM-DD HH:mm Z").utc().format('HH');

            // var currentTimePST = moment(date+' '+dt+':00 -0800', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeCET = moment(date+' '+dt+':00 +0100', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            console.log(element.title + '; PST TIME: ' + currentTimeinPST + '; UTC TIME: '+ transformToUTC + '; CET TIME: '+ transformToCET);
            var rule = new schedule.RecurrenceRule();
            rule.hour = hourInUTC;
            rule.minute = 0;

            schedule.scheduleJob('DBEntry'+element.id,rule, function(){
                const eventEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('#'+element.id+' '+element.title)
                        .addField('Time PST',currentTimeinPST,true)
                        .addField('Time CET',transformToCET,true)
                        .addField('Time UTC',transformToUTC,true)
                        .addField('Date',element.date,true)
                        .addField('Location',element.location,true);
                client.channels.get('663469227683872787').send(eventEmbed);
                console.log(schedule);
            });
        }else if(res[1] == "CET"){
            var currentTimeinCET = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToPST = moment(date+' '+currentTimeinCET+' +0900', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToUTC = moment(date+' '+currentTimeinCET+' +0100', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var hourInUTC = moment(date+' '+currentTimeinCET+' +0100', "YYYY-MM-DD HH:mm Z").utc().format('HH');

            // var timeInUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH');
            // var currentTimePST = moment(date+' '+dt+':00 -0800', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeCET = moment(date+' '+dt+':00 +0100', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            console.log(element.title + '; CET TIME: ' + currentTimeinCET + '; UTC TIME: '+ transformToUTC + '; PST TIME: '+ transformToPST);
            var rule = new schedule.RecurrenceRule();
            rule.hour = hourInUTC;
            rule.minute = 0;

            schedule.scheduleJob('DBEntry'+element.id,rule, function(){
                const eventEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('#'+element.id+' '+element.title)
                        .addField('Time PST',transformToPST,true)
                        .addField('Time CET',currentTimeinCET,true)
                        .addField('Time UTC',transformToUTC,true)
                        .addField('Date',element.date,true)
                        .addField('Location',element.location,true);
                client.channels.get('663469227683872787').send(eventEmbed);
                console.log(schedule);
            });
        }else if(res[1] == "UTC"){
            var currentTimeinUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToPST = moment(date+' '+currentTimeinUTC+' +0800', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var transformToCET = moment(date+' '+currentTimeinUTC+' -0100', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            var hourInUTC = moment(date+' '+currentTimeinUTC+' +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH');

            // var timeInUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH');
            // var currentTimePST = moment(date+' '+dt+':00 -0800', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeCET = moment(date+' '+dt+':00 +0100', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            // var currentTimeUTC = moment(date+' '+dt+':00 +0000', "YYYY-MM-DD HH:mm Z").utc().format('HH:mm');
            console.log(element.title + '; UTC TIME: ' + currentTimeinUTC + '; CET TIME: ' + transformToCET + '; PST TIME: ' + transformToPST);
            var rule = new schedule.RecurrenceRule();
            rule.hour = hourInUTC;
            rule.minute = 0;

            schedule.scheduleJob('DBEntry'+element.id,rule, function(){
                const eventEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('#'+element.id+' '+element.title)
                        .addField('Time PST',transformToPST,true)
                        .addField('Time CET',transformToCET,true)
                        .addField('Time UTC',currentTimeinUTC,true)
                        .addField('Date',element.date,true)
                        .addField('Location',element.location,true);
                client.channels.get('663469227683872787').send(eventEmbed);
                console.log(schedule);
            });
        }else{
            console.log('idk');
        }

    });
}

// client.channels.get(channelID).send('My Message');


client.login(config.discord.token);
module.exports = client
