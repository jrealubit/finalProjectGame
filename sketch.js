var level1Background;
var level1Music;
var level2Background;
var level2Music;
var bossFightBackground;
var bossMusic;
var endGameScreen;
var playerSprite;
var playerAttackSprite;
var playerSpecialSprite;
var enemySprite;
var enemySpriteAttack;
var bossSprite;
var bossSpriteAttack;
let customFont;

var level = -1;
var frame_rate = 60;

//attack zones where enemies attack
const zone1Start = 0;
const zone1End = 400;

const zone2Start = 600;
const zone2End = 800;

const zone3Start = 1000;
const zone3End = 1200;
//arrays that holds each set of enemies for each level
var level1EnemyArray = [];
var level2EnemyArray = [];
var level1Clear = false;
var level2Clear = false;
var bossLevelClear = false;
var gameOver = false;
var enemyMovementSpeed = 5;

var player;
var playerHitBoxOffSet = 20;
var playerMovementSpeed = 14;
//constrain player position to bottom area of screen
var playerX;
var playerY;

var boss;
var bossMovementSpeed = 12;
//constrain boss positions to bottom area of screen
var bossX;
var bossY;

/* Every hit on an enemy will increment to this counter until 3 charges.
   When there are 3 charges, the next hit will be a special attack which does more 
   damage to enemies. The counter then resets to 0.
*/
var specialAttack;

function preload() {
  level1Background = loadImage("citypixel.png");
  level2Background = loadImage("level2.png");
  bossFightBackground = loadImage("fieldpixel.png");
  endGameScreen = loadImage("endGameScreen.png");
  playerSprite = loadImage("blip.png");
  playerAttackSprite = loadImage("blipA.png");
  playerSpecialSprite = loadImage("blipS.png");
  enemySprite = loadImage("enemy.png");
  enemySpriteAttack = loadImage("enemyAttack.png");
  bossSprite = loadImage("boss.png");
  bossSpriteAttack = loadImage("bossA.png");
  customFont = loadFont("PublicPixel-z84yD.ttf");
  level1Music = loadSound("cityGame.mp3");
  level2Music = loadSound("forestGame.mp3");
  bossMusic = loadSound("bossFightGame.mp3");
}

function setup() {
  createCanvas(1366, 593);
  frameRate(frame_rate);
  textFont(customFont);

  player = new Player(10, 0, 600, 20, 10, 20, 20);

  specialAttack = 0;
  //enemies for level 1
  for (let i = 0; i < 4; i++) {
    let enemy = new Enemy(3, 100 + 100 * i, 200 + i * 100, 20, 10, 40, 20);

    level1EnemyArray.push(enemy);
  }

  //enemies for level 2
  for (let j = 0; j < 4; j++) {
    let enemy = new Enemy(3, 1000 - 100 * j, 200 + j * 100, 20, 10, 40, 20);

    level2EnemyArray.push(enemy);
  }

  //make boss
  boss = new Octo(20, width, height, 100);
  
}

