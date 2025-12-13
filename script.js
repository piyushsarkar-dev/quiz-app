// Quiz Questions Database
const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1
    },
    {
        question: "What is the smallest prime number?",
        answers: ["0", "1", "2", "3"],
        correctAnswer: 2
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        answers: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: 2
    },
    {
        question: "What year did World War II end?",
        answers: ["1943", "1944", "1945", "1946"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2
    },
    {
        question: "Which country is home to the kangaroo?",
        answers: ["New Zealand", "Australia", "South Africa", "Brazil"],
        correctAnswer: 1
    },
    {
        question: "How many continents are there?",
        answers: ["5", "6", "7", "8"],
        correctAnswer: 2
    }
];

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const questionNumber = document.getElementById('question-number');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Start Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');
    showQuestion();
}

// Show Question
function showQuestion() {
    resetState();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    questionText.textContent = currentQuestion.question;
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    scoreDisplay.textContent = `Score: ${score}`;
    
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', () => selectAnswer(index));
        answerButtons.appendChild(button);
    });
}

// Reset State
function resetState() {
    nextBtn.style.display = 'none';
    selectedAnswer = null;
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Select Answer
function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = answerIndex;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const answerButtonsArray = Array.from(answerButtons.children);
    
    // Disable all buttons
    answerButtonsArray.forEach(btn => btn.disabled = true);
    
    // Show correct/incorrect
    if (answerIndex === currentQuestion.correctAnswer) {
        answerButtonsArray[answerIndex].classList.add('correct');
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        answerButtonsArray[answerIndex].classList.add('incorrect');
        answerButtonsArray[currentQuestion.correctAnswer].classList.add('correct');
    }
    
    nextBtn.style.display = 'block';
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const percentage = (score / quizQuestions.length) * 100;
    finalScore.textContent = `${score} / ${quizQuestions.length} (${percentage.toFixed(0)}%)`;
    
    if (percentage >= 80) {
        resultMessage.textContent = "Excellent! You did great! 🎉";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good job! Keep learning! 👍";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad! You can do better! 💪";
    } else {
        resultMessage.textContent = "Keep practicing! You'll improve! 📚";
    }
}

// Restart Quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    resultScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
}
