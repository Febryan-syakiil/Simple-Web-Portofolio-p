const $ = (selector) => document.querySelector(selector);

// ==================================
// 1. INTERACTIVE LOADING SCREEN
// ==================================
const loader = $("#loader");
const progressBar = $("#progressBar");
const progressText = $("#progressText");
const loadingText = $("#loadingText");
const enterButton = $("#enterButton");

let progress = 0;
let loadingDone = false;

const loadingMessages = [
  "Preparing your experience...",
  "Loading personal data...",
  "Creating your universe...",
  "Almost ready..."
];

const loadingTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 3;
  progress = Math.min(progress, 100);

  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}%`;

  const messageIndex = Math.min(
    Math.floor(progress / 26),
    loadingMessages.length - 1
  );

  loadingText.textContent = loadingMessages[messageIndex];

  if (progress >= 100) {
    clearInterval(loadingTimer);
    loadingDone = true;
    loadingText.textContent = "Your universe is ready!";
    enterButton.hidden = false;
  }
}, 100);

enterButton.addEventListener("click", () => {
  if (!loadingDone) return;

  loader.classList.add("hide");
});

// ==================================
// 2. CHANGE PROFILE IMAGE
// ==================================
const imageUpload = $("#imageUpload");
const profileImage = $("#profileImage");
let currentImageURL = null;

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Silakan pilih file gambar.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran gambar maksimal 5 MB.");
    imageUpload.value = "";
    return;
  }

  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
  }

  currentImageURL = URL.createObjectURL(file);
  profileImage.src = currentImageURL;
});

// ==================================
// 3. EDIT BIODATA
// ==================================
const bioDialog = $("#bioDialog");
const bioForm = $("#bioForm");

$("#editBioButton").addEventListener("click", () => {
  bioDialog.showModal();
});

$("#cancelBio").addEventListener("click", () => {
  bioDialog.close();
});

bioForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bioForm);
  const name = data.get("name").trim();
  const age = data.get("age").trim();
  const location = data.get("location").trim();
  const email = data.get("email").trim();

  $("#profileName").textContent = name;
  $("#bioName").textContent = name;
  $("#bioAge").textContent = age;
  $("#bioLocation").textContent = location;
  $("#bioEmail").textContent = email;

  bioDialog.close();
});

// ==================================
// 4. ADD PROJECT
// ==================================
const projectDialog = $("#projectDialog");
const projectForm = $("#projectForm");
const projectGrid = $("#projectGrid");

$("#addProjectButton").addEventListener("click", () => {
  projectForm.reset();
  projectDialog.showModal();
});

$("#cancelProject").addEventListener("click", () => {
  projectDialog.close();
});

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(projectForm);
  const title = data.get("title").trim();
  const description = data.get("description").trim();
  const tech = data.get("tech").trim();
  const url = data.get("url").trim();

  if (!title || !description || !tech) return;

  const card = document.createElement("article");
  card.className = "card project-card";

  const number = projectGrid.children.length + 1;

  const projectNumber = document.createElement("div");
  projectNumber.className = "project-number";
  projectNumber.textContent =
    `PROJECT ${String(number).padStart(2, "0")}`;

  const icon = document.createElement("div");
  icon.className = "project-icon";
  icon.textContent = "💻";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  const tags = document.createElement("div");
  tags.className = "tags";

  tech.split(",").map(item => item.trim()).filter(Boolean)
    .forEach(item => {
      const tag = document.createElement("span");
      tag.textContent = item;
      tags.appendChild(tag);
    });

  const link = document.createElement("a");
  link.className = "project-link";
  link.textContent = "View Project ↗";

  if (url) {
    try {
      const parsedURL = new URL(url);

      if (parsedURL.protocol === "https:" ||
          parsedURL.protocol === "http:") {
        link.href = parsedURL.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.href = "#projects";
      }
    } catch {
      link.href = "#projects";
    }
  } else {
    link.href = "#projects";
  }

  card.append(
    projectNumber,
    icon,
    heading,
    paragraph,
    tags,
    link
  );

  projectGrid.appendChild(card);
  projectDialog.close();
});

// ==================================
// 5. INTERACTIVE STAR BACKGROUND
// ==================================
const canvas = $("#starCanvas");
const ctx = canvas.getContext("2d");
const starToggle = $("#starToggle");

let starsEnabled = false;
let stars = [];
let width = 0;
let height = 0;
let mouse = { x: -1000, y: -1000 };
let animationFrame;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    180,
    Math.floor((width * height) / 6500)
  );

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.7 + 0.4,
    speed: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.6 + 0.3
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  if (!starsEnabled) {
    animationFrame = 0;
    return;
  }

  for (const star of stars) {
    // Parallax mengikuti posisi cursor
    const offsetX = (mouse.x - width / 2) *
      star.speed * 0.025;

    const offsetY = (mouse.y - height / 2) *
      star.speed * 0.025;

    const x = star.x - offsetX;
    const y = star.y - offsetY;

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = `rgba(200, 215, 255, ${star.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#8b8cff";
    ctx.fill();

    // Bintang bergerak perlahan secara vertikal
    if (!reducedMotion.matches) {
      star.y -= star.speed * 0.12;

      if (star.y < -5) {
        star.y = height + 5;
        star.x = Math.random() * width;
      }
    }
  }

  ctx.shadowBlur = 0;
  animationFrame = requestAnimationFrame(drawStars);
}

function startStars() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = 0;
  drawStars();
}

starToggle.addEventListener("click", () => {
  starsEnabled = !starsEnabled;

  starToggle.textContent = starsEnabled
    ? "✦ Star Mode: ON"
    : "✦ Star Mode: OFF";

  starToggle.setAttribute(
    "aria-pressed",
    String(starsEnabled)
  );

  if (starsEnabled) {
    startStars();
  } else {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = 0;
    ctx.clearRect(0, 0, width, height);
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}, { passive: true });

window.addEventListener("touchmove", (event) => {
  if (!event.touches.length) return;

  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
}, { passive: true });

window.addEventListener("resize", () => {
  resizeCanvas();

  if (starsEnabled) {
    startStars();
  }
});

// ==================================
// 6. INITIALIZE
// ==================================
resizeCanvas();

$("#year").textContent = new Date().getFullYear();
starToggle.setAttribute("aria-pressed", "false");