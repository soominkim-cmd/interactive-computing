let faceMesh;
let video;
let faces = [];

let options = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: false
};

const DW = 1792;
const DH = 1024;

const RED = "#D90B0B";
const TITLE_RED = "#A91D1D";

let cardW = 210;
let cardH = 300;

let handRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];

let state = "title";
let stateStartFrame = 0;

let opponentRank;
let selectedRank = null;
let selectedIndex = -1;
let selectedStartPose = null;

let highlightIndex = 0;
let lastScanFrame = 0;
let scanSpeed = 38;

let resultText = "";

let score = 0;
let roundCount = 0;
const maxRounds = 7;

let opponentDeck = [];
let usedPlayerRanks = [];

let blinkThisFrame = false;
let eyeWasClosed = false;
let lastBlinkFrame = 0;

let BLINK_CLOSE = 0.18;
let BLINK_OPEN = 0.23;

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  setState("title");
}

function draw() {
  background(0);

  updateBlink();
  updateGame();

  drawScaledGame();
}

function updateBlink() {
  blinkThisFrame = false;

  if (faces.length === 0) return;

  let face = faces[0];
  let k = face.keypoints;

  let leftEAR = eyeAspectRatio(k, 33, 160, 158, 133, 153, 144);
  let rightEAR = eyeAspectRatio(k, 362, 385, 387, 263, 373, 380);

  let ear = (leftEAR + rightEAR) / 2;

  if (!eyeWasClosed && ear < BLINK_CLOSE && frameCount - lastBlinkFrame > 15) {
    blinkThisFrame = true;
    eyeWasClosed = true;
    lastBlinkFrame = frameCount;
  }

  if (eyeWasClosed && ear > BLINK_OPEN) {
    eyeWasClosed = false;
  }
}

function eyeAspectRatio(k, p1, p2, p3, p4, p5, p6) {
  let horizontal = dist(k[p1].x, k[p1].y, k[p4].x, k[p4].y);
  let vertical1 = dist(k[p2].x, k[p2].y, k[p6].x, k[p6].y);
  let vertical2 = dist(k[p3].x, k[p3].y, k[p5].x, k[p5].y);

  return (vertical1 + vertical2) / (2 * horizontal);
}

function gotFaces(results) {
  faces = results;
}

function resetGame() {
  score = 0;
  roundCount = 0;

  opponentDeck = makeShuffledDeck();
  usedPlayerRanks = [];

  selectedRank = null;
  selectedIndex = -1;
  selectedStartPose = null;

  startRound();
}

function startRound() {
  if (roundCount >= maxRounds) {
    setState("gameover");
    return;
  }

  opponentRank = opponentDeck[roundCount];

  selectedRank = null;
  selectedIndex = -1;
  selectedStartPose = null;
  highlightIndex = 0;
  resultText = "";

  setState("stack");
}

function setState(newState) {
  state = newState;
  stateStartFrame = frameCount;

  if (state === "scan") {
    highlightIndex = 0;
    lastScanFrame = frameCount;
  }
}

function stateAge() {
  return frameCount - stateStartFrame;
}

function updateGame() {
  if (state === "title" || state === "gameover") {
    return;
  }

  if (state === "stack" && stateAge() > 55) {
    setState("opponent");
  }

  if (state === "opponent" && stateAge() > 60) {
    setState("fan");
  }

  if (state === "fan" && stateAge() > 70) {
    setState("scan");
  }

  if (state === "scan") {
    let available = getAvailablePlayerRanks();

    if (available.length > 0 && frameCount - lastScanFrame > scanSpeed) {
      highlightIndex = (highlightIndex + 1) % available.length;
      lastScanFrame = frameCount;
    }

    if (blinkThisFrame) {
      chooseCard();
    }
  }

  if (state === "place" && stateAge() > 45) {
    setState("reveal");
  }

  if (state === "reveal" && stateAge() > 220) {
    if (roundCount >= maxRounds) {
      setState("gameover");
    } else {
      startRound();
    }
  }
}

