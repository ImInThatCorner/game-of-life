var ctx;
var move;

function setupGame() {
    ctx = game.canvas.getContext("2d");
    game.setup();
}

function startGame() {
    game.playing = true;
    var speedSlider = document.getElementById("speedSlider");
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "inline";
    move = setInterval(function() {
        if(game.speed != 3000-speedSlider.value*30) {
            game.speed = 3000-speedSlider.value*30;
            stopGame();
            startGame();
        }
        game.makeMove();
    }, game.speed);
}

function changeSpeedP() {
    var speedP = document.getElementById("speedP");
    var speedVal = document.getElementById("speedVal");
    var speedSlider = document.getElementById("speedSlider");
    speedVal.innerHTML = ""+(3 - speedSlider.value*(3/100)).toFixed(2);
}

function stopGame() {
    game.playing = false;
    document.getElementById("stopButton").style.display = "none";
    document.getElementById("startButton").style.display = "inline";
    clearInterval(move);
}

function clearGame() {
    game.clearGame();
}

function makeMove() {
    game.makeMove();
}

function addTile(event) {
    var x = Math.floor(event.clientX/(10*game.scalar));
    var y = Math.floor(event.clientY/(10*game.scalar));
    if(game.findTile(x,y) != null)
        game.tiles.splice(game.findTile(x,y), 1);
    else
        game.tiles.push({x: x, y: y});
    game.drawCanvas();
}

function tile(x, y) {
    this.width = 10;
    this.height = 10;
    this.color = "black";
    this.x = 10*x;
    this.y = 10*y;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x*game.scalar, this.y*game.scalar, this.width*game.scalar, this.height*game.scalar);
}

function findUnit(object, array) {
    for(var i = 0; i < array.length; i++)
        if(array[i].x == object.x && array[i].y == object.y) return true;
    return false;
}

function zoomIn() { if(game.scalar < 20) game.scalar++; game.setup() }
function zoomOut() { if(game.scalar > 1) game.scalar--; game.setup() }

var game = {
    canvas: document.getElementById("gameBoard"),
    tiles: [],
    tempTiles: [],
    playing: false,
    speed: 1000,
    scalar: 2,
    // draws the canvas
    drawCanvas: function() {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
        ctx.strokeStyle = "grey";
        for(var i = 0; i < window.innerWidth; i+=(10*game.scalar)) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, window.innerHeight);
            ctx.stroke();
        }
        for(var i = 0; i < window.innerHeight; i+=(10*game.scalar)) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(window.innerWidth, i);
            ctx.stroke();
        }
        game.drawTiles();
    },
    // clears the game
    clearGame: function() {
        game.tiles = [];
        game.drawCanvas();
    },
    // makes a move
    makeMove: function() {
        var hasBeenTested = [];
        for(var i = 0; i < game.tiles.length; i++) {
            var x = game.tiles[i].x;
            var y = game.tiles[i].y;
            for(var j = -1; j <= 1; j++) {
                for(var k = -1; k <= 1; k++) {
                    var wasTested = false;
                    wasTested = findUnit({x: x+j, y: y+k}, hasBeenTested);
                    if(!wasTested) {
                        hasBeenTested.push({x:x+j,y:y+k});
                        if(game.unitStatus(x+j, y+k)) {
                            switch(game.countNeighbors(x+j,y+k)) {
                                case 0:
                                    continue;
                                case 1:
                                    continue;
                                case 4:
                                    continue;
                                case 5:
                                    continue;
                                case 6:
                                    continue;
                                case 7:
                                    continue;
                                case 8:
                                    continue;
                                default:
                                    game.tempTiles.push({x: x+j, y: y+k});
                                    break;
                            }
                        }
                        else {
                            if(game.countNeighbors(x+j,y+k) == 3) {
                                game.tempTiles.push({x: x+j, y: y+k});
                            }
                        }
                    }
                    
                }
            }
        }
        hasBeenTested = [];
        game.tiles = game.tempTiles;
        game.drawCanvas();
        game.tempTiles = [];
    },
    // finds if unit is alive or dead
    unitStatus: function(x, y) {
        var alive = false; 
        for(var i = 0; i < game.tiles.length; i++)
            if(game.tiles[i].x == x && game.tiles[i].y == y)
                alive = true;
        return alive;
    },
    // sets up the game board
    setup: function() {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
        game.drawCanvas();
        // draws the game board everytime the window is resized
        window.addEventListener('resize', function() {
            game.drawCanvas();
        });
        game.canvas.removeEventListener('mousedown', addTile);
        game.canvas.addEventListener('mousedown', addTile);
        
    },
    // draws all the tiles
    drawTiles: function() {
        game.tiles.forEach(function(item) {
            new tile(item.x, item.y);
        });
    },
    // searches for a tile and returns its index in the tiles array
    findTile: function(x, y) {
        for(var i = 0; i < game.tiles.length; i++)
            if(game.tiles[i].x == x && game.tiles[i].y == y)
                return i;
        return null;
    }   ,
    // counts how many neighbors a tile has
    countNeighbors: function(x, y) {
        var count = 0;
        for(var i = -1; i <= 1; i++){
            for(var j = -1; j <= 1; j++) {
                if(x+i >= 0 && y+j >= 0 && (i != 0 || j != 0) && game.findTile(x+i,y+j) != null)
                    count++;
            }
        }
        return count;
    }
}