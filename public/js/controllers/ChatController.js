angular.module("Chatr")
	.controller("ChatController", ChatController);

ChatController.$inject = ["$scope", "socketFactory"];
function ChatController($scope, socketFactory) {
	$scope.test = "test message";

	$scope.chat = {};
	$scope.chat.messages = [];
	$scope.chat.users = [];
	$scope.chat.currentUser="";
	
	//methods
	$scope.createUser = createUser;
	$scope.addPrivateUser = addPrivateUser;
	$scope.removePrivateUser = removePrivateUser;
	$scope.sendMessage = sendMessage;
	$scope.sendPrivateMessage = sendPrivateMessage;


	function addPrivateUser(user) {
		$scope.chat.users[user.id].private = true;
	}
	
	function removePrivateUser(user) {
		$scope.chat.users[user.id].private = false;
	}

	function sendMessage() {
		socketFactory.emit("newMessage", { message: $scope.chat.message });
		$scope.chat.message = "";
	};

	function createUser() {
		socketFactory.emit("newUser", { newUser: $scope.chat.currentUser });
	};

	function sendPrivateMessage(user) {

		socketFactory.emit("privateMessage", { user: user.name, message: user.privateMessage });
		$scope.chat.users[user.id].messages.push($scope.chat.currentUser+ ": " + user.privateMessage);
		$scope.chat.users[user.id].privateMessage = "";

	};
	
	//need apply since its a non-angularjs event
	socketFactory.on("allUsers", function (data) {
		if($scope.chat.currentUser=="") return;
		var users = [];
		for (var i = 0; i < data.users.length; i++) {
			users.push({ id: i, name: data.users[i], private: false, privateMessage: "", current: true, messages: [] });
		}

		$scope.$apply(function () {
            $scope.chat.users = users;
        });
	});

	socketFactory.on("sendMessage", function (data) {
		$scope.$apply(function () {
            $scope.chat.messages.push(data.user + ": " + data.message);
        });
	});

	socketFactory.on("sendPrivateMessage", function (data) {
		$scope.$apply(function () {
			var user = findUser(data.user)
			$scope.chat.users[user.id].private = true;
			$scope.chat.users[user.id].messages.push(data.user + ": " + data.message);
		});
	});

	function findUser(name) {
		return $.grep($scope.chat.users, function (e) { return e.name == name; })[0];
	}
};