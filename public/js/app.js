angular.module("Chatr",[])
.factory("socketFactory",function(){
	var socket = io.connect("https://chatr-chatr.herokuapp.com/");
	return socket;
})
.directive('schrollBottom', function () {
  return {
    scope: {
      schrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
});

