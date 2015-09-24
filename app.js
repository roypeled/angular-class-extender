angular.module("animals", ["ngExtender"]);

function AbstractMammal(){

    var self = this;
    
    this.speak = function(){
        var rand = Math.round(Math.random() * (self.wordsArray.length-1));
        window.alert(self.wordsArray[rand]);
    }

    this.setTitle = function(){
        self.title = "Hi! I am a " + self.name + "!";
    }

    this.$binded(function(){
        self.setTitle();
    });

    this.$abstract("wordsArray");
    this.$abstract("name");
}

function Cat($extend){
    $extend(this).with(AbstractMammal);

    this.wordsArray = ["Meow!", "Hiss!"];
    this.name = "Cat";
}

function Dog($extend){
    $extend(this).with(AbstractMammal);

    this.wordsArray = ["Woof!", "Lick!"];
    this.name = "Dog";
}

function AngryDog($extend){
    var $super = $extend(this).with(Dog);
    
    var self = this;

    this.speak = function(){
        $super.speak();
        self.name = "Angry Dog";
        self.setTitle();
    }
}
