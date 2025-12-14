# 🎯 Quiz Application (HTML / CSS / JavaScript)

A modern, dark-themed quiz web app built with **pure HTML, CSS, and JavaScript** — no frameworks or libraries required.  
It asks for the user’s name, verifies a fixed password (**80808**), and then runs an interactive quiz with animations and a celebration screen for high scores.

---

## 🚀 Features

- 🔒 **Name & Login Flow** (Password: `80808`)  
- 🧠 **Quiz System** with multiple-choice questions (4 options per question)  
- 🚫 **No answer visibility before submission**  
- 🔁 **Previous questions can be viewed but not edited**  
- 🌗 **Fully dark mode** with a smooth, modern interface  
- 🎉 **Animated results page**:
  - Score summary  
  - Celebration animation (balloons, emojis, name animation) if score ≥ 75%  
  - “Excellent!” banner for top performance  
- 💾 Uses `localStorage` to keep session data  
- 📱 **Responsive & accessible** on all devices  

---

## 🧩 Folder Structure

```
project/
│
├── index.html        # Main HTML file
├── styles.css        # All CSS styles (dark mode + animations)
├── app.js            # Quiz logic and interactions
└── questions.json    # Quiz data (editable)
```

---

## ⚙️ Setup & Usage

1. **Download or clone** this project:
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd quiz-app
   ```

2. **Open** the project in your browser:
   - Just double-click `index.html`  
   *(No server needed — runs locally)*

3. **Follow the flow:**
   - Enter your **name**
   - Enter password **80808**
   - Start the quiz  
   - Select one answer per question  
   - Click **Next** to move forward  
   - After finishing, see your **score and animation**  

---

## 📚 Editing Questions

All quiz questions are stored in `questions.json` (or inside `app.js` as a constant).

Example format:
```json
{
  "quizTitle": "MS Word Basics",
  "questions": [
    {
      "id": "q1",
      "title": "Which tab in MS Word contains the 'Insert Table' option?",
      "options": [
        { "id": "a", "text": "Home" },
        { "id": "b", "text": "Insert" },
        { "id": "c", "text": "Layout" },
        { "id": "d", "text": "Design" }
      ],
      "correctOptionId": "b"
    }
  ]
}
```

You can add as many questions as you like — just follow this structure.

---

## 🧠 Rules

- The **password** to enter the quiz is always:  
  **`80808`**

- You **cannot skip** questions.  
- You **cannot change answers** for previous questions.  
- You can **review previous answers** (read-only).  
- If your score ≥ 75%, the app celebrates your success with animations.

---

## 🎨 Design Notes

- Dark mode only  
- Subtle MS Word–style animation transitions  
- Responsive layout for both desktop and mobile  
- Accessible with keyboard navigation (`Tab`, `Enter`, `Arrow` keys)

---

## 💡 Future Improvements

- Add backend authentication (Node.js + Express)
- Add database (MongoDB or Firebase) for user progress
- Add custom quiz creation for admins
- Implement leaderboard system

---

## 🧾 License

This project is open source and free to use.  
You can modify and expand it for your own educational or learning purposes.
