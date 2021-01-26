var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, backGround;
var bground, bgroundImage, backgroundImage;

var jumpSound,collidedSound
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score = 0;

var gameOver, restart;

function preload() {
  trex_running = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");

  trex_collided = loadAnimation("trex_collided.png");

  jumpSound = loadSound("jump.wav");
  collidedSound =loadSound("collided.wav")

  backgroundImage = loadImage("trex back.jpg");
  bgroundImage = loadImage("trexback.jpg")
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(100, height - 80, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;

  bground = createSprite(width/2 , height -0.5);
  bground.addImage("ground", bgroundImage);
  bground.velocityX = -(6 + 3 * score / 100);
  bground.width = width * 2;
  bground.scale = 2.5;

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {

  background(backgroundImage);
  textSize(20);
  fill("black");
  text("Score: " + score, width-200, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    bground.velocityX = -(10 + 3 * score / 100);

    if (touches.length > 0 || keyDown("space") && trex.y >= height - 250) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8

    if (bground.x < 500) {
      bground.x = width / 2;
    }

    trex.collide(bground);
    
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
     collidedSound.play();
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    bground.velocityX = 0;
    trex.velocityY = 0;
    
    obstaclesGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);


    if (mousePressedOver(restart) || touches.length > 0) {
      reset();
      touches = [];
    }
  }

  drawSprites();
}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width-200, height - 220);
    
    obstacle.setCollider('circle', 0, 0, 50);
    
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      default:
        break;
    }

    obstacle.scale = 0.4;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;

}