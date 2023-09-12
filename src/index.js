const CELL_SIZE = 10;
const DENSITY = 0.9;
const SPEED = 100;

let gridArray = [];
let speed = SPEED;

function initCanvas(cellSize) {
  const canvas = document.getElementById('app');
  let gl = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.fillStyle = '#FFFFFF';
  gl.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < canvas.width / cellSize; i++) {
    gridArray[i] = [];
    for (let j = 0; j < canvas.height / cellSize; j++) {
      gridArray[i][j] = 0;
    }
  }

  return gl;
}

function updatePixel(x, y, value) {
  gridArray[x][y] = value;
}

function paintPixel(x, y, color, cellSize) {
  gl.fillStyle = color;
  gl.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function paintGrid(cellSize) {
  for (let i = 0; i < gridArray.length; i++) {
    for (let j = 0; j < gridArray[i].length; j++) {
      if (gridArray[i][j] === 1) {
        paintPixel(i, j, '#000000', cellSize);
      } else {
        paintPixel(i, j, '#FFFFFF', cellSize);
      }
    }
  }
}

function randonizeGrid(density) {
  for (array of gridArray) {
    const arrayLength = array.length;
    const activateLineCells = Math.floor(arrayLength * density);

    for (let i = 0; i < activateLineCells; i++) {
      const randomIndex = Math.floor(Math.random() * arrayLength);
      array[randomIndex] = 1;
    }
  }
}

function countAliveNeighbors(x, y) {
  let nw = 0;
  let n = 0;
  let w = 0;
  let ne = 0;
  let e = 0;
  let sw = 0;
  let s = 0;
  let se = 0;

  const canCountNorth = y > 0;
  const canCountSouth = y < gridArray[x].length - 1;
  const canCountWest = x > 0;
  const canCountEast = x < gridArray.length - 1;

  if ((canCountWest && canCountNorth) && (canCountEast && canCountSouth)) {
    nw = gridArray[x - 1][y - 1];
    n = gridArray[x][y - 1];
    w = gridArray[x - 1][y];
    ne = gridArray[x + 1][y - 1];
    e = gridArray[x + 1][y];
    sw = gridArray[x - 1][y + 1];
    s = gridArray[x][y + 1];
    se = gridArray[x + 1][y + 1];
  } else if (canCountNorth && canCountSouth && canCountEast) {
    n = gridArray[x][y - 1];
    e = gridArray[x + 1][y];
    s = gridArray[x][y + 1];
    ne = gridArray[x + 1][y - 1];
    se = gridArray[x + 1][y + 1];
  } else if (canCountWest && canCountEast && canCountSouth) {
    w = gridArray[x - 1][y];
    e = gridArray[x + 1][y];
    s = gridArray[x][y + 1];
    sw = gridArray[x - 1][y + 1];
    se = gridArray[x + 1][y + 1];
  } else if (canCountWest && canCountNorth && canCountEast) {
    w = gridArray[x - 1][y];
    n = gridArray[x][y - 1];
    e = gridArray[x + 1][y];
    nw = gridArray[x - 1][y - 1];
    ne = gridArray[x + 1][y - 1];
  } else if (canCountSouth && canCountNorth && canCountWest) {
    s = gridArray[x][y + 1];
    n = gridArray[x][y - 1];
    w = gridArray[x - 1][y];
    sw = gridArray[x - 1][y + 1];
    nw = gridArray[x - 1][y - 1];
  } else if (canCountNorth && canCountEast) {
    n = gridArray[x][y - 1];
    e = gridArray[x + 1][y];
    ne = gridArray[x + 1][y - 1];
  } else if (canCountNorth && canCountWest) {
    n = gridArray[x][y - 1];
    w = gridArray[x - 1][y];
    nw = gridArray[x - 1][y - 1];
  } else if (canCountSouth && canCountEast) {
    s = gridArray[x][y + 1];
    e = gridArray[x + 1][y];
    se = gridArray[x + 1][y + 1];
  } else if (canCountSouth && canCountWest) {
    s = gridArray[x][y + 1];
    w = gridArray[x - 1][y];
    sw = gridArray[x - 1][y + 1];
  }

  return nw + n + w + ne + e + sw + s + se;
}

// Uma célula viva morre se tiver menos de dois vizinhos vivos.
// Uma célula viva com dois ou três vizinhos vivos sobrevive para a próxima geração.
// Uma célula viva com mais de três vizinhos vivos morre.
// Uma célula morta será trazida de volta à vida se tiver exatamente três vizinhos vivos.
function calculateGameOfLife() {
  const newGridArray = [];

  for (let i = 0; i < gridArray.length; i++) {
    newGridArray[i] = [];
    for (let j = 0; j < gridArray[i].length; j++) {
      const cell = gridArray[i][j];
      const isAlive = cell === 1;
      const aliveNeighbors = countAliveNeighbors(i, j); // Implemente a função countAliveNeighbors.

      if (isAlive) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          newGridArray[i][j] = 0;
        } else {
          newGridArray[i][j] = 1;
        }
      } else {
        if (aliveNeighbors === 3) {
          newGridArray[i][j] = 1;
        } else {
          newGridArray[i][j] = 0;
        }
      }
    }
  }

  gridArray = newGridArray;
}

let animationFrame = null;
function onClickStart(e) {
  e.preventDefault();
  e.stopPropagation();

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  const speedEl = document.getElementById('speed');
  if (speedEl) {
    speed = speedEl.value > 0 ? speedEl.value : SPEED;
  }

  let cellSize = CELL_SIZE;
  const cellSizeEl = document.getElementById('cell-size');
  if (cellSizeEl) {
    cellSize = cellSizeEl.value > 0 ? cellSizeEl.value : cellSize;
  }

  let density = DENSITY;
  const densityEl = document.getElementById('density');
  if (densityEl) {
    density = densityEl.value > 0 ? densityEl.value : density;
  }

  initCanvas(cellSize);
  randonizeGrid(density);
  animationFrame = requestAnimationFrame((time) => run(cellSize, time));
}

let lastRun = 0;
function run(cellSize, time) {
  if (time - lastRun > speed || lastRun === 0) {
    paintGrid(cellSize);
    calculateGameOfLife();
    lastRun = time;
  }

  animationFrame = requestAnimationFrame((time) => run(cellSize, time));
}

const gl = initCanvas(CELL_SIZE);
randonizeGrid(DENSITY);
animationFrame = requestAnimationFrame((time) => run(CELL_SIZE, time));