function chooseCard() {
  let available = getAvailablePlayerRanks();

  if (available.length === 0) return;

  selectedIndex = highlightIndex;
  selectedRank = available[selectedIndex];
  selectedStartPose = getHighlightedPose(selectedIndex, available.length);

  let myValue = rankValue(selectedRank);
  let opponentValue = rankValue(opponentRank);

  if (myValue > opponentValue) {
    resultText = "YOU WON";
    score += 10;
  } else if (myValue < opponentValue) {
    resultText = "YOU LOST";
  } else {
    resultText = "DRAW";
    score += 30;
  }

  usedPlayerRanks.push(selectedRank);
  roundCount++;

  setState("place");
}

function keyPressed() {
  if (key === " " && state === "title") {
    resetGame();
    return;
  }

  if (key === " " && state === "scan") {
    chooseCard();
    return;
  }

  if (key === " " && state === "gameover") {
    resetGame();
    return;
  }

  if (key === "r" || key === "R") {
    resetGame();
  }
}

function rankValue(rank) {
  if (rank === "A") return 11;
  return Number(rank);
}

function makeShuffledDeck() {
  let deck = handRanks.slice();

  for (let i = deck.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));

    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
}

function getAvailablePlayerRanks() {
  let available = [];

  for (let i = 0; i < handRanks.length; i++) {
    if (!usedPlayerRanks.includes(handRanks[i])) {
      available.push(handRanks[i]);
    }
  }

  return available;
}

function drawScaledGame() {
  let s = min(width / DW, height / DH);
  let ox = (width - DW * s) / 2;
  let oy = (height - DH * s) / 2;

  push();
  translate(ox, oy);
  scale(s);
  drawGame();
  pop();
}

function drawGame() {
  if (state === "title") {
    drawTitleScreen();
    return;
  }

  if (state === "gameover") {
    drawGameOverScreen();
    return;
  }

  if (state === "stack") {
    drawStackedDeck(DW / 2, 760);
  }

  if (state === "opponent") {
    drawCard(DW / 2, 190, cardW, cardH, null, false, 0, false);
    drawStackedDeck(DW / 2, 760);
  }

  if (state === "fan") {
    drawCard(DW / 2, 190, cardW, cardH, null, false, 0, false);
    drawFanCards(-1);
  }

  if (state === "scan") {
    drawTopBattleArea(false, false, true);
    drawFanCards(highlightIndex);
  }

  if (state === "place") {
    drawTopBattleArea(false, false, true);
    drawFanCards(-1);
    drawMovingSelectedCard();
  }

  if (state === "reveal") {
    drawTopBattleArea(true, true, false);
    drawFanCards(-1);
    drawResult();
  }

  drawScoreHUD();
}

function drawTitleScreen() {
  background(TITLE_RED);

  push();
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  
  // 제목을 화면 중앙보다 약간 위로 배치
  textStyle(BOLD);
  textSize(74);
  text("HIGH CARD BATTLE", DW / 2, DH / 2 - 40);

  // 안내 문구를 화면 중앙보다 약간 아래로 배치
  textStyle(NORMAL);
  textSize(28);
  text("Press SPACE to Start", DW / 2, DH / 2 + 50);
  pop();
}

function drawGameOverScreen() {
  background(0);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Georgia");

  textStyle(BOLD);
  textSize(72);
  text("GAME OVER", DW / 2, DH / 2 - 120);

  textSize(46);
  text("FINAL SCORE", DW / 2, DH / 2 - 20);

  textSize(110);
  text(score, DW / 2, DH / 2 + 90);

  textStyle(NORMAL);
  textSize(28);
  text("Press SPACE or R to restart", DW / 2, DH / 2 + 190);
}

function drawScoreHUD() {
  let shownRound = roundCount;

  if (
    state === "stack" ||
    state === "opponent" ||
    state === "fan" ||
    state === "scan"
  ) {
    onRound = roundCount + 1;
  }

  shownRound = constrain(shownRound, 1, maxRounds);

  push();
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(28);
  text("SCORE  " + score, 40, 30);

  textStyle(NORMAL);
  textSize(22);
  text("ROUND  " + shownRound + " / " + maxRounds, 40, 68);
  pop();
}