function draw() {
  clear();

  //logic to constrain player to botttom area of screen
  playerX = constrain(
    player.playerXPosition,
    0 + player.body,
    width - player.body
  );
  playerY = constrain(
    player.playerYPosition,
    300 + player.body,
    height - player.body
  );
  player.playerXPosition = playerX;
  player.playerYPosition = playerY;

  //logic to constrain Octo to bottom area of screen
  bossX = constrain(boss.octoXPosition, 0, width - boss.body);
  bossY = constrain(boss.octoYPosition, 300, height - boss.body);
  boss.octoXPosition = bossX;
  boss.octoYPosition = bossY;

  if (level == -2) {
    //Game Over
    gameOver = true;
    textSize(40);
    background(0);
    textAlign(CENTER);
    stroke("black");
    fill("white");
    text("GAME OVER", width / 2, height / 2);
    textSize(15);
    text(
      "Press enter until you reach your last level you played on to continue...",
      width / 2,
      height / 2 + 100
    );
    //reset player health
    player.health = 10;
  }
  if (level == -1) {
    //Start screen
    textSize(24);
    textAlign(CENTER);
    background(220);
    strokeWeight(2);
    stroke("black");
    fill("red");
    textStyle(BOLDITALIC);
    text(
      "The year is 30XX.\nThe world is ruled by a rogue A.I. named Octo\nwho uses his band of sentinels to enforce his power.\nThe human race is on its last leg.\nThe only hope for humanity is you,\na cyborg who must defeat Octo and his henchmen,\nto restore balance to the world.\n\nPress enter to continue…",
      width / 2,
      height / 2
    );
  }
  if(level == 0){
    textSize(24);
    textAlign(CENTER);
    background(220);
    strokeWeight(2);
    stroke("black");
    fill("red");
    textStyle(BOLDITALIC);
    text("How to play:\n\n*Arrow keys to move\n\n*Spacebar to attack\n\n*Every 3 successful hits,\nmakes your next hit a stronger attack\n\nPress enter to continue...", width/2, height/2);
  }
  if (level == 1) {
    //first level
    background(level1Background);
    gameOver = false;
    
    if(level1Clear == true){
        fill('red');
        stroke('orange');
        textSize(30);
        textAlign(CENTER);
        text("Press enter to continue...", width/2, height/2);
      }
    player.makeBody();
    player.healthBar();
    player.specialBar();
    player.movement();
    player.attack();

    for (let i = 1; i < level1EnemyArray.length; i++) {
      fill("red");
      level1EnemyArray[i].makeBody();
      level1EnemyArray[i].movement();
      level1EnemyArray[i].attack();

      //hit detection for player
      if (
        level1EnemyArray[i].enemyXPosition - 20 + player.body >
          player.playerXPosition &&
        level1EnemyArray[i].enemyXPosition - 20 <
          player.body + player.playerXPosition &&
        level1EnemyArray[i].enemyYPosition +
          10 +
          player.body +
          playerHitBoxOffSet >
          player.playerYPosition &&
        level1EnemyArray[i].enemyYPosition + 10 <
          player.body + playerHitBoxOffSet + player.playerYPosition &&
        level1EnemyArray[i].attack() == true
      ) {
        //text('hit player', 300, 100);
        //knock-back affter hit
        player.playerXPosition = player.playerXPosition - 100;

        //player takes damage
        player.health = player.health - 1;
      }
      // //hit dectection for enemies
      if (
        player.playerXPosition + 20 + level1EnemyArray[i].body >
          level1EnemyArray[i].enemyXPosition &&
        player.playerXPosition + 20 <
          level1EnemyArray[i].body + level1EnemyArray[i].enemyXPosition &&
        player.playerYPosition + level1EnemyArray[i].body >
          level1EnemyArray[i].enemyYPosition &&
        player.playerYPosition <
          level1EnemyArray[i].body + level1EnemyArray[i].enemyYPosition &&
        player.attack() == true
      ) {
        //text('hit enemy', 300, 100);
        //knock-back affter hit
        level1EnemyArray[i].enemyXPosition =
          level1EnemyArray[i].enemyXPosition + 100;
        //damage to enemy
        level1EnemyArray[i].health = level1EnemyArray[i].health - 1;
        //increment to special attack counter
        specialAttack = specialAttack + 1;

        if (specialAttack == 5) {
          specialAttack = 0;
        }
        if (specialAttack == 4) {
          //special attack does 3 damage
          level1EnemyArray[i].health = 0;
        }
      }

      //deletes enemy object from array when their health hits 0
      if (level1EnemyArray[i].health == 0) {
        level1EnemyArray.splice(i, 1);
      }
      //advance to next level if enemy array is empty
      if (level1EnemyArray.length == 1) {
        //1 is empty since an extra enemy object is made but not on screen
        level1Clear = true;
      }
      
      //player loses
      if (player.health == 0) {
        gameOver = true;
        level = -2;
      }
    }
  }
  if (level == 2) {
    //2nd level
    background(level2Background);
    gameOver = false;
    
    if(level2Clear == true){
        fill('green');
        stroke('blue');
        textSize(30);
        textAlign(CENTER);
        text("Press enter to continue...", width/2, height/2);
      }

    player.makeBody();
    player.healthBar();
    player.specialBar();
    player.movement();
    player.attack();

    for (let i = 1; i < level2EnemyArray.length; i++) {
      fill("red");
      level2EnemyArray[i].makeBody();
      level2EnemyArray[i].movement();
      level2EnemyArray[i].attack();

      //hit detection for player
      if (
        level2EnemyArray[i].enemyXPosition - 20 + player.body >
          player.playerXPosition &&
        level2EnemyArray[i].enemyXPosition - 20 <
          player.body + player.playerXPosition &&
        level2EnemyArray[i].enemyYPosition +
          10 +
          player.body +
          playerHitBoxOffSet >
          player.playerYPosition &&
        level2EnemyArray[i].enemyYPosition + 10 <
          player.body + playerHitBoxOffSet + player.playerYPosition &&
        level2EnemyArray[i].attack() == true
      ) {
        //text('hit player', 300, 100);
        //knock-back affter hit
        player.playerXPosition = player.playerXPosition - 100;

        //player takes damage
        player.health = player.health - 1;
      }
      // //hit dectection for enemies
      if (
        player.playerXPosition + 20 + level2EnemyArray[i].body >
          level2EnemyArray[i].enemyXPosition &&
        player.playerXPosition + 20 <
          level2EnemyArray[i].body + level2EnemyArray[i].enemyXPosition &&
        player.playerYPosition + level2EnemyArray[i].body >
          level2EnemyArray[i].enemyYPosition &&
        player.playerYPosition <
          level2EnemyArray[i].body + level2EnemyArray[i].enemyYPosition &&
        player.attack() == true
      ) {
        //text('hit enemy', 300, 100);
        //knock-back affter hit
        level2EnemyArray[i].enemyXPosition =
          level2EnemyArray[i].enemyXPosition + 100;
        //damage to enemy
        level2EnemyArray[i].health = level2EnemyArray[i].health - 1;
        //increment to special attack counter
        specialAttack = specialAttack + 1;

        if (specialAttack == 5) {
          specialAttack = 0;
        }
        if (specialAttack == 4) {
          //special attack does 3 damage
          level2EnemyArray[i].health = 0;
        }
      }

      //deletes enemy object from array when their health hits 0
      if (level2EnemyArray[i].health == 0) {
        level2EnemyArray.splice(i, 1);
      }
      //advance to next level if enemy array is empty
      if (level2EnemyArray.length == 1) {
        //1 is empty since an extra enemy object is made but not on screen
          level2Clear = true;
      }

      //player loses
      if (player.health == 0) {
        gameOver = true;
        level = -2;
      }
    }
  }
  if (level == 3) {
    //Final level, boss fight
    background(bossFightBackground);
    textSize(32);
    textAlign(CENTER);
    stroke("white");
    fill("red");
    //slight rumble to text
    text(
      "“ARE YOU NOT A MACHINE AS WELL?\nNEVERMIND THAT.\nPREPARE TO BE DELETED FOR YOUR INSOLENCE.”",
      width / 2 + random(8),
      height / 2 + random(8)
    );
    textSize(24);
    text("Press enter to continue…", width / 2, height / 2 + 200);
  }
  if (level == 4) {
    background(bossFightBackground);
        gameOver = false;
        if(bossLevelClear == true){
        fill('green');
        stroke('blue');
        textSize(30);
        textAlign(CENTER);
        text("Press enter to continue...", width/2, height/2);
      }
    //player reset health
    player.makeBody();
    player.healthBar();
    player.specialBar();
    player.movement();
    player.attack();

    boss.makeBody();
    boss.healthBar();
    boss.movement();
    boss.attack();
    // text('boss X: ' + boss.octoXPosition, 300, 300);
    // text('boss Y: ' + boss.octoYPosition, 300, 400);

    //hit detection for player
    if (
      boss.octoXPosition - 100 + player.body > player.playerXPosition &&
      boss.octoXPosition - 100 < player.body + player.playerXPosition &&
      boss.octoYPosition + player.body + 80 > player.playerYPosition &&
      boss.octoYPosition < player.body + 80 + player.playerYPosition &&
      boss.attack() == true
    ) {
      //text('hit player', 300, 100);
      //knock-back affter hit
      player.playerXPosition = player.playerXPosition - 200;

      //player takes damage
      player.health = player.health - 1;
    }
    // //hit dectection for enemies
    if (
      player.playerXPosition + 20 + boss.body > boss.octoXPosition &&
      player.playerXPosition + 20 < boss.body + boss.octoXPosition &&
      player.playerYPosition + boss.body > boss.octoYPosition &&
      player.playerYPosition < boss.body + boss.octoYPosition &&
      player.attack() == true
    ) {
      //text('hit enemy', 300, 100);
      //knock-back affter hit
      boss.octoXPosition = boss.octoXPosition + 100;
      //damage to enemy
      boss.health = boss.health - 1;
      //increment to special attack counter
      specialAttack = specialAttack + 1;

      if (specialAttack == 5) {
        specialAttack = 0;
      }
      if (specialAttack == 4) {
        //special attack does 3 damage
        boss.health = boss.health - 3;
      }
    }

    //changes level when boss is defeated
    if (boss.health <= 0) {
      bossLevelClear = true;
      level++;
    }

    //player loses
    if (player.health == 0) {
      gameOver = true;
      level = -2;
    }
  }
  if (level == 5) {
    //End game dialogue
    bossLevelClear = true;
    background(endGameScreen);
    textSize(24);
    textAlign(CENTER);
    stroke("black");
    strokeWeight(2);
    fill("#00FFE7");
    text(
      "Octo is defeated,\nyour courage and intuition has taken you far.\nYet there is still some distance left to travel.\nYou walk towards the sunrise.",
      width / 2,
      height / 2
    );
    textSize(50);
    text("→", width / 2, height / 2 + 200);
    // //debugging
    // text('height: ' + height, 300, 300);
    // text('width: ' + width, 300, 400);
    player.makeBody();
    player.healthBar();
    player.specialBar();
    player.movement();
    if (player.playerXPosition == width - player.body) {
      level = level + 1;
    }
  }
  if (level >= 6) {
    background(endGameScreen);
    textSize(24);
    textAlign(CENTER);
    stroke("black");
    strokeWeight(2);
    fill("#00FFE7");
    text(
      "The world is quiet and the air is still.\nAs the world is now able to rest, your journey ends...",
      width / 2,
      height / 2
    );
    textSize(50);
    text("THE END", width / 2, height / 2 + 100);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    //Skip to next level button
    level = level + 1;
    sounds();
  }
  if (keyCode === BACKSPACE) {
    //Go back a level
    level = level - 1;
  }
}

