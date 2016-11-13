var canvas = document.getElementById('can'),
    context = canvas.getContext('2d'),
    ball = new Ball(5, "#789123"),
    angle = 0,
    centerY = 200,
    range = 50,
    xspeed = 1,
    yspeed = 0.05;

    blueBall1 = new Ball(10, "#454121");
    blueBall2 = new Ball(10, "#454121");
    blueBall3 = new Ball(10, "#454121");
        
    context.font="16px Georgia"
    blueBall1.x = 10;
    blueBall1.y = 10;
    blueBall1.draw(context);
    context.fillText("信标1(0, 0, 2)", 20, 16);

    blueBall2.x = 10;
    blueBall2.y = 290;
    blueBall2.draw(context);
    context.fillText("信标2(0, 2, 2)", 180, 16);

    blueBall3.x = 290;
    blueBall3.y = 10;
    blueBall3.draw(context);
    context.fillText("信标2(2, 0, 2)", 20, 292);

    ball.x = 0;

    var flag = 1 // 0表示正向，1表示反向
    var stop;
        
function drawFrame () {
    stop = window.requestAnimationFrame(drawFrame);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if(ball.x < 290 && flag){
    	ball.x += xspeed;
    }
    else {
    	flag = 0;
    	ball.x -= xspeed;
    }

    if(!flag && ball.x < 10){
    	flag = 1;
    	ball.x += xspeed;
    }

    ball.y = centerY + Math.sin(angle) * range;
    angle += yspeed;
    ball.draw(context);

    var posString = "("+Math.floor(ball.x)+", "+Math.floor(ball.y)+")";

    context.fillText(posString, (ball.x-30), Math.floor(ball.y - 20));

    context.font="16px Georgia"
    blueBall1.x = 10;
    blueBall1.y = 10;
    blueBall1.draw(context);
    context.fillText("信标1(0, 0, 2)", 20, 16);

    blueBall2.x = 10;
    blueBall2.y = 290;
    blueBall2.draw(context);
    context.fillText("信标2(0, 2, 2)", 180, 16);

    blueBall3.x = 290;
    blueBall3.y = 10;
    blueBall3.draw(context);
    context.fillText("信标2(2, 0, 2)", 20, 292);
       
}

      // drawFrame();
      // var rand = document.getElementById("random");
      // rand.onclick = random();

      // var r = document.getElementById("real");
      // r.onclick = real();
var btnRandom = document.getElementById("btnRandom");
var btnReal = document.getElementById("btnReal");

btnRandom.onclick = function random(){
	btnRandom.style.background = "#cc6600";
	btnReal.style.background = "#b3e4ff";
	window.cancelAnimationFrame(stop);
    drawFrame();
    console.log('Hello world.')
}

btnReal.onclick = function real(){
	btnReal.style.background = "#cc6600";
	btnRandom.style.background = "#b3e4ff";
    window.cancelAnimationFrame(stop);
    context.clearRect(0, 0, canvas.width, canvas.height);
        
    console.log("Real");

    context.font="16px Georgia"
    blueBall1.x = 10;
    blueBall1.y = 10;
    blueBall1.draw(context);
    context.fillText("信标1(0, 0, 2)", 20, 16);

    blueBall2.x = 10;
    blueBall2.y = 290;
    blueBall2.draw(context);
    context.fillText("信标2(0, 2, 2)", 180, 16);

    blueBall3.x = 290;
    blueBall3.y = 10;
    blueBall3.draw(context);
    context.fillText("信标2(2, 0, 2)", 20, 292);
}

