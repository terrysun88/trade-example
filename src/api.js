const request = require('request');

export function getTradePrice(callback) {
	const url = "https://api.bitfinex.com/v1/pubticker/BTCUSD";
	request.get(url,
	  function(error, response, body) {
	    callback(JSON.parse(body));
	});

}