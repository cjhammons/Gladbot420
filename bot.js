const tmi = require('tmi.js');
const dotenv = require('dotenv');
dotenv.config()
const fs = require('fs')

// setup MongoDB Atlas
const MongoClient = require('mongodb').MongoClient;
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.aetew.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


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

// Create a twitchClient with our options
const twitchClient = new tmi.client(opts);

// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();
//
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  try {
    if (self ) { return; } // Ignore messages from the bot
  
    // Remove whitespace from chat message
    const commandName = msg.trim().toLowerCase();

    // If the command is known, let's execute it
    if (commandName === '!d20') {
      rollDice(target, commandName);
    } 
    else if (commandName === '@gladbot420') {
      dontAtMe(target, commandName);
    } 
    else if (commandName === '!copypasta'){
      copypasta(target, commandName)
    } 
    else if (commandName === '!sourcecode') {
      code(target, commandName);
    }
    else if ((commandName.includes('among us')) || (commandName.includes('amogus'))) {
      amongUs(target, commandName);
    }
    else {
      console.log(`* Unknown command ${commandName}`);
    }
  } catch (err) {
    console.log(`Error: ${err}`)
  }
  
}

function code(target, commandName){
  twitchClient.say(target, 'You can see my source code here: https://github.com/cjhammons/Gladbot420')
  console.log(`* Executed ${commandName} command`);
}

/*
Posts random copypasta

Opens a connection to the mongoDB database and retrieves all the stored copypastas.
It then randomly selects one and sends it in the twitch chat.
*/
function copypasta(target, commandName){
  MongoClient.connect(mongo_uri, function(err_connect, mongoClient) {
    if(err_connect) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    const col = mongoClient
      .db("gladbot-responses")
      .collection("copypastas")
    
    col.find({}).toArray(function(err, items) {
      if (err) {
        console.log('Error occured getting collection from Atlas...\n', err)
      } else {
        const rand = Math.floor(Math.random() * (items.length));
        var copypasta = items[rand]["text"];
        twitchClient.say(target, `${copypasta}`);
        console.log(`* Executed ${commandName} command: Index ${rand}`);
      }
      
    }); 
    mongoClient.close() 
  }); 
}

function amongUs(target){
  const text = "STOP POSTING ABOUT AMONG US, I'M TIRED OF SEEING IT! My friends on TikTok send me memes, on Discord it's fucking memes, i was in a server, right? and ALL of the channels are just Among Us stuff. I-I showed my Champion underwear to my girlfriend, and the logo i flipped it and i said \"Hey babe, when the underwear sus HAHA ding ding ding ding ding ding ding\" I FUCKING LOOKED AT A TRASH CAN, I SAID \"THAT'S A BIT SUSSY\"";
  var username = target.replace('#', '')
  twitchClient.say(target, `@${username} ${text}`);
  console.log(`* Executed Among Us`);
}
/*
Function called when someone @s gladbot
*/
function dontAtMe(target, commandName){
  var username = target.replace('#', '')
  twitchClient.say(target, `@${username} How dare you speak to me`);
  console.log(`* Executed ${commandName} command and Spoke to ${username}`)
}

/* 
Function called when the "dice" command is issued
*/
function rollDice (target, commandName) {
  const sides = 20;
  var roll = Math.floor(Math.random() * sides) + 1;
  twitchClient.say(target, `You rolled a ${roll}.`);
  console.log(`* Executed ${commandName} command`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
