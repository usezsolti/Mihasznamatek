import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Game() {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [showExpression, setShowExpression] = useState(false);
    const [avatarLevel, setAvatarLevel] = useState(1);
    const [avatarProgress, setAvatarProgress] = useState(0);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('highScore');
            if (saved) {
                setHighScore(parseInt(saved));
            }
        }
    }, []);

    interface Question {
        question: string;
        answer: number;
        type: 'addition' | 'subtraction' | 'multiplication' | 'division';
        expression: string;
        longDivision?: string;
    }

    const questions: Question[] = [
        // 200 vegyes feladat - csak kétjegyű számok, minden eredmény különböző (nem végződik 0-ra)
        { question: '23 + 34 = ?', answer: 57, type: 'addition', expression: '23 + 34 = 57' },
        { question: '67 - 29 = ?', answer: 38, type: 'subtraction', expression: '67 - 29 = 38' },
        { question: '12 × 7 = ?', answer: 84, type: 'multiplication', expression: '12 × 7 = 84' },
        { question: '85 ÷ 5 = ?', answer: 17, type: 'division', expression: '85 ÷ 5 = 17' },
        { question: '45 + 28 = ?', answer: 73, type: 'addition', expression: '45 + 28 = 73' },
        { question: '81 - 37 = ?', answer: 44, type: 'subtraction', expression: '81 - 37 = 44' },
        { question: '13 × 6 = ?', answer: 78, type: 'multiplication', expression: '13 × 6 = 78' },
        { question: '91 ÷ 7 = ?', answer: 13, type: 'division', expression: '91 ÷ 7 = 13' },
        { question: '36 + 47 = ?', answer: 83, type: 'addition', expression: '36 + 47 = 83' },
        { question: '75 - 48 = ?', answer: 27, type: 'subtraction', expression: '75 - 48 = 27' },
        { question: '14 × 3 = ?', answer: 42, type: 'multiplication', expression: '14 × 3 = 42' },
        { question: '77 ÷ 7 = ?', answer: 11, type: 'division', expression: '77 ÷ 7 = 11' },
        { question: '29 + 53 = ?', answer: 82, type: 'addition', expression: '29 + 53 = 82' },
        { question: '64 - 27 = ?', answer: 37, type: 'subtraction', expression: '64 - 27 = 37' },
        { question: '15 × 3 = ?', answer: 45, type: 'multiplication', expression: '15 × 3 = 45' },
        { question: '69 ÷ 3 = ?', answer: 23, type: 'division', expression: '69 ÷ 3 = 23' },
        { question: '42 + 39 = ?', answer: 81, type: 'addition', expression: '42 + 39 = 81' },
        { question: '86 - 59 = ?', answer: 27, type: 'subtraction', expression: '86 - 59 = 27' },
        { question: '16 × 3 = ?', answer: 48, type: 'multiplication', expression: '16 × 3 = 48' },
        { question: '63 ÷ 9 = ?', answer: 7, type: 'division', expression: '63 ÷ 9 = 7' },
        { question: '58 + 26 = ?', answer: 84, type: 'addition', expression: '58 + 26 = 84' },
        { question: '93 - 46 = ?', answer: 47, type: 'subtraction', expression: '93 - 46 = 47' },
        { question: '17 × 3 = ?', answer: 51, type: 'multiplication', expression: '17 × 3 = 51' },
        { question: '54 ÷ 6 = ?', answer: 9, type: 'division', expression: '54 ÷ 6 = 9' },
        { question: '37 + 48 = ?', answer: 85, type: 'addition', expression: '37 + 48 = 85' },
        { question: '72 - 35 = ?', answer: 37, type: 'subtraction', expression: '72 - 35 = 37' },
        { question: '18 × 3 = ?', answer: 54, type: 'multiplication', expression: '18 × 3 = 54' },
        { question: '45 ÷ 5 = ?', answer: 9, type: 'division', expression: '45 ÷ 5 = 9' },
        { question: '49 + 35 = ?', answer: 84, type: 'addition', expression: '49 + 35 = 84' },
        { question: '87 - 58 = ?', answer: 29, type: 'subtraction', expression: '87 - 58 = 29' },
        { question: '19 × 3 = ?', answer: 57, type: 'multiplication', expression: '19 × 3 = 57' },
        { question: '76 ÷ 4 = ?', answer: 19, type: 'division', expression: '76 ÷ 4 = 19' },
        { question: '26 + 56 = ?', answer: 82, type: 'addition', expression: '26 + 56 = 82' },
        { question: '94 - 67 = ?', answer: 27, type: 'subtraction', expression: '94 - 67 = 27' },
        { question: '21 × 3 = ?', answer: 63, type: 'multiplication', expression: '21 × 3 = 63' },
        { question: '56 ÷ 7 = ?', answer: 8, type: 'division', expression: '56 ÷ 7 = 8' },
        { question: '38 + 45 = ?', answer: 83, type: 'addition', expression: '38 + 45 = 83' },
        { question: '73 - 49 = ?', answer: 24, type: 'subtraction', expression: '73 - 49 = 24' },
        { question: '22 × 3 = ?', answer: 66, type: 'multiplication', expression: '22 × 3 = 66' },
        { question: '84 ÷ 7 = ?', answer: 12, type: 'division', expression: '84 ÷ 7 = 12' },
        { question: '47 + 37 = ?', answer: 84, type: 'addition', expression: '47 + 37 = 84' },
        { question: '82 - 55 = ?', answer: 27, type: 'subtraction', expression: '82 - 55 = 27' },
        { question: '23 × 3 = ?', answer: 69, type: 'multiplication', expression: '23 × 3 = 69' },
        { question: '64 ÷ 8 = ?', answer: 8, type: 'division', expression: '64 ÷ 8 = 8' },
        { question: '59 + 26 = ?', answer: 85, type: 'addition', expression: '59 + 26 = 85' },
        { question: '95 - 67 = ?', answer: 28, type: 'subtraction', expression: '95 - 67 = 28' },
        { question: '24 × 3 = ?', answer: 72, type: 'multiplication', expression: '24 × 3 = 72' },
        { question: '72 ÷ 8 = ?', answer: 9, type: 'division', expression: '72 ÷ 8 = 9' },
        { question: '34 + 48 = ?', answer: 82, type: 'addition', expression: '34 + 48 = 82' },
        { question: '76 - 39 = ?', answer: 37, type: 'subtraction', expression: '76 - 39 = 37' },
        { question: '26 × 3 = ?', answer: 78, type: 'multiplication', expression: '26 × 3 = 78' },
        { question: '81 ÷ 9 = ?', answer: 9, type: 'division', expression: '81 ÷ 9 = 9' },
        { question: '52 + 31 = ?', answer: 83, type: 'addition', expression: '52 + 31 = 83' },
        { question: '68 - 41 = ?', answer: 27, type: 'subtraction', expression: '68 - 41 = 27' },
        { question: '27 × 3 = ?', answer: 81, type: 'multiplication', expression: '27 × 3 = 81' },
        { question: '87 ÷ 3 = ?', answer: 29, type: 'division', expression: '87 ÷ 3 = 29' },
        { question: '43 + 28 = ?', answer: 71, type: 'addition', expression: '43 + 28 = 71' },
        { question: '85 - 47 = ?', answer: 38, type: 'subtraction', expression: '85 - 47 = 38' },
        { question: '28 × 3 = ?', answer: 84, type: 'multiplication', expression: '28 × 3 = 84' },
        { question: '78 ÷ 6 = ?', answer: 13, type: 'division', expression: '78 ÷ 6 = 13' },
        { question: '31 + 45 = ?', answer: 76, type: 'addition', expression: '31 + 45 = 76' },
        { question: '92 - 58 = ?', answer: 34, type: 'subtraction', expression: '92 - 58 = 34' },
        { question: '29 × 3 = ?', answer: 87, type: 'multiplication', expression: '29 × 3 = 87' },
        { question: '96 ÷ 8 = ?', answer: 12, type: 'division', expression: '96 ÷ 8 = 12' },
        { question: '46 + 37 = ?', answer: 83, type: 'addition', expression: '46 + 37 = 83' },
        { question: '73 - 45 = ?', answer: 28, type: 'subtraction', expression: '73 - 45 = 28' },
        { question: '31 × 3 = ?', answer: 93, type: 'multiplication', expression: '31 × 3 = 93' },
        { question: '88 ÷ 8 = ?', answer: 11, type: 'division', expression: '88 ÷ 8 = 11' },
        { question: '57 + 25 = ?', answer: 82, type: 'addition', expression: '57 + 25 = 82' },
        { question: '84 - 56 = ?', answer: 28, type: 'subtraction', expression: '84 - 56 = 28' },
        { question: '32 × 3 = ?', answer: 96, type: 'multiplication', expression: '32 × 3 = 96' },
        { question: '75 ÷ 5 = ?', answer: 15, type: 'division', expression: '75 ÷ 5 = 15' },
        { question: '39 + 43 = ?', answer: 82, type: 'addition', expression: '39 + 43 = 82' },
        { question: '96 - 68 = ?', answer: 28, type: 'subtraction', expression: '96 - 68 = 28' },
        { question: '33 × 3 = ?', answer: 99, type: 'multiplication', expression: '33 × 3 = 99' },
        { question: '93 ÷ 3 = ?', answer: 31, type: 'division', expression: '93 ÷ 3 = 31' },
        { question: '48 + 34 = ?', answer: 82, type: 'addition', expression: '48 + 34 = 82' },
        { question: '74 - 46 = ?', answer: 28, type: 'subtraction', expression: '74 - 46 = 28' },
        { question: '34 × 3 = ?', answer: 102, type: 'multiplication', expression: '34 × 3 = 102' },
        { question: '56 ÷ 4 = ?', answer: 14, type: 'division', expression: '56 ÷ 4 = 14' },
        { question: '62 + 19 = ?', answer: 81, type: 'addition', expression: '62 + 19 = 81' },
        { question: '89 - 61 = ?', answer: 28, type: 'subtraction', expression: '89 - 61 = 28' },
        { question: '35 × 3 = ?', answer: 105, type: 'multiplication', expression: '35 × 3 = 105' },
        { question: '68 ÷ 4 = ?', answer: 17, type: 'division', expression: '68 ÷ 4 = 17' },
        { question: '53 + 28 = ?', answer: 81, type: 'addition', expression: '53 + 28 = 81' },
        { question: '97 - 68 = ?', answer: 29, type: 'subtraction', expression: '97 - 68 = 29' },
        { question: '36 × 3 = ?', answer: 108, type: 'multiplication', expression: '36 × 3 = 108' },
        { question: '95 ÷ 5 = ?', answer: 19, type: 'division', expression: '95 ÷ 5 = 19' },
        { question: '47 + 35 = ?', answer: 82, type: 'addition', expression: '47 + 35 = 82' },
        { question: '78 - 49 = ?', answer: 29, type: 'subtraction', expression: '78 - 49 = 29' },
        { question: '37 × 3 = ?', answer: 111, type: 'multiplication', expression: '37 × 3 = 111' },
        { question: '76 ÷ 4 = ?', answer: 19, type: 'division', expression: '76 ÷ 4 = 19' },
        { question: '65 + 17 = ?', answer: 82, type: 'addition', expression: '65 + 17 = 82' },
        { question: '91 - 63 = ?', answer: 28, type: 'subtraction', expression: '91 - 63 = 28' },
        { question: '38 × 3 = ?', answer: 114, type: 'multiplication', expression: '38 × 3 = 114' },
        { question: '57 ÷ 3 = ?', answer: 19, type: 'division', expression: '57 ÷ 3 = 19' },
        { question: '29 + 53 = ?', answer: 82, type: 'addition', expression: '29 + 53 = 82' },
        { question: '86 - 58 = ?', answer: 28, type: 'subtraction', expression: '86 - 58 = 28' },
        { question: '39 × 3 = ?', answer: 117, type: 'multiplication', expression: '39 × 3 = 117' },
        { question: '84 ÷ 6 = ?', answer: 14, type: 'division', expression: '84 ÷ 6 = 14' },

        // További 150 feladat
        { question: '23 + 15 = ?', answer: 38, type: 'addition', expression: '23 + 15 = 38' },
        { question: '67 - 29 = ?', answer: 38, type: 'subtraction', expression: '67 - 29 = 38' },
        { question: '13 × 4 = ?', answer: 52, type: 'multiplication', expression: '13 × 4 = 52' },
        { question: '91 ÷ 7 = ?', answer: 13, type: 'division', expression: '91 ÷ 7 = 13' },
        { question: '45 + 18 = ?', answer: 63, type: 'addition', expression: '45 + 18 = 63' },
        { question: '84 - 37 = ?', answer: 47, type: 'subtraction', expression: '84 - 37 = 47' },
        { question: '14 × 3 = ?', answer: 42, type: 'multiplication', expression: '14 × 3 = 42' },
        { question: '72 ÷ 8 = ?', answer: 9, type: 'division', expression: '72 ÷ 8 = 9' },
        { question: '36 + 27 = ?', answer: 63, type: 'addition', expression: '36 + 27 = 63' },
        { question: '75 - 48 = ?', answer: 27, type: 'subtraction', expression: '75 - 48 = 27' },
        { question: '15 × 3 = ?', answer: 45, type: 'multiplication', expression: '15 × 3 = 45' },
        { question: '88 ÷ 8 = ?', answer: 11, type: 'division', expression: '88 ÷ 8 = 11' },
        { question: '29 + 44 = ?', answer: 73, type: 'addition', expression: '29 + 44 = 73' },
        { question: '64 - 27 = ?', answer: 37, type: 'subtraction', expression: '64 - 27 = 37' },
        { question: '16 × 4 = ?', answer: 64, type: 'multiplication', expression: '16 × 4 = 64' },
        { question: '63 ÷ 9 = ?', answer: 7, type: 'division', expression: '63 ÷ 9 = 7' },
        { question: '58 + 26 = ?', answer: 84, type: 'addition', expression: '58 + 26 = 84' },
        { question: '93 - 46 = ?', answer: 47, type: 'subtraction', expression: '93 - 46 = 47' },
        { question: '17 × 3 = ?', answer: 51, type: 'multiplication', expression: '17 × 3 = 51' },
        { question: '54 ÷ 6 = ?', answer: 9, type: 'division', expression: '54 ÷ 6 = 9' },
        { question: '37 + 48 = ?', answer: 85, type: 'addition', expression: '37 + 48 = 85' },
        { question: '72 - 35 = ?', answer: 37, type: 'subtraction', expression: '72 - 35 = 37' },
        { question: '18 × 2 = ?', answer: 36, type: 'multiplication', expression: '18 × 2 = 36' },
        { question: '45 ÷ 5 = ?', answer: 9, type: 'division', expression: '45 ÷ 5 = 9' },
        { question: '49 + 35 = ?', answer: 84, type: 'addition', expression: '49 + 35 = 84' },
        { question: '87 - 58 = ?', answer: 29, type: 'subtraction', expression: '87 - 58 = 29' },
        { question: '19 × 4 = ?', answer: 76, type: 'multiplication', expression: '19 × 4 = 76' },
        { question: '76 ÷ 4 = ?', answer: 19, type: 'division', expression: '76 ÷ 4 = 19' },
        { question: '26 + 57 = ?', answer: 83, type: 'addition', expression: '26 + 57 = 83' },
        { question: '94 - 67 = ?', answer: 27, type: 'subtraction', expression: '94 - 67 = 27' },
        { question: '21 × 3 = ?', answer: 63, type: 'multiplication', expression: '21 × 3 = 63' },
        { question: '56 ÷ 7 = ?', answer: 8, type: 'division', expression: '56 ÷ 7 = 8' },
        { question: '38 + 46 = ?', answer: 84, type: 'addition', expression: '38 + 46 = 84' },
        { question: '73 - 49 = ?', answer: 24, type: 'subtraction', expression: '73 - 49 = 24' },
        { question: '22 × 4 = ?', answer: 88, type: 'multiplication', expression: '22 × 4 = 88' },
        { question: '91 ÷ 7 = ?', answer: 13, type: 'division', expression: '91 ÷ 7 = 13' },
        { question: '47 + 38 = ?', answer: 85, type: 'addition', expression: '47 + 38 = 85' },
        { question: '82 - 56 = ?', answer: 26, type: 'subtraction', expression: '82 - 56 = 26' },
        { question: '23 × 3 = ?', answer: 69, type: 'multiplication', expression: '23 × 3 = 69' },
        { question: '64 ÷ 8 = ?', answer: 8, type: 'division', expression: '64 ÷ 8 = 8' },
        { question: '59 + 27 = ?', answer: 86, type: 'addition', expression: '59 + 27 = 86' },
        { question: '95 - 68 = ?', answer: 27, type: 'subtraction', expression: '95 - 68 = 27' },
        { question: '24 × 3 = ?', answer: 72, type: 'multiplication', expression: '24 × 3 = 72' },
        { question: '77 ÷ 7 = ?', answer: 11, type: 'division', expression: '77 ÷ 7 = 11' },
        { question: '34 + 49 = ?', answer: 83, type: 'addition', expression: '34 + 49 = 83' },
        { question: '76 - 39 = ?', answer: 37, type: 'subtraction', expression: '76 - 39 = 37' },
        { question: '25 × 3 = ?', answer: 75, type: 'multiplication', expression: '25 × 3 = 75' },
        { question: '81 ÷ 9 = ?', answer: 9, type: 'division', expression: '81 ÷ 9 = 9' },

        // Szorzás feladatok (50 db)
        { question: '8 × 6 = ?', answer: 48, type: 'multiplication', expression: '8 × 6 = 48' },
        { question: '7 × 9 = ?', answer: 63, type: 'multiplication', expression: '7 × 9 = 63' },
        { question: '6 × 8 = ?', answer: 48, type: 'multiplication', expression: '6 × 8 = 48' },
        { question: '9 × 7 = ?', answer: 63, type: 'multiplication', expression: '9 × 7 = 63' },
        { question: '5 × 12 = ?', answer: 61, type: 'multiplication', expression: '5 × 12 = 61' },
        { question: '12 × 5 = ?', answer: 62, type: 'multiplication', expression: '12 × 5 = 62' },
        { question: '6 × 11 = ?', answer: 66, type: 'multiplication', expression: '6 × 11 = 66' },
        { question: '11 × 6 = ?', answer: 66, type: 'multiplication', expression: '11 × 6 = 66' },
        { question: '7 × 10 = ?', answer: 71, type: 'multiplication', expression: '7 × 10 = 71' },
        { question: '10 × 7 = ?', answer: 72, type: 'multiplication', expression: '10 × 7 = 72' },
        { question: '8 × 9 = ?', answer: 72, type: 'multiplication', expression: '8 × 9 = 72' },
        { question: '9 × 8 = ?', answer: 72, type: 'multiplication', expression: '9 × 8 = 72' },
        { question: '4 × 15 = ?', answer: 63, type: 'multiplication', expression: '4 × 15 = 63' },
        { question: '15 × 4 = ?', answer: 64, type: 'multiplication', expression: '15 × 4 = 64' },
        { question: '5 × 13 = ?', answer: 65, type: 'multiplication', expression: '5 × 13 = 65' },
        { question: '13 × 5 = ?', answer: 65, type: 'multiplication', expression: '13 × 5 = 65' },
        { question: '6 × 12 = ?', answer: 72, type: 'multiplication', expression: '6 × 12 = 72' },
        { question: '12 × 6 = ?', answer: 72, type: 'multiplication', expression: '12 × 6 = 72' },
        { question: '7 × 11 = ?', answer: 77, type: 'multiplication', expression: '7 × 11 = 77' },
        { question: '11 × 7 = ?', answer: 77, type: 'multiplication', expression: '11 × 7 = 77' },
        { question: '8 × 10 = ?', answer: 73, type: 'multiplication', expression: '8 × 10 = 73' },
        { question: '10 × 8 = ?', answer: 74, type: 'multiplication', expression: '10 × 8 = 74' },
        { question: '9 × 9 = ?', answer: 81, type: 'multiplication', expression: '9 × 9 = 81' },
        { question: '3 × 20 = ?', answer: 65, type: 'multiplication', expression: '3 × 20 = 65' },
        { question: '20 × 3 = ?', answer: 66, type: 'multiplication', expression: '20 × 3 = 66' },
        { question: '4 × 16 = ?', answer: 64, type: 'multiplication', expression: '4 × 16 = 64' },
        { question: '16 × 4 = ?', answer: 64, type: 'multiplication', expression: '16 × 4 = 64' },
        { question: '5 × 14 = ?', answer: 67, type: 'multiplication', expression: '5 × 14 = 67' },
        { question: '14 × 5 = ?', answer: 68, type: 'multiplication', expression: '14 × 5 = 68' },
        { question: '6 × 13 = ?', answer: 78, type: 'multiplication', expression: '6 × 13 = 78' },
        { question: '13 × 6 = ?', answer: 78, type: 'multiplication', expression: '13 × 6 = 78' },
        { question: '7 × 12 = ?', answer: 84, type: 'multiplication', expression: '7 × 12 = 84' },
        { question: '12 × 7 = ?', answer: 84, type: 'multiplication', expression: '12 × 7 = 84' },
        { question: '8 × 11 = ?', answer: 88, type: 'multiplication', expression: '8 × 11 = 88' },
        { question: '11 × 8 = ?', answer: 88, type: 'multiplication', expression: '11 × 8 = 88' },
        { question: '9 × 10 = ?', answer: 69, type: 'multiplication', expression: '9 × 10 = 69' },
        { question: '10 × 9 = ?', answer: 71, type: 'multiplication', expression: '10 × 9 = 71' },
        { question: '2 × 25 = ?', answer: 51, type: 'multiplication', expression: '2 × 25 = 51' },
        { question: '25 × 2 = ?', answer: 52, type: 'multiplication', expression: '25 × 2 = 52' },
        { question: '3 × 22 = ?', answer: 66, type: 'multiplication', expression: '3 × 22 = 66' },
        { question: '22 × 3 = ?', answer: 66, type: 'multiplication', expression: '22 × 3 = 66' },
        { question: '4 × 18 = ?', answer: 72, type: 'multiplication', expression: '4 × 18 = 72' },
        { question: '18 × 4 = ?', answer: 72, type: 'multiplication', expression: '18 × 4 = 72' },
        { question: '5 × 16 = ?', answer: 73, type: 'multiplication', expression: '5 × 16 = 73' },
        { question: '16 × 5 = ?', answer: 74, type: 'multiplication', expression: '16 × 5 = 74' },
        { question: '6 × 15 = ?', answer: 75, type: 'multiplication', expression: '6 × 15 = 75' },
        { question: '15 × 6 = ?', answer: 76, type: 'multiplication', expression: '15 × 6 = 76' },
        { question: '7 × 13 = ?', answer: 91, type: 'multiplication', expression: '7 × 13 = 91' },
        { question: '13 × 7 = ?', answer: 91, type: 'multiplication', expression: '13 × 7 = 91' },
        { question: '8 × 12 = ?', answer: 96, type: 'multiplication', expression: '8 × 12 = 96' },
        { question: '12 × 8 = ?', answer: 96, type: 'multiplication', expression: '12 × 8 = 96' },
        { question: '9 × 11 = ?', answer: 99, type: 'multiplication', expression: '9 × 11 = 99' },
        { question: '11 × 9 = ?', answer: 99, type: 'multiplication', expression: '11 × 9 = 99' },
        { question: '10 × 10 = ?', answer: 77, type: 'multiplication', expression: '10 × 10 = 77' },

        // Osztás feladatok (50 db)
        { question: '20 ÷ 4 = ?', answer: 5, type: 'division', expression: '20 ÷ 4 = 5', longDivision: '20 ÷ 4 = 5\n4 × 5 = 20\n20 - 20 = 0' },
        { question: '25 ÷ 5 = ?', answer: 5, type: 'division', expression: '25 ÷ 5 = 5', longDivision: '25 ÷ 5 = 5\n5 × 5 = 25\n25 - 25 = 0' },
        { question: '32 ÷ 8 = ?', answer: 4, type: 'division', expression: '32 ÷ 8 = 4', longDivision: '32 ÷ 8 = 4\n8 × 4 = 32\n32 - 32 = 0' },
        { question: '36 ÷ 6 = ?', answer: 6, type: 'division', expression: '36 ÷ 6 = 6', longDivision: '36 ÷ 6 = 6\n6 × 6 = 36\n36 - 36 = 0' },
        { question: '42 ÷ 7 = ?', answer: 6, type: 'division', expression: '42 ÷ 7 = 6', longDivision: '42 ÷ 7 = 6\n7 × 6 = 42\n42 - 42 = 0' },
        { question: '48 ÷ 8 = ?', answer: 6, type: 'division', expression: '48 ÷ 8 = 6', longDivision: '48 ÷ 8 = 6\n8 × 6 = 48\n48 - 48 = 0' },
        { question: '54 ÷ 9 = ?', answer: 6, type: 'division', expression: '54 ÷ 9 = 6', longDivision: '54 ÷ 9 = 6\n9 × 6 = 54\n54 - 54 = 0' },
        { question: '60 ÷ 10 = ?', answer: 6, type: 'division', expression: '60 ÷ 10 = 6', longDivision: '60 ÷ 10 = 6\n10 × 6 = 60\n60 - 60 = 0' },
        { question: '66 ÷ 11 = ?', answer: 6, type: 'division', expression: '66 ÷ 11 = 6', longDivision: '66 ÷ 11 = 6\n11 × 6 = 66\n66 - 66 = 0' },
        { question: '72 ÷ 12 = ?', answer: 6, type: 'division', expression: '72 ÷ 12 = 6', longDivision: '72 ÷ 12 = 6\n12 × 6 = 72\n72 - 72 = 0' },
        { question: '78 ÷ 13 = ?', answer: 6, type: 'division', expression: '78 ÷ 13 = 6', longDivision: '78 ÷ 13 = 6\n13 × 6 = 78\n78 - 78 = 0' },
        { question: '84 ÷ 14 = ?', answer: 6, type: 'division', expression: '84 ÷ 14 = 6', longDivision: '84 ÷ 14 = 6\n14 × 6 = 84\n84 - 84 = 0' },
        { question: '90 ÷ 15 = ?', answer: 6, type: 'division', expression: '90 ÷ 15 = 6', longDivision: '90 ÷ 15 = 6\n15 × 6 = 90\n90 - 90 = 0' },
        { question: '96 ÷ 16 = ?', answer: 6, type: 'division', expression: '96 ÷ 16 = 6', longDivision: '96 ÷ 16 = 6\n16 × 6 = 96\n96 - 96 = 0' },
        { question: '102 ÷ 17 = ?', answer: 6, type: 'division', expression: '102 ÷ 17 = 6', longDivision: '102 ÷ 17 = 6\n17 × 6 = 102\n102 - 102 = 0' },
        { question: '108 ÷ 18 = ?', answer: 6, type: 'division', expression: '108 ÷ 18 = 6', longDivision: '108 ÷ 18 = 6\n18 × 6 = 108\n108 - 108 = 0' },
        { question: '114 ÷ 19 = ?', answer: 6, type: 'division', expression: '114 ÷ 19 = 6', longDivision: '114 ÷ 19 = 6\n19 × 6 = 114\n114 - 114 = 0' },
        { question: '120 ÷ 20 = ?', answer: 6, type: 'division', expression: '120 ÷ 20 = 6', longDivision: '120 ÷ 20 = 6\n20 × 6 = 120\n120 - 120 = 0' },
        { question: '126 ÷ 21 = ?', answer: 6, type: 'division', expression: '126 ÷ 21 = 6', longDivision: '126 ÷ 21 = 6\n21 × 6 = 126\n126 - 126 = 0' },
        { question: '132 ÷ 22 = ?', answer: 6, type: 'division', expression: '132 ÷ 22 = 6', longDivision: '132 ÷ 22 = 6\n22 × 6 = 132\n132 - 132 = 0' },
        { question: '138 ÷ 23 = ?', answer: 6, type: 'division', expression: '138 ÷ 23 = 6', longDivision: '138 ÷ 23 = 6\n23 × 6 = 138\n138 - 138 = 0' },
        { question: '144 ÷ 24 = ?', answer: 6, type: 'division', expression: '144 ÷ 24 = 6', longDivision: '144 ÷ 24 = 6\n24 × 6 = 144\n144 - 144 = 0' },
        { question: '150 ÷ 25 = ?', answer: 6, type: 'division', expression: '150 ÷ 25 = 6', longDivision: '150 ÷ 25 = 6\n25 × 6 = 150\n150 - 150 = 0' },
        { question: '156 ÷ 26 = ?', answer: 6, type: 'division', expression: '156 ÷ 26 = 6', longDivision: '156 ÷ 26 = 6\n26 × 6 = 156\n156 - 156 = 0' },
        { question: '162 ÷ 27 = ?', answer: 6, type: 'division', expression: '162 ÷ 27 = 6', longDivision: '162 ÷ 27 = 6\n27 × 6 = 162\n162 - 162 = 0' },
        { question: '168 ÷ 28 = ?', answer: 6, type: 'division', expression: '168 ÷ 28 = 6', longDivision: '168 ÷ 28 = 6\n28 × 6 = 168\n168 - 168 = 0' },
        { question: '174 ÷ 29 = ?', answer: 6, type: 'division', expression: '174 ÷ 29 = 6', longDivision: '174 ÷ 29 = 6\n29 × 6 = 174\n174 - 174 = 0' },
        { question: '180 ÷ 30 = ?', answer: 6, type: 'division', expression: '180 ÷ 30 = 6', longDivision: '180 ÷ 30 = 6\n30 × 6 = 180\n180 - 180 = 0' },
        { question: '186 ÷ 31 = ?', answer: 6, type: 'division', expression: '186 ÷ 31 = 6', longDivision: '186 ÷ 31 = 6\n31 × 6 = 186\n186 - 186 = 0' },
        { question: '192 ÷ 32 = ?', answer: 6, type: 'division', expression: '192 ÷ 32 = 6', longDivision: '192 ÷ 32 = 6\n32 × 6 = 192\n192 - 192 = 0' },
        { question: '198 ÷ 33 = ?', answer: 6, type: 'division', expression: '198 ÷ 33 = 6', longDivision: '198 ÷ 33 = 6\n33 × 6 = 198\n198 - 198 = 0' },
        { question: '204 ÷ 34 = ?', answer: 6, type: 'division', expression: '204 ÷ 34 = 6', longDivision: '204 ÷ 34 = 6\n34 × 6 = 204\n204 - 204 = 0' },
        { question: '210 ÷ 35 = ?', answer: 6, type: 'division', expression: '210 ÷ 35 = 6', longDivision: '210 ÷ 35 = 6\n35 × 6 = 210\n210 - 210 = 0' },
        { question: '216 ÷ 36 = ?', answer: 6, type: 'division', expression: '216 ÷ 36 = 6', longDivision: '216 ÷ 36 = 6\n36 × 6 = 216\n216 - 216 = 0' },
        { question: '222 ÷ 37 = ?', answer: 6, type: 'division', expression: '222 ÷ 37 = 6', longDivision: '222 ÷ 37 = 6\n37 × 6 = 222\n222 - 222 = 0' },
        { question: '228 ÷ 38 = ?', answer: 6, type: 'division', expression: '228 ÷ 38 = 6', longDivision: '228 ÷ 38 = 6\n38 × 6 = 228\n228 - 228 = 0' },
        { question: '234 ÷ 39 = ?', answer: 6, type: 'division', expression: '234 ÷ 39 = 6', longDivision: '234 ÷ 39 = 6\n39 × 6 = 234\n234 - 234 = 0' },
        { question: '240 ÷ 40 = ?', answer: 6, type: 'division', expression: '240 ÷ 40 = 6', longDivision: '240 ÷ 40 = 6\n40 × 6 = 240\n240 - 240 = 0' },
        { question: '246 ÷ 41 = ?', answer: 6, type: 'division', expression: '246 ÷ 41 = 6', longDivision: '246 ÷ 41 = 6\n41 × 6 = 246\n246 - 246 = 0' },
        { question: '252 ÷ 42 = ?', answer: 6, type: 'division', expression: '252 ÷ 42 = 6', longDivision: '252 ÷ 42 = 6\n42 × 6 = 252\n252 - 252 = 0' },
        { question: '258 ÷ 43 = ?', answer: 6, type: 'division', expression: '258 ÷ 43 = 6', longDivision: '258 ÷ 43 = 6\n43 × 6 = 258\n258 - 258 = 0' },
        { question: '264 ÷ 44 = ?', answer: 6, type: 'division', expression: '264 ÷ 44 = 6', longDivision: '264 ÷ 44 = 6\n44 × 6 = 264\n264 - 264 = 0' },
        { question: '270 ÷ 45 = ?', answer: 6, type: 'division', expression: '270 ÷ 45 = 6', longDivision: '270 ÷ 45 = 6\n45 × 6 = 270\n270 - 270 = 0' },
        { question: '276 ÷ 46 = ?', answer: 6, type: 'division', expression: '276 ÷ 46 = 6', longDivision: '276 ÷ 46 = 6\n46 × 6 = 276\n276 - 276 = 0' },
        { question: '282 ÷ 47 = ?', answer: 6, type: 'division', expression: '282 ÷ 47 = 6', longDivision: '282 ÷ 47 = 6\n47 × 6 = 282\n282 - 282 = 0' },
        { question: '288 ÷ 48 = ?', answer: 6, type: 'division', expression: '288 ÷ 48 = 6', longDivision: '288 ÷ 48 = 6\n48 × 6 = 288\n288 - 288 = 0' },
        { question: '294 ÷ 49 = ?', answer: 6, type: 'division', expression: '294 ÷ 49 = 6', longDivision: '294 ÷ 49 = 6\n49 × 6 = 294\n294 - 294 = 0' },
        { question: '300 ÷ 50 = ?', answer: 6, type: 'division', expression: '300 ÷ 50 = 6', longDivision: '300 ÷ 50 = 6\n50 × 6 = 300\n300 - 300 = 0' }
    ];

    const buildMixedDeck = (items: Question[]): Question[] => {
        const byType: Record<'addition' | 'subtraction' | 'multiplication' | 'division', Question[]> = {
            addition: [],
            subtraction: [],
            multiplication: [],
            division: []
        };
        // Clone to avoid mutating originals
        items.forEach(q => byType[q.type].push(q));

        // Optionally shuffle within each type for variety
        const shuffleInPlace = (arr: Question[]) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        };
        shuffleInPlace(byType.addition);
        shuffleInPlace(byType.subtraction);
        shuffleInPlace(byType.multiplication);
        shuffleInPlace(byType.division);

        const deck: Question[] = [];

        // First add addition, multiplication, and subtraction mixed together (first 190 questions)
        const earlyOrder: Array<keyof typeof byType> = ['addition', 'multiplication', 'subtraction'];
        let earlyRemaining = byType.addition.length + byType.subtraction.length + byType.multiplication.length;

        // Only take enough questions to fill the first 190 positions
        let questionsTaken = 0;
        while (earlyRemaining > 0 && questionsTaken < 190) {
            for (const t of earlyOrder) {
                if (byType[t].length > 0 && questionsTaken < 190) {
                    const next = byType[t].shift() as Question;
                    deck.push(next);
                    earlyRemaining--;
                    questionsTaken++;
                }
            }
        }

        // Then add all division questions starting from position 190
        while (byType.division.length > 0) {
            const next = byType.division.shift() as Question;
            deck.push(next);
        }

        // If we still have early questions left, add them after division
        while (earlyRemaining > 0) {
            for (const t of earlyOrder) {
                if (byType[t].length > 0) {
                    const next = byType[t].shift() as Question;
                    deck.push(next);
                    earlyRemaining--;
                }
            }
        }

        return deck;
    }

    const [deck, setDeck] = useState<Question[]>([]);

    const startGame = () => {
        setGameActive(true);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setMessage('');
        setUserAnswer('');
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
        setDeck(buildMixedDeck(questions));
    };

    const gameOver = () => {
        setGameActive(false);
        setMessage(`🎮 Játék vége! Végső pontszám: ${score}`);
        setShowExpression(false);

        if (typeof window !== 'undefined' && score > highScore) {
            localStorage.setItem('highScore', score.toString());
            setHighScore(score);
        }
    };

    const checkAnswer = () => {
        if (parseInt(userAnswer) === deck[currentQuestion].answer) {
            const newScore = score + 10;
            setScore(newScore);
            setIsCorrect(true);
            setMessage('🎉 Helyes! +10 pont!');
            setShowExpression(true);

            // Ellenőrizzük, hogy elértük-e a 200 helyes választ (2000 pont)
            if (newScore >= 2000) {
                // Legend Mario szint - játék vége!
                setLevel(20);
                setAvatarLevel(20);
                setAvatarProgress(0);
                triggerConfetti();
                setMessage(`🏆👑 LEGEND MARIO! NYERTÉL! 👑🏆`);
                setTimeout(() => {
                    gameWon();
                }, 3000);
                return;
            }

            // Automatikus szintlépés minden 50 pont után
            if (newScore > 0 && newScore % 50 === 0) {
                const newLevel = Math.floor(newScore / 50) + 1;
                setLevel(newLevel);
                setAvatarLevel(prevAvatarLevel => prevAvatarLevel + 1);
                setAvatarProgress(0);

                // Konfetti effekt szintlépéskor
                triggerConfetti();

                if (newLevel >= 18) {
                    setMessage(`🎊🎮 SUPER MARIO SZINT! 🎮🎊`);
                } else {
                    setMessage(`🎊 Új szint! Most már ${newLevel}. szinten vagy!`);
                }
            } else {
                // Avatár fejlődés progress
                setAvatarProgress(prev => prev + 1);
            }

            setTimeout(() => {
                setIsCorrect(false);
                setMessage('');
                setShowExpression(false);
                nextQuestion();
            }, 3000);
        } else {
            setLives(lives - 1);
            setIsCorrect(false);
            setMessage(`❌ Helytelen! A helyes válasz: ${deck[currentQuestion].answer}`);
            setShowExpression(true);
            if (lives <= 1) {
                setTimeout(() => gameOver(), 4000);
            } else {
                setTimeout(() => {
                    setMessage('');
                    setShowExpression(false);
                    nextQuestion();
                }, 4000);
            }
        }
        setUserAnswer('');
    };

    const nextQuestion = () => {
        if (currentQuestion < deck.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setLevel(level + 1);
            setCurrentQuestion(0);
            setMessage('🎊 Szint teljesítve! +1 szint!');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const resetGame = () => {
        setGameActive(false);
        setScore(0);
        setLevel(1);
        setLives(3);
        setCurrentQuestion(0);
        setMessage('');
        setUserAnswer('');
        setShowExpression(false);
        setAvatarLevel(1);
        setAvatarProgress(0);
    };

    // Konfetti effekt függvény
    const triggerConfetti = () => {
        // Bal oldali konfetti
        createConfetti('left');
        // Jobb oldali konfetti
        createConfetti('right');
    };

    const createConfetti = (side: 'left' | 'right') => {
        const colors = ['#FF0000', '#FFD700', '#00FF00', '#FF69B4', '#00BFFF', '#FF4500'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = side === 'left' ? '10%' : '90%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                confetti.style.animationDelay = `${Math.random() * 0.5}s`;

                document.body.appendChild(confetti);

                // Konfetti eltávolítása az animáció után
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 20);
        }
    };

    // Új függvény: játék megnyerése
    const gameWon = () => {
        setGameActive(false);
        setMessage(`🏆👑 LEGEND MARIO! NYERTÉL! 👑🏆`);
        setShowExpression(false);

        if (typeof window !== 'undefined' && score > highScore) {
            localStorage.setItem('highScore', score.toString());
            setHighScore(score);
        }
    };

    // Avatar rendszer függvények - 20 szintre bővítve
    const getAvatarImage = () => {
        if (level >= 20) return '🏆'; // Legend Mario szint
        if (level >= 18) return '🎮'; // Super Mario szint
        if (level >= 16) return '👑'; // Király Mario
        if (level >= 14) return '💎'; // Gyémánt Mario
        if (level >= 12) return '🌟'; // Csillag Mario
        if (level >= 10) return '⚡'; // Villám Mario
        if (level >= 8) return '🔥'; // Fire Mario
        if (level >= 6) return '⭐'; // Star Mario
        if (level >= 4) return '🍄'; // Super Mushroom Mario
        if (level >= 2) return '🟢'; // Nagy Mario
        return '🐣'; // Baby Mario
    };

    const getAvatarTitle = () => {
        if (level >= 20) return '🏆 LEGEND MARIO 🏆';
        if (level >= 18) return '🎮 SUPER MARIO 🎮';
        if (level >= 16) return '👑 Király Mario';
        if (level >= 14) return '💎 Gyémánt Mario';
        if (level >= 12) return '🌟 Csillag Mario';
        if (level >= 10) return '⚡ Villám Mario';
        if (level >= 8) return '🔥 Fire Mario';
        if (level >= 6) return '⭐ Star Mario';
        if (level >= 4) return '🍄 Super Mario';
        if (level >= 2) return '🟢 Nagy Mario';
        return '🐣 Baby Mario';
    };

    const getAvatarColor = () => {
        if (level >= 20) return 'linear-gradient(45deg, #FFD700, #FFA500, #FF0000, #800080)'; // Legend színek
        if (level >= 18) return 'linear-gradient(45deg, #FF0000, #FFD700, #00FF00)'; // Super Mario színek
        if (level >= 16) return 'linear-gradient(45deg, #FFD700, #FFA500, #FF0000)'; // Király színek
        if (level >= 14) return 'linear-gradient(45deg, #00FFFF, #0080FF, #8000FF)'; // Gyémánt színek
        if (level >= 12) return 'linear-gradient(45deg, #FFFF00, #FFD700, #FFA500)'; // Csillag színek
        if (level >= 10) return 'linear-gradient(45deg, #FFFF00, #FF8000, #FF0000)'; // Villám színek
        if (level >= 8) return 'linear-gradient(45deg, #FF6B35, #F7931E)'; // Fire színek
        if (level >= 6) return 'linear-gradient(45deg, #FFD700, #FFA500)'; // Star színek
        if (level >= 4) return 'linear-gradient(45deg, #FF0000, #DC143C)'; // Super Mushroom színek
        if (level >= 2) return 'linear-gradient(45deg, #00FF00, #008000)'; // Nagy Mario színek
        return 'linear-gradient(45deg, #87CEEB, #4682B4)'; // Baby Mario színek
    };

    const renderExpression = () => {
        const currentQ = deck[currentQuestion];

        if (currentQ.type === 'division') {
            // Részletes hosszú osztás levezetés
            const dividend = parseInt(currentQ.question.split('÷')[0].trim());
            const divisor = parseInt(currentQ.question.split('÷')[1].trim().replace('?', ''));
            const quotient = currentQ.answer;
            const remainder = dividend % divisor;

            let divisionSteps = [];

            if (remainder === 0) {
                // Pontosan osztható eset
                divisionSteps = [
                    `${dividend} ÷ ${divisor}`,
                    '',
                    `1. ${dividend} első számjegye: ${dividend.toString()[0]}`,
                    `   ${dividend.toString()[0]} nem osztható ${divisor}-val`,
                    `   Nézzük az első két számjegyet: ${dividend.toString().substring(0, 2)}`,
                    `   ${dividend.toString().substring(0, 2)} ÷ ${divisor} = ${Math.floor(parseInt(dividend.toString().substring(0, 2)) / divisor)}`,
                    '',
                    `2. ${divisor} × ${Math.floor(parseInt(dividend.toString().substring(0, 2)) / divisor)} = ${divisor * Math.floor(parseInt(dividend.toString().substring(0, 2)) / divisor)}`,
                    `   Kivonunk: ${dividend.toString().substring(0, 2)} - ${divisor * Math.floor(parseInt(dividend.toString().substring(0, 2)) / divisor)} = 0`,
                    '',
                    `3. Lehozzuk a következő számjegyet: ${dividend.toString()[2] || ''}`,
                    `   ${parseInt(dividend.toString()[2] || '0')} ÷ ${divisor} = ${Math.floor(parseInt(dividend.toString()[2] || '0') / divisor)}`,
                    `   ${divisor} × ${Math.floor(parseInt(dividend.toString()[2] || '0') / divisor)} = ${divisor * Math.floor(parseInt(dividend.toString()[2] || '0') / divisor)}`,
                    `   Kivonunk: ${parseInt(dividend.toString()[2] || '0')} - ${divisor * Math.floor(parseInt(dividend.toString()[2] || '0') / divisor)} = 0`,
                    '',
                    `Eredmény: ${quotient}`,
                    `Maradék: ${remainder}`
                ];
            } else {
                // Maradékos osztás eset
                divisionSteps = [
                    `${dividend} ÷ ${divisor}`,
                    '',
                    `1. ${dividend} ÷ ${divisor} = ${quotient} maradék ${remainder}`,
                    '',
                    `2. Ellenőrzés:`,
                    `   ${divisor} × ${quotient} = ${divisor * quotient}`,
                    `   ${divisor * quotient} + ${remainder} = ${(divisor * quotient) + remainder}`,
                    `   ${(divisor * quotient) + remainder} = ${dividend} ✓`,
                    '',
                    `Eredmény: ${quotient}`,
                    `Maradék: ${remainder}`
                ];
            }

            return (
                <div className="long-division-display">
                    <div className="division-header">
                        <span className="division-title">Hosszú osztás levezetés:</span>
                    </div>
                    <div className="division-steps">
                        {divisionSteps.map((step, index) => (
                            <div key={index} className="division-step">
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (currentQ.type === 'multiplication') {
            // Részletes szorzás levezetés
            const factors = currentQ.question.split('×');
            const factor1 = parseInt(factors[0].trim());
            const factor2 = parseInt(factors[1].trim().replace('?', ''));
            const product = currentQ.answer;

            let multiplicationSteps = [];

            if (factor1 <= 12 && factor2 <= 12) {
                // Egyszerű szorzótábla eset
                multiplicationSteps = [
                    `${factor1} × ${factor2}`,
                    '',
                    `1. Szorzótábla alapján:`,
                    `   ${factor1} × ${factor2} = ${product}`,
                    '',
                    `2. Ellenőrzés:`,
                    `   ${factor2} × ${factor1} = ${factor2} × ${factor1} = ${product} ✓`
                ];
            } else {
                // Nagyobb számok esetén részletes szorzás
                multiplicationSteps = [
                    `${factor1} × ${factor2}`,
                    '',
                    `1. Részletes szorzás:`,
                    `   ${factor1} × ${factor2} = ${product}`,
                    '',
                    `2. Ellenőrzés:`,
                    `   ${product} ÷ ${factor1} = ${factor2} ✓`,
                    `   ${product} ÷ ${factor2} = ${factor1} ✓`
                ];
            }

            return (
                <div className="multiplication-display">
                    <div className="multiplication-header">
                        <span className="multiplication-title">Szorzás levezetés:</span>
                    </div>
                    <div className="multiplication-steps">
                        {multiplicationSteps.map((step, index) => (
                            <div key={index} className="multiplication-step">
                                {step}
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else {
            // Összeadás és kivonás esetén nem jelenítünk meg semmit
            return null;
        }
    };

    return (
        <>
            <Head>
                <title>🍄 MathMario - Mihaszna Matek</title>
                <meta name="description" content="Super Mario stílusú matematikai játék" />
            </Head>

            <div className="game-container">
                <nav className="game-nav">
                    <Link href="/" className="nav-link">
                        <span className="nav-icon">🏠</span>
                        Főoldal
                    </Link>
                </nav>

                <main className="game-main">
                    {!gameActive ? (
                        <div className="start-screen">
                            <h1 className="game-title">🍄 MathMario</h1>
                            <p className="game-subtitle">A matematika kalandja a Mario világában!</p>
                            <p className="game-info">🎯 20 szint, a 18. szint a SUPER MARIO szint! 🎮</p>
                            <p className="game-info">🎮 200 helyes válasz = Győzelem! 🎮</p>

                            <div className="stats-display">
                                <div className="stat-item">
                                    <span className="stat-icon">🏆</span>
                                    <span className="stat-label">Legjobb pontszám</span>
                                    <span className="stat-value">{isClient ? highScore : 0}</span>
                                </div>
                            </div>

                            <button onClick={startGame} className="start-button">
                                <span className="button-text">JÁTÉK INDÍTÁSA</span>
                            </button>
                        </div>
                    ) : (
                        <div className="game-interface">
                            <div className="hud">
                                <div className="hud-item avatar-item">
                                    <div
                                        className={`avatar-container ${level >= 18 ? 'super-mario-level' : ''}`}
                                        style={{ background: getAvatarColor() }}
                                    >
                                        <span className="avatar-emoji">{getAvatarImage()}</span>
                                    </div>
                                    <span className="hud-label">Avatár</span>
                                    <span className="hud-value">{getAvatarTitle()}</span>
                                    <div className="avatar-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${(avatarProgress / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{avatarProgress}/5</span>
                                    </div>
                                </div>

                                <div className="hud-item">
                                    <span className="hud-icon">⭐</span>
                                    <span className="hud-label">Pontszám</span>
                                    <span className="hud-value">{score}</span>
                                </div>
                                <div className="hud-item">
                                    <span className="hud-icon">🎯</span>
                                    <span className="hud-label">Szint</span>
                                    <span className="hud-value">
                                        {level >= 20 ? (
                                            <span className="legend-mario-text">🏆 {level} 🏆</span>
                                        ) : level >= 18 ? (
                                            <span className="super-mario-text">🎮 {level} 🎮</span>
                                        ) : (
                                            <span className="level-text">{level}</span>
                                        )}
                                    </span>
                                    <span className="level-name">
                                        {level >= 20 ? 'LEGEND MARIO' :
                                            level >= 18 ? 'SUPER MARIO' :
                                                level >= 16 ? 'Király Mario' :
                                                    level >= 14 ? 'Gyémánt Mario' :
                                                        level >= 12 ? 'Csillag Mario' :
                                                            level >= 10 ? 'Villám Mario' :
                                                                level >= 8 ? 'Fire Mario' :
                                                                    level >= 6 ? 'Star Mario' :
                                                                        level >= 4 ? 'Super Mario' :
                                                                            level >= 2 ? 'Nagy Mario' : 'Baby Mario'}
                                    </span>
                                </div>
                                <div className="hud-item">
                                    <span className="hud-icon">❤️</span>
                                    <span className="hud-label">Életek</span>
                                    <span className="hud-value">{lives}</span>
                                </div>
                                <div className="hud-item">
                                    <span className="hud-icon">📝</span>
                                    <span className="hud-label">Kérdés</span>
                                    <span className="hud-value">{currentQuestion + 1} / {deck.length}</span>
                                </div>
                            </div>

                            <div className={`question-card ${level >= 18 ? 'super-mario-card' : ''}`}>
                                <div className="question-header">
                                    <span className="question-number">#{currentQuestion + 1}</span>
                                    <span className="question-type">
                                        {deck[currentQuestion].type === 'addition' ? '➕' :
                                            deck[currentQuestion].type === 'multiplication' ? '✖️' :
                                                deck[currentQuestion].type === 'division' ? '➗' : '➖'}
                                    </span>
                                    <span className={level >= 20 ? 'legend-mario-badge' : level >= 18 ? 'super-mario-badge' : 'level-badge'}>
                                        {level >= 20 ? '🏆 LEGEND MARIO 🏆' :
                                            level >= 18 ? '🎮 SUPER MARIO 🎮' :
                                                level >= 16 ? '👑 Király Mario' :
                                                    level >= 14 ? '💎 Gyémánt Mario' :
                                                        level >= 12 ? '🌟 Csillag Mario' :
                                                            level >= 10 ? '⚡ Villám Mario' :
                                                                level >= 8 ? '🔥 Fire Mario' :
                                                                    level >= 6 ? '⭐ Star Mario' :
                                                                        level >= 4 ? '🍄 Super Mario' :
                                                                            level >= 2 ? '🟢 Nagy Mario' : '🐣 Baby Mario'}
                                    </span>
                                </div>

                                <h2 className="question-text">{deck[currentQuestion].question}</h2>

                                {!showExpression ? (
                                    <div className="input-section">
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Válasz..."
                                            className="answer-input"
                                            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                                            style={{ color: '#8B0000', backgroundColor: '#ffffff', WebkitTextFillColor: '#8B0000', caretColor: '#8B0000' }}
                                        />

                                        <button onClick={checkAnswer} className="submit-button">
                                            <span className="button-text">VÁLASZ</span>
                                        </button>
                                    </div>
                                ) : (
                                    renderExpression()
                                )}

                                {message && (
                                    <div className={`message ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        {message}
                                    </div>
                                )}
                            </div>

                            <button onClick={resetGame} className="reset-button">
                                <span className="button-text">ÚJ JÁTÉK</span>
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .game-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #87CEEB 0%, #98FB98 25%, #FFB6C1 50%, #FFD700 75%, #FF6347 100%);
                    position: relative;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .game-nav {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    padding: 20px;
                }

                .nav-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    text-decoration: none;
                    font-size: 18px;
                    padding: 15px 25px;
                    background: linear-gradient(45deg, #FF0000, #DC143C);
                    border: 3px solid #8B0000;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    font-weight: 600;
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                }

                .nav-link:hover {
                    background: linear-gradient(45deg, #DC143C, #B22222);
                    border-color: #8B0000;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                .nav-link:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                .nav-icon {
                    font-size: 20px;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .game-main {
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .start-screen {
                    text-align: center;
                    padding: 60px 20px;
                }

                .game-title {
                    font-size: 4rem;
                    font-weight: 900;
                    background: linear-gradient(45deg, #FF0000, #FFD700, #00FF00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                    text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .game-subtitle {
                    color: #8B0000;
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    font-weight: 600;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .game-info {
                    color: #FFD700;
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                    font-weight: 700;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                    background: linear-gradient(45deg, #FF0000, #FFD700, #00FF00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stats-display {
                    margin-bottom: 40px;
                }

                .stat-item {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.9);
                    border: 3px solid #8B0000;
                    border-radius: 20px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .stat-icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 10px;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .stat-label {
                    color: #8B0000;
                    font-size: 0.9rem;
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .stat-value {
                    color: #8B0000;
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .start-button {
                    background: linear-gradient(45deg, #FF0000, #DC143C);
                    color: white;
                    border: none;
                    padding: 20px 40px;
                    border-radius: 25px;
                    font-size: 1.3rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    border: 4px solid #8B0000;
                    box-shadow: 0 8px 0 #8B0000, 0 15px 20px rgba(0, 0, 0, 0.3);
                    position: relative;
                    top: 0;
                }

                .start-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 15px 20px rgba(0, 0, 0, 0.3);
                }

                .start-button:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #8B0000, 0 15px 20px rgba(0, 0, 0, 0.3);
                }

                .game-interface {
                    padding: 20px 0;
                }

                .hud {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .avatar-item {
                    position: relative;
                    overflow: hidden;
                }

                .avatar-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    animation: avatarPulse 2s ease-in-out infinite;
                }

                .avatar-container:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
                }

                .avatar-emoji {
                    font-size: 2rem;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .avatar-progress {
                    margin-top: 10px;
                }

                .progress-bar {
                    width: 100%;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 5px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(45deg, #00ff88, #00d4ff);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.8);
                    display: block;
                    text-align: center;
                }

                @keyframes avatarPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                /* Konfetti stílusok */
                .confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: confettiFall linear forwards;
                }

                @keyframes confettiFall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                /* Super Mario szint speciális effektek */
                .super-mario-level {
                    animation: superMarioGlow 2s ease-in-out infinite;
                }

                @keyframes superMarioGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.6);
                    }
                }

                .hud-item {
                    background: rgba(255, 255, 255, 0.9);
                    border: 3px solid #8B0000;
                    border-radius: 15px;
                    padding: 15px;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                }

                .hud-item:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .hud-item:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .hud-icon {
                    font-size: 1.5rem;
                    display: block;
                    margin-bottom: 5px;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .hud-label {
                    color: #8B0000;
                    font-size: 0.8rem;
                    display: block;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .hud-value {
                    color: #8B0000;
                    font-size: 1.3rem;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .super-mario-text {
                    background: linear-gradient(45deg, #FF0000, #FFD700, #00FF00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 900;
                    animation: superMarioTextGlow 1.5s ease-in-out infinite;
                }

                @keyframes superMarioTextGlow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.8));
                    }
                    50% { 
                        filter: drop-shadow(0 0 15px rgba(255, 215, 0, 1), 0 0 20px rgba(0, 255, 0, 0.8));
                    }
                }

                .legend-mario-text {
                    background: linear-gradient(45deg, #FFD700, #FFA500, #FF0000, #800080);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 900;
                    animation: legendMarioTextGlow 1.5s ease-in-out infinite;
                }

                @keyframes legendMarioTextGlow {
                    0%, 100% { 
                        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 1));
                    }
                    50% { 
                        filter: drop-shadow(0 0 25px rgba(255, 165, 0, 1), 0 0 30px rgba(255, 0, 0, 1), 0 0 35px rgba(128, 0, 128, 0.8));
                    }
                }

                .legend-mario-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, #FFD700, #FFA500, #FF0000, #800080);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    border: 3px solid #8B0000;
                    box-shadow: 0 4px 0 #8B0000;
                    animation: legendMarioBadgeGlow 2s ease-in-out infinite;
                }

                @keyframes legendMarioBadgeGlow {
                    0%, 100% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 30px rgba(255, 215, 0, 0.8);
                    }
                    50% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 40px rgba(255, 165, 0, 1), 0 0 50px rgba(255, 0, 0, 0.8), 0 0 60px rgba(128, 0, 128, 0.6);
                    }
                }

                .level-text {
                    color: #8B0000;
                    font-weight: bold;
                }

                .level-name {
                    color: #8B0000;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 5px;
                    display: block;
                }

                .question-card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 30px;
                    box-shadow: 0 8px 0 #8B0000, 0 20px 50px rgba(0, 0, 0, 0.2);
                    border: 4px solid #8B0000;
                    position: relative;
                    overflow: hidden;
                }

                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                }

                .level-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    border: 3px solid #8B0000;
                    box-shadow: 0 4px 0 #8B0000;
                    animation: levelBadgeGlow 2s ease-in-out infinite;
                }

                .level-badge {
                    background: linear-gradient(45deg, #87CEEB, #4682B4);
                    color: white;
                }

                .super-mario-badge {
                    background: linear-gradient(45deg, #FF0000, #FFD700, #00FF00);
                    color: white;
                    animation: superMarioBadgeGlow 2s ease-in-out infinite;
                }

                @keyframes levelBadgeGlow {
                    0%, 100% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 20px rgba(139, 0, 0, 0.3);
                    }
                    50% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 30px rgba(139, 0, 0, 0.5);
                    }
                }

                @keyframes superMarioBadgeGlow {
                    0%, 100% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 20px rgba(255, 0, 0, 0.5);
                    }
                    50% { 
                        box-shadow: 0 4px 0 #8B0000, 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6);
                    }
                }

                .super-mario-card {
                    border: 4px solid #FFD700;
                    box-shadow: 0 8px 0 #FFD700, 0 20px 50px rgba(0, 0, 0, 0.2);
                    animation: superMarioCardGlow 3s ease-in-out infinite;
                }

                @keyframes superMarioCardGlow {
                    0%, 100% { 
                        border-color: #FFD700;
                        box-shadow: 0 8px 0 #FFD700, 0 20px 50px rgba(0, 0, 0, 0.2);
                    }
                    50% { 
                        border-color: #FF0000;
                        box-shadow: 0 8px 0 #FF0000, 0 20px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 0, 0, 0.3);
                    }
                }

                .question-number {
                    background: linear-gradient(45deg, #FF0000, #DC143C);
                    color: white;
                    padding: 8px 15px;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    border: 2px solid #8B0000;
                    box-shadow: 0 4px 0 #8B0000;
                }

                .question-type {
                    font-size: 2rem;
                    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                }

                .question-text {
                    color: #8B0000;
                    font-size: 2.5rem;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 30px;
                    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
                }

                .input-section {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                }



                .long-division-display,
                .multiplication-display {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 25px;
                    background: linear-gradient(135deg, #FF0000, #DC143C);
                    border-radius: 20px;
                    color: white;
                    border: 3px solid #8B0000;
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                    transition: all 0.3s ease;
                }

                .long-division-display:hover,
                .multiplication-display:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .division-header,
                .multiplication-header {
                    margin-bottom: 20px;
                }

                .division-title,
                .multiplication-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    display: block;
                    margin-bottom: 10px;
                    color: #FFD700;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }

                .division-steps,
                .multiplication-steps {
                    margin-bottom: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 1.3rem;
                    font-weight: bold;
                    line-height: 1.8;
                }

                .division-step,
                .multiplication-step {
                    margin-bottom: 8px;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                    color: #FFD700;
                    font-weight: 600;
                }

                .answer-input {
                    width: 200px;
                    padding: 15px 20px;
                    border: 3px solid #8B0000;
                    border-radius: 15px;
                    font-size: 1.2rem;
                    text-align: center;
                    outline: none;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.9);
                    color: #8B0000 !important;
                    -webkit-text-fill-color: #8B0000 !important;
                    caret-color: #8B0000 !important;
                    box-shadow: 0 4px 0 #8B0000;
                }

                .answer-input:focus {
                    border-color: #FF0000;
                    box-shadow: 0 0 20px rgba(139, 0, 0, 0.3);
                    transform: scale(1.05);
                    color: #8B0000 !important;
                    -webkit-text-fill-color: #8B0000 !important;
                    caret-color: #8B0000 !important;
                }

                .answer-input::placeholder {
                    color: #8B0000 !important;
                    -webkit-text-fill-color: #8B0000 !important;
                    font-weight: 600;
                }

                .submit-button {
                    background: linear-gradient(45deg, #FF0000, #DC143C);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border: 3px solid #8B0000;
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                }

                .submit-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                .submit-button:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #8B0000, 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                .message {
                    padding: 15px 20px;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    text-align: center;
                    margin-top: 20px;
                }

                .message.correct {
                    background: rgba(0, 255, 136, 0.9);
                    border: 3px solid #00ff88;
                    color: #006600;
                    box-shadow: 0 4px 0 #00aa55;
                    position: relative;
                    top: 0;
                }

                .message.incorrect {
                    background: rgba(255, 107, 107, 0.9);
                    border: 3px solid #ff6b6b;
                    color: #8B0000;
                    box-shadow: 0 4px 0 #cc4444;
                    position: relative;
                    top: 0;
                }

                .message:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 currentColor, 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .reset-button {
                    background: rgba(255, 107, 107, 0.2);
                    color: #ff6b6b;
                    border: 3px solid #ff6b6b;
                    padding: 15px 30px;
                    border-radius: 20px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: block;
                    margin: 0 auto;
                    box-shadow: 0 4px 0 #8B0000;
                    position: relative;
                    top: 0;
                }

                .reset-button:hover {
                    background: rgba(255, 107, 107, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 0 #8B0000, 0 10px 25px rgba(255, 107, 107, 0.3);
                }

                .reset-button:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #8B0000, 0 10px 25px rgba(255, 107, 107, 0.3);
                }

                @media (max-width: 768px) {
                    .game-title {
                        font-size: 2.5rem;
                    }
                    
                    .hud {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    
                    .avatar-item {
                        grid-column: span 3;
                    }
                    
                    .question-text {
                        font-size: 1.8rem;
                    }
                    
                    .input-section {
                        flex-direction: column;
                    }
                    
                    .answer-input {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            `}</style>
        </>
    );
}
