/**!
 * AngularJS class extender
 * @author  Roy  <peled.roy@gmail.com>
 * @version 1.1.0
 */
(function() {
    var angularExtender = angular.module('ngExtender', []);

    var currentLocals;

    angularExtender.factory('$extendedController', ['$controller', function($controller) {
        return function(name, scope){
            currentLocals = scope;
            $controller(name, scope);
            currentLocals = null;
        }
    }]);

    angularExtender.factory('$extend', ['$injector', '$rootScope', function($injector, $rootScope) {

        function inject(func, locals){
            return $injector.instantiate(func, locals);
        }

        function Extend(currentScope){

            var abstracts = {};
            var bindedHandlers = [];

            currentScope.$abstract = function(name){
                abstracts[name] = true;
            };

            currentScope.$binded = function(handler){
                bindedHandlers.push(handler);
            };

            return {
                with: function(){
                    var klasses = arguments;
                    var $super = {};

                    var locals = {$scope: currentScope};

                    if(currentLocals){
                        for(var key in currentLocals){
                            locals[key] = locals[key] || currentLocals[key];
                        }
                    }

                    for(var i=0; i<klasses.length; i++){
                        var klass = klasses[i];
                        angular.extend(currentScope, klass);
                        klass = Extend.inject(, locals);
                        
                        for(var func in currentScope){
                            if(!/^(\$|this)/.test(func)){
                                $super[func] = currentScope[func];
                            }
                        }
                    }

                    $rootScope.$$postDigest(function(){
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

                        currentScope.$digest && currentScope.$digest();
                    });

                    return $super;
                }
            }
        }

        Extend.inject = inject;

        return Extend;
    }]);
})();
