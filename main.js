const board = [];
const rows = 8;
const columns = 8;

const minesCount = 10;
const minesLocation = [];

const messageEl = document.querySelector('h2');
const playAgainBtn = document.getElementById("play-again");

playAgainBtn.addEventListener('click', resetGame);

let tilesClicked = 0;
let flagEnabled = false;
let winner;

init();

function init() {
    startGame();
}



function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();
    
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    
    console.log(board);
    renderControls();
}
function setMines() {

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
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

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            tile.removeEventListener("click", clickTile);
        }
    }
    board.length = 0;
    document.getElementById("board").innerHTML = "";
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
          img = document.createElement('img');
          img.src = 'honey2.png';
          img.alt = 'honey';
          img.className = 'honey-icon';
          tile.appendChild(img);
        } else {
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
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
       checkMine(r, c);

      if (tilesClicked == rows * columns - minesCount) {
        winner = 1;
        renderMessage('You Win!');
        renderControls();
      }
}

function revealMines() {
    winner = -1;
    renderMessage('You Lose!');
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = '';
                
                const mineImg = new Image();
                mineImg.src = 'grizzly1.png';
                mineImg.style.width = '70px';
                mineImg.style.height = '40px';
                tile.appendChild(mineImg);
                tile.style.backgroundColor = "orange";
            }
        }
    }
    renderControls();
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked");

    tilesClicked += 1;
    let minesFound = 0;

    
    minesFound += checkTile(r-1, c-1);    
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      

   
    minesFound += checkTile(r, c-1);       
    minesFound += checkTile(r, c+1);        


    minesFound += checkTile(r+1, c-1);      
    minesFound += checkTile(r+1, c);        
    minesFound += checkTile(r+1, c+1);      

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        
        checkMine(r-1, c-1);    
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    

        
        checkMine(r, c-1);      
        checkMine(r, c+1);      

        
        checkMine(r+1, c-1);    
        checkMine(r+1, c);      
        checkMine(r+1, c+1);    
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        renderMessage();
        renderControls();
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}