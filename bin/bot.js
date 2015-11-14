'use strict';

var MtgBot = require('../lib/mtgbot');


var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;
console.log('Creating new bot');
var mtgbot = new MtgBot({
	token: token,
	name: name
});

mtgbot.run();