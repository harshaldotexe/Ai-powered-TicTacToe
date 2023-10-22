let humanPlayer;
let AI;
let player;
let grid = [];
let isGameOver = false;
//possible winning combos;
// const winCombos = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
// ]
//start of game
start();
function show(){
    const messageContent = document.querySelector('.message-container');
    messageContent.classList.add('remove');
    const boardContent = document.querySelector('.board');
    boardContent.classList.add('remove');
}
function hide(){
    const selectionContent = document.querySelector('.selection-container');
    selectionContent.classList.add('remove');
    const boardContent = document.querySelector('.board');
    boardContent.classList.remove('remove');
}
function start(){
   show();
   for(let i=0;i<9;i++) grid.push(i);
       ///Now Selecting wether to take O or X;
    const SelectPlayer = e => {
        //We got the human player here
      humanPlayer = e.target.id;
      AI = (humanPlayer == 'O') ? 'X':'O';
      player = (humanPlayer == 'X')? humanPlayer: AI;
      if(player === AI) AIfunc();
      hide();
    }
    
    let selectionbtns = document.querySelectorAll('.play');
    for(btn of selectionbtns){
        btn.addEventListener('click', SelectPlayer);   
    }
}

for(let i=0;i<9;i++){
    let selectedTile = document.querySelector(`.box-${i}`);
    selectedTile.setAttribute('id',i); 
    selectedTile.addEventListener('click', turn);
    
}
console.log(typeof grid[1])
function turn(box){
    console.log('clicked');
    const boxEL = document.getElementById(box.target.id);
    console.log(boxEL);
    if(isGameOver === false && boxEL.textContent === ''){
    changeTurn(box.target.id,humanPlayer);
    // player = (player === AI)? humanPlayer : AIfunc();
    AIfunc();
}
    
}

function changeTurn(boxLoc,player){
    
    const box = document.getElementById(boxLoc);
    box.textContent = player;
    box.classList.remove('empty');
    console.log(player);
    grid[boxLoc] = player;
    let winner = ckeckForWin(grid,player);
    if(isTie()){
        console.log(`Its tie`)
        gameOver(null, true)
    }
    console.log(winner);
    if(winner){
        console.log(player);
        gameOver(player,false);
    }
}

//To check possible game win combos
function ckeckForWin(grid,player){
    console.log(grid);
    //Checking along rows
    let j = 0;
    for(let i=0;i<3;i++){
        if((grid[j] === player && grid[j+1] === player && grid[j+2] === player)) return true;
        j += 3;
    }
    // Checking along columns;
    for(let i=0;i<3;i++){
        if((grid[i] === player && grid[i+3] === player && grid[i+6] === player)) return true;
    }
    //Checking along diagonal
    if((grid[0] === player && grid[4] === player && grid[8] === player) ||
    (grid[2] === player && grid[4] === player && grid[6] === player)) return true;

    return false;
}

function gameOver(player, tie){
    isGameOver = true;
    console.log('tie');
    if(!tie){
    const messageContent = document.querySelector('.message-container');
    const message = document.querySelector('.message-container h3');
    messageContent.classList.remove('remove');
    message.textContent = (player === AI) ?'You Lost!' : 'You Win!' 
    const restart = document.getElementById('restart');
    console.log(restart);
    restart.addEventListener('click', Restart);
    }else{
        const messageContent = document.querySelector('.message-container');
    const message = document.querySelector('.message-container h3');
    messageContent.classList.remove('remove');
    message.textContent = `It's a Tie!` ;
    const restart = document.getElementById('restart');
    console.log(restart);
    restart.addEventListener('click', Restart);
    }

}
//Check for tie
function isTie() {
    for(let i=0;i<9;i++){
        const box = document.getElementById(i);
        if(box.textContent == '') return false;
    }
    return true;
}

function Restart(){
        isGameOver = false;
        for(let i=0;i<9;i++){
            grid[i] = i;
            const box = document.getElementById(i);
            box.textContent = '';
        }
        const messageContent = document.querySelector('.message-container');
        messageContent.classList.add('remove');
        if(player == 'O') AIfunc();
} 
//AI function
function AIfunc(){
    player = AI;
    let bestVal = -1000;
    let bestMove = -1;
    for(let i=0;i<9;i++){
        if(grid[i] !== 'O' && grid[i] !== 'X'){
            grid[i] = player
            let maxVal = minimax(grid,0,false, AI);
            grid[i] = i;
            if(maxVal > bestVal){
                bestVal = maxVal;
                bestMove = i;
            }
           

        }
    }
    console.log(bestMove);
    changeTurn(bestMove,AI)
    player = humanPlayer;
}

function isMoveLeft(){
    for(let i=0;i<9;i++){
        if(grid[i] != 'X' && grid[i] != 'O') return true;
    }
    return false;
}

function evaluate(grid, player){
    let j = 0;
    for(let i=0;i<3;i++){
        if((grid[j] === player && grid[j+1] === player && grid[j+2] === player)){
            console.log(player);
            if(player === AI) return 10;
            else return -10;
        }
        j += 3;
    }
    // Checking along columns;
    for(let i=0;i<3;i++){
        if((grid[i] === player && grid[i+3] === player && grid[i+6] === player))
        if(player === AI) return 10;
        else return -10;
    }
    //Checking along diagonal
    if((grid[0] === player && grid[4] === player && grid[8] === player) ||
    (grid[2] === player && grid[4] === player && grid[6] === player)){
        if(player === AI) return 10;
        else return -10;
    }

    return 0;
}
function minimax(grid, depth, isMax, player){
    let score = evaluate(grid, player);
    console.log(score);
    if(score === 10) return score;
    if(score === -10) return score;

    if(isMoveLeft(grid) === false) return 0;

    if(isMax){
        let best = -1000;
        for(let i=0;i<9;i++){
            if(grid[i] !== 'O' && grid[i] !== 'X'){
                grid[i] = AI;
                best = Math.max(best, minimax(grid, depth+1, !isMax, AI));
                grid[i] = i;
            }
        }
        return best;
    }else{
        let best = 1000;
        for(let i=0;i<9;i++){
            if(grid[i] !== 'O' && grid[i] !== 'X'){
                grid[i] = humanPlayer;
                best = Math.min(best, minimax(grid, depth+1, !isMax, humanPlayer));
                grid[i] = i;
            }
        }
        return best;
        
    }
}