function sounds() {
  if (level == 1) {
    level1Music.play();
    level1Music.setVolume(0.5);
  } 
  if(level == 2) {
    level2Music.play();
    level2Music.setVolume(0.5);
    level1Music.stop();  
  }
  if (level == 4){
    bossMusic.play();
    bossMusic.setVolume(0.5);
    level2Music.stop();
  }
  if(bossLevelClear == true){
    bossMusic.stop();
  }
  if(gameOver == true){
    level1Music.stop();
    level2Music.stop();
    bossMusic.stop();
  }    
}

class Enemy {
  constructor(
    health,
    enemyXPosition,
    enemyYPosition,
    enemyArmSizeHeight,
    enemyArmSizeWidth,
    body,
    arm
  ) {
    this.health = health;
    this.enemyXPosition = enemyXPosition;
    this.enemyYPosition = enemyYPosition;
    this.enemyArmSizeHeight = enemyArmSizeHeight;
    this.enemyArmSizeWidth = enemyArmSizeWidth;
    this.body = body; //body will be a square
    this.arm = arm; //arm will only appear when enemy is attacking
  }

  makeBody() {
    if (this.attack() == true) {
      image(
        enemySpriteAttack,
        this.enemyXPosition - 90,
        this.enemyYPosition - 80,
        200,
        200
      );
    } else {
      image(
        enemySprite,
        this.enemyXPosition - 90,
        this.enemyYPosition - 80,
        200,
        200
      );
    }
    //hide hit box
    noFill();
    noStroke();
    rect(this.enemyXPosition, this.enemyYPosition, this.body, this.body);
  }

