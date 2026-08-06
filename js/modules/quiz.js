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
        const optionsEl = document.getElementById('quiz-options-container');

        if (optionsEl) {
            const buttons = optionsEl.querySelectorAll('button');
            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === currentQ.correctAnswer) {
                    btn.className = "w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold mb-3 transition-all";
                } else if (idx === optionIndex) {
                    btn.className = "w-full text-left p-4 rounded-xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold mb-3 transition-all";
                }
            });
        }

        const isCorrect = optionIndex === currentQ.correctAnswer;
        if (isCorrect) {
            state.score += 10;
            if (typeof window.showToast === 'function') {
                window.showToast("Chính xác! +10 GEMS Xu", "success");
            }
        }

        let explanationCard = document.getElementById('quiz-explanation-card');
        if (!explanationCard && optionsEl) {
            explanationCard = document.createElement('div');
            explanationCard.id = 'quiz-explanation-card';
            optionsEl.appendChild(explanationCard);
        }

        if (explanationCard) {
            explanationCard.className = `p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'} mt-3 mb-4 text-xs font-medium leading-relaxed animate-fade-in`;
            explanationCard.innerHTML = `<strong>💡 Giải thích y khoa:</strong> ${currentQ.explanation || (isCorrect ? 'Đáp án hoàn toàn chính xác theo tài liệu chẩn đoán lâm sàng.' : 'Hãy tham khảo lại tài liệu chuyên môn.')}`;
        }

        state.userAnswers.push(optionIndex);

        setTimeout(() => {
            state.currentIndex++;
            if (state.currentIndex < state.questions.length) {
                window.renderQuizQuestion();
            } else {
                window.finishQuiz();
            }
        }, 2200);
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
