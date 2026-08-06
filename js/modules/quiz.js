/* js/modules/quiz.js - Interactive Quiz Engine & Explanations */
(function() {
    window.currentQuizState = {
        questions: [],
        currentIndex: 0,
        score: 0,
        userAnswers: []
    };

    window.startQuiz = function(bookId, chapterId) {
        const quizData = (window.QUIZ_DATA && window.QUIZ_DATA[chapterId]) || [];
        window.currentQuizState.questions = quizData;
        window.currentQuizState.currentIndex = 0;
        window.currentQuizState.score = 0;
        window.currentQuizState.userAnswers = [];

        const quizModal = document.getElementById('view-quiz-modal');
        if (quizModal) {
            quizModal.classList.remove('hidden');
        }
        window.renderQuizQuestion();
    };

    window.renderQuizQuestion = function() {
        const state = window.currentQuizState;
        if (!state.questions || state.questions.length === 0) {
            if (typeof window.showToast === 'function') {
                window.showToast("Chương này chưa có bài trắc nghiệm.", "info");
            }
            return;
        }

        const currentQ = state.questions[state.currentIndex];
        const titleEl = document.getElementById('quiz-title');
        const optionsEl = document.getElementById('quiz-options-container');

        if (titleEl) {
            titleEl.textContent = `Câu ${state.currentIndex + 1}/${state.questions.length}: ${currentQ.question}`;
        }

        if (optionsEl) {
            optionsEl.innerHTML = '';
            currentQ.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all font-medium mb-3";
                btn.textContent = opt;
                btn.onclick = function() {
                    window.submitAnswer(idx);
                };
                optionsEl.appendChild(btn);
            });
        }
    };

    window.submitAnswer = function(optionIndex) {
        const state = window.currentQuizState;
        const currentQ = state.questions[state.currentIndex];

        if (optionIndex === currentQ.correctAnswer) {
            state.score += 10;
            if (typeof window.showToast === 'function') {
                window.showToast("Chính xác! +10 GEMS Xu", "success");
            }
        } else {
            if (typeof window.showToast === 'function') {
                window.showToast("Rất tiếc! " + (currentQ.explanation || "Hãy thử lại lần sau."), "warning");
            }
        }

        state.userAnswers.push(optionIndex);
        state.currentIndex++;

        if (state.currentIndex < state.questions.length) {
            window.renderQuizQuestion();
        } else {
            window.finishQuiz();
        }
    };

    window.finishQuiz = function() {
        const state = window.currentQuizState;
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        if (window.appState) {
            window.appState.userCoins += state.score;
            if (typeof window.saveState === 'function') {
                window.saveState();
            }
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Hoàn thành Quiz! Bạn nhận được ${state.score} GEMS Xu`, "success");
        }

        const quizModal = document.getElementById('view-quiz-modal');
        if (quizModal) {
            quizModal.classList.add('hidden');
        }
    };
})();
