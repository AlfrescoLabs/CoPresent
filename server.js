var express = require('express');
var url = require('url');
var http = require('http');
var httpProxy = require('http-proxy');
var util = require('util');
var nowjs = require('now');

var app = express.createServer();

var everyone = nowjs.initialize(app);

var rooms = {};

var ALLOWED = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var ROOM_CODE_LENGTH = 3;

var generateSessionId = function() {
	var code ='';
	var rnd;
	for (var i=0; i<ROOM_CODE_LENGTH; i++) {
		rnd = Math.floor(Math.random()*ALLOWED.length);
		code +=ALLOWED[rnd];
	}
	
	if (!rooms[code]) {
		rooms[code] = {};
		return code;
	} else {
		return generateSessionId()
	}	
};

nowjs.on('connect', function(){
	this.now.roomId='lobby';
	var group = nowjs.getGroup(this.now.roomId);
	group.addUser(this.user.clientId);
	console.log(this.user.clientId+' added to '+ group.groupName);
});

everyone.now.createSession = function() {
	
	var roomId = generateSessionId();
	console.log(this.user.clientId + ' created room ' + roomId);

	var clientId = this.user.clientId;
	
	var oldRoomId = this.now.roomId;
	
	// Add user if room exists, otherwise, go to lobby
	if (!rooms[roomId]) {
		roomId = 'lobby'
	}
	
	nowjs.getGroup(oldRoomId).removeUser(clientId);
	nowjs.getGroup(roomId).addUser(clientId);
	
	this.now.room = roomId;
	this.now.joinedRoom(roomId);
	console.log(this.user.clientId + ' created room ' + roomId);	
};

everyone.now.joinSession = function(roomId) {
	var clientId = this.user.clientId;
	
	var oldRoomId = this.now.roomId;
	
	// Add user if room exists, otherwise, go to lobby
	if (!rooms[roomId]) {
		roomId = 'lobby'
	}
	
	nowjs.getGroup(oldRoomId).removeUser(clientId);
	nowjs.getGroup(roomId).addUser(clientId);
	
	this.now.room = roomId;
	this.now.joinedRoom(roomId);
	
	console.log(this.user.clientId + ' joined room ' + roomId);	
};

everyone.now.distributeLoadDocument = function(url) {
	console.log('Room '+this.now.room +': '+this.user.clientId + ' sent loadDocument ' + url);
	this.now.documentUrl = url;
	nowjs.getGroup(this.now.room).now.loadDocument(url);
};

everyone.now.distributePageChange = function(num) {
	var group = nowjs.getGroup(this.now.room);
	group.now.changePage(num);
	console.log('Room '+ group.groupName +': '+this.user.clientId + ' sent changePage ' + num);	
};


/*
 * Simple preview server for AJAX apps. Includes a basic AJAX proxy.
 * This server will naively serve any files from the app's home directory (and its children).
 * 
 * DO NOT USE FOR PRODUCTION
*/

var APP_PORT = process.env.PORT || 3000;

console.log('\n========================================\n')
console.log('Development Preview Server\nDO NOT USE IN PRODUCTION!!!\n');
console.log('Listening on port ' + APP_PORT);
console.log('AJAX proxy bound to "/_proxy"');
console.log('     eg. http://localhost:3000/_proxy/http://example.com/a/b/c');
console.log('\n========================================\n');

//app.use(express.logger());

app.use('/_proxy/', function(req, res, next){

	var target = req.url.substring("/".length, req.url.length);

	//console.log("PROXY request received. Target: " + target);

  	// parse the url
  	var url_parts = url.parse(target);

    // Simple validation of well-formed URL
  	if(url_parts.host == undefined) {
  	    var err = "PROXY Error: Malformed target URL " + target;
  	    //console.log('PROXY_PORT Error: '+err);
        res.statusCode=501;
    	res.write(err);
    	res.end();
  	} else {
          //console.log("PROXY Request: " + url_parts.hostname + ", port: " + (url_parts.port ? url_parts.port : 80) + ", path: " + (url_parts.path ? url_parts.path : url_parts.pathname));

          // Create and configure the proxy.

          var proxy = new httpProxy.HttpProxy({
              target:{
                  host: url_parts.hostname,
                  port: url_parts.port ? url_parts.port : 80,
                  https: (url_parts.protocol === 'https:')
              }
          });

          // Rewrite the URL on the request to remove the /proxy/ prefix.
          // Then pass along to the proxy.

          // Heroku's version of http-proxy requires the use of 'pathname' instead of 'path'
          req.url = (url_parts.path ? url_parts.path : url_parts.pathname);
          req.headers['host']=url_parts.host;  // Reset the host header to the destination host.

          proxy.proxyRequest(req, res);

	} // end if-else

});

// Serve static files from local directory
// TODO Add ability to recompile LESS CSS on each request.
app.use(express.static(__dirname));

app.listen(APP_PORT);