/**!
 * AngularJS class extender
 * @author  Roy  <peled.roy@gmail.com>
 * @version 1.0.0
 */
(function() {
    var angularExtender = angular.module('ngExtender', []);

    angularExtender.factory('$extend', ['$injector', function($injector) {
        return function(currentScope){

            var abstracts = {};
            var bindedHandlers = [];

            currentScope.$abstract = function(name){
                abstracts[name] = true;
            }

            currentScope.$binded = function(handler){
                bindedHandlers.push(handler);
            }

            return {
                with: function(){
                    var klasses = arguments;
                    var $super = {};

                    for(var i=0; i<klasses.length; i++){
                        $injector.instantiate(klasses[i], {$scope: currentScope});
                        for(var func in currentScope){
                            if(!/^(\$|this)/.test(func)){
                                $super[func] = currentScope[func];
                                currentScope.$super[func] = currentScope[func];
                            }
                        }
                    }

                    setTimeout(function(){
                        for(var func in abstracts){
                            if(!currentScope[func]){

                                // Uh-oh! It looks like someone declared an abstract but did not implement the method!

                                var allNodes = document.querySelectorAll("*");
                                var ctrl;
                                for(var i=0; i<allNodes.length; i++){
                                    var el = angular.element(allNodes[i]);
                                    ctrl = el.attr("ng-controller") || el.attr("ng:controller") || el.attr("data-ng-controller");
                                    var scope = el.scope();
                                    if(scope == currentScope)
                                        break;
                                }
                                throw new Error("Abstract method " + func + " must be overriden in "+ ctrl + "!");
                            }
                        }

                        while(bindedHandlers.length)
                            bindedHandlers.pop()();

                        currentScope.$digest();
                    }, 5);

                    return $super;
                }
            }
        }
    }]);
})();