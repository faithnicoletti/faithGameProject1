/* -- constants -- */
const rows = 8;
const columns = 8;

const minesCount = 10;
const minesLocation = []; //mines will be random across the board

/* --- state variablea ---*/
let tilesClicked = 0; //goal to click all tiles except the ones containing bears
let flagEnabled = false;
let winner;

/* --- cached elements --- */
const messageEl = document.querySelector('h2');
const playAgainBtn = document.getElementById("play-again");

/* --- event listeners--- */
playAgainBtn.addEventListener('click', resetGame);

/* --- functions ---*/
init();
//initialize all states and startGame()
function init() {
    board = [
        [0, 0, 0, 0, 0, 0, 0, 0], // col 0
        [0, 0, 0, 0, 0, 0, 0, 0], // col 1
        [0, 0, 0, 0, 0, 0, 0, 0], // col 2
        [0, 0, 0, 0, 0, 0, 0, 0], // col 3
        [0, 0, 0, 0, 0, 0, 0, 0], // col 4
        [0, 0, 0, 0, 0, 0, 0, 0], // col 5
        [0, 0, 0, 0, 0, 0, 0, 0], // col 6
        [0, 0, 0, 0, 0, 0, 0, 0], // col 7
    ]; 
    startGame();
}
function setMines() {
    let minesLeft = minesCount;

    while (minesLeft > 0) {
        let c = Math.floor(Math.random() * columns);
        let r = Math.floor(Math.random() * rows);
        
        let element = document.getElementById(`c${c}r${r}`);
        
        if (element.classList.contains('mine')) {
            continue;
        }
        
        element.classList.add('mine');
        minesLocation.push(`c${c}r${r}`);
        minesLeft -= 1;
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "tan";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgreen";
    }
}

function startGame() {
    setMines();
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    const tiles = document.querySelectorAll('#board>div');

    tiles.forEach((tile) => {
    tile.addEventListener('click', clickTile);
    checkTile();
  });

  renderControls();
  
}

function renderMessage(message) {
    messageEl.innerText = message;
}

function renderControls() {
    playAgainBtn.style.visibility = winner === undefined ? 'hidden': 'visible';
}

function resetGame() {
    tilesClicked = 0;
    flagEnabled = false;
    winner = undefined;
    minesLocation.length = 0;

    // Remove event listeners from tiles
    const tiles = document.querySelectorAll('#board div');

  tiles.forEach((tile) => {
    tile.removeEventListener('click', clickTile);
    tile.innerText = '';
    tile.classList.remove('mine', 'tile-clicked', 'x1', 'x2', 'x3');
    tile.innerHTML = '';
    tile.style.backgroundColor = '';
  });
    
    document.querySelector('h2').innerText = 'Avoid all the grizzly bears!';
    startGame();
}

function clickTile() {
  if (winner !== undefined || this.classList.contains("tile-clicked")) {
    return;
  }
  
  let tile = this;
    if (flagEnabled) {
      let img = tile.querySelector('img');
      if (!img) {
        // Create the img element if it doesn't exist
        img = document.createElement('img');
        img.src = 'honey2.png';
        img.alt = 'honey';
        img.className = 'honey-icon';
        tile.appendChild(img);
      } else {
        // Remove the img element if it already exists
        tile.removeChild(img);
      }
      return;
    } 
  
    if (minesLocation.includes(tile.id)) {
      revealMines();
      winner = -1;
      renderControls();
      return;
    }
  
    let coords = tile.id.split("-");
    let c = parseInt(coords[0]);
    let r = parseInt(coords[1]);
    checkMine(c, r);
    
    

    // if (result === 1) {
    //   tile.classList.add("tile-clicked");
    //   renderMessage('Game Over!');
    //   revealMines();
    //   winner = -1;
    //   renderControls();
    // } else {
    //   tile.classList.add("tile-clicked");
    //   tilesClicked++;
      if (tilesClicked === columns * rows - minesCount) {
        winner = 1;
        renderMessage('You Win!');
        renderControls();
      }
    }
  // }

