// Quiz questions and answers
const quizData = [
    {
        question: "Vad är 5 + 3?",
        options: ["6", "7", "8", "9"],
        correct: "8"
    },
    {
        question: "Vad är 12 - 5?",
        options: ["5", "7", "6", "8"],
        correct: "7"
    },
    {
        question: "Vad är 9 × 3?",
        options: ["27", "18", "24", "30"],
        correct: "27"
    },
    {
        question: "Vad är 15 ÷ 3?",
        options: ["3", "4", "5", "6"],
        correct: "5"
    }
];

// DOM elements
const quizContainer = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");
const resultEl = document.getElementById("result");

// Load quiz questions
function loadQuiz() {
    quizData.forEach((data, index) => {
        // Create question element
        const questionEl = document.createElement("div");
        questionEl.classList.add("question");
        questionEl.innerHTML = `<h3>${index + 1}. ${data.question}</h3>`;
        
        // Create options
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

        // Append question and options to quiz container
        questionEl.appendChild(optionsList);
        quizContainer.appendChild(questionEl);
    });
}

// Calculate score
function calculateScore() {
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
    const score = calculateScore();
    resultEl.innerHTML = `Du fick ${score} av ${quizData.length} rätt!`;
}

// Event listener
submitBtn.addEventListener("click", showResult);

// Load quiz on page load
loadQuiz();
