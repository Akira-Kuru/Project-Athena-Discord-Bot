const Discord       = require('discord.js');
const con           = require("../db.js");
var moment          = require('moment');
var momentZone      = require('moment-timezone');


module.exports = {
	name: 'event',
    description: 'Assigning, Creating, Deleting, Pospone',
    cooldown: 5,
    args: true,
    usage: '<command> <title> <day/date> <time> <location>',
    guildOnly: true,
	async execute(message, args) {
        await message.delete();
        if(!args.length){
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }else if(args[0] === 'create'){
            const filter = m => m.author.id === message.author.id;
            message.reply("Please enter the title, day or date, time and the location step by step.").then(r => r.delete(300000));
            message.reply("This process will expire in 5 minutes.").then(r => r.delete(300000));
            message.channel.awaitMessages(filter, {max: 6, time:300000}).then(collected => {
                var collectArr = Array.from(collected.values());
                con.query("INSERT INTO pa_events (title, date, time, location, creator_id) VALUES ('"+collectArr[0]+"' ,'"+collectArr[1]+"' ,'"+collectArr[2]+"' , '"+collectArr[3]+"' , '"+message.author.id+"')", function (err, result) {
                    if (err) throw err;
                    return message.channel.send(collectArr[0]+" was created");
                });
                if(collected.first().content === "cancel"){
                    return message.reply("Event creation was cancelled");
                }          
            }).catch(err => {
                console.log(err)
            })
        }else if(args[0] === 'delete'){
            if(args[1] !== undefined){
                con.query("SELECT * FROM pa_events WHERE id='"+args[1]+"'", function (err, result) {
                    if (err) throw err;
                    // console.log(result);
                    if(!result.length){
                        result.forEach(element => {
                            // console.log(element.creator_id)
                            if(element.creator_id === message.author.id){
                                con.query("DELETE FROM pa_events WHERE '"+args[1]+"'", function (err, result) {
                                    if (err) throw err;
                                    return message.channel.send('Event was deleted.');
                                });
                            }else{
                                return message.channel.send('Only the creator of this event can delete it.');
                            }
                        });
                    }else{
                        return message.channel.send('This event does not exist. Please enter a valid ID');
                    }
                });
            }else{
                return message.channel.send('Please enter an event ID');
            }
            
            
        }else if(args[0] === 'edit'){
            if(args[1] !== undefined){
                con.query("SELECT * FROM pa_events WHERE id="+args[1], function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    if(result.length > 0 ){
                        result.forEach(element => {
                            // console.log(element.creator_id)
                            if(element.creator_id === message.author.id){
                                const filter = m => m.author.id === message.author.id;
                                message.reply("Please enter the title, day or date, time and the location step by step.").then(r => r.delete(300000));
                                message.reply("This process will expire in 5 minutes.").then(r => r.delete(300000));
                                message.channel.awaitMessages(filter, {max: 6, time:300000}).then(collected => {
                                    var collectArr = Array.from(collected.values());
                                    con.query("UPDATE pa_events SET title='"+collectArr[0]+"' , date='"+collectArr[1]+"' , time='"+collectArr[2]+"' , location='"+collectArr[3]+"' , creator_id='"+message.author.id+"' WHERE id="+args[1], function (err, result) {
                                        if (err) throw err;
                                        return message.channel.send(collectArr[0]+" was updated");
                                    });
                                    if(collected.first().content === "cancel"){
                                        return message.reply("Updating event was cancelled");
                                    }          
                                }).catch(err => {
                                    console.log(err)
                                })
                            }else{
                                return message.channel.send('Only the creator of this event can edit it.');
                            }
                        });
                    }else{
                        return message.channel.send('This event does not exist. Please enter a valid ID');
                    }
                });
            }else{
                return message.channel.send('Please enter an event ID');
            }
        }else if(args[0] === 'list'){
            if(args[1] === undefined){
                con.query("SELECT * FROM pa_events", function (err, results, fields) {
                    if (err) throw err;
                    results.forEach(element => {
                        const eventEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('#'+element.id+' '+element.title)
                        .addField('Date',element.date,true)
                        .addField('Time',element.time,true)
                        .addField('Location',element.location,true)
                        message.channel.send(eventEmbed);
                    });
                    console.log(args[1]);
                });
            }else{
                con.query("SELECT * FROM pa_events WHERE id="+args[1], function (err, results, fields) {
                    if (err) throw err;
                    results.forEach(element => {
                        const eventEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle('#'+element.id+' '+element.title)
                        .addField('Date',element.date,true)
                        .addField('Time',element.time,true)
                        .addField('Location',element.location,true)
                        message.channel.send(eventEmbed);
                    });
                });
            }
        }else if(args[0] === 'sub'){
            if(args[1] === undefined){
                message.channel.send('You need to specify which id of the event you want to subscribe too.');
            }else{
                con.query("SELECT * FROM pa_subs WHERE id='"+args[1]+"'", function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    if(!result.length){
                        con.query("INSERT INTO pa_subs (user_id) VALUES ('"+message.author.id+"')", function (err, result) {
                            if (err) throw err;
                            con.query("INSERT INTO pa_events_subs (events_id, subs_id) VALUES ('"+args[1]+"', LAST_INSERT_ID())", function (err, result) {
                                if (err) throw err;
                            });
                        });
                        return message.channel.send('Event was subscribed. You will notified over DMs');
                    }else{
                        result.forEach(element => {
                            con.query("INSERT INTO pa_events_subs (events_id, subs_id) VALUES ('"+args[1]+"', '"+element.user_id+"')", function (err, result) {
                                if (err) throw err;
                            });
                            return message.channel.send('Event was subscribed. You will notified over DMs');
                        });
                    }
                });
            }
        }else{
            return message.channel.send('That is not a valid command');
        }
	},
};