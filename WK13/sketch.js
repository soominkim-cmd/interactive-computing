let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/NjEVvFCl1/';
let video;
let label = "모델 로딩 중...";


let gameState = 0; // 0: 시작 화면, 1: 게임 진행 중
let bikeX;
let bikeY;
let wheelRotation = 0; 
let pedalRotation = 0; 


let speed = 0;          
let maxSpeed = 6;       
let accel = 0.12;       
let friction = 0.93;    


let btnX, btnY, btnW = 150, btnH = 50;


let rocks = [];

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', {
    flipped: true,
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  classifier.classifyStart(video, gotResult);

  
  bikeX = width / 2;
  btnX = width / 2;
  btnY = height / 2 + 60;
  
 
  initRocks();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  btnX = width / 2;
  btnY = height / 2 + 60;
  initRocks(); 
}

function draw() {
  background(0);
  
  if (gameState === 0) {
    
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(60);
    text('자전거 운전하기', width / 2, height / 2 - 40);

    
    rectMode(CENTER);
    fill(50);
    stroke(255);
    strokeWeight(2);
    rect(btnX, btnY, btnW, btnH, 10); 

    fill(255);
    noStroke();
    textSize(24);
    text('시작', btnX, btnY);

  } else if (gameState === 1) {
    
    
    
    image(video, 10, 10, 160, 120);

    
    fill(255);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);
    text('주먹 : 전진 / 손바닥: 정지', 190, 20);

   
    if (label === '전진') {
      speed += accel; 
      if (speed > maxSpeed) speed = maxSpeed; 
    } else {
      speed *= friction; 
    }

    
    bikeX += speed;
    wheelRotation += speed * 0.04; 
    pedalRotation += speed * 0.06; 

    
    if (bikeX > width + 150) bikeX = -150;

    
    let groundY = height * 0.8; 
    bikeY = groundY - 55; 

    
    fill(255);
    noStroke();
    rectMode(CORNER);
    rect(0, groundY, width, height - groundY);

    
    for (let rock of rocks) {
      
      if (millis() - rock.spawnTime < 3000) {
        fill(255);
        noStroke();
        arc(rock.x, rock.y, rock.r * 2, rock.r * 2, PI, TWO_PI);

        let frontDist = dist(bikeX + 90, bikeY, rock.x, rock.y);
        let rearDist = dist(bikeX - 90, bikeY, rock.x, rock.y);

        if (frontDist < 50 + rock.r || rearDist < 50 + rock.r) {
          gameState = 0;      
          speed = 0;          
          bikeX = width / 2;  
          break;              
        }
      } else {
        
        rock.x = random(width);
        while (abs(rock.x - bikeX) < 250) {
          rock.x = random(width);
        }
        rock.r = random(15, 30);
        rock.spawnTime = millis(); 
      }
    }

   
    drawBike(bikeX, bikeY);

   
    noStroke();
    fill(255);
    textSize(24);
    textAlign(CENTER, TOP);
    text(label, width / 2, 40);
  }
}


function mousePressed() {
  if (gameState === 0) {
    if (mouseX > btnX - btnW / 2 && mouseX < btnX + btnW / 2 &&
        mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      gameState = 1; 
      bikeX = width / 2; 
      speed = 0; 
      initRocks(); 
    }
  }
}

function gotResult(results) {
  label = results[0].label;
}


function initRocks() {
  rocks = [];
  let groundY = height * 0.8; 
  for (let i = 0; i < 1; i++) { 
    let rx = random(width);
    while (abs(rx - width / 2) < 250) {
      rx = random(width);
    }
    rocks.push({
      x: rx,
      y: groundY,
      r: random(15, 30),
      spawnTime: millis() 
    });
  }
}



function drawBike(x, y) {
  push();
  translate(x, y);

  stroke(255); 
  strokeJoin(ROUND);
  strokeCap(ROUND);

 
  let rearHub = {x: -90, y: 0};
  let frontHub = {x: 90, y: 0};
  let bb = {x: -15, y: 0}; 
  let seatTop = {x: -35, y: -90}; 
  let headTop = {x: 60, y: -90}; 

 
  strokeWeight(6);
  line(rearHub.x, rearHub.y, bb.x, bb.y); 
  line(bb.x, bb.y, seatTop.x, seatTop.y); 
  line(rearHub.x, rearHub.y, seatTop.x, seatTop.y); 
  line(seatTop.x, seatTop.y, headTop.x, headTop.y); 
  line(bb.x, bb.y, headTop.x, headTop.y); 
  line(headTop.x, headTop.y, frontHub.x, frontHub.y); 
  line(seatTop.x, seatTop.y, -40, -105); 

  // 2. 핸들바
  line(headTop.x, headTop.y, 52, -115); 
  line(52, -115, 80, -115); 

  // 3. 안장
  strokeWeight(10);
  line(-65, -107, -25, -105); 

  // 4. 중앙 크랭크
  fill(255);
  noStroke();
  ellipse(bb.x, bb.y, 35, 35); 

  // 페달
  drawPedals(bb.x, bb.y, pedalRotation);

  // 5. 바퀴
  drawWheel(rearHub.x, rearHub.y, 55, wheelRotation);
  drawWheel(frontHub.x, frontHub.y, 55, wheelRotation);

  pop();
}

function drawWheel(x, y, r, rotation) {
  push();
  translate(x, y);
  
  // 바깥쪽 타이어
  noFill();
  stroke(255);
  strokeWeight(6);
  ellipse(0, 0, r * 2, r * 2);

  // 안쪽 림
  strokeWeight(2);
  ellipse(0, 0, r * 1.6, r * 1.6);

  // 바퀴 살
  push();
  rotate(rotation);
  strokeWeight(1.5);
  let numSpokes = 16; 
  for (let i = 0; i < numSpokes; i++) {
    let angle = map(i, 0, numSpokes, 0, TWO_PI);
    line(0, 0, cos(angle) * (r * 0.8), sin(angle) * (r * 0.8));
  }
  pop();
  
 
  fill(255);
  noStroke();
  ellipse(0, 0, 14, 14);
  pop();
}

function drawPedals(x, y, rotation) {
  push();
  translate(x, y);
  rotate(rotation);
  
  // 크랭크 암
  stroke(255);
  strokeWeight(5);
  line(0, 0, 0, 25); 
  line(0, 0, 0, -25); 

  // 페달 본체
  strokeWeight(8);
  line(-10, 25, 10, 25); 
  line(-10, -25, 10, -25); 
  
  pop();
}