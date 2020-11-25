import React, {
    useRef,
    useEffect,
    useState
} from 'react';

import classes from './styles.module.css';

import {
    ballRadius,
    paddleHeight,
    paddleWidth,
    brickRowCount,
    brickColumnCount,
    brickWidth,
    brickHeight,
    brickPadding,
    brickOffsetTop,
    brickOffsetLeft
} from "./variables";

interface Brick {
    [key:number]: {
        x: number
        y: number
        status: number
    }
}
interface Bricks {
    [key: number]: Brick
}

let canvas: HTMLCanvasElement;
let ctx: any;
let paddleX: number;
let bricks: Bricks  = [];
let x: number;
let y: number;
let dx = 2;
let dy = -2;

const Canvas: React.FunctionComponent = () => {
    let canvasRef = useRef < HTMLCanvasElement > (null);
    let [level, setLevel] = useState<number>(1);
    let [lives, setLives] = useState<number>(3);
    let [score, setScore] = useState<number>(0);

    const collisionDetection = () => {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (
                        x > b.x &&
                        x < b.x + brickWidth &&
                        y > b.y &&
                        y < b.y + brickHeight
                    ) {
                        dy = -dy;
                        b.status = 0;
                        setScore(++score);
                        if (score === brickRowCount * brickColumnCount * level) {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            setLevel(++level);
                            generateBricks();
                        }
                    }
                }
            }
        }
    };

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    };

    const drawPaddle = () => {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    };

    const generateBricks = () => {
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }
    }

    const drawBricks = () => {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                    let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#000000";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };

    const drawScore = () => {
        ctx.font = "16px Roboto";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: " + score, 8, 20);
    }

    const drawLevel = ()=> {
        ctx.font = "16px Roboto";
        ctx.fillStyle = "#000000";
        ctx.fillText("Level: " + level, 130, 20);
    };

    const drawLives = () => {
        ctx.font = "16px Roboto";
        ctx.fillStyle = "#000000";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLevel();
        drawLives();
        collisionDetection();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                setLives(--lives);
                if (!lives) {
                    window.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    };

    useEffect(() => {
        if (canvasRef.current) {
            canvas = canvasRef.current;
            ctx = canvas.getContext('2d');
        }
            x = canvas.width / 2;
            y = canvas.height - 30;
            window.addEventListener("mousemove", e => {
                let relativeX = e.clientX - canvas.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddleX = relativeX - paddleWidth / 2;
                }
            });
            generateBricks();
            draw();
        },[]);

    return <canvas ref={canvasRef} width='300px' height='500px' className={classes.Canvas} /> ;
}

export default Canvas;