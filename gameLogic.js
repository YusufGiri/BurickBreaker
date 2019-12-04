const cvs = document.getElementById("burick");
const ctx = cvs.getContext("2d");
const gameover = document.getElementById("game_over");
//menambah border
cvs.style.border = "1px solid #0ff";

ctx.lineWidth = 3;

//variabel game 
let GAME_OVER = false; //game over status
let LIFE = 9999999; //nyawa player
let SCORE = 0; //init score
let LEVEL = 3; //init level
const LEVEL_MAX = 3;
const SCORE_UNIT = 10;

var WarnaMusuh = ["#ff0000","#ffcd05","#00ff00","#ffffff"];
//penghalang level 2
const TEMBOK_WIDTH = 150;
const TEMBOK_HEIGHT = 20;
const TEMBOK_MARGIN_BOTTOM = 50;
const tembok = {
	x : 0,
	y : cvs.height/2,
	width : TEMBOK_WIDTH,
	height : TEMBOK_HEIGHT,
	dx : 5
}
const tembok2 = {
	x : cvs.width - TEMBOK_WIDTH,
	y : cvs.height/2,
	width : TEMBOK_WIDTH,
	height : TEMBOK_HEIGHT,
	dx : 5
}
const tembok3 = {
	x : 0,
	y : cvs.height/2 + 50,
	width : TEMBOK_WIDTH + 150,
	height : TEMBOK_HEIGHT,
	dx : 5
}
const tembok4 = {
	x : cvs.width - TEMBOK_WIDTH - 150,
	y : cvs.height/2 - 100,
	width : TEMBOK_WIDTH + 150,
	height : TEMBOK_HEIGHT,
	dx : 5
}

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
	strokeColor : "#FFF"
}

const brickLevelDua = {
	row : 4,
	column : 5,
	width : 55,
	height : 20,
	offSetLeft : 20,
	offSetTop : 10,
	marginTop : 10,
	strokeColor : "#FFF"
}

const brickLevelTiga = {
	row : 4,
	column : 6,
	width : 55,
	height : 20,
	offSetLeft : 10,
	offSetTop : 20,
	marginTop : 1,
	strokeColor : "#FFF"
}

let bricks = new Array();
let bricks2 = new Array();
let bricks3 = new Array();