function drawTopBattleArea(opponentOpen, userOpen, showSlot) {
  let oppX = DW / 2 - 120;
  let userX = DW / 2 + 120;
  let y = 190;

  drawCard(oppX, y, cardW, cardH, opponentRank, opponentOpen, 0, false);

  if (showSlot) {
    drawEmptySlot(userX, y, cardW, cardH);
  }

  if (userOpen && selectedRank !== null) {
    drawCard(userX, y, cardW, cardH, selectedRank, true, 0, false);
  }
}

function drawEmptySlot(cx, cy, w, h) {
  push();
  rectMode(CENTER);
  noFill();
  stroke(230);
  strokeWeight(2);
  rect(cx, cy, w, h, 14);

  noStroke();
  fill(210);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(NORMAL);
  textSize(20);
  text("Blink to place your card", cx, cy);
  pop();
}

function drawResult() {
  push();
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(ITALIC);
  textSize(66);
  text(resultText, DW / 2, 525);
  pop();
}

function getFanPose(i, n) {
  let x;
  let angle;

  if (n <= 1) {
    x = DW / 2;
    angle = 0;
  } else {
    x = map(i, 0, n - 1, DW / 2 - 470, DW / 2 + 470);
    angle = map(i, 0, n - 1, -34, 34);
  }

  let y = 870 + abs(angle) * 1.6;

  return {
    x: x,
    y: y,
    angle: angle
  };
}

function getHighlightedPose(i, n) {
  let p = getFanPose(i, n);

  return {
    x: p.x,
    y: p.y - 175,
    angle: 0
  };
}

function drawFanCards(highlightIndexToDraw) {
  let available = getAvailablePlayerRanks();
  let n = available.length;

  for (let i = 0; i < n; i++) {
    if (i === highlightIndexToDraw) continue;

    let p = getFanPose(i, n);
    drawCard(p.x, p.y, cardW, cardH, available[i], true, p.angle, false);
  }

  if (highlightIndexToDraw >= 0 && highlightIndexToDraw < n) {
    let p = getHighlightedPose(highlightIndexToDraw, n);

    drawCard(
      p.x,
      p.y,
      cardW,
      cardH,
      available[highlightIndexToDraw],
      true,
      p.angle,
      true
    );
  }
}

function drawMovingSelectedCard() {
  if (selectedRank === null || selectedStartPose === null) return;

  let start = selectedStartPose;
  let end = {
    x: DW / 2 + 120,
    y: 190,
    angle: 0
  };

  let t = constrain(stateAge() / 45, 0, 1);
  t = easeOutCubic(t);

  let x = lerp(start.x, end.x, t);
  let y = lerp(start.y, end.y, t);
  let angle = lerp(start.angle, end.angle, t);

  drawCard(x, y, cardW, cardH, selectedRank, true, angle, true);
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function drawStackedDeck(cx, cy) {
  for (let i = 12; i >= 1; i--) {
    push();
    translate(cx - i * 7, cy - i * 1.2);
    rotate(radians(-1));
    drawCard(0, 0, cardW, cardH, null, false, 0, false);
    pop();
  }

  drawCard(cx, cy, cardW, cardH, null, false, 0, false);
}

function drawCard(cx, cy, w, h, rank, faceUp, angle, highlighted) {
  push();

  translate(cx, cy);
  rotate(radians(angle));

  rectMode(CENTER);

  drawingContext.shadowBlur = highlighted ? 22 : 0;
  drawingContext.shadowColor = highlighted ? "rgba(255,255,255,0.55)" : "transparent";

  fill(250);
  stroke(highlighted ? 255 : 20);
  strokeWeight(highlighted ? 3.5 : 1.5);
  rect(0, 0, w, h, 12);

  drawingContext.shadowBlur = 0;

  if (faceUp && rank !== null) {
    drawCardFace(w, h, rank);
  } else {
    drawCardBack(w, h);
  }

  pop();
}

function drawCardBack(w, h) {
  let outerPad = 14;
  let innerPad = 24;

  rectMode(CENTER);

  noFill();
  stroke(RED);
  strokeWeight(3);
  rect(0, 0, w - outerPad * 2, h - outerPad * 2, 4);

  fill(RED);
  noStroke();
  rect(0, 0, w - innerPad * 2, h - innerPad * 2, 2);

  let pw = w - innerPad * 2;
  let ph = h - innerPad * 2;
  let left = -pw / 2;
  let top = -ph / 2;

  let ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, pw, ph);
  ctx.clip();

  noFill();
  stroke(255);
  strokeWeight(3);

  let step = 22;
  let size = 10;

  for (let yy = top + 8; yy < top + ph; yy += step) {
    for (let xx = left + 10; xx < left + pw; xx += step) {
      beginShape();
      vertex(xx, yy - size);
      vertex(xx + size, yy);
      vertex(xx, yy + size);
      vertex(xx - size, yy);
      endShape(CLOSE);
    }
  }

  ctx.restore();
}

