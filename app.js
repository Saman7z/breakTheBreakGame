// vars
let name = document.getElementById("name");
const sideBar = document.querySelector(".sidebar-container");
const changeThemeBtn = document.getElementById("change-theme");
const canvas = document.getElementById("canvas");
let highScore = document.getElementById("high-score");
let score = 0;
const ctx = canvas.getContext("2d");
//console.log(ctx)
// Ball Props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 35,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
// paddle Props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 6,
  dx: 0,
};
// Brick Props
const brickProp = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
const brickRowCount = 9;
const brickColumnCount = 6;
//creating Bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickProp.w + brickProp.padding) + brickProp.offsetX;
    const y = j * (brickProp.h + brickProp.padding) + brickProp.offsetY;
    bricks[i][j] = { x, y, ...brickProp };
  }
}
// funcs

// DROW BALL
const drawTheBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "rgb(255, 139, 44)";
  ctx.fill();
  ctx.closePath();
};

//DRAW Paddle
const drawThePaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "rgb(255, 79, 146)";
  ctx.fill();
  ctx.closePath();
};

const DrawScore = () => {
  ctx.font = "20px Arial";
  ctx.fillText(`Score : ${score}`, canvas.width - 100, 30);
};

// Draw Bricks

const drawBricks = () => {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "rgb(87, 216, 13)" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};
// moving paddle
const movePaddle = () => {
  paddle.x += paddle.dx;
  // walls
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
};
// SLIDE BAr

const showtheSideBar = () => {
  sideBar.classList.add("sidebar-show");
};
const closetheSideBar = () => {
  sideBar.classList.remove("sidebar-show");
};
const changeTheme = () => {
  // document.documentElement.style.setProperty()
  //console.log(changeThemeBtn.innerText == "Light");
  if (changeThemeBtn.innerText == "Light") {
    document.documentElement.style.setProperty("--dark-color", "#fff");
    document.documentElement.style.setProperty(
      "--light-color",
      "rgb(58, 56, 56)"
    );
    document.documentElement.style.setProperty(
      "--pink-color",
      "rgb(205, 255, 87)"
    );
    changeThemeBtn.innerText = "Dark";
  } else {
    document.documentElement.style.setProperty(
      "--dark-color",
      "rgb(58, 56, 56)"
    );
    document.documentElement.style.setProperty("--light-color", "#fff");
    document.documentElement.style.setProperty(
      "--pink-color",
      "rgb(255, 79, 146)"
    );
    changeThemeBtn.innerText = "Light";
  }
};

//key down function
const keyDown = (e) => {
  //console.log(paddle);
  if (e.key == "Right" || e.key == "ArrowRight") {
    // console.log(e.key);
    paddle.dx = paddle.speed;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    paddle.dx = -paddle.speed;
    // console.log(e.key);
  }
};
//key up function
const keyUp = (e) => {
  if (
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
};
//showAllBricks func
const showAllBricks = () => {
  bricks.forEach((col) => {
    col.forEach((item) => (item.visible = true));
  });
};

// increase score func
const increaseScore = () => {
  score++;
  //totalScore += score;
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
  //saveData(score)
};
//saveData 
const saveData = (score) => {
  let data = localStorage.getItem("data");
  let newData = { name: name.value, score: score };
  formattedData = JSON.parse(data)
 
  if (formattedData != null) {
    //console.log('noy null')
    newAdd = [...formattedData, {name:name.value, score: score}]
    //formattedData.push(newData);
    localStorage.setItem("data",JSON.stringify(newAdd));
  } else {
    //console.log("object")
    data = [];
    data.push(newData);
    localStorage.setItem("data", JSON.stringify(data));
  }
}
// move Ball func
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // wall collision on x = right and left wall
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  // wall collison on y axis top and bot wall
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // collision with paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }
  //brick collision
  bricks.forEach((col) => {
    col.forEach((item) => {
      if (item.visible) {
        if (
          ball.x - ball.size > item.x &&
          ball.x + ball.size < item.x + item.w &&
          ball.y + ball.size > item.y &&
          ball.y - ball.size < item.y + item.h
        ) {
          ball.dy *= -1;
          item.visible = false;
          increaseScore();
        }
      }
    });
  });
  // Lose on bottom
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    //score = 0;
    gameOver();
    saveData(score)
  }
};
// DrAW init
const Draw = () => {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTheBall();
  drawThePaddle();
  DrawScore();
  drawBricks();
};
// update canvas
const update = () => {
  movePaddle();
  moveBall();
  Draw();
  requestAnimationFrame(update);
};
const resetTheGame = () => {
  location.reload();
  document.getElementById("start-btn").click();
};
const gameOver = () => {
  ball.x = ball.dx;
  ball.y = ball.dy;
  document.querySelector(".reStart-btn-container").style.display = "block";

 
};
const startTheGame = () => {
  if (name.value.trim() != "") {
    document.querySelector(".score-board-container").style.display = "none"
    document.getElementById("start-btn").style.display = "none";
    document.querySelector(".reStart-btn-container").style.display = "none";
    name.style.display = "none";
    document.getElementById("error-box").style.opacity = "0";
    document.getElementById("warning-box").style.display = "block";
    document.getElementById(
      "warning-box"
    ).innerText = `GET READY ${name.value}`;
    setTimeout(() => {
      document.getElementById("warning-box3").style.display = "block";
    }, 1000);
    setTimeout(() => {
      document.getElementById("warning-box2").style.display = "block";
    }, 2000);
    setTimeout(() => {
      document.getElementById("warning-box1").style.display = "block";
    }, 3000);
    setTimeout(() => {
      Draw();
      update();
      document.getElementById("warning-box").style.display = "none";
      document.getElementById("warning-box3").style.display = "none";
      document.getElementById("warning-box2").style.display = "none";
      document.getElementById("warning-box1").style.display = "none";
    }, 4000);
  } else {
    document.getElementById("error-box").style.opacity = "1";
    setTimeout(() => {
      document.getElementById("error-box").style.opacity = "0";
    }, 3000);
  }
};
const clearScores = () => {
  localStorage.clear();
  location.reload()
}
// events
document.getElementById("start-btn").addEventListener("click", startTheGame);
document.getElementById("reStart-btn").addEventListener("click", resetTheGame);
document.getElementById("rule-btn").addEventListener("click", showtheSideBar);
document.getElementById("close-btn").addEventListener("click", closetheSideBar);
document.getElementById("clear-btn").addEventListener("click", clearScores);
changeThemeBtn.addEventListener("click", changeTheme);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
// init funcs
//Draw();
//update();
//startTheGame()
//let m =
if (score == 54) {
  ball.x = ball.dx;
  ball.y = ball.dy;

  document.querySelector(".reStart-btn-container").style.display = "block";
  document.querySelector(".reStart-btn-title").innerText =
    "You have Won hooray!";
}
 let pageData = localStorage.getItem('data')
 //console.log(JSON.parse(pageData))
 let pageDataFormatted = JSON.parse(pageData)
 if(pageDataFormatted != null){
   document.querySelector(".score-board-container").style.display = "block"
 document.getElementById("table").innerHTML = `<tr>
  <td>name</td>
  <td>scores</td>
</tr>
  ${pageDataFormatted.map(item => `<tr>
  <td>${item.name}</td>
  <td>${item.score}</td>
</tr>`).join("")}`
 }
// highScore.innerHTML = `${pageDataFormatted.}`
// console.log(JSON.parse(pageData))
