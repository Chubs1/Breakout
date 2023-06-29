

const BOARDWIDTH = 600;
const BOARDHEIGHT = 700;

const numOfBricks = 100

const bricksPerRow = 10
let previousTimePaddle = 0, previousTimeBall = 0;
const colors = ["red", "green", "blue", "purple", "cyan", "grey", "white", "yellow", "pink"]

//Make the time do something then i think the numbers will line up a lot better


const ballSpeedStart = {
  x: 2,
  y: 10
}

let paddle = {
  x: 250,
  y: 680,
  size : {
    height : 10,
    width : 150
  },
  speed : 5
}

let ball = {
  x:310,
  y:630,
  speed : {
    x : 0,
    y : 1
  },
  size : {
    height : 10,
    width : 10
  }
}

let moving = false;
let isLeftPressed, isRightPressed;

let bricks = []

document.querySelector("#app").innerHTML = `
  <h1 id="text">It's Breakout!</h1>
  <canvas id="board" width="${BOARDWIDTH}" height="${BOARDHEIGHT}">
    
  </canvas>
`;

const canvas = document.querySelector("#board")

const ctx = canvas.getContext("2d")

const destroyBrick = index => {
  bricks.splice(index, 1)
}

const clearBoard = () => {
  ctx.clearRect(0, 0, BOARDWIDTH , BOARDHEIGHT);
}

const movePaddle = time => {

  if(moving){
    Paddlemovement()
  }
  ctx.fillStyle = "grey"
  ctx.fillRect(paddle.x,paddle.y,paddle.size.width,paddle.size.height)

}

const Paddlemovement = () => {
  if((paddle.x >= 0 - paddle.speed || paddle.speed > 0) && (paddle.x <= BOARDWIDTH - paddle.size.width - paddle.speed || paddle.speed < 0)){
  paddle.x += paddle.speed
  }
}

const Ballmovement = () => {
  ball.x += ball.speed.x
  ball.y += ball.speed.y
}

const calcRebound = () => {
  
  const change = (ball.x - paddle.x - (0.5 * paddle.size.width) ) / 30
  ball.speed.x = change * ballSpeedStart.x
  ball.speed.y = -ballSpeedStart.y
}

const ballCollision = () => {
  if(ball.x <= 0 && ball.speed.x < 0){
    ball.speed.x = -ball.speed.x
  }

  if(ball.x >= BOARDWIDTH - ball.size.width && ball.speed.x > 0){
    ball.speed.x = -ball.speed.x
  }

  if(ball.y <= 0 && ball.speed.y < 0){
    ball.speed.y = -ball.speed.y
  }

  if((ball.y >= paddle.y - ball.size.height && ball.y <= paddle.y + (paddle.size.height * 0.5)) && (ball.x >= paddle.x - ball.size.width && ball.x <= paddle.x + paddle.size.width) && ball.speed.y > 0){

    console.log("Boing")
    calcRebound()
  }
  if(ball.y > paddle.y + paddle.size.height ){
    console.log("lose")
  }
}

const moveBall = () => {
  Ballmovement()
  ctx.fillStyle = "red"
  ctx.fillRect(ball.x,ball.y,ball.size.width,ball.size.height)

}

const drawBricks = () => {
  bricks.forEach(brick => {
    ctx.fillStyle = brick.color
    ctx.fillRect(brick.x, brick.y, brick.size.width, brick.size.height)
  })
}

const brickCollision = () => {

  bricks.forEach((brick, index) => {
    if(ball.x >= brick.x && ball.x <= brick.x + brick.size.width){
      if(ball.y + ball.size.height >= brick.y && ball.y <= brick.y + ballSpeedStart.y && ball.speed.y >= 0){
        console.log("hit top")
        ball.speed.y = -ball.speed.y
        destroyBrick(index)
      } else 
      if(ball.y <= brick.y + brick.size.height && ball.y >= brick.y + brick.size.height - ballSpeedStart.y && ball.speed.y < 0){
        console.log("hit bottom")
        ball.speed.y = -ball.speed.y
        destroyBrick(index)
      }

      

      

    }
    if(ball.y >= brick.y && ball.y <= brick.y + brick.size.height){

      if(ball.x + ball.size.width >= brick.x && ball.x <= brick.x + ball.speed.x && ball.speed.x >= 0){
        console.log("hit left")
        ball.speed.x = -ball.speed.x
        destroyBrick(index)
      } else 
      if(ball.x >= brick.x + brick.size.width && ball.x <= brick.x + brick.size.width - ball.speed.x  && ball.speed.x < 0){
        console.log("hit right")
        ball.speed.x = -ball.speed.x
        destroyBrick(index)
      }
    }
    /* used to visualize the zone the ball will detect where it will hit brick
    ctx.fillStyle = "green"
    ctx.fillRect(brick.x,brick.y,ball.speed.x,brick.size.height)

    ctx.fillRect(brick.x + brick.size.width,brick.y, ball.speed.x,brick.size.height)
    ctx.fillStyle = "blue"
    ctx.fillRect(brick.x, brick.y, brick.size.width, ballSpeedStart.y)
    ctx.fillRect(brick.x, brick.y + brick.size.height - ballSpeedStart.y, brick.size.width, ballSpeedStart.y)

    
    */
    })
 
  }

const playGame = time => {
  const elapsed = time - previousTimePaddle;
  previousTimePaddle = time
  clearBoard()
  drawBricks()
  brickCollision()
  moveBall()
  movePaddle()
  ballCollision()
  

  requestAnimationFrame(playGame)
}

const generateBricks = () => {
  let k = 0
  for( let i = 0; i < 100; i++){
    for(let j = 0; j < bricksPerRow; j++){
      k++
      if(k > numOfBricks){
        return
      }
    const color = Math.floor(Math.random() * colors.length)
  bricks.push({x: 60 * j, y : 30 * i, color : colors[color], size : {height : 30, width : 60}})
  }}
}

generateBricks()
requestAnimationFrame(playGame)


document.addEventListener("keydown", event => {
  if(event.key == "d" || event.key == "ArrowRight"){
    moving = true;
    paddle.speed = 5
    isRightPressed = true;
  } 
  else if (event.key == "a" || event.key == "ArrowLeft"){
    moving = true;
    paddle.speed = -5
    isLeftPressed = true
  }
})
document.addEventListener("keyup", event => {
  if (event.key === "d" || event.key === "ArrowRight") {
    isRightPressed = false;
    paddle.speed = -5
  } else if (event.key === "a" || event.key === "ArrowLeft") {
    isLeftPressed = false;
    paddle.speed = 5
  }

  moving = isLeftPressed || isRightPressed;
})
