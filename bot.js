const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config()

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
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!d20') {
    rollDice(target, commandName);
  } 
  else if (commandName === '@gladbot420') {
    speak(target, commandName);
  } 
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}
function speak(target, commandName){
  var username = target.replace('#', '')
  client.say(target, `@${username} How dare you speak to me`);
  console.log(`Spoke to ${username}`)
}
// Function called when the "dice" command is issued
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
