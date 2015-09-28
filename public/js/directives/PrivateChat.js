angular.module("Chatr")
.directive("privateChat",function($compile){
	return{
		restrict:"A",
		scope:{
			id:"@"
		},
		link:function(scope,element,attr)
		{
			element.bind("click",function(e){
				var privateChat =$compile("<private-chat-box id={{id}}  ></private-chat-box>")(scope);
				angular.element(document.getElementById("private-chats")).append(privateChat);
			});
		}
		
	};
});