  movement() {
    if (this.enemyXPosition <= 0) {
      this.enemyXPosition = width;
    } else {
      this.enemyXPosition = this.enemyXPosition - enemyMovementSpeed;
    }
  }
  attack() {
    //hide hit box
    noFill();
    noStroke();
    if (
      //only attacks at certain zones on the screen
      (this.enemyXPosition >= zone1Start && this.enemyXPosition <= zone1End) ||
      (this.enemyXPosition >= zone2Start && this.enemyXPosition <= zone2End) ||
      (this.enemyXPosition >= zone3Start && this.enemyXPosition <= zone3End)
    ) {
      this.arm = rect(
        this.enemyXPosition - 20,
        this.enemyYPosition + 10,
        this.enemyArmSizeHeight,
        this.enemyArmSizeWidth
      );
      return true;
    }
    return false;
  }
}

class Player {
  constructor(
    health,
    playerXPosition,
    playerYPosition,
    playerArmSizeHeight,
    playerArmSizeWidth,
    body,
    arm
  ) {
    this.health = health;
    this.playerXPosition = playerXPosition;
    this.playerYPosition = playerYPosition;
    this.playerArmSizeHeight = playerArmSizeHeight;
    this.playerArmSizeWidth = playerArmSizeWidth;
    this.body = body; //body will be a square
    this.arm = arm; //arm will only appear when enemy is attacking
  }