//membuat balok
function createBricks(brick, bricks, lvl){
	if(lvl==1){
		for(let i = 0; i < brick.row; i++){
			bricks[i] = []; 
			for(let j = 0; j<brick.column; j++){
				if(i==0 && j == 0 || i==0 && j==(brick.column-1)/2 || i==0 && j==brick.column-1){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[3],
						outline: WarnaMusuh[3],
						life: 4,
						status: true
					}
				}else if(i==1 && j == 0 || i==1 && j==(brick.column-1)/2 || i==1 && j==brick.column-1){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[2],
						outline: WarnaMusuh[2],
						life: 3,
						status: true
					}
				}else if(i==1 && j%2!=0){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[1],
						outline: WarnaMusuh[1],
						life: 2,
						status: true
					}
				}else{
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[0],
						outline: WarnaMusuh[0],
						life: 1,
						status: true
					}
				}
				
			}
		}
	}else if(lvl==2){
		for(let i = 0; i < brick.row; i++){
			bricks[i] = []; 
			for(let j = 0; j<brick.column; j++){
				if(i==0 && j==0 || i==0 && j==brick.column-1){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[2],
						outline: WarnaMusuh[2],
						life: 3,
						status: true
					}
				}else if(i==0 || i==1 && j==(brick.column-1)/2){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[3],
						outline: WarnaMusuh[3],
						life: 4,
						status: true
					}
				}else if(i==1 && j==0 || i==1 && j==brick.column-1 || i==2 && j%2!=0 || i==3 && j==(brick.column-1)/2){
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[1],
						outline: WarnaMusuh[1],
						life: 2,
						status: true
					}
				}else{
					bricks[i][j] = {
						x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
						y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
						color: WarnaMusuh[0],
						outline: WarnaMusuh[0],
						life: 1,
						status: true
					}
				}
			}
		}
	}else if(lvl==3){
		for(let i = 0; i < brick.row; i++){
			bricks[i] = []; 
			if(i==0){
				bricks[i][0] = {
					x: 0 * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
					y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
					color: "#000000",
					outline: "#ffffff",
					life: 10,
					dx: 5,
					status: true
				}
			}else{
				for(let j = 0; j<brick.column; j++){
					// if(i==0 && j==0 || i==0 && j==brick.column-1 || i==2 && j%2!=0){
					// 	bricks[i][j] = {
					// 		x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
					// 		y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
					// 		color: WarnaMusuh[3],
					// 		outline: WarnaMusuh[3],
					// 		life: 4,
					// 		status: true
					// 	}
					// }
					if(i==1 && j%2!=0){
						bricks[i][j] = {
							x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
							y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
							color: WarnaMusuh[1],
							outline: WarnaMusuh[1],
							life: 2,
							status: true
						}
					}else if(i==1){
						bricks[i][j] = {
							x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
							y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
							color: WarnaMusuh[0],
							outline: WarnaMusuh[0],
							life: 1,
							status: true
						}
					}else if(i==2){
						if(j%2==0){
							bricks[i][j] = {
								x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
								y: tembok4.y + (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
								color: WarnaMusuh[0],
								outline: WarnaMusuh[0],
								life: 1,
								status: true
							}	
						}else if(j%2!=0){
							bricks[i][j] = {
								x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
								y: (tembok4.y + (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop),
								color: WarnaMusuh[2],
								outline: WarnaMusuh[2],
								life: 3,
								status: true
							}
						}
					}else if(i==3){
						if(j%2==0){
							bricks[i][j] = {
								x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
								y: bricks[i-1][j].y + (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
								color: WarnaMusuh[1],
								outline: WarnaMusuh[1],
								life: 2,
								status: true
							}
						}else if(j%2!=0){
							bricks[i][j] = {
								x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft, 
								y: bricks[i-1][j].y * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
								color: WarnaMusuh[0],
								outline: WarnaMusuh[0],
								life: 1,
								status: true
							}
						}
					}
				}
			}
		}
	}
}
// createBricks(brick,bricks,LEVEL);
createBricks(brickLevelTiga,bricks3,LEVEL);
function moveLevel3Boss(){
	if(bricks3[0][0].x + bricks3[0][0].width < cvs.width){ 
		bricks3[0][0].x += bricks3[0][0].dx; 
	}else if(bricks[0][0].x + bricks3[0][0].width == cvs.width){
		bricks3[0][0].dx = - bricks3[0][0].dx; 
		bricks3[0][0].x += bricks3[0][0].dx;
	}
	else if(bricks3[0][0].x == 0){
		bricks3[0][0].dx = -bricks3[0][0].dx; 
	}
}
//menggambar balok
function drawBricks(brick, bricks, level){
	if(level!=3){
		for(let i = 0; i< brick.row;i++){
			for(let j = 0; j< brick.column; j++){
				if(bricks[i][j].status){
					ctx.fillStyle = bricks[i][j].color;
					ctx.fillRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
					ctx.strokeStyle = bricks[i][j].outline;
					ctx.strokeRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
				}
			}
		}
	}else if(level==3){
		for(let i = 0; i< brick.row;i++){
			if(i==0){
				if(bricks[i][0].status){
						ctx.fillStyle = bricks[i][0].color;
						ctx.fillRect(bricks[i][0].x, bricks[i][0].y, brick.width, brick.height);
						ctx.strokeStyle = bricks[i][0].outline;
						ctx.strokeRect(bricks[i][0].x, bricks[i][0].y, brick.width, brick.height);
				}
			}else{
				for(let j = 0; j< brick.column; j++){
					if(bricks[i][j].status){
						ctx.fillStyle = bricks[i][j].color;
						ctx.fillRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
						ctx.strokeStyle = bricks[i][j].outline;
						ctx.strokeRect(bricks[i][j].x, bricks[i][j].y, brick.width, brick.height);
					}
				}
			}
		}
	}
}

//gambar tembok lvl2
function drawTembok(tembok,tembok2){
	ctx.fillStyle = "#000";
	ctx.fillRect(tembok.x,tembok.y,tembok.width,tembok.height);
	ctx.strokeStyle = "#ffcd05";
	ctx.strokeRect(tembok.x,tembok.y,tembok.width,tembok.height);
	ctx.fillStyle = "#000";
	ctx.fillRect(tembok2.x,tembok2.y,tembok2.width,tembok2.height);
	ctx.strokeStyle = "#ffcd05";
	ctx.strokeRect(tembok2.x,tembok2.y,tembok2.width,tembok2.height);
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

// colision penghalang
function tembokCollision(tembok){
	let b = tembok;
	 	if(ball.x + ball.radius > b.x
			&& ball.x - ball.radius < b.x + tembok.width
			&& ball.y + ball.radius > b.y
			&& ball.y - ball.radius < b.y + tembok.height){
			ball.dy = - ball.dy;
	 	}else if(ball.y + ball.radius > b.y
			&& ball.y - ball.radius < b.y + tembok.height
			&& ball.x + ball.radius > b.x
			&& ball.x - ball.radius < b.x + tembok.width){
	 		ball.dx = - ball.dx;
	 	}
	 		
}

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
function ballBrickCollision(brick,bricks,level){
	if(level==3){
		for(let i = 0; i< brick.row; i++){
			if(i==0){
				let b = bricks[i][0];
			 	if(b.status){
			 		if(ball.x + ball.radius > b.x
			 			&& ball.x - ball.radius < b.x + brick.width
			 			&& ball.y + ball.radius > b.y
			 			&& ball.y - ball.radius < b.y + brick.height){
			 			ball.dy = - ball.dy;
			 			b.life--; 
			 			if(b.life == 0)
			 				b.status = false;//bricknya hancur
			 		}
			 	}
			}else{
			 	for(let j = 0; j<brick.column;j++){
			 		let b = bricks[i][j];
			 		if(b.status){
			 			if(ball.x + ball.radius > b.x
			 				&& ball.x - ball.radius < b.x + brick.width
			 				&& ball.y + ball.radius > b.y
			 				&& ball.y - ball.radius < b.y + brick.height){
			 				ball.dy = - ball.dy;
			 				b.life--; 
			 				if(b.life == 0)
			 					b.status = false;//bricknya hancur
			 				else
			 					b.outline = WarnaMusuh[b.life-1];
			 			}
			 		}
			 	}
			}
		}
	}else{
		for(let i = 0; i< brick.row; i++){
		 	for(let j = 0; j<brick.column;j++){
		 		let b = bricks[i][j];
		 		if(b.status){
		 			if(ball.x + ball.radius > b.x
		 				&& ball.x - ball.radius < b.x + brick.width
		 				&& ball.y + ball.radius > b.y
		 				&& ball.y - ball.radius < b.y + brick.height){
		 				ball.dy = - ball.dy;
		 				b.life--; 
		 				if(b.life == 0)
		 					b.status = false;//bricknya hancur
		 				else
		 					b.outline = WarnaMusuh[b.life-1];
		 				//SCORE += SCORE_UNIT;
		 			}
		 		}
		 	}
		}
	}
}

function levelUp(brick, bricks){
	let isLevelDone = true;
	if(LEVEL==3){
		for(let i = 0;i<brick.row;i++){
			if(i==0){
				isLevelDone = isLevelDone && !bricks[i][0].status;

			}else{
				for(let j = 0;j<brick.column;j++){
					isLevelDone = isLevelDone && !bricks[i][j].status;
				}
			}
		}
	}else{
		for(let i = 0;i<brick.row;i++){
			for(let j = 0;j<brick.column;j++){
				isLevelDone = isLevelDone && !bricks[i][j].status;
			}
		}
	}
	if(isLevelDone){
		if(LEVEL>=3){
			return;
		}else if(LEVEL==1){
			//brick.row++;
			LEVEL++;
			createBricks(brickLevelDua, bricks2, LEVEL);
			resetBall();
			resetPaddle();
		}else if(LEVEL == 2){
			LEVEL++;
			createBricks(brickLevelTiga, bricks3, LEVEL);
			resetBall();
			resetPaddle();
			
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
		drawBricks(brick,bricks,LEVEL);
	} else if(LEVEL == 2){
		drawBricks(brickLevelDua, bricks2,LEVEL);
		drawTembok(tembok,tembok2);
	} else if(LEVEL == 3){
		drawBricks(brickLevelTiga, bricks3,LEVEL);
		drawTembok(tembok3,tembok4);
	}

	// //menunjukkan score
	// showStats(SCORE, 35, 25, SCORE_IMG, 5, 5);

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
	gameOver();

	if(LEVEL == 1){
		ballBrickCollision(brick,bricks,LEVEL);
		levelUp(brick,bricks);
	}else if(LEVEL == 2){
		ballBrickCollision(brickLevelDua,bricks2,LEVEL);
		tembokCollision(tembok);
		tembokCollision(tembok2);
		levelUp(brickLevelDua, bricks2);
	}else if(LEVEL == 3){
		moveLevel3Boss();
		ballBrickCollision(brickLevelTiga,bricks3,LEVEL);
		tembokCollision(tembok3);
		tembokCollision(tembok4);
		levelUp(brickLevelTiga,bricks3);
	}
	
}


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