import {useEffect, useState} from "react";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type BoardProps = {
    dimension: number;
    className?: string;
}

export type SquareProps = {
    active: boolean;
    head?: boolean;
    food?: boolean;
    vector?: string;
}

function Square({active, food, head}: SquareProps) {
    const commonCss = "border dark:border-gray-950 h-full w-[10%]";
    return active ? (
        <div className={`${commonCss} bg-black dark:bg-gray-400 rounded flex justify-center items-center text-gray-700 dark:text-gray-600`}>
            {head ? <FontAwesomeIcon icon={solid("user")} className="w-[50%] h-[50%] drop-shadow-xl" /> : null}
        </div>
    ) : (food ?? false ? (
        <div className={`${commonCss} bg-emerald-800 rounded animate-fade-in-opacity flex justify-center items-center text-emerald-950`}>
            <FontAwesomeIcon icon={solid("apple-whole")} className="w-[50%] h-[50%] drop-shadow-xl" />
        </div>
    ) : (
        <div className={commonCss} />
    ))
}

export default function Board({dimension, className}: BoardProps) {
    const [snakeSquares, setSnakeSquares] = useState<number[][]>([]);
    const [running, setRunning] = useState<boolean>(false);
    const [vector, setVector] = useState<string>("right");
    const [foodSquares, setFoodSquares] = useState<number[][]>([]);
    const [size, setSize] = useState<number>(3);
    const [record, setRecord] = useState<number>(0);

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
        setFoodSquares(localFoodSquares);
        setSize(localSize);

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
                    localFoodSquares = localFoodSquares.filter(s => s !== foodSquareStepped);
                    setSize(localSize);
                    setFoodSquares(localFoodSquares);
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
            }, 4000)
        ];
        const keyDownHandler = (event: KeyboardEvent) => {
            let vectorToSet;
            if (event.key === 'ArrowUp') {
                vectorToSet = [0, -1];
            } else if (event.key === 'ArrowDown') {
                vectorToSet = [0, 1];
            } else if (event.key === 'ArrowLeft') {
                vectorToSet = [-1, 0];
            } else if (event.key === 'ArrowRight') {
                vectorToSet = [1, 0];
            }
            if (vectorToSet
                && vectorToSet[0] * -1 === localVector[0]
                && vectorToSet[1] * -1 === localVector[1]) {
                // Vector is opposite, aborting
                return;
            }
            localVector = vectorToSet ?? localVector;
            setVector(event.key.replace('Arrow', '').toLowerCase());
        };
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            tasks.forEach(clearInterval);
            document.removeEventListener('keydown', keyDownHandler);
            setSnakeSquares([]);
            setFoodSquares([]);
            if (localSize > record) {
                setRecord(localSize);
            }
            alert("Game over!");
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
        <div className={`relative ${className}`} style={{
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
                                    head={snakeSquares.findIndex(coords => coords[0] === colIndex && coords[1] === rowIndex) === snakeSquares.length - 1}
                                    vector={vector}
                                    key={rowIndex * 6 + colIndex}
                                />
                            )
                        })}
                    </div>
                )
            })}
            {!running ? <div className={`${running ? "" : "bg-neutral-200/50 dark:bg-gray-950/50"} w-full h-full absolute left-0 top-0 animate-fade-in-opacity`} /> : null}
            {!running ? <p className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-neutral-800 dark:text-neutral-300">Press <span className="rounded bg-purple-300 text-purple-600 px-2 py-1 border-b-2 border-b-purple-800 animate-ping-infinite">ENTER</span> to start!</p> : null}
            {running ? (
                <div className="-translate-y-full p-4 dark:text-neutral-200">
                    <p>Snake Size: {size}</p>
                    <p>Record: {record}</p>
                </div>
            ) : null}
        </div>
    )
}
