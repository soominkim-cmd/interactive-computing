let colors = ['#54E6D4','#101516'];

let numOfArcs = 2;
let wd = 50;

let rings = [];
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  cols = ceil(width/wd) + 1;
  rows = ceil(height/wd) + 1;

  for(let i=0; i<cols; i++) {
    for(let j=0; j<rows; j++) {
      let x = i*wd;
      let y = j*wd;
      rings.push(new Ring(x, y, wd));
    }
  }
}

function draw() {
  background('#101516');

  for(let ring of rings) {
    ring.show();
    ring.update();
  }
}

function mousePressed() {
  colors.reverse();
}

class Ring {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.rSeed = random(1, 10000);
    this.rad = 0;
    this.lineRad = 0; 
    this.currentLen = w * 0.35;
    this.darkness = 1;
  }

  show() {
    randomSeed(this.rSeed);
    for (let n = numOfArcs; n > 0; n--) {
      let seed = random(1, 10000);
      randomSeed(seed);

      push();
      translate(this.x, this.y);
      rotate(random(PI * 2) + this.rad);
      
      let baseC = color(random(colors));
      let r = red(baseC) * this.darkness;
      let g = green(baseC) * this.darkness;
      let b = blue(baseC) * this.darkness;
      fill(r, g, b);
      
      if (n === 2) {
        let d = n * (this.w / numOfArcs);
        circle(0, 0, d);
      }
      pop();
    }

    push();
    translate(this.x, this.y);
    rotate(this.lineRad);
    
    let baseLineC = color(random(colors));
    let rLine = red(baseLineC) * this.darkness;
    let gLine = green(baseLineC) * this.darkness;
    let bLine = blue(baseLineC) * this.darkness;
    
    stroke(rLine, gLine, bLine); 
    strokeWeight(3.5);      
    strokeCap(ROUND);       
    line(0, 0, this.currentLen, 0); 
    pop();
  }

  update() {
    this.rad += PI/180;
    this.lineRad = atan2(mouseY - this.y, mouseX - this.x);

    let distance = dist(this.x, this.y, mouseX, mouseY);
    let maxdistance = dist(0, 0, width, height);
    
    this.currentLen = map(distance, 0, maxdistance, this.w * 0.35, 0);
    
    let ratio = map(distance, 0, maxdistance, 1, 0);
    this.darkness = pow(ratio, 4); 
  }
}