function revealMines() {
    winner = -1;
    renderMessage('You Lose!');
    minesLocation.forEach((mineId) => {
      let tile = document.getElementById(mineId);
      tile.innerText = '';
  
      const mineImg = new Image();
      mineImg.src = 'grizzly1.png';
      mineImg.style.width = '70px';
      mineImg.style.height = '40px';
      tile.appendChild(mineImg);
      tile.style.backgroundColor = 'tan';
    });
    renderControls();
  }
  
  // function checkMine(c, r) {
  //       if (c < 0 || c >= columns || r < 0 || r >= rows) {
  //         return;
  //       }
  
  //       let tileElement = document.getElementById(`c${c}r${r}`);
        
  //       if (tileElement.classList.contains("tile-clicked")) {
  //         return;
  //       }
        
  //       tileElement.classList.add("tile-clicked");
  //       tilesClicked += 1;
  
  //       let minesFound = 0;
  
  //       // Check the adjacent tiles
  //       minesFound += checkTile(c - 1, r - 1); // top left
  //       minesFound += checkTile(c, r - 1); // top
  //       minesFound += checkTile(c + 1, r - 1); // top right
  //       minesFound += checkTile(c - 1, r); // left
  //       minesFound += checkTile(c + 1, r); // right
  //       minesFound += checkTile(c - 1, r + 1); // bottom left
  //       minesFound += checkTile(c, r + 1); // bottom
  //       minesFound += checkTile(c + 1, r + 1); // bottom right
  
  //       if (minesFound > 0) {
  //         tileElement.innerText = minesFound;
  //         tileElement.classList.add("x" + minesFound.toString());
  //       } else {
  //         // Check the neighboring tiles recursively
  //         checkMine(c - 1, r - 1); // top left
  //         checkMine(c, r - 1); // top
  //         checkMine(c + 1, r - 1); // top right
  //         checkMine(c - 1, r); // left
  //         checkMine(c + 1, r); // right
  //         checkMine(c - 1, r + 1); // bottom left
  //         checkMine(c, r + 1); // bottom
  //         checkMine(c + 1, r + 1); // bottom right
  //       }
  //       if (tilesClicked === columns * rows - minesCount) {
  //         document.getElementById("mines-count").innerText = "Cleared";
  //         renderMessage();
  //         renderControls();
  //       }
  
  //       return minesFound;
  //     }
  function checkMine(r, c) {
    const tileId = `c${c}r${r}`;
    const tileElement = document.getElementById(tileId);
  
    if (tileElement.classList.contains("tile-clicked")) {
      return;
    }
  
    tileElement.classList.add("tile-clicked");
    tilesClicked += 1;
  
    let minesFound = 0;
  
    // Top 3
    minesFound += checkTile(r - 1, c - 1); // Top left
    minesFound += checkTile(r - 1, c); // Top
    minesFound += checkTile(r - 1, c + 1); // Top right
  
    // Left and right
    minesFound += checkTile(r, c - 1); // Left
    minesFound += checkTile(r, c + 1); // Right
  
    // Bottom 3
    minesFound += checkTile(r + 1, c - 1); // Bottom left
    minesFound += checkTile(r + 1, c); // Bottom
    minesFound += checkTile(r + 1, c + 1); // Bottom right
  
    if (minesFound > 0) {
      tileElement.innerText = minesFound;
      tileElement.classList.add("x" + minesFound.toString());
    } else {
      // Top 3
      checkMine(r - 1, c - 1); // Top left
      checkMine(r - 1, c); // Top
      checkMine(r - 1, c + 1); // Top right
  
      // Left and right
      checkMine(r, c - 1); // Left
      checkMine(r, c + 1); // Right
  
      // Bottom 3
      checkMine(r + 1, c - 1); // Bottom left
      checkMine(r + 1, c); // Bottom
      checkMine(r + 1, c + 1); // Bottom right
    }
  
    if (tilesClicked === rows * columns - minesCount) {
      document.getElementById("mines-count").innerText = "Cleared";
      renderMessage();
      renderControls();
    }
  }
  
  function checkTile() {
    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
    if (c < 0 || c >= columns || r < 0 || r >= rows) {
      return 0;
    }
  
    let tileId = `c${c}r${r}`;
    let tileElement = document.getElementById(tileId);
  
    if (!tileElement) {
      return 0;
    }
  
    if (tileElement.classList.contains('mine')) {
      return 1;
    }
  
    return 0;
      }
    }
  }