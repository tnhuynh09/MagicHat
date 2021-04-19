import React, { useEffect, useState, useRef } from 'react';
import iceBreakerQuestions from './questionsList';
import magicHat from './magic-hat.png';
import './Home.css';

const TIMER = 3000;

function Home() {
    const [randQuestion, setRandQuestion] = useState("");
    const [questionArray, setQuestionArray] = useState(iceBreakerQuestions);
    const [rightIndexPointer, setRightIndexPointer] = useState(iceBreakerQuestions.length - 1);
    const [error, setError] = useState("");
    const [rouletteIsActive, setRouletteIsActive] = useState(false);
    const rightIdxRef = useRef(rightIndexPointer);
    const questionArrayRef = useRef(questionArray);

    rightIdxRef.current = rightIndexPointer;
    questionArrayRef.current = questionArray;

    function generateAQuestion(rightIndex, questions) {

        let randIndex = Math.floor(Math.random() * (rightIndex + 1));
        let question = questionArray[randIndex];
        setRandQuestion(question);

        let temp = questions[randIndex];
        questions[randIndex] = questions[rightIndex];
        questions[rightIndex] = temp;

        setRightIndexPointer(rightIndex => rightIndex - 1);
    }

    function pickAQuestion() {
        if (rightIndexPointer === -1) {
            setRandQuestion("");
            setError("There are no questions left. Reset to go another round.");
            return;
        }

        generateAQuestion(rightIndexPointer, questionArray);
    };

    useEffect(() => {
        let interval;

        if (rouletteIsActive) {
            if (rightIdxRef.current === 0) {
                clearInterval(interval);
                setRandQuestion("");
                setError("There are no questions left. Reset to go another round.");
            }

            generateAQuestion(rightIdxRef.current, questionArrayRef.current);

            interval = setInterval(() => {
                if (rightIdxRef.current === 0) {
                    clearInterval(interval);
                    setRandQuestion("");
                    setError("There are no questions left. Reset to go another round.");
                }
                generateAQuestion(rightIdxRef.current, questionArrayRef.current);
            }, TIMER);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [rouletteIsActive]);

    function toggleRoulette() {
        setRouletteIsActive(!rouletteIsActive);
    };

    function reset() {
        setRandQuestion("");
        setQuestionArray(iceBreakerQuestions);
        setRightIndexPointer(iceBreakerQuestions.length - 1);
        setError("");
        setRouletteIsActive(false);
    };

    return (
        <div className="Home">
            <h1 className="Home-title"> <img className="Home-logo" src={magicHat} alt="magic-hat-icon" />Magic Hat</h1>
            <hr />

            <div className="Home-question-wrapper">
                {randQuestion ?
                    <h3>
                        <div className="Home-question">ICE BREAKER QUESTION: {randQuestion}</div>
                    </h3>
                    :
                    <h3>
                        <div className="Home-question">Press GET QUESTION/START ROULETTE or RESET to start pulling out questions from the Magic Hat! (:</div>
                    </h3>
                }

            </div>

            <div className="Home-buttons">
                {rouletteIsActive === false ?
                    <button onClick={pickAQuestion}>Get Question</button>
                    :
                    null
                }

                <button onClick={toggleRoulette}>{rouletteIsActive === true ? "Stop" : "Start"} Roulette</button>

                {rightIndexPointer !== iceBreakerQuestions.length - 1 ?
                    <button onClick={reset}>Reset</button>
                    :
                    null
                }
            </div>

            <div className="Home-error">
                {error ?
                    <h4 className="Home-error-message"> Warning: {error} </h4>
                    :
                    null
                }
            </div>
        </div>
    );
}

export default Home;





