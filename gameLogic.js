const cvs = document.getElementById("burick");
const ctx = cvs.getContext("2d");

//menambah border
cvs.style.border = "1px solid #0ff";

//========================PADDLE===========================
//variabel game 
//object paddle
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const paddle = {
	x : cvs.width/2 - PADDLE_WIDTH/2,
	y : cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
	width : PADDLE_WIDTH,
	height : PADDLE_HEIGHT,
	dx : 5
}

//gambar paddle
function drawPaddle(){
	ctx.fillStyle = "#000";
	ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
	ctx.strokeStyle = "#ffcd05";
	ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
}

//control paddle
let leftArrow = false;
let rightArrow = false;
document.addEventListener("keydown",function(event){
	if(event.keyCode == 37){
		leftArrow = true;
	}else if(event.keyCode == 39){
		rightArrow = true;
	}
});
document.addEventListener("keyup",function(event){
	if(event.keyCode == 37){
		leftArrow = false;
	}else if(event.keyCode == 39){
		rightArrow = false;
	}
});
//function untuk mengubah posisi paddle
function movePaddle(){
	//GERAK PADDLE KEKANAN
	if(rightArrow && paddle.x + paddle.width < cvs.width){ 
		paddle.x += paddle.dx; 
	//GERAK PADDLE KEKIRI
	}else if(leftArrow && paddle.x>0){ 
		paddle.x -= paddle.dx; 
	}
}
//reset posisi paddle ke tengah setelah mati
function resetPaddle(){
	paddle.x = cvs.width/2 - PADDLE_WIDTH/2;
	paddle.y = cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM;
}
//=========================================================

//============================BOLA=========================
//MENGGAMBAR BOLA
//object bola
const BALL_RADIUS = 8;
const ball = {
	x : cvs.width/2,
	y : paddle.y - BALL_RADIUS,
	radius : BALL_RADIUS,
	speed : 5,
	dx : 5,
	dy : -5
}
//fungsi menggambar bola
function drawBall(){
	ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
	ctx.fillStyle = "#ffcd05";
	ctx.fill();
	ctx.StokeStyle = "#2e3548";
	ctx.stroke();
	ctx.closePath();
}

//MENGGERAKKAN BOLA
//y-- = atas
//y++ = bawah
//x++ = kanan
//x-- = kiri
function moveBall(){
	ball.x += ball.dx;
	ball.y += ball.dy;
}

//mengembalikan bola ke paddle setelah mati
function resetBall(){
	ball.x = cvs.width/2;
	ball.y = paddle.y - BALL_RADIUS;
	//untuk membuat arah pertama bola acak
	ball.dx - 3 * (Math.random()* 2-1);
	ball.dt = -3;
}
//=========================================================


//==========================BRICK==========================
//object musuh, bernama brick
const brick = {
	row : 3,
	column : 5,
	width : 55,
	height : 20,
	offSetLeft : 20,
	offSetTop : 20,
	marginTop : 40,
	fillColor : "#2e3548",
	strokeColor : "#FFF"
}

let bricks = new Array();

function createBricks(){
	for(let i = 0; i < brick.row; i++){
		bricks[i] = []; 
		for(let j = 0; j<brick.column; j++){
			bricks[i][j] = {
				x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
				y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
				status: true
			}
		}
	}
}
createBricks();

function drawBricks(){	
	for(let i = 0; i< brick.row;i++){
		for(let j = 0; j< brick.column; j++){
			if(bricks[i][j].status){
				ctx.fillStyle = brick.fillColor;
				ctx.fillRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
				ctx.strokeStyle = brick.strokeColor;
				ctx.strokeRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
			}
		}
	}
}
//=========================================================


//==========================COLLISION======================
//COLLISION PADDLE DAN BOLA
function ballPaddleCollision(){
	if(ball.y > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width){
		let collidePoint = ball.x - (paddle.x + paddle.width/2); //lokasi collision
		//lokasi collision menentukan arah bola akan memantul
		collidePoint = collidePoint/ (paddle.width/2);
		let angle = collidePoint * (Math.PI/3); //
		ball.dx = ball.speed * Math.sin(angle);
		ball.dy = - ball.speed * Math.cos(angle);
	}
}
//COLLISION BOLA DAN DINDING
//nyawa player
let LIFE = 3;
//fungsi collision
function ballWallCollision(){
	//dinding kanan dan kiri
	if(ball.x + ball.radius > cvs.width  || ball.x - ball.radius <0){
		ball.dx = -ball.dx;//membuat bola memantul ke kanan / kiri
	}
	//dinding atas
	if(ball.y - ball.radius < 0){
		ball.dy = -ball.dy; //membuat bola memantul kebawah
	}
	//jika melewati dinding bawah / MATI
	if(ball.y + ball.radius > cvs.height){
		LIFE--; //kurangi nyawa player
		resetBall(); //kembalikan posisi bola
		resetPaddle(); //kembalikan posisi paddle
	}
}
//COLLISION BOLA DAN BRICK / MUSUH
function ballBrickCollision(){
	for(let i = 0; i< brick.row; i++){
	 	for(let j = 0; j<brick.column;j++){
	 		let b = bricks[i][j];
	 		if(b.status){
	 			if(ball.x + ball.radius > b.x
	 				&& ball.x - ball.radius < b.x + brick.width
	 				&& ball.y + ball.radius > b.y
	 				&& ball.y - ball.radius < b.y + brick.height){

	 				b.status = false;
	 				ball.dy = - ball.dy;
	 			}
	 		}
	 	}
	}
}
//=========================================================

//=====================MEMULAI GAME========================
//menggambar game
function draw(){
	drawPaddle();
	drawBall();
	drawBricks();
}
//menggerakkan object
function update(){
	movePaddle();
	moveBall();
	ballWallCollision();
	ballPaddleCollision();
	ballBrickCollision();
}

const BG_IMG = new Image();
BG_IMG.src = "bg_img.jpg";
function loop(){
	//ctx.clear(0,0,cvs.width,cvs.height);
	ctx.drawImage(BG_IMG,0,0);
	draw();
	update();
	requestAnimationFrame(loop);
}
loop();
//=========================================================