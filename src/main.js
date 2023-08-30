import config from "./site.config.js";
//import "./spa.js";

const nav = document.querySelector(".nav-progress");
const navTop = document.querySelector(".nav-top");
const projects = document.querySelector("div.projects");
const frontGrid = document.querySelector("#front-grid");
const frontImgGrid = document.querySelector("#images-grid");

document.addEventListener("scroll", updateProgress);

function updateProgress() {
  const full = document.body.getBoundingClientRect();
  const progress = (document.documentElement.scrollTop || document.body.scrollTop) / (full.height - window.innerHeight) * 100;
  nav.style.setProperty("--width", `${progress}vw`);

  if ((document.documentElement.scrollTop || document.body.scrollTop) < 600) navTop.classList.add("hidden");
  else navTop.classList.remove("hidden");
}

(function() {
  config.projects.forEach(project => {
    const ele = document.createElement("div");
    const src = project.src ?? `/src/projects/shot-${project.name}.png`;

    ele.className = "project";
    ele.id = `project-${project.name}`;

    ele.innerHTML = /*html*/`
      <img src="${src}" draggable="false">
      <div class="info">
        <h1>${project.id} - ${project.name}</h1>
        <p>${project.description}</p>
        <div class="buttons">
          ${getButtons(project)}
        </div>
      </div>
    `;

    projects.appendChild(ele);
  });

  updateProgress();
  updateFrontGrid();
})();

function getButtons(project) {
  let res = "";

  if(project.live) res += /*html*/`<a class="button fill" href=${project.live} target="_blank">View live</a>`;
  if(project.github) res += /*html*/`<a class="button" href=${project.github} target="_blank">View code</a>`;
  if(project.info) res += /*html*/`<a class="button" href=${project.info}>Meer info</a>`;

  return res;
}

// TODO: Front grid effects
function updateFrontGrid() {
  const tiles = Array.from(frontGrid.querySelectorAll("rect[--data-project]"));
  tiles.sort((a, b) => {
    const bounds = [ a.getBoundingClientRect(), b.getBoundingClientRect() ];
    const area = [ bounds[0].width * bounds[0].height, bounds[1].width * bounds[1].height ];
    if (area[0] > area[1]) return -1;
    if (area[0] < area[1]) return 1;
    return 0
  });
  
  const projectIndices = generateRandomIndices(0, config.projects.length, tiles.length);
  console.log(projectIndices);
  tiles.forEach((e, i) => {
    if (i > config.projects.length - 1) return;
    const ele = document.createElement("div");
    const scrollUpdate = () => {
      const bounds = e.getBoundingClientRect();
      ele.style.setProperty("--width", `${bounds.width - 2}px`);
      ele.style.setProperty("--height", `${bounds.height - 2}px`);
      ele.style.top = `${bounds.top + window.scrollY + 1}px`;
      ele.style.left = `${bounds.left}px`;
    }
    ele.className = "front-image-grid";
    ele.style.backgroundImage = `url("${config.projects[projectIndices[i]].src}")`;

    scrollUpdate();
    addEventListener("resize", scrollUpdate)

    frontImgGrid.append(ele);
    tiles[i].dataset.tileHasImage = ""
  })
}

function generateRandomIndices(min, max, count) {
  const _count = Math.min(max, count);
  let _res = [];

  for (let i = 0; i < _count; i++) rNum(_res, min, max);
  return _res;
}

function rNum (res, min, max) {
  let _num = Math.round(min + Math.random() * (max - min - 1));
  if (res.indexOf(_num) == -1) return res.push(_num);
  return rNum(res, min, max);
}