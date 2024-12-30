document.addEventListener("DOMContentLoaded", () => {
    const basePath = 'data/';
    const subject = document.body.getAttribute('data-subject');

    if (!subject) {
        console.error("No subject specified in the HTML file.");
        return;
    }

    const loadQuiz = (lessonId, course, chapter) => {
        const quizPath = `${basePath}${subject}/${course}/${chapter}.json`;

        fetch(quizPath)
            .then(response => response.json())
            .then(data => {
                const lesson = data.find(lesson => lesson.id === lessonId);
                if (lesson && lesson.quiz) {
                    renderQuiz(lesson.quiz);
                } else {
                    console.error("Quiz not found for the specified lesson.");
                }
            })
            .catch(error => {
                console.error("Error loading quiz data:", error);
            });
    };

    const renderQuiz = (quiz) => {
        const quizContainer = document.getElementById("quiz-container");

        if (!quizContainer) {
            console.error("Quiz container not found!");
            return;
        }

        quizContainer.innerHTML = ""; // Clear any existing content

        const title = document.createElement("h3");
        title.textContent = "Quiz";

        const questionList = document.createElement("div");
        questionList.className = "quiz-questions";

        quiz.questions.forEach((question, index) => {
            const questionBlock = document.createElement("div");
            questionBlock.className = "quiz-question";

            const questionText = document.createElement("p");
            questionText.textContent = `${index + 1}. ${question.text}`;
            questionBlock.appendChild(questionText);

            const options = document.createElement("ul");
            options.className = "options";
            options.style.listStyleType = "none"; // Remove bullet points

            question.options.forEach((option, optIndex) => {
                const optionItem = document.createElement("li");

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `question-${index}`;
                radio.value = optIndex;

                const label = document.createElement("label");
                label.textContent = option;
                label.prepend(radio);

                optionItem.appendChild(label);
                options.appendChild(optionItem);
            });

            questionBlock.appendChild(options);
            questionList.appendChild(questionBlock);
        });

        const submitButton = document.createElement("button");
        submitButton.textContent = "Rätta quiz";
        submitButton.className = "btn";
        submitButton.addEventListener("click", () => {
            evaluateQuiz(quiz, submitButton);
        });

        quizContainer.appendChild(title);
        quizContainer.appendChild(questionList);
        quizContainer.appendChild(submitButton);

        quizContainer.style.display = "block"; // Ensure it's visible
    };

    const evaluateQuiz = (quiz, submitButton) => {
        const quizContainer = document.getElementById("quiz-container");
        let score = 0;

        quiz.questions.forEach((question, index) => {
            const questionBlock = document.querySelector(`.quiz-question:nth-child(${index + 1})`);
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            const options = questionBlock.querySelectorAll(".options li");

            options.forEach((option, optIndex) => {
                const label = option.querySelector("label");
                label.style.fontWeight = "normal";
                label.style.color = "";

                if (optIndex === question.correctOption) {
                    label.style.fontWeight = "bold";
                    label.style.color = "green";
                }

                if (selectedOption && parseInt(selectedOption.value) === optIndex) {
                    if (optIndex === question.correctOption) {
                        score++;
                    } else {
                        label.style.fontWeight = "bold";
                        label.style.color = "red";
                    }
                }
            });
        });

        const scoreDisplay = document.createElement("p");
        scoreDisplay.textContent = `Your score: ${score}/${quiz.questions.length}`;
        scoreDisplay.style.fontWeight = "bold";
        scoreDisplay.style.marginTop = "20px";

        const existingScore = quizContainer.querySelector(".score-display");
        if (existingScore) {
            existingScore.replaceWith(scoreDisplay);
        } else {
            scoreDisplay.className = "score-display";
            quizContainer.appendChild(scoreDisplay);
        }

        // Disable and update the button
        submitButton.disabled = true;
        submitButton.textContent = "Försök igen";
        submitButton.addEventListener("click", () => {
            renderQuiz(quiz); // Reset the quiz
        });
    };

    // Listen for custom events to load the quiz
    document.addEventListener("startQuiz", (event) => {
        const { lessonId, course, chapter } = event.detail;
        loadQuiz(lessonId, course, chapter);
    });
});
