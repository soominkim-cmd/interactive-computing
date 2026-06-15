let img;
let flapWidth = 8; 
let range = 150;   
let flaps = [];
let cols, rows;

// 메뉴 토글 함수
function toggleMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
}

// 배경 업데이트 함수
function preload() {
  // image.PNG 파일이 없으면 생성하지 않음
  // img = loadImage('image.PNG');
}

function setup() {
  // 캔버스 컨테이너 크기 기반으로 생성
  let container = document.getElementById('sketch-container');
  let w = container.offsetWidth || 1000;
  let h = container.offsetHeight || 1000;
  
  createCanvas(w, h);
  
  // 메뉴 버튼 클릭 이벤트
  document.getElementById('hamburgerBtn').addEventListener('click', toggleMenu);
  
  // 메뉴 항목 클릭 이벤트
  document.querySelectorAll('.menu-list li').forEach(item => {
    item.addEventListener('click', () => {
      const wk = item.dataset.wk;
      window.location.href = `${window.location.origin}${window.location.pathname.replace(/\/WK8\/?$/, '')}/WK${wk}/`;
    });
  });
  
  cols = ceil(width / (flapWidth * 1.5));
  rows = ceil(height / (flapWidth * 1.5));

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * (flapWidth * 1.5);
      let y = j * (flapWidth * 1.5);
      flaps.push(new Flap(x, y));
    }
  }
}

function windowResized() {
  if (document.getElementById('sketch-container')) {
    let container = document.getElementById('sketch-container');
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    resizeCanvas(w, h);
    
    // 플랩 재설정
    flaps = [];
    cols = ceil(width / (flapWidth * 1.5));
    rows = ceil(height / (flapWidth * 1.5));
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * (flapWidth * 1.5);
        let y = j * (flapWidth * 1.5);
        flaps.push(new Flap(x, y));
      }
    }
  }
}

function draw() {
  background(0);

  // image가 있으면 표시
  if (img) {
    push(); 
    tint(255, 100); 
    image(img, 0, 0, width, height);
    pop();
  }
  
  noTint();

  for (let flap of flaps) {
    flap.update(); 
    flap.show();   
  }
}

class Flap {
  constructor(x, y) {
    this.originX = x;
    this.originY = y;
    this.x = x;
    this.y = y;
    this.rad = 0;
    this.s = 1.0;
    
    // image가 있으면 색상 가져오기, 없으면 흰색
    if (img) {
      let ix = floor(map(this.originX, 0, width, 0, img.width));
      let iy = floor(map(this.originY, 0, height, 0, img.height));
      this.c = img.get(ix, iy);
    } else {
      this.c = color(255); // 기본 흰색
    }
  }

  update() {
    let d = abs(mouseX - this.x) + abs(mouseY - this.y);

    if (d < range) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let pushForce = map(d, 0, range, 25, 0);
      this.x += cos(angle) * pushForce;
      this.y += sin(angle) * pushForce;
      
      this.rad = lerp(this.rad, angle + PI/2, 0.2);
      this.s = map(d, 0, range, 2.5, 1.0); 
    } else {
      this.x = lerp(this.x, this.originX, 0.1);
      this.y = lerp(this.y, this.originY, 0.1);
      this.rad = lerp(this.rad, sin(frameCount * 0.05 + (this.originX * 0.01)) * 0.5, 0.05);
      this.s = lerp(this.s, 1.0, 0.1);
    }

    let wave = sin(frameCount * 0.03 + this.originX * 0.01 + this.originY * 0.01) * 2;
    this.y += wave * 0.1; 
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.rad);
    scale(this.s);

    fill(this.c);
    noStroke();

    rectMode(CENTER);
    rect(0, 0, flapWidth, flapWidth ); 
    
    pop();
  }
}