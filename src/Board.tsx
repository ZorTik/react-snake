import {useEffect, useState} from "react";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type BoardProps = {
    dimension: number;
}

export type SquareProps = {
    active: boolean;
    food?: boolean;
    vector?: string;
}

function Square({active, food}: SquareProps) {
    const commonCss = "border h-full w-[10%]";
    return active ? (
        <div className={`${commonCss} bg-black rounded`} />
    ) : (food ?? false ? (
        <div className={`${commonCss} bg-emerald-800 rounded animate-fade-in-opacity flex justify-center items-center text-emerald-950`}>
            <FontAwesomeIcon icon={solid("apple-whole")} className="w-[50%] h-[50%] drop-shadow-xl" />
        </div>
    ) : (
        <div className={commonCss} />
    ))
}

export default function Board({dimension}: BoardProps) {
    const [snakeSquares, setSnakeSquares] = useState<number[][]>([]);
    const [running, setRunning] = useState<boolean>(false);
    const [vector, setVector] = useState<string>("right");
    const [foodSquares, setFoodSquares] = useState<number[][]>([]);
    const [size, setSize] = useState<number>(3);
    const [record, setRecord] = useState<number>(0);

    const handleGameOver = (size: number) => {
        setSnakeSquares([]);
        setFoodSquares([]);

        if (size > record) {
            setRecord(size);
        }

        alert("Game over!");
    }

    useEffect(() => {
        if (!running) {
            return;
        }
        let localSnakeSquares = [[0, 4], [1, 4], [2, 4]];
        let localVector = [1, 0];
        let localFoodSquares: number[][] = [];
        let localSize = 3;
        const rerenderSnake = () => setSnakeSquares(localSnakeSquares);
        rerenderSnake();

        const tasks = [
            setInterval(() => {
                rerenderSnake();
                const squares = [...localSnakeSquares];
                const snake = squares.length < localSize
                    ? squares
                    : squares.splice(1, squares.length - 1);
                const squareToAppend = snake[snake.length - 1].map(
                    (value, index) => {
                        let newValue = value + localVector[index];
                        if (newValue < 0) {
                            newValue = 9;
                        } else if (newValue > 9) {
                            newValue = 0;
                        }
                        return newValue;
                    }
                );
                localSnakeSquares = [...snake, squareToAppend];
                rerenderSnake();
                const foodSquareStepped = localFoodSquares.find(
                    coords => coords[0] === squareToAppend[0] && coords[1] === squareToAppend[1]
                );
                if (snake.some(
                    coords => coords[0] === squareToAppend[0] && coords[1] === squareToAppend[1]
                )) {
                    setRunning(false);
                    return;
                } else if (foodSquareStepped !== undefined) {
                    localSize += 1;
                    setSize(localSize);
                    setFoodSquares(localFoodSquares.filter(s => s !== foodSquareStepped));
                }
            }, 400),
            setInterval(() => {
                if (localFoodSquares.length > 1) {
                    return;
                }
                localFoodSquares.push([
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10)
                ]);
                setFoodSquares(localFoodSquares);
            }, 2000)
        ];
        const keyDownHandler = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                localVector = [0, -1];
            } else if (event.key === 'ArrowDown') {
                localVector = [0, 1];
            } else if (event.key === 'ArrowLeft') {
                localVector = [-1, 0];
            } else if (event.key === 'ArrowRight') {
                localVector = [1, 0];
            }
            setVector(event.key.replace('Arrow', '').toLowerCase());
        };
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            tasks.forEach(clearInterval);
            document.removeEventListener('keydown', keyDownHandler);
            handleGameOver(localSize);
        }
    }, [running]);

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                setRunning(true);
            }
        });
    }, []);

    return (
        <div className={`relative`} style={{
            width: dimension,
            height: dimension,
        }}>
            {Array.from(Array(10).keys()).map(rowIndex => {
                return (
                    <div className="flex w-full h-[10%]" key={rowIndex}>
                        {Array.from(Array(10).keys()).map(colIndex => {
                            return (
                                <Square
                                    active={snakeSquares.some(coords => coords[0] === colIndex && coords[1] === rowIndex)}
                                    food={foodSquares.some(coords => coords[0] === colIndex && coords[1] === rowIndex)}
                                    vector={vector}
                                    key={rowIndex * 6 + colIndex}
                                />
                            )
                        })}
                    </div>
                )
            })}
            {!running ? <div className={`${running ? "" : "bg-neutral-100/50"} w-full h-full absolute left-0 top-0 animate-fade-in-opacity`} /> : null}
            {!running ? <p className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-neutral-800">Press <span className="rounded bg-purple-300 text-purple-600 px-2 py-1 border-b border-b-2 border-b-purple-800 animate-ping-infinite">ENTER</span> to start!</p> : null}
            {running ? (
                <div className="-translate-y-full p-4">
                    <p>Snake Size: {size}</p>
                    <p>Record: {record}</p>
                </div>
            ) : null}
        </div>
    )
}
