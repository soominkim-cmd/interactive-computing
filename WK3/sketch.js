function setup() {
  const container = document.getElementById('sketch-holder');
  const size = min(windowWidth, windowHeight);
  const canvas = createCanvas(size, size);
  canvas.parent('sketch-holder');
}

function windowResized() {
  const size = min(windowWidth, windowHeight);
  resizeCanvas(size, size);
}

function draw() {
  background(255);
  noStroke();
  fill('#F5E2C8');
  rect(0,0,width/2, height/2);

  fill('#D88373')
  ellipse(300,300,600)
  fill('#17255A')
  ellipse(300, 300, 200)

  strokeCap(SQUARE)
  stroke('#BD1E1E')
  strokeWeight(230)
  arc(300, 300, 258, 258, PI, PI*3/2)

  noFill()
  strokeCap(SQUARE)
  stroke('#00408E')
  strokeWeight(50)
  arc(300, 300, 350, 350, 0 , PI*1/2)

  noStroke()
  fill('#BD1E1E')
  triangle(300, 300, 200, 300, 300, 200)

  


  noStroke()
  fill('#BCD4DE')
  rect(600,0,600)

  fill('#A5CCD1')
  triangle(1200,0, 900, 300, 1030, 430)
  triangle(770, 168,900, 300, 600, 600)

  fill('#A0B0BF')
  triangle(770, 168, 718, 118, 839, 0 )
  triangle(718, 118, 667, 66, 600, 235)
  triangle(964, 600, 1082, 482, 1030, 430)
  triangle(1082, 482,1133, 534, 1200, 365, 1109, 600)
  fill('#949BA0')
  triangle(1133, 534, 1154, 554, 1109, 600)
  triangle(1154, 554, 1174, 574, 1200, 509)
  triangle(667, 66, 692, 0, 646.5, 47.5 )
  triangle(646.5, 47.5, 600, 98, 627, 27.5)


  fill('#000000')
  rect(0,600,600)

  fill('#381a84')
  ellipse(150, 750, 300)
  rect(0, 750, 300, 450)
  rect(300, 968, 300, 230)
  ellipse(450+75, 893+75, 150)

  fill('#000000')
  ellipse(450+75-150, 893+75, 150)
  
  fill('#31f3c2')
  ellipse(337+75/2, 930+75/2, 75)




  fill('#D7CF07')
  rect(600,600,600)

	
  let radialGradient = drawingContext.createRadialGradient(860, 947, 20, 860, 947, 300);
  radialGradient.addColorStop(0, '#000000');
  radialGradient.addColorStop(1, '#A40606');

  drawingContext.fillStyle = radialGradient;


  beginShape();
  vertex(868.5,642 )
  vertex(814,861)
  vertex(621,820.5 )
  vertex(807, 956.5 )
  vertex(691.5,1000 )
  vertex(807,987.5 )
  vertex(792,1162 )
  vertex(878,1012 )
  vertex(1131,1174 )
  vertex(923,956.5 )
  vertex(1181.5,843.5)
  vertex(938,902)
  vertex(959.5,820.5)
  vertex(887.5,902 )
  endShape(CLOSE)

}