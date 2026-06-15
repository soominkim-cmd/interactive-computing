const numLines = 50;
const contourOpacity = 90;
const contourStrokeWeight = 1.5;
const coastNoiseSpeed = 0.003;

let coastline = [];
let sandTraces = [];
let lastMouseX = 0;
let lastMouseY = 0;
let stepCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  let yStep = 5;
  let baseCoastlineX = -width * 0.2;
  let coastlineVariation = width * 1.3;

  let sVal = sin(frameCount * 0.008);
  let surgeOffset = 0;
  
  if (sVal > 0.85) { 
    let surgeNorm = map(sVal, 0.85, 1.0, 0, 1);
    surgeOffset = pow(surgeNorm, 1.5) * (width * 0.7); 
  }

  if (lastMouseX === 0 && lastMouseY === 0) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }

  let d = dist(lastMouseX, lastMouseY, mouseX, mouseY);
  if (d > 40 && (mouseX !== 0 || mouseY !== 0)) { 
    let angle = atan2(mouseY - lastMouseY, mouseX - lastMouseX);
    sandTraces.push({
      x: mouseX,
      y: mouseY,
      angle: angle,
      isLeft: stepCount % 2 === 0
    });
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    stepCount++;
  }

  noStroke();
  fill(240); 
  
  for (let i = sandTraces.length - 1; i >= 0; i--) {
    let p = sandTraces[i];
    
    let waveX = noise(frameCount * coastNoiseSpeed, p.y * 0.003) * coastlineVariation + baseCoastlineX - surgeOffset;
    
    if (p.x > waveX) {
      sandTraces.splice(i, 1);
    } else {
      push();
      translate(p.x, p.y);
      rotate(p.angle);
      
      let sideOffset = p.isLeft ? -10 : 10;
      
      ellipse(6, sideOffset, 20, 15); 
      ellipse(-6, sideOffset, 13, 10); 
      
      pop();
    }
  }

  coastline = [];
  for (let y = 0; y <= height; y += yStep) {
    let x = noise(frameCount * coastNoiseSpeed, y * 0.003) * coastlineVariation + baseCoastlineX - surgeOffset;
    coastline.push(createVector(x, y));
  }

  for (let i = 0; i < numLines; i++) {
    let offsetFactor = map(i, 0, numLines, 1.0, 10.0);

    beginShape();
    stroke(255, contourOpacity);
    strokeWeight(contourStrokeWeight);
    noFill();

    for (let j = 0; j < coastline.length; j++) {
      let p = coastline[j];
      let xOff = noise(frameCount * coastNoiseSpeed * 0.5, p.y * 0.01, i * 0.05) * 150 * offsetFactor;
      vertex(p.x + xOff, p.y);
    }

    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}