  makeBody() {
    //hide hit box
    noStroke();
    noFill();
    rect(this.playerXPosition, this.playerYPosition, this.body, this.body + 80);
    if (this.attack() == true && specialAttack != 3) {
      image(
        playerAttackSprite,
        this.playerXPosition - 100,
        this.playerYPosition - 50,
        200,
        200
      );
    } else if (this.attack() == true && specialAttack == 3) {
      image(
        playerSpecialSprite,
        this.playerXPosition - 200,
        this.playerYPosition - 150,
        400,
        400
      );
    } else {
      image(
        playerSprite,
        this.playerXPosition - 100,
        this.playerYPosition - 50,
        200,
        200
      );
    }
  }

  healthBar() {
    fill("orange");
    stroke("white");
    rect(100, 100, 10 * this.health, 10);
  }

  specialBar() {
    stroke("white");
    if (specialAttack == 0 || specialAttack == 4) {
      noFill();
      rect(100, 120, 30, 10);
    }
    if (specialAttack < 3) {
      fill("yellow");
      rect(100, 120, 10 * specialAttack, 10);
    }
    if (specialAttack == 3) {
      fill("green");
      rect(100, 120, 30, 10);
    }
  }

  movement() {
    if (keyIsDown(UP_ARROW)) {
      this.playerYPosition = this.playerYPosition - playerMovementSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.playerYPosition = this.playerYPosition + playerMovementSpeed;
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.playerXPosition = this.playerXPosition - playerMovementSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.playerXPosition = this.playerXPosition + playerMovementSpeed;
    }
  }

  attack() {
    //hide hit boxes
    noFill();
    noStroke();
    if (keyCode === 32) {
      this.arm = rect(
        this.playerXPosition + 20,
        this.playerYPosition + 40,
        this.playerArmSizeHeight,
        this.playerArmSizeWidth
      );
      return true;
    }

    return false;
  }
}

class Octo {
  constructor(health, octoXPosition, octoYPosition, body) {
    this.health = health;
    this.octoXPosition = octoXPosition;
    this.octoYPosition = octoYPosition;
    this.body = body;
  }

  makeBody() {
    rectMode(CENTER);
    image(
      bossSprite,
      this.octoXPosition - 100,
      this.octoYPosition - 50,
      200,
      100
    );
    //hide hit box
    noStroke();
    noFill();
    rect(this.octoXPosition, this.octoYPosition, this.body, this.body);
  }

  //Octo has 20 health
  healthBar() {
    fill("red");
    rect(width - 200, 200, 10 * -this.health, 10);
  }

  movement() {
    if (this.octoXPosition == bossX && this.octoYPosition == bossY) {
      this.octoXPosition = this.octoXPosition - bossMovementSpeed;
    }

    if (this.octoXPosition <= 0) {
      this.octoXPosition = width;
      this.octoYPosition = random(300, height);
    }
  }

  attack() {
    if (
      //only attacks at certain zones on the screen
      (this.octoXPosition >= zone1Start && this.octoXPosition <= zone1End) ||
      (this.octoXPosition >= zone2Start && this.octoXPosition <= zone2End) ||
      (this.octoXPosition >= zone3Start && this.octoXPosition <= zone3End)
    ) {
      image(
        bossSpriteAttack,
        this.octoXPosition - 200,
        this.octoYPosition - 50,
        200,
        100
      );
      //hide hit box
      noStroke();
      noFill();
      rect(this.octoXPosition - 100, this.octoYPosition, this.body, this.body);
      return true;
    }
    return false;
  }
}
