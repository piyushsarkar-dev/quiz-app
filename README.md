# Quiz Application

A simple, interactive web-based quiz application built with HTML, CSS, and JavaScript.

## Features

- 10 multiple-choice questions covering various topics
- Real-time score tracking
- Immediate feedback on answers (correct/incorrect)
- Responsive design for mobile and desktop
- Beautiful gradient UI with smooth animations
- Results summary with performance feedback

## How to Use

1. Open `index.html` in your web browser
2. Click "Start Quiz" to begin
3. Read each question and select your answer
4. Click "Next Question" to proceed
5. View your final score and performance feedback
6. Click "Restart Quiz" to try again

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- Vanilla JavaScript (ES6+)

## File Structure

```
quiz-app/
├── index.html    # Main HTML structure
├── style.css     # Styling and animations
├── script.js     # Quiz logic and interactivity
└── README.md     # Documentation
```

## Customization

To add or modify questions, edit the `quizQuestions` array in `script.js`:

```javascript
const quizQuestions = [
    {
        question: "Your question here?",
        answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0  // Index of correct answer (0-3)
    },
    // Add more questions...
];
```

## License

See LICENSE file for details.