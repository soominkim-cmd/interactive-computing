let inputStr = '';
let sandChars = []; 
let accumulatedPileVolume = 0; 


let isFlipping = false;
let flipAngle = 0;
let flipThreshold = 140; 

function setup() {
  createCanvas(600, 700); 
}

function draw() {
  background(0); 

  let cx = width / 2;
  let topY = 0;         
  let bottomY = height; 
  let neckY = height / 2;
  let neckW = 34;       
  let bulbW = 200;      

  
  if (isFlipping) {
    flipAngle += 0.05; 
    
    if (flipAngle >= PI) {
      isFlipping = false;
      flipAngle = 0;
      
      for (let i = 0; i < sandChars.length; i++) {
        let p = sandChars[i];
        p.x = width - p.x;   
        p.y = height - p.y;  
        p.angle += 180;      
        
        p.isStopped = false; 
        p.scattered = false; 
        p.vy = random(1, 3); 
        p.vx = random(-1.2, 1.2); 
      }
      accumulatedPileVolume = 0; 
    }
  }

  push();
  translate(cx, neckY);
  rotate(flipAngle);
  translate(-cx, -neckY);

  
  fill(255);
  noStroke();
  beginShape();
  vertex(cx - bulbW, topY); 
  vertex(cx + bulbW, topY); 
  bezierVertex(cx + bulbW, neckY - 80, cx + neckW / 2 + 10, neckY - 30, cx + neckW / 2, neckY);
  bezierVertex(cx + neckW / 2 + 10, neckY + 30, cx + bulbW, neckY + 80, cx + bulbW, bottomY);
  vertex(cx - bulbW, bottomY); 
  bezierVertex(cx - bulbW, neckY + 80, cx - neckW / 2 - 10, neckY + 30, cx - neckW / 2, neckY);
  bezierVertex(cx - neckW / 2 - 10, neckY - 30, cx - bulbW, neckY - 80, cx - bulbW, topY);
  endShape(CLOSE);

  
  for (let i = 0; i < sandChars.length; i++) {
    if (!isFlipping) {
      sandChars[i].update();
    }
    sandChars[i].display();
  }
  pop(); 

  
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(inputStr, width / 2, 40); 

  if (!isFlipping && accumulatedPileVolume > flipThreshold) {
    isFlipping = true;
  }
}


function mousePressed() {
  sandChars = [];              
  accumulatedPileVolume = 0;   
  isFlipping = false;         
  flipAngle = 0;               
  inputStr = '';                
}

function keyTyped() {
  if (keyCode === ENTER && !isFlipping) {
    let repeatCount = 20; 
    for (let r = 0; r < repeatCount; r++) {
      for (let i = 0; i < inputStr.length; i++) {
        let ch = inputStr.charAt(i);
        let startX = width / 2 + random(-10, 10); 
        let startY = height / 2 - random(20, 250); 
        sandChars.push(new SandChar(startX, startY, ch));
      }
    }
    inputStr = ''; 
  } else if (!isFlipping) {
    inputStr += key; 
  }
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    inputStr = inputStr.substring(0, inputStr.length - 1);
  }
}

class SandChar {
  constructor(_x, _y, _c) {
    this.x = _x;
    this.y = _y;
    this.ch = _c;
    this.vx = random(-6, 6); 
    this.vy = random(1, 3); 
    this.g = 0.5; 
    this.angle = 0;
    this.isStopped = false;
    this.scattered = false; 
  }

  update() {
    if (!this.isStopped) {
      this.vy += this.g; 
      if (this.y < height / 2 - 20) {
        if (this.x < width / 2 - 15) this.vx += 0.8;
        else if (this.x > width / 2 + 15) this.vx -= 0.8;
        this.vx *= 0.9; 
      }
      this.x += this.vx;
      this.y += this.vy;
      this.angle += 8; 

      if (this.y > height / 2 + 30 && !this.scattered) { 
        this.vx += random(-5, 5); 
        this.scattered = true; 
      }
      if (this.y > height / 2 + 30) { 
        this.floorY = height - 5 - accumulatedPileVolume - random(0, 25); 
      }
      if (this.floorY && this.y > this.floorY) {
        this.y = this.floorY; 
        this.isStopped = true; 
        accumulatedPileVolume += 0.2; 
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (!this.isStopped) {
      rotate(radians(this.angle)); 
    }
    fill(0); 
    textSize(14); 
    textAlign(CENTER, CENTER);
    text(this.ch, 0, 0);
    pop();
  }
}