function drawCardFace(w, h, rank) {
  drawCornerText(w, h, rank);
  drawPips(w, h, rank);
}

function drawCornerText(w, h, rank) {
  push();
  fill(RED);
  noStroke();
  textFont("Georgia");
  textStyle(BOLD);
  textAlign(LEFT, TOP);

  let rankSize = rank === "10" ? 28 : 34;
  let suitSize = 24;

  textSize(rankSize);
  text(rank, -w / 2 + 14, -h / 2 + 12);

  textSize(suitSize);
  text("♦", -w / 2 + 16, -h / 2 + 45);
  pop();

  push();
  translate(w / 2 - 14, h / 2 - 12);
  rotate(PI);

  fill(RED);
  noStroke();
  textFont("Georgia");
  textStyle(BOLD);
  textAlign(LEFT, TOP);

  textSize(rank === "10" ? 28 : 34);
  text(rank, 0, 0);

  textSize(24);
  text("♦", 2, 33);
  pop();
}

function drawPips(w, h, rank) {
  let positions = [];

  if (rank === "A") {
    positions = [[0, 22, 34]];
  } else if (rank === "2") {
    positions = [[0, -74, 26], [0, 74, 26]];
  } else if (rank === "3") {
    positions = [[0, -82, 25], [0, 0, 25], [0, 82, 25]];
  } else if (rank === "4") {
    positions = [
      [-44, -78, 24],
      [44, -78, 24],
      [-44, 78, 24],
      [44, 78, 24]
    ];
  } else if (rank === "5") {
    positions = [
      [-44, -78, 24],
      [44, -78, 24],
      [0, 0, 24],
      [-44, 78, 24],
      [44, 78, 24]
    ];
  } else if (rank === "6") {
    positions = [
      [-44, -88, 23],
      [44, -88, 23],
      [-44, 0, 23],
      [44, 0, 23],
      [-44, 88, 23],
      [44, 88, 23]
    ];
  } else if (rank === "7") {
    positions = [
      [-44, -92, 22],
      [44, -92, 22],
      [0, -42, 22],
      [-44, 0, 22],
      [44, 0, 22],
      [-44, 92, 22],
      [44, 92, 22]
    ];
  } else if (rank === "8") {
    positions = [
      [-44, -96, 21],
      [44, -96, 21],
      [0, -44, 21],
      [-44, 0, 21],
      [44, 0, 21],
      [0, 44, 21],
      [-44, 96, 21],
      [44, 96, 21]
    ];
  } else if (rank === "9") {
    positions = [
      [-44, -96, 20],
      [44, -96, 20],
      [-44, -42, 20],
      [44, -42, 20],
      [0, 0, 20],
      [-44, 42, 20],
      [44, 42, 20],
      [-44, 96, 20],
      [44, 96, 20]
    ];
  } else if (rank === "10") {
    positions = [
      [-44, -98, 19],
      [44, -98, 19],
      [0, -66, 19],
      [-44, -28, 19],
      [44, -28, 19],
      [-44, 28, 19],
      [44, 28, 19],
      [0, 66, 19],
      [-44, 98, 19],
      [44, 98, 19]
    ];
  }

  noStroke();
  fill(RED);

  for (let i = 0; i < positions.length; i++) {
    let p = positions[i];
    drawDiamond(p[0], p[1], p[2]);
  }
}

function drawDiamond(x, y, size) {
  push();
  translate(x, y);

  beginShape();
  vertex(0, -size);
  vertex(size * 0.72, 0);
  vertex(0, size);
  vertex(-size * 0.72, 0);
  endShape(CLOSE);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}