let artworks = [
  {
    title: "Artwork One",
    desc: "This is a poetic description of the first artwork. It explores light, memory, and digital texture.",
    img: "assets/images/WhatsApp Image 2 2025-12-29 at 14.25.17.jpeg",
    video: "assets/videos/video-2.mp4"
  },
  {
    title: "Artwork Two",
    desc: "A study of motion and stillness, blending organic forms with digital abstraction.",
    img: "assets/images/WhatsApp Image 3 2025-12-29 at 14.25.18.jpeg",
    video: "assets/videos/video-2.mp4"
  },
  {
    title: "Artwork Three",
    desc: "An emotional exploration of color, space, and layered perception.",
    img: "assets/images/WhatsApp Image 4 2025-12-29 at 14.25.18.jpeg",
    video: "assets/videos/video-2.mp4"
  }
];

let currentIndex = 0;
let currentImg;
let preloadedImages = [];
let hoverTimer = null;

let canvasW = 600;
let canvasH = 400;

let activeVideo = 'A';   // for crossfade system

// Preload all images
function preload() {
  for (let i = 0; i < artworks.length; i++) {
    preloadedImages[i] = loadImage(artworks[i].img);
  }
  currentImg = preloadedImages[0];
}

function setup() {
  let canvas = createCanvas(canvasW, canvasH);
  canvas.parent("canvas-container");
  imageMode(CORNER);
}

function draw() {
  background(0);

  if (currentImg) {
    image(currentImg, 0, 0, width, height);
    pixelMagnifier();
  }
}

/* Pixel Magnifier Effect (ACCURATE) */
function pixelMagnifier() {
  let lensRadius = 60;
  let zoom = 2.5;

  let scaleX = currentImg.width / width;
  let scaleY = currentImg.height / height;

  let imgMouseX = mouseX * scaleX;
  let imgMouseY = mouseY * scaleY;

  let sw = (lensRadius * 2) / zoom * scaleX;
  let sh = (lensRadius * 2) / zoom * scaleY;

  let sx = imgMouseX - sw / 2;
  let sy = imgMouseY - sh / 2;

  sx = constrain(sx, 0, currentImg.width - sw);
  sy = constrain(sy, 0, currentImg.height - sh);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(mouseX, mouseY, lensRadius, 0, TWO_PI);
  drawingContext.clip();

  image(
    currentImg,
    mouseX - lensRadius,
    mouseY - lensRadius,
    lensRadius * 2,
    lensRadius * 2,
    sx,
    sy,
    sw,
    sh
  );

  drawingContext.restore();

  noFill();
  stroke(255, 200);
  strokeWeight(2);
  circle(mouseX, mouseY, lensRadius * 2);
}

/* Hover Logic */
function startHover() {
  if (hoverTimer) return;
  hoverTimer = setInterval(nextArtwork, 3000);
}

function stopHover() {
  clearInterval(hoverTimer);
  hoverTimer = null;
}

/* Crossfade Background Video (NO FLASH) */
function crossfadeBackgroundVideo(newSrc) {
  let videoA = document.getElementById("bgVideoA");
  let videoB = document.getElementById("bgVideoB");

  let incoming = activeVideo === 'A' ? videoB : videoA;
  let outgoing = activeVideo === 'A' ? videoA : videoB;

  incoming.src = newSrc;
  incoming.load();

  incoming.oncanplay = () => {
    incoming.classList.add("active");
    outgoing.classList.remove("active");

    incoming.play();
    outgoing.pause();

    activeVideo = activeVideo === 'A' ? 'B' : 'A';
  };
}

/* Switch Artwork */
function nextArtwork() {
  currentIndex = (currentIndex + 1) % artworks.length;

  // Use preloaded images instead of async load
  currentImg = preloadedImages[currentIndex];

  document.getElementById("artTitle").innerText = artworks[currentIndex].title;
  document.getElementById("artDesc").innerText  = artworks[currentIndex].desc;

  // Smooth crossfade video instead of hard swap
  crossfadeBackgroundVideo(artworks[currentIndex].video);

  let container = document.getElementById("canvas-container");
  container.style.animation = "none";
  container.offsetHeight;
  container.style.animation = "fadeIn 0.8s ease";
}

/* Music Controls */
function toggleMusic() {
  let music = document.getElementById("bgMusic");
  let btn = document.getElementById("musicBtn");

  if (music.paused) {
    music.play();
    btn.innerText = "Pause Music";
  } else {
    music.pause();
    btn.innerText = "Play Music";
  }
}
