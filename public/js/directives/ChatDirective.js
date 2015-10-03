angular.module("Chatr")
    .directive('userPing', function ($interval) {
        return {
            restrict: 'A',
            scope: {
                ping: "="
            },
            link: function (scope, element, attrs) {
                var promise;
                
                function setPing(i) {
                        if (i % 2) {
                            element.css("border-color", "#009afd");
                        } else {
                            element.css("border-color", "#ddd");
                        }
                    };
                    
                scope.$watch('ping', function (ping) {
                    
                    
                    if (ping) {
                        $interval.cancel(promise);
                        promise = $interval(setPing, 500);
                    }
                    else {
                        $interval.cancel(promise);
                        element.css("border-color", "#ddd");
                    }
                });

            }
        };
    })
    .directive('focusOn', function () {
        return {
            restrict: 'A',
            scope: {
                focus: "="
            },
            link: function (scope, element, attrs) {
                scope.$watch('focus', function (focus) {
                    if (focus) {
                        element[0].focus();
                         $('html, body').animate({
                        scrollTop: $(element[0]).offset().top}, 2000);
                    }
                });

            }
        };
    });