function Animal(name){
	this.name = name;
}

Animal.prototype.Talk = function(){
	document.writeln("나의 이름은 " + this.name + "야<br>" );
}

var dog = new Animal("개");
var bird = new Animal("새");
var monkey = new Animal("원숭이");

monkey.Talk();
bird.Talk();
dog.Talk();