angular-class-extender
======================

A lightweight angular module that adds support for class inheritance and method abstraction.

**Here is the <a href="http://roypeled.github.io/angular-class-extender/" target="_blank">DEMO</a>**

This module will help you minimize code duplication by classic methods of inheritance.

## Usage
To use this module you must add the JS file to your HTML and add `ngExtender` as a dependency to your app:
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.2/angular.min.js"></script>
    <script src="angular-class-extender.js"></script>
</head>
<body ng-app="app">
...

```
```js
angular.module("app", ["ngExtender"]);
```

### Basic Inheritance
```js
function ParentClass($scope){
  $scope.foo = function(){
    // Do A
  }
}

function HelperClass($scope){
  $scope.help = function(){
    // Get help!
  }
}

function ChildClass($extend, $scope){
  $extend($scope).with(ParentClass, HelperClass);
}
```
Now calling `foo()` or `help()` from `ChildClass` would actually call `foo()` from `ParentClass` and do 'A' or `help()` from `HelperClass`. 

### Overriding Methods and Calling Super Methods
```js
function ChildClass($extend, $scope){
  var $super = $extend($scope).with(ParentClass);
  
  $scope.foo = function(){
    
    // Do B
    
    $super.foo();
  }
}
```
Calling `foo()` from `ChildClass` would perform the overidden method, and the `ParentClass` method by calling `$super`.

### Implementing Abtract Methods
```js
function ParentClass($scope){
  $scope.$abstract("bar");
}

function ChildClass($extend, $scope){
  $extend($scope).with(ParentClass);
  
  $scope.bar = function(){
    // Do C
  }
}
```
Using the `$abstract` syntax you are making sure that whichever class extended `ParentClass` it has to implement `bar()` method.
Not doing so would result in an error:
> Abstract method bar must be overriden in ChildClass!

### Binded Event
This handler is called after all the classes in your inheritance tree have been linked, so you can be sure you can access all of the inherited or implemented properies.
```js
function ParentClass($scope){
  window.alert($scope.bar); // undefined

  $scope.$binded(function(){
    window.alert($scope.bar); // hello world!
  });
  
  $scope.$abstract("bar");
}

function ChildClass($extend, $scope){
  $extend($scope).with(ParentClass);
  
  $scope.bar = "hello world!"
}
