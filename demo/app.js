angular.module("animals", ["ngExtender"]);

function AbstractMammal($scope){

    $scope.speak = function(){
        var rand = Math.round(Math.random() * ($scope.wordsArray.length-1));
        window.alert($scope.wordsArray[rand]);
    }

    $scope.setTitle = function(){
        $scope.title = "Hi! I am a " + $scope.name + "!";
    }

    $scope.$binded(function(){
        $scope.setTitle();
    });

    $scope.$abstract("wordsArray");
    $scope.$abstract("name");
}

function Cat($extend, $scope){
    $extend($scope).with(AbstractMammal);

    $scope.wordsArray = ["Meow!", "Hiss!"];
    $scope.name = "Cat";
}

function Dog($extend, $scope){
    $extend($scope).with(AbstractMammal);

    $scope.wordsArray = ["Woof!", "Lick!"];
    $scope.name = "Dog";
}

function AngryDog($extend, $scope){
    $extend($scope).with(Dog);

    $scope.speak = function(){
        $scope.$super.speak();
        $scope.name = "Angry Dog";
        $scope.setTitle();
    }
}