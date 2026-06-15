let vines = [];
let ripples = [];
let num = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(4, 15, 35);
}

function draw() {
	//ai 사용 
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(153, 230, 241), color(4, 15, 35), inter);
    stroke(c);
    line(0, y, width, y);
  }
  background(0, 50);
// ai 사용
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].isOut()) {
      ripples.splice(i, 1);
    }
  }

  for (let i = vines.length - 1; i >= 0; i--) {
    let c = vines[i];
    if (c.isOut()) {
      vines.splice(i, 1);
    } else {
      c.update();
      c.display();
    }
  }
}

function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
  for (let i = 0; i < num; i++) {
    let type = random(1) < 0.15 ? 'white' : 'gradient';
    vines.push(new Vine(mouseX, mouseY, random(-1, 1), random(-2, -6), type));
  }
}
// ai 사용
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 0;
    this.maxD = random(width * 0.8, width * 1.5);
   
    this.speed = random(8, 16);
  }

  display() {
    noFill();
    let r = map(this.d, 0, this.maxD, 153, 4);
    let g = map(this.d, 0, this.maxD, 230, 15);
    let b = map(this.d, 0, this.maxD, 241, 35);
    
    
    let currentAlpha = map(this.d, 0, this.maxD, 150, 0);
    
    stroke(r, g, b, currentAlpha);
    strokeWeight(2.5);
    ellipse(this.x, this.y, this.d);
    ellipse(this.x, this.y, this.d * 1.5);
    ellipse(this.x, this.y, this.d * 2);
  }

  update() {
    this.d += this.speed;
  }

  isOut() {
    return this.d > this.maxD;
  }
}

class Vine {
  constructor(_x, _y, _dx, _dy, type) {
    this.x = _x;
    this.y = _y;
    this.dx = _dx;
    this.dy = _dy;
    this.d = random(2, 60);
    this.alpha = 255;
    this.type = type;
  }

  display() {
    noStroke();
    if (this.type === 'white') {
      
      fill(255, 255, 255, this.alpha);
      ellipse(this.x, this.y, this.d, this.d);
    } else {
      let radius = max(0.1, this.d / 2);
		//ai 사용
      const grad = drawingContext.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
      
      let a = this.alpha / 255;
      grad.addColorStop(0, `rgba(153, 230, 241, ${a})`);
      grad.addColorStop(1, `rgba(4, 15, 35, ${a})`);
      
      drawingContext.fillStyle = grad;
      ellipse(this.x, this.y, this.d, this.d);
    }
  }

  update() {
    this.d *= random(.99, .999);
    
    this.dx += random(-0.1, 0.1);
    this.dy += random(-0.05, 0); 

    this.x += this.dx;
    this.y += this.dy;
    
    this.alpha -= 2.5;
    this.alpha = max(0, this.alpha);
  }

  isOut() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.alpha <= 0) {
      return true;
    } else {
      return false;
    }
  }
}