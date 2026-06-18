function setup() {
  const container = document.getElementById('sketch-holder');
  const size = min(windowWidth, windowHeight) / 2;
  const canvas = createCanvas(size, size);
  canvas.parent('sketch-holder');
}

function windowResized() {
  const size = min(windowWidth, windowHeight) / 2;
  resizeCanvas(size, size);
}

function draw() {
  background(255);
  noStroke();
  fill('#F5E2C8');
  rect(0,0,width/2, height/2);

  fill('#D88373')
  ellipse(width/2, height/2, width*0.6)
  fill('#17255A')
  ellipse(width/2, height/2, width*0.2)

  strokeCap(SQUARE)
  stroke('#BD1E1E')
  strokeWeight(width*0.23)
  arc(width/2, height/2, width*0.258, width*0.258, PI, PI*3/2)

  noFill()
  strokeCap(SQUARE)
  stroke('#00408E')
  strokeWeight(width*0.05)
  arc(width/2, height/2, width*0.35, width*0.35, 0 , PI*1/2)

  noStroke()
  fill('#BD1E1E')
  triangle(width/2, height/2, width/2-width*0.1, height/2, width/2, height/2-width*0.1)

  noStroke()
  fill('#BCD4DE')
  rect(width/2, 0, width/2, height/2)

  fill('#A5CCD1')
  triangle(width, 0, width*0.75, height*0.25, width*0.858, height*0.357)
  triangle(width*0.641, height*0.14, width*0.75, height*0.25, width/2, width/2)

  fill('#A0B0BF')
  triangle(width*0.642, height*0.14, width*0.598, height*0.098, width*0.699, 0 )
  triangle(width*0.598, height*0.098, width*0.556, height*0.055, width*0.5, height*0.196)
  triangle(width*0.803, height*0.5, width*0.902, height*0.402, width*0.858, height*0.357)
  triangle(width*0.902, height*0.402, width*0.944, height*0.445, width, height*0.304, width*0.924, height*0.5)
  fill('#949BA0')
  triangle(width*0.944, height*0.445, width*0.962, height*0.462, width*0.924, height*0.5)
  triangle(width*0.962, height*0.462, width*0.978, height*0.478, width, height*0.424)
  triangle(width*0.556, height*0.055, width*0.577, 0, width*0.539, height*0.040)
  triangle(width*0.539, height*0.040, width*0.5, height*0.082, width*0.523, height*0.023)

  fill('#000000')
  rect(0, height/2, width/2, height/2)

  fill('#381a84')
  ellipse(width*0.125, height*0.625, width*0.25)
  rect(0, height*0.625, width*0.25, height*0.375)
  rect(width*0.25, height*0.807, width*0.25, height*0.192)
  ellipse(width*0.438, height*0.744, width*0.125)

  fill('#000000')
  ellipse(width*0.313, height*0.744, width*0.125)
  
  fill('#31f3c2')
  ellipse(width*0.406, height*0.775, width*0.063)

  fill('#D7CF07')
  rect(width/2, height/2, width/2, height/2)

  let radialGradient = drawingContext.createRadialGradient(width*0.717, height*0.789, width*0.017, width*0.717, height*0.789, width*0.25);
  radialGradient.addColorStop(0, '#000000');
  radialGradient.addColorStop(1, '#A40606');

  drawingContext.fillStyle = radialGradient;

  beginShape();
  vertex(width*0.724, height*0.535)
  vertex(width*0.678, height*0.718)
  vertex(width*0.518, height*0.684)
  vertex(width*0.673, height*0.797)
  vertex(width*0.576, height*0.833)
  vertex(width*0.673, height*0.823)
  vertex(width*0.66, height*0.968)
  vertex(width*0.732, height*0.843)
  vertex(width*0.942, height*0.978)
  vertex(width*0.769, height*0.797)
  vertex(width*0.984, height*0.703)
  vertex(width*0.782, height*0.752)
  vertex(width*0.8, height*0.684)
  vertex(width*0.729, height*0.752)
  endShape(CLOSE)

}