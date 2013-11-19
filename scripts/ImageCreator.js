var context;

var currentX;
var currentY;
var lastX;
var lastY;

var paint;

function init(){
	context = document.getElementById('canvas').getContext("2d");
	
	document.onselectstart = function(){ return false; };

	$('#canvas').mousedown(function(e){
		currentX = getMouseX(e);
		currentY = getMouseY(e);
		lastX = undefined;
		lastY = undefined;
		paint = true;
	});

	$('#canvas').mousemove(function(e){
		if(paint){
			lastX = currentX;
			lastY = currentY;
			currentX = getMouseX(e);
			currentY = getMouseY(e);
			redraw();
		}
	});

	$('#canvas').mouseup(function(e){
		lastX = currentX;
		lastY = currentY;
		currentX = getMouseX(e);
		currentY = getMouseY(e);
		redraw();
		paint = false;
	});

	$('#canvas').mouseleave(function(e){
		if( paint == true ){
			currentX = undefined;
			currentY = undefined;
			lastX = undefined;
			lastY = undefined;
		}
	});
	
	$('#canvas').mouseenter(function(e){
		if( paint == true ){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			currentX = mouseX;
			currentY = mouseY;
		}
	});
	
	$(window).mouseup(function(){
		paint = false;
	});
	
	$(window).mousedown(function(){
		paint = true;
	});
	
    document.getElementById("submit").onclick = function(){
		saveImage();
	}
}

function saveImage() {
	var canvasData = context.canvas.toDataURL("image/png");
	var xmlHttpReq = false;
	if(window.XMLHttpRequest) {
		var ajax = new XMLHttpRequest();
	} else if( window.ActiveXObject){
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	ajax.open("POST", 'cgi-bin/saveImage.py', false);
	ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	ajax.onreadystatechange = function() {
		console.log(ajax.responseText);
	}
	ajax.send("imgData="+encodeURIComponent(canvasData));
}

function redraw(){
	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = 5;
	
	if( lastX && lastY ){
		context.beginPath();
		if( lastX == currentX && lastY == currentY ){
			context.moveTo(lastX-1, lastY);
		} else{
			context.moveTo(lastX, lastY);
		}
		context.lineTo(currentX, currentY);
		context.closePath();
		context.stroke();
	}	
}

function getMouseX(e){
	return (e.pageX - context.canvas.offsetLeft);
}

function getMouseY(e){
	return (e.pageY - context.canvas.offsetTop);
}


	


