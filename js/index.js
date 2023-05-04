const myObstacles = [];

const myGameArea = {
    startCanvas: document.createElement("canvas"),
  canvas: document.createElement("canvas"),
  frames: 0,
  start: function() {
//landing page canvas
this.startCanvas.width = 1000;
this.startCanvas.height = 600;
this.startContext = this.startCanvas.getContext("2d");
this.startCanvas.style.display = "block";
document.body.insertBefore(this.startCanvas, document.body.childNodes[0]);

// landing page game description along with start button
const backgroundImage = new Image();
    backgroundImage.src = "/images/background city landing page.png";
    backgroundImage.onload = () => {
      // Draw the image on the starting canvas
      this.startContext.drawImage(backgroundImage, 0, 0, this.startCanvas.width, this.startCanvas.height);

    this.startContext.fillStyle = "black";
    this.startContext.font = "30px Arial";
    this.startContext.fillText("Click to Start", this.startCanvas.width / 2 - 90, this.startCanvas.height / 2 - 30);
    this.startContext.font = "20px Arial";
    this.startContext.fillText("Game Description", this.startCanvas.width / 2 - 90, this.startCanvas.height / 2 + 20);


    this.startCanvas.addEventListener("click", () => {

        // to hide canvas
        this.startCanvas.style.display = "none";
        this.canvas.style.display = "block";   

    //gameCanvas
    this.canvas.width = 1000;
    this.canvas.height = 600;
    
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // call updateGameArea() every 20 milliseconds
    this.interval = setInterval(updateGameArea, 1);
})
    }
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  },
  score: function() {
    const points = Math.floor(this.frames / 5);
    this.context.font = "18px serif";
    this.context.fillStyle = "black";
    this.context.fillText(`Score: ${points}`, 350, 50);
  }
};

class Component {
  constructor(width, height, imageUrl, x, y) {
    this.width = width;
    this.height = height;
    this.imageUrl = imageUrl;
    this.x = x;
    this.y = y;
    // new speed properties
    this.speedX = 0;
    this.speedY = 0;
    this.img = new Image();
  }

  update() {
    // let ctx = myGameArea.context;
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);

    let ctx = myGameArea.context;
    this.img.src = this.imageUrl;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

const player = new Component(50, 50, "/images/supergirl.png", 0, 110);

function updateGameArea() {
  myGameArea.clear();
  // update the player's position before drawing
  player.newPos();
  player.update();
  // update the obstacles array
  updateObstacles();
  // check if the game should stop
  checkGameOver();
  // update and draw the score
  myGameArea.score();
}

myGameArea.start(); // Starting of the game

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY -= 1;
      break;
    case 40: // down arrow
      player.speedY += 1;
      break;
    case 37: // left arrow
      player.speedX -= 1;
      break;
    case 39: // right arrow
      player.speedX += 1;
      break;
  }
};

document.onkeyup = function(e) {
  player.speedX = 0;
  player.speedY = 0;
};

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  myGameArea.frames += 1;
  if (myGameArea.frames % 120 === 0) {
    let x = myGameArea.canvas.width;
    let minHeight = 50;
    let maxHeight = 200;
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    let minGap = 50;
    let maxGap = 70;
    let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    // myObstacles.push(new Component(10, height, "green", x, 0));
    myObstacles.push(
      new Component(200, x - height - gap, "/images/Apartment.png", x, height + gap)
    );
  }
}

function checkGameOver() {
  const crashed = myObstacles.some(function(obstacle) {
    return player.crashWith(obstacle);
  });

  if (crashed) {
    myGameArea.stop();
  }
}