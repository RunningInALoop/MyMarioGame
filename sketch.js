//creating global variables

var bgImg, ground2, ground2Img, invG;
var mario, marioImg, marioJmpSound, marioCollidedIMg;
var brickImg, brick, brkGroup;
var coinImg, coin, coinGroup;

var dieSound, checkPointSound;

var obstacleImg, obGroup, obstacles;

var gameOver, gameOverIMg, restart, restartImg;

var gameState = "start";
var score = 0;


//loading assets
function preload() {

  bgImg = loadImage("bg.png");
  ground2Img = loadImage("ground2.png");
  marioImg = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");

  marioJmpSound = loadSound("jump.mp3");

  marioCollidedImg = loadAnimation("collided.png");

  dieSound = loadSound("die.mp3");

  checkPointSound = loadSound("checkPoint.mp3");

  obstacleImg = loadAnimation("obstacle1.png", "obstacle4.png", "obstacle2.png", "obstacle3.png")

  brickImg = loadImage("brick.png");
  coinImg = loadImage("coin2.png");

  gameOverImg = loadImage("gameOver.png");

  restartImg = loadImage("restart.png");
}

function setup() {

  createCanvas(600, 400);


  //creating ground to overlap over background image
  ground2 = createSprite(300, 380, 300, 300);
  ground2.addImage(ground2Img);
  ground2.scale = 1.25;


  //creating invisible ground
  invG = createSprite(100, 380, 600, 90);
  invG.visible = false;

  //creating mario
  mario = createSprite(50, 300, 10, 10);
  mario.addAnimation("mario", marioImg);
  mario.addAnimation("collided", marioCollidedImg);
  mario.scale = 2;
  mario.setCollider("rectangle", 0, 0, 20, mario.height);
  //mario.debug = true;

  gameOver = createSprite(280, 100);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;


  restart = createSprite(280, 150);
  restart.addImage(restartImg);
  restart.visible = false;

  obGroup = new Group();
  brkGroup = new Group();
  coinGroup = new Group();
}

function draw() {

  background(bgImg);

  if (gameState === "start") {

    textSize(20);
    textFont("Helevicta");
    fill("black");
    text("Press s to start. Avoid Bricks. Catch coins!", 120, 200);

    start();

  } else if (gameState === "play") {

    //giving illusion of movement to mario
    ground2.velocityX = -5;

    //creating infinitely scrolling ground

    if (ground2.x < 0) {
      ground2.x = ground2.width / 2;
    }


    if (score > 0 && score % 20 === 0) checkPointSound.play();

    //making mario jump 
    if (touches.length > 0 || keyDown("space") && mario.y >= 150) {

      mario.velocityY = -10;
      marioJmpSound.play();
      touches = [];
    }

    //adding gravity
    mario.velocityY = mario.velocityY + 0.8;

    //keeping mario from falling off
    mario.collide(invG);

    //spawing obstacles, coins and bricks
    spawnObstacles();

    spawnCoins();

    spawnBricks();


    //checking for collision with bricks and decreasing score

    for (var i = 0; i < brkGroup.length; i++) {

      if (mario.isTouching(brkGroup[i])) {

        score--;
        brkGroup[i].destroy();
      }


    }

    //checking for catching coins and increasing score
    for (var j = 0; j < coinGroup.length; j++) {

      if (mario.isTouching(coinGroup[j])) {

        score = score + 2;
        coinGroup[j].destroy();
      }


    }

    //if mario touches obstacles, game ends
    if (obGroup.isTouching(mario)) {
      dieSound.play();
      gameState = "end";
    }

  } else if ((gameState === "end")) {

    ground2.velocityX = 0;
    mario.changeAnimation("collided", marioCollidedImg);

    obGroup.setVelocityXEach(0);
    brkGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);

    obGroup.setLifetimeEach(-1);
    brkGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    //restarting game
    if (mousePressedOver(restart)) {

      gameOver.visible = false;
      restart.visible = false;

      obGroup.destroyEach();
      brkGroup.destroyEach();
      coinGroup.destroyEach();

      mario.changeAnimation("mario");

      gameState = "start";

    }

  }


  //keeping mario from falling off
  mario.collide(invG);

  drawSprites();

  //displaying scores
  textSize(20);
  fill("black");
  text("SCORE:" + score, 450, 30);

}


function spawnObstacles() {

  if (frameCount % 80 === 0) {

    obstacles = createSprite(550, 310, 10, 10);
    obstacles.velocityX = -5;
    obstacles.addAnimation("obstacle", obstacleImg);
    obstacles.lifetime = 150;

    // obstacles.debug = true;
    obGroup.add(obstacles);

  }
}

function spawnBricks() {

  if (frameCount % 100 === 0) {
    brick = createSprite(550, Math.round(random(80, 150)), 10, 10);
    brick.addImage(brickImg);
    brick.scale = 2;
    brick.velocityX = -5;
    brick.lifetime = 150;
    brkGroup.add(brick);

    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    gameOver.depth = mario.depth;
    restart.depth = mario.depth;

  }
}

function spawnCoins() {

  if (frameCount % 60 === 0) {
    coin = createSprite(530, Math.round(random(150, 250)), 10, 10);
    coin.addImage(coinImg);
    coin.scale = 0.09;
    coin.velocityX = -5;
    coin.lifetime = 150;
    coinGroup.add(coin);

    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    gameOver.depth = mario.depth;
    restart.depth = mario.depth;

  }
}

function start() {

  ground2.velocityX = 0;
  score = 0;

  if (keyDown("s")) {

    gameState = "play";

  }

}