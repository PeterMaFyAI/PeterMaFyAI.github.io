// Quiz data for different subjects
const quizzes = {
    matematik: [
        {
            question: "Vad är 5 + 3?",
            options: ["6", "7", "8", "9"],
            correct: "8"
        },
        {
            question: "Vad är 12 - 5?",
            options: ["5", "7", "6", "8"],
            correct: "7"
        }
    ],
    fysik: [
        {
            question: "Vad är Newtons första lag?",
            options: [
                "En kropp i vila förblir i vila",
                "Kraft är lika med massa gånger acceleration",
                "För varje kraft finns en lika stor motkraft",
                "Energi kan inte förstöras"
            ],
            correct: "En kropp i vila förblir i vila"
        },
        {
            question: "Vad är enheten för kraft?",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            correct: "Newton"
        }
    ],
    ai: [
        {
            question: "Vad står AI för?",
            options: ["Artificiell Insikt", "Artificiell Intelligens", "Automatiserad Interaktion", "Analytisk Intuition"],
            correct: "Artificiell Intelligens"
        },
        {
            question: "Vilken metod används ofta i maskininlärning?",
            options: ["Gradient Descent", "Newton's Law", "String Theory", "Ohm's Law"],
            correct: "Gradient Descent"
        }
    ]
};

// DOM elements
const quizContainer = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const submitBtn = document.getElementById("submit");
const quizWrapper = document.getElementById("quiz-container");

let currentQuiz = null; // Store the active quiz

// Load quiz questions
function loadQuiz(quizData) {
    quizContainer.innerHTML = ""; // Clear previous quiz
    quizData.forEach((data, index) => {
        const questionEl = document.createElement("div");
        questionEl.classList.add("question");
        questionEl.innerHTML = `<h3>${index + 1}. ${data.question}</h3>`;
        
        const optionsList = document.createElement("ul");
        optionsList.classList.add("options");
        data.options.forEach(option => {
            const optionEl = document.createElement("li");
            optionEl.innerHTML = `
                <label>
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                </label>
            `;
            optionsList.appendChild(optionEl);
        });

        questionEl.appendChild(optionsList);
        quizContainer.appendChild(questionEl);
    });

    // Show the quiz container
    quizWrapper.classList.remove("hidden");
    currentQuiz = quizData; // Save the active quiz
}

// Calculate score
function calculateScore(quizData) {
    let score = 0;

    quizData.forEach((data, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && selectedOption.value === data.correct) {
            score++;
        }
    });

    return score;
}

// Show result
function showResult() {
    if (currentQuiz) {
        const score = calculateScore(currentQuiz);
        resultEl.innerHTML = `Du fick ${score} av ${currentQuiz.length} rätt!`;
    } else {
        resultEl.innerHTML = "Välj ett quiz först!";
    }
}

// Start quiz for a specific subject
function startQuiz(subject) {
    if (quizzes[subject]) {
        loadQuiz(quizzes[subject]);
        resultEl.innerHTML = ""; // Clear previous results
    } else {
        alert("Det finns inga frågor för detta ämne.");
    }
}

// Event listener for submit button
submitBtn.addEventListener("click", showResult);
