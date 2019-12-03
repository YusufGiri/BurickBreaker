const cvs = document.getElementById("burick");
const ctx = cvs.getContext("2d");
const gameover = document.getElementById("game_over");
//menambah border
cvs.style.border = "1px solid #0ff";

ctx.lineWidth = 3;




//variabel game 
let GAME_OVER = false; //game over status
let LIFE = 3; //nyawa player
let SCORE = 0; //init score
let LEVEL = 1; //init level
const LEVEL_MAX = 3;
const SCORE_UNIT = 10;


//========================PADDLE===========================
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

//function game over
function gameOver(){
	if(LIFE <= 0){
		showYoulose();
		GAME_OVER = true;
	}	
}

//bila menang
function showYouWin(){
	ctx.drawImage(WIN_IMG, 45, 80);
}

//bila kalah
function showYoulose(){
	ctx.drawImage(GAME_OVER_IMG,45,80);
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

const brickLevelDua = {
	row : 3,
	column : 1,
	width : 55,
	height : 20,
	offSetLeft : 20,
	offSetTop : 20,
	marginTop : 40,
	fillColor : "#2e3548",
	strokeColor : "#FFF"
}

let bricks = new Array();
let bricks2 = new Array();

//membuat balok lvl 1
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


//menggambar balok
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
		//tempColumn += 2;
	}
	
}


function createBricks2(){
	for(let i = 0; i < brick.row; i++){
		bricks2[i] = []; 
		for(let j = 0; j<brick.column; j++){
			bricks2[i][j] = {
				x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
				y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
				status: true
			}
		}
	}
}


function drawBricks2(){	
	tempColumn = brickLevelDua.column;
	for(let i = 0; i< brick.row;i++){
		for(let j = 0; j< brick.column; j++){
			if(bricks2[i][j].status){
				ctx.fillStyle = brickLevelDua.fillColor;
				ctx.fillRect(bricks2[i][j].x, bricks2[i][j].y, brickLevelDua.width, brickLevelDua.height);
				ctx.strokeStyle = brickLevelDua.strokeColor;
				ctx.strokeRect(bricks2[i][j].x, bricks2[i][j].y, brickLevelDua.width, brickLevelDua.height);
			}
		}
		tempColumn += 2;
	}
	
}


//ketika permainan sudah selesai di level maksimal
function levelDone(){
	if (LEVEL > LEVEL_MAX) {
		GAME_OVER = true;
	}
}

//fungsi untuk menaikkan level
function nextLevel(){
	let levelCleared = true;

	//pengecekan ketika semua balok sudah hancur
	for (let i = 0; r < brick.row; r++){
		for (let j = 0; j < brick.column; c++){
			levelCleared = levelCleared && !bricks[r][c].status;
		}
	}
}

//menunjukkan stats permainan
function showStats(text, textX, textY, img, imgX, imgY){
	ctx.fillStyle = "#FFF";
	ctx.fillText(text, textX, textY);

	//gambar icon
	ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
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

	 				ball.dy = - ball.dy;
	 				b.status = false; //bricknya hancur
	 				SCORE += SCORE_UNIT;
	 			}
	 		}
	 	}
	}
}

function levelUp(){
	let isLevelDone = true;

	for(let i = 0;i<brick.row;i++){
		for(let j = 0;j<brick.column;j++){
			isLevelDone = isLevelDone && !bricks[i][j].status;
		}
	}

	if(isLevelDone){

		if(LEVEL>=3){
			return;
		}else{
			//brick.row++;
			createBricks2();
			resetBall();
			resetPaddle();
			LEVEL++;
		}
	}
	
}

//=========================================================

//=====================MEMULAI GAME========================
//menggambar game
function draw(){

	
	drawPaddle();

	drawBall();
	if(LEVEL==1){
		drawBricks();
	} else if(LEVEL == 2){
		drawBricks2();
	}

	
	//menunjukkan score
	showStats(SCORE, 35, 25, SCORE_IMG, 5, 5);

	//menunjukkan nyawa
	showStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);

	showStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}


//menggerakkan object
function update(){
	movePaddle();

	moveBall();

	ballWallCollision();

	ballPaddleCollision();

	ballBrickCollision();

	gameOver();
	levelUp();
	createBricks2();
}

//const BG_IMG = new Image();
//BG_IMG.src = "bg_img.jpg";
function loop(){
	//ctx.clear(0,0,cvs.width,cvs.height);
	ctx.drawImage(BG_IMG,0,0);
	draw();
	update();

	if(!GAME_OVER){
		requestAnimationFrame(loop);		
	}
	
}

loop();
//=========================================================