let rad1 = 0;
let rad2 = 0;
let steps = 0;
let dir = 1;
let incr = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#EEE7D7');
  noStroke();

  for (let x = 0; x < width; x += 72) {
    for (let y = 0; y < height; y += 101) {
      push();
      translate(x, y);
      fill('#AD3131cc');
      beginShape();
      vertex(0, 48.5);
      vertex(39.5, 0);
      vertex(72, 56.5);
      vertex(27, 100.5);
      endShape(CLOSE);
      pop();
    }
  }

  for (let x = 0; x < width; x += 240) {
    for (let y = 0; y < height; y += 240) {
      push();
      translate(x, y);
      rotate(rad2);
      fill('#B5CDD5');
      beginShape();
      vertex(-149, -177.36);
      vertex(149, -286);
      vertex(149, -161.19);
      vertex(71.6, -168.95);
      vertex(2.58, 285);
      endShape(CLOSE);
      pop();
    }
  }

  for (let x = 0; x < width; x += 190) {
    for (let y = 0; y < height; y += 190) {
      push();
      translate(x, y);
      rotate(rad1);
      fill('#AD3131');
      beginShape();
      vertex(-23.03, 78);
      vertex(20.47, 78);
      vertex(44.97, -78);
      bezierVertex(-39.06, -73.68, -50.84, -20.46, -41.15, 27.5);
      bezierVertex(-37.37, 46.21, -30.33, 64.11, -23.03, 78);
      endShape();
      fill('#EEE7D7');
      ellipse(-1 + 17, -17 + 17, 34); 
      fill('#AD3131');
      ellipse(-1 + 17, -17 + 17, 21);
      noFill();
      stroke('#EEE7D7');
      strokeWeight(5);
      line(24.49, 80.09, 95.49, -321.91);
      line(36.49, 80.09, 104.49, -311.91);
      line(48.49, 80.09, 115.49, -303.91);
      pop();
    }
  }

  let n = norm(steps, 0, 100);
  let st = easeInCubic(n);

  rad1 += (PI / 360) * st * 35;
  rad2 -= (PI / 270) * st * 35;

  steps += incr * dir;
  if (steps < 0 || steps > 100) {
    dir *= (-1);
  }
}

function easeInCubic(x) {
  return x * x * x;
}