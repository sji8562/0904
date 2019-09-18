Window.addEventListener("load", drawScreen, false);
Window.addEventListener("keydown", onkeydown,false);
Window.addEventListener("keyup", onkeyup,false);
var strKeyEventType = "None";
var strKeyEventValue = "None";
function drawScreen(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	Context.fillStyle = "#000000";
	Context.fillRect(0,0,800,600);
	Context.fillStyle = "#ffffff";
	Context.font = '25px Arlal';
	Context.textBaseline = "top";
	Context.fillText("입력된 키 : " +strKeyEventValue,5,5);
	Context.fillText("키 입력 상태 : " +strKeyEventType,5,30);
}

function onkeydown(e){
	strKeyEventType = e.type;
	strKeyEventValue = e.key;
	drawScreen();
}

function onkeyup(e){
	strKeyEventValue =e.key;
	strKeyEventType =e.type;
	drawScreen();
}