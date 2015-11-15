'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var rest = require('restler');



var MtgBot = function Constructor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'mtg-bot';
	//this.dbpath = settings.dbPath || path.resolve(process.cwd(), 'data', 'mtgbot.db');

	this.user = null;
	this.db = null;
	console.log('bot constructed');
};

// inherit methods and properties from the Bot Constructor
util.inherits(MtgBot, Bot);

MtgBot.prototype.run = function () {
	console.log('running bot');
	MtgBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
	console.log('events attached');
};

MtgBot.prototype._onStart = function () {
	console.log('starting bot');
	this._loadBotUser();
	// this._connectDb();
	// this._firstRunCheck();
	//self._welcomeMessage();
};

MtgBot.prototype._loadBotUser = function () {
	var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
}


// MtgBot.prototype._connectDb = function () {
// 	if (!fs.existsSync(this.dbPath)) {
// 		console.error('Database path ' + '"' + this.dbPath + '" does not exist or it\'s not readable.');
// 		process.exit(1);
// 	}

// 	this.db = new SQLite.Database(this.dbPath);
// };

// MtgBot.prototype._firstRunCheck = function () {
// 	var self = this;
// 	self.db.get('SELECT val FROM info WERE name = "lastrun" LIMIT1', function(err,record) {
// 		if (err) {
// 			return console.error('DATABSE ERROR:',err);
// 		}
// 		var currentTime = (new Date()).toJSON();

// 		//this is a first run
// 		if (!record){
// 			self._welcomeMessage();
// 			return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
// 		}

// 		// updates with new last running time
//         self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
// 	});
// };

MtgBot.prototype._welcomeMessage = function () {
	console.log('preparing to send welcome message');
	this.postMessageToChannel(this.channels[0].name, 'Greetings, I am here to help with your MTG related ' +
	'questions.  I am have not yet loaded all the lore and knowlege neccessary yet to answer your queries, ' + 
	'but when I have  you may just say `MTG Bot` or `' + this.name + '` to invoke me',
	{as_user: true});
	console.log('welcome message sent');
};


MtgBot.prototype._onMessage = function (message) {
	
	console.log('typeof message.channel: ' + typeof message.channel);
	console.log('message.channel: ' + message.channel[0]);
	console.log('message.channel: ' + message.channel[0].name);
	
		
	if (this._isChatMessage(message) &&
		this._isChannelConversation(message) &&
		!this._isFromMtgBot(message) &&
		this._isMentioningMtgBot(message)
	) {
		var cardImage = this._lookupCard(message);
		this._reply(message,message.channel[0]);
	}
};

MtgBot.prototype._isChatMessage = function (message) {
	return message.type === 'message' && Boolean(message.text);	
};

MtgBot.prototype._isChannelConversation = function (message) {
	return typeof message.channel === 'string' && (message.channel[0] === 'C' || message.channel[0] === 'G');
};

MtgBot.prototype._isFromMtgBot = function (message) {
	return message.user === this.user.id;
};

//checks if our message starts with 'mtg bot' or the name of our bot
MtgBot.prototype._isMentioningMtgBot = function (message) {
	return message.text.toLowerCase().indexOf('mtg bot') === 0 ||
		message.text.toLowerCase().indexOf(this.name) === 0;
};

MtgBot.prototype._reply = function (originalMessage, channelType) {
	var self = this;
	
	var	channel = self._getChannelById(originalMessage.channel, channelType);
	if (channelType === 'G') {
		self.postMessageToGroup(channel.name, 'I\'m sorry, I\'m still collecting ' + 
		'all the lore of the mulitverse.  Please try again later after I\'ve finished.  Also, Joe sucks.', {as_user: true});	
	} else {
		self.postMessageToChannel(channel.name, 'I\'m sorry, I\'m still collecting ' + 
		'all the lore of the mulitverse.  Please try again later after I\'ve finished.  Also, Joe sucks.', {as_user: true});
	}
	
};

MtgBot.prototype._getChannelById = function (channelId, channelType) {

	if (channelType === 'G') {
		return this.groups.filter(function (item) {
        	return item.id === channelId;
    	})[0];	
	} else {
		return this.channels.filter(function (item) {
        	return item.id === channelId;
    	})[0];	
	}
};

MtgBot.prototype._lookupCard = function (message) {
	var namePos = message.indexOf('look up');
	var cardName = message.slice(namePos + 7).trim();

	rest.get('https://api.deckbrew.com/mtg/cards?name=' + cardName).on('complete', function(data) {
  		if (data instanceof Error) {
    		console.log('Error:', result.message);
    		return "I'm sorry, I couldn't find that card."
  		} else {
  			var versions[] = data[0].editions;
  			versions[versions.length].	
    		console.log(result);
  		}
	});
}

module.exports = MtgBot;