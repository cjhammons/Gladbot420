const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config()
const fs = require('fs')


var copypastas = []
try {
  const data = fs.readFileSync('./copypasta.json')

  const cp = JSON.parse(data);

  for (let i in cp){
    copypastas.push(cp[i].text)
  }
} catch (err){
  console.log(`Error reading file: ${err}`);
}

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  try {
    if (self ) { return; } // Ignore messages from the bot
  
    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === '!d20') {
      rollDice(target, commandName);
    } 
    else if (commandName === '@gladbot420') {
      dontAtMe(target, commandName);
    } 
    else if (commandName === '!copypasta'){
      copypasta(target, commandName)
    } else if (commandName === '!sourcecode') {
      code(target, commandName)
    }
    else {
      console.log(`* Unknown command ${commandName}`);
    }
  } catch (err) {
    console.log(`Error: ${err}`)
  }
  
}

function code(target, commandName){
  client.say(target, 'You can see my source code here: https://github.com/cjhammons/Gladbot420')
  console.log(`* Executed ${commandName} command`);
}

/*
Posts random copypasta
*/
function copypasta(target, commandName){
  const rand = Math.floor(Math.random() * (copypastas.length));
  var copypasta = copypastas[rand];

  client.say(target, `${copypasta}`);

  console.log(`* Executed ${commandName} command: Index ${rand}`);
}

/*
Function called when someone @s gladbot
*/
function dontAtMe(target, commandName){
  var username = target.replace('#', '')
  client.say(target, `@${username} How dare you speak to me`);
  console.log(`* Executed ${commandName} command and Spoke to ${username}`)
}

/* 
Function called when the "dice" command is issued
*/
function rollDice (target, commandName) {
  const sides = 20;
  var roll = Math.floor(Math.random() * sides) + 1;
  client.say(target, `You rolled a ${roll}.`);
  console.log(`* Executed ${commandName} command`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
