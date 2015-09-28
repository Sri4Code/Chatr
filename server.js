var express = require("express")
var app = express();
var users = {};
//create server with app
var server = require("http").Server(app);

//socket should be attached to same server as app
var io = require("socket.io").listen(server);

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

var port = Number(process.env.PORT || 3000);

server.listen(port);

//default page to index.html
app.get("/",function(request,response){
	response.sendFile(__dirname+"/index.html")
});

//listening to socket connection
io.on("connection",function(socket){
	
	//listening when new user event
	socket.on("newUser",function(data){
		socket.userName= data.newUser;
		users[data.newUser] = socket;
		
		//emit to tall including current socket
		io.emit("allUsers",{users:Object.keys(users)});
	});

	//listening to "newMessage" event emitted by the client
	socket.on("newMessage",function(data){
		
		//send message to all  users
		//except the current client
		io.emit('sendMessage',{user:socket.userName, message:data.message });
		
	});
	
	socket.on("privateMessage",function(data){
		
		//get socket for the TOuser
		var toSocket = users[data.user];
		toSocket.emit("sendPrivateMessage",{user: socket.userName, message: data.message});
		
		//socket.emit("sendPrivateMessage",{user: socket.userName, message: data.message});
		
	});
	
	socket.on('disconnect', function (data) {
		
      if(!socket.userName) return;
	  delete users[socket.userName]
		io.emit("allUsers",{users:Object.keys(users)});

  });

	
});
