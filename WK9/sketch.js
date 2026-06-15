let capture;
let prevFrame;

let dots = [];
let dotSize = 20;
let cols, rows;

function setup() {
  let winHeight = windowWidth * 240 / 320;
  createCanvas(windowWidth, winHeight);
  
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();

  prevFrame = capture.get(0, 0, capture.width, capture.height);

  cols = ceil(width / dotSize);
  rows = ceil(height / dotSize);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * dotSize;
      let y = j * dotSize;
      let c = getColor(x, y);
      let cdot = new Dot(x, y, c);
      dots.push(cdot);
    }
  }
}

function getColor(x, y) {
  let cx = floor(map(x, 0, width, 0, capture.width));
  let cy = floor(map(y, 0, height, 0, capture.height));
  let index = (cx + cy * capture.width) * 4;
  let r = capture.pixels[index];
  let g = capture.pixels[index + 1];
  let b = capture.pixels[index + 2];
  let c = color(r, g, b);
  return c;
}

function draw() {
  background(245, 245, 240); 

  capture.loadPixels();
  prevFrame.loadPixels();

  for (let cdot of dots) {
    cdot.show();
    cdot.update();
    if (cdot.isMoving()) {
      cdot.d = dotSize * 2;
    }
  }

  prevFrame = capture.get(0, 0, capture.width, capture.height);
}

class Dot {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.d = dotSize / 2;
    this.c = c;
  }

  show() {
    if (this.d > dotSize / 2) {
      stroke(15, random(80, 200)); 
      strokeWeight(random(1, 2.5)); 
      noFill();

      let offset = this.d * 0.6;
      
      for (let i = 0; i < 15; i++) {
        line(
          this.x + random(-offset, offset), this.y + random(-offset, offset),
          this.x + random(-offset, offset), this.y + random(-offset, offset)
        );
      }
    }
  }

  update() {
    this.c = getColor(this.x, this.y);

    if (this.d > dotSize / 2) {
      this.d--;
    }
  }

  isMoving() {
    let cx = floor(map(this.x, 0, width, 0, capture.width));
    let cy = floor(map(this.y, 0, height, 0, capture.height));
    let index = (cx + cy * capture.width) * 4;
    let r = capture.pixels[index];
    let g = capture.pixels[index + 1];
    let b = capture.pixels[index + 2];
    let pr = prevFrame.pixels[index];
    let pg = prevFrame.pixels[index + 1];
    let pb = prevFrame.pixels[index + 2];

    let distance = dist(r, g, b, pr, pg, pb);

    if (distance > 80) {
      return true;
    } else {
      return false;
    }
  }
}