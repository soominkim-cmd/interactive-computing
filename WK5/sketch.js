let bCols = ['#00B1B1', '#008080', '#114852', '#0B262B', '#040404'];
let aCols = ['#ffffff', '#00B1B1', '#008080', '#114852', '#0B262B', '#040404']
let cCols = ['#ffffff', '#00B1B1', '#008080', '#114852', '#0B262B']
let w = 200;
let cols, rows;

function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
	rectMode(CENTER);
	noLoop();

	cols = ceil(width / w) + 1;
	rows = ceil(height / w) + 1;

	drawPattern();

}

function mousePressed() {
	drawPattern();
}

function drawPattern() {
	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {
			let x = c * w;
			let y = r * w;
			drawRect(x, y, w);
			drawArc(x, y, w);
      drawArc2(x, y, w);
		}
	}
}

function drawRect(x, y, w) {
	push();
	translate(x, y);
	fill(random(bCols));
	rect(0, 0, w);
	pop();
}

function drawArc(x, y, w) {
	let halfW = w / 2;
		push();
		translate(x, y);
		fill(random(aCols));
		circle(halfW, halfW, w)
		pop();
	}

function drawArc2(x, y, w) {
  let halfW = w/2;
		push();
		translate(x, y);
		fill(random(cCols));
		circle(-halfW, -halfW, w)
		pop();
	}


function draw() {

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	cols = ceil(width / w) + 1;
	rows = ceil(height / w) + 1;

	drawPattern();

}