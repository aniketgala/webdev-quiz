// Quiz Application JavaScript
class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswerSelected = false;
        
        // DOM Elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressBar = document.getElementById('progressBar');
        this.questionCounter = document.getElementById('questionCounter');
        this.totalQuestions = document.getElementById('totalQuestions');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        
        // Result elements
        this.scoreNumber = document.getElementById('scoreNumber');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsMessage = document.getElementById('resultsMessage');
        this.correctCount = document.getElementById('correctCount');
        this.wrongCount = document.getElementById('wrongCount');
        this.accuracy = document.getElementById('accuracy');
        
        // Initialize the app
        this.init();
    }
    
    async init() {
        try {
            // Add event listeners
            this.addEventListeners();
            
            // Load questions
            await this.loadQuestions();
            
            // Set total questions
            this.totalQuestions.textContent = this.questions.length;
            
            console.log('Quiz app initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize quiz app:', error);
            this.showError('Failed to load quiz questions. Please refresh the page.');
        }
    }
    
    addEventListeners() {
        // Start quiz button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startQuiz();
        });
        
        // Restart quiz button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartQuiz();
        });
        
        // Share results button
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResults();
        });
    }
    
    async loadQuestions() {
        this.showLoading(true);
        let loaded = false;
        try {
            // Try normal fetch (works when served via http/https)
            const response = await fetch('questions.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data.questions) && data.questions.length > 0) {
                this.questions = data.questions;
                loaded = true;
            }
        } catch (error) {
            console.warn('Primary fetch failed, attempting fallback to embedded questions. Reason:', error);
        } finally {
            this.showLoading(false);
        }

        // Fallback for file:// or any environment where fetching JSON is blocked
        if (!loaded || !this.questions || this.questions.length === 0) {
            const fallback = this.getEmbeddedQuestionsFallback();
            if (fallback && fallback.length) {
                this.questions = fallback;
                loaded = true;
            }
        }

        if (!loaded) {
            throw new Error('No questions available');
        }

        // Shuffle questions for variety
        this.shuffleArray(this.questions);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Embedded fallback questions for environments where fetching local JSON is blocked (e.g., file://)
    getEmbeddedQuestionsFallback() {
        try {
            return [
                { "question": "What's the most honest thing a developer can say about their CSS?", "options": ["I know exactly why it works", "I have no idea why it works, but it does", "It's perfectly organized and maintainable", "I never copy-paste from Stack Overflow"], "correct": "I have no idea why it works, but it does" },
                { "question": "Why don't HTML developers ever get locked out?", "options": ["They always use strong passwords", "They know all the escape sequences", "They always have the right <key>", "They never close their <door>"], "correct": "They never close their <door>" },
                { "question": "What's the developer's favorite way to center a div?", "options": ["display: flex; justify-content: center; align-items: center;", "Pray to the CSS gods and use margin: auto;", "Google it for the 847th time", "All of the above"], "correct": "All of the above" },
                { "question": "What happens when you fix one bug in JavaScript?", "options": ["Your code becomes perfect", "Two more bugs appear", "You become a senior developer", "The universe achieves balance"], "correct": "Two more bugs appear" },
                { "question": "How do you comfort a JavaScript bug?", "options": ["console.log('There, there')", "Try/catch it in a hug", "Promise it will be resolved", "Tell it undefined is not a function of you"], "correct": "console.log('There, there')" },
                { "question": "What's the difference between Java and JavaScript?", "options": ["Java is to JavaScript as Car is to Carpet", "JavaScript is Java's younger, cooler sibling", "Java requires more coffee to understand", "There's no difference, it's all the same"], "correct": "Java is to JavaScript as Car is to Carpet" },
                { "question": "Why did the CSS developer break up with HTML?", "options": ["They had no class", "There was no chemistry", "They couldn't align their relationship", "HTML was too semantic for them"], "correct": "They couldn't align their relationship" },
                { "question": "What's a developer's favorite type of party?", "options": ["A function call", "An event handler", "A callback party", "A block party (with lots of curly braces)"], "correct": "A callback party" },
                { "question": "How many programmers does it take to change a light bulb?", "options": ["None, that's a hardware problem", "One, but they'll rewrite the entire lighting system", "404: Light bulb not found", "It depends on the framework"], "correct": "None, that's a hardware problem" },
                { "question": "What do you call a programmer who doesn't comment their code?", "options": ["A mystery writer", "Future enemy of themselves", "Job security specialist", "All of the above"], "correct": "All of the above" },
                { "question": "Why do React developers always seem so happy?", "options": ["They love their components", "They're always in a good state", "They know how to handle props-erly", "They've mastered the art of hooks"], "correct": "They're always in a good state" },
                { "question": "What's the most terrifying thing in web development?", "options": ["A deadline", "Internet Explorer support", "A client saying 'Can you make it pop more?'", "Merging branches on Friday afternoon"], "correct": "Merging branches on Friday afternoon" },
                { "question": "How do you explain APIs to a non-technical person?", "options": ["It's like a waiter at a restaurant", "It's magic, don't question it", "It's the internet's way of gossiping", "It's when computers have a polite conversation"], "correct": "It's like a waiter at a restaurant" },
                { "question": "What's the developer's response to 'It works on my machine'?", "options": ["Then we'll ship your machine", "Have you tried turning it off and on again?", "Must be a user error", "Let's dockerize your machine"], "correct": "Then we'll ship your machine" },
                { "question": "Why don't developers trust stairs?", "options": ["They prefer elevators (lifts)", "They're always up to something", "Because they're always debugging steps", "They know about infinite loops"], "correct": "Because they're always debugging steps" },
                { "question": "What's the first rule of web development?", "options": ["Always blame the browser", "It's not a bug, it's a feature", "Test in production", "Never trust user input"], "correct": "Never trust user input" },
                { "question": "How does a developer fix a relationship?", "options": ["Try to catch the exception", "Refactor the entire relationship", "Add more debugging statements", "Check if it's undefined"], "correct": "Try to catch the exception" },
                { "question": "What's the most used JavaScript method?", "options": ["console.log()", "stackoverflow.copy()", "panicMode.activate()", "hopeItWorks()"], "correct": "console.log()" },
                { "question": "Why did the developer quit their job?", "options": ["They didn't get arrays", "The company had no class", "They couldn't handle the pressure", "Their boss was null and void"], "correct": "They didn't get arrays" },
                { "question": "What's the developer's favorite exercise?", "options": ["Git push-ups", "Flexbox yoga", "Runtime running", "Debugging squats"], "correct": "Git push-ups" },
                { "question": "How do you know if someone is a frontend developer?", "options": ["They'll tell you within 5 minutes", "They complain about IE while using Chrome", "They have strong opinions about semicolons", "They measure everything in pixels and ems"], "correct": "They have strong opinions about semicolons" },
                { "question": "What's the backend developer's motto?", "options": ["Make it work, then make it pretty", "If you can see it, you're doing it wrong", "200 OK is all that matters", "The database knows best"], "correct": "If you can see it, you're doing it wrong" },
                { "question": "Why do developers prefer dark mode?", "options": ["It's easier on the eyes during 3 AM coding sessions", "Light attracts bugs", "They're secretly vampires", "White background costs more electricity"], "correct": "Light attracts bugs" },
                { "question": "What's a developer's favorite type of music?", "options": ["Heavy metal (because of all the frameworks)", "Hip-hop (for all the loops)", "Jazz (it's all about improvisation)", "Classical (everything has good composition)"], "correct": "Jazz (it's all about improvisation)" },
                { "question": "How many developers does it take to screw in a light bulb?", "options": ["None, they just redefine darkness as the new standard", "One, but they'll create a framework for it first", "Two, one to hold the bulb and one to rotate the house", "That's a legacy lighting system, we need to rewrite it"], "correct": "None, they just redefine darkness as the new standard" },
                { "question": "What's the developer's favorite day of the week?", "options": ["Friday (deployment day, what could go wrong?)", "Monday (fresh bugs to fix)", "Saturday (no meetings, just code)", "Any day ending in segmentation fault"], "correct": "Friday (deployment day, what could go wrong?)" },
                { "question": "Why don't developers ever get lost?", "options": ["They always know their current directory", "They have GPS (Git Position System)", "They follow the breadcrumbs in their code", "They can always find their way home (directory)"], "correct": "They always know their current directory" },
                { "question": "What's the most romantic thing a developer can say?", "options": ["You're the only one in my git log", "You make my heart race condition", "I'd never throw an exception with you", "You're my favorite dependency"], "correct": "You're the only one in my git log" },
                { "question": "How do developers stay fit?", "options": ["By running npm install", "Doing daily scrums", "Lifting heavy databases", "Sprint planning"], "correct": "Doing daily scrums" },
                { "question": "What's the developer's last words before going live?", "options": ["What could possibly go wrong?", "I tested it thoroughly on localhost", "The staging environment is identical to production", "I'm sure nobody will notice that bug"], "correct": "What could possibly go wrong?" }
            ];
        } catch (e) {
            console.error('Failed to provide embedded fallback questions:', e);
            return [];
        }
    }
    
    showLoading(show) {
        if (show) {
            this.loadingScreen.style.display = 'flex';
        } else {
            this.loadingScreen.style.display = 'none';
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: rgba(255, 51, 102, 0.1);
                border: 1px solid #ff3366;
                color: #ff3366;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px;
                font-size: 1.1rem;
            ">
                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];

        if (!this.questions || this.questions.length === 0) {
            this.showError('Questions are unavailable. If you opened the file directly, please run a local server or try again.');
            return;
        }
        
        // Transition from welcome to quiz screen
        this.transitionScreens(this.welcomeScreen, this.quizScreen);
        
        // Load first question
        setTimeout(() => {
            this.loadQuestion();
            this.updateProgress();
        }, 300);
    }
    
    transitionScreens(fromScreen, toScreen) {
        fromScreen.classList.add('screen-transition-out');
        
        setTimeout(() => {
            fromScreen.style.display = 'none';
            fromScreen.classList.remove('screen-transition-out');
            
            toScreen.style.display = 'block';
            toScreen.classList.add('screen-transition-in');
            
            setTimeout(() => {
                toScreen.classList.remove('screen-transition-in');
            }, 500);
        }, 500);
    }
    
    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        this.isAnswerSelected = false;
        
        // Update question text with typing animation
        this.typeText(this.questionText, question.question);
        
        // Clear and populate options
        this.optionsContainer.innerHTML = '';
        
        // Create options with staggered animation
        question.options.forEach((option, index) => {
            setTimeout(() => {
                const optionBtn = this.createOptionButton(option, index);
                this.optionsContainer.appendChild(optionBtn);
                
                // Add slide-in animation
                requestAnimationFrame(() => {
                    optionBtn.style.opacity = '1';
                    optionBtn.style.transform = 'translateX(0)';
                });
            }, index * 100);
        });
    }
    
    createOptionButton(option, index) {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.style.opacity = '0';
        optionBtn.style.transform = 'translateX(-50px)';
        optionBtn.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        optionBtn.addEventListener('click', () => {
            this.selectAnswer(option, optionBtn);
        });
        
        return optionBtn;
    }
    
    selectAnswer(selectedOption, buttonElement) {
        if (this.isAnswerSelected) return;
        
        this.isAnswerSelected = true;
        const question = this.questions[this.currentQuestionIndex];
        const correctAnswer = question.correct;
        const isCorrect = selectedOption === correctAnswer;
        
        // Store user answer
        this.userAnswers.push({
            question: question.question,
            selected: selectedOption,
            correct: correctAnswer,
            isCorrect: isCorrect
        });
        
        if (isCorrect) {
            this.score++;
        }
        
        // Animate answer feedback
        this.showAnswerFeedback(buttonElement, isCorrect);
        
        // Highlight correct answer if user was wrong
        if (!isCorrect) {
            this.highlightCorrectAnswer(correctAnswer);
        }
        
        // Disable all options
        const allOptions = document.querySelectorAll('.option-btn');
        allOptions.forEach(btn => btn.classList.add('disabled'));
        
        // Auto-proceed to next question or results
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.showResults();
            }
        }, 2000);
    }
    
    showAnswerFeedback(buttonElement, isCorrect) {
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.createParticles(buttonElement, '#00ff88');
        } else {
            buttonElement.classList.add('incorrect');
        }
    }
    
    highlightCorrectAnswer(correctAnswer) {
        const allOptions = document.querySelectorAll('.option-btn');
        allOptions.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
                this.createParticles(btn, '#00ff88');
            }
        });
    }
    
    createParticles(element, color) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    left: ${centerX}px;
                    top: ${centerY}px;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (i * 30) * Math.PI / 180;
                const velocity = 50 + Math.random() * 50;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                let x = 0, y = 0;
                let opacity = 1;
                
                const animate = () => {
                    x += vx * 0.02;
                    y += vy * 0.02 + 0.5; // gravity
                    opacity -= 0.02;
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                    particle.style.opacity = opacity;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        document.body.removeChild(particle);
                    }
                };
                
                animate();
            }, i * 20);
        }
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.updateProgress();
        
        // Slide out current question
        const questionContainer = document.querySelector('.question-container');
        questionContainer.style.transform = 'translateX(-100px)';
        questionContainer.style.opacity = '0';
        
        setTimeout(() => {
            this.loadQuestion();
            
            // Slide in new question
            questionContainer.style.transform = 'translateX(50px)';
            setTimeout(() => {
                questionContainer.style.transform = 'translateX(0)';
                questionContainer.style.opacity = '1';
            }, 50);
        }, 300);
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.questionCounter.textContent = this.currentQuestionIndex + 1;
        
        // Add progress milestone effects
        if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
            this.progressBar.style.boxShadow = '0 0 20px var(--accent-cyan)';
            setTimeout(() => {
                this.progressBar.style.boxShadow = 'none';
            }, 1000);
        }
    }
    
    showResults() {
        // Transition to results screen
        this.transitionScreens(this.quizScreen, this.resultsScreen);
        
        setTimeout(() => {
            this.animateResults();
        }, 600);
    }
    
    animateResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const wrongCount = this.questions.length - this.score;
        
        // Animate score counter
        this.animateNumber(this.scoreNumber, 0, this.score, 1500);
        
        // Update stats with delay
        setTimeout(() => {
            this.correctCount.textContent = this.score;
            this.wrongCount.textContent = wrongCount;
            this.accuracy.textContent = percentage;
        }, 800);
        
        // Set results message
        setTimeout(() => {
            const { title, message } = this.getResultsMessage(percentage);
            this.resultsTitle.textContent = title;
            this.typeText(this.resultsMessage, message);
        }, 1200);
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(start + (end - start) * easeOutQuart);
            element.textContent = current;
            
            // Add scale animation at milestones
            if (current !== parseInt(element.dataset.lastValue || 0)) {
                element.style.transform = 'scale(1.1)';
                element.style.animation = 'countUp 0.3s ease';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.animation = '';
                }, 300);
            }
            element.dataset.lastValue = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    getResultsMessage(percentage) {
        if (percentage === 100) {
            return {
                title: "🏆 Perfect Score! 🏆",
                message: "You're a true Web Development Master! Time to update your LinkedIn with 'HTML Whisperer' and 'CSS Wizard' 🧙‍♂️✨"
            };
        } else if (percentage >= 90) {
            return {
                title: "🚀 Outstanding! 🚀",
                message: "Almost perfect! You probably know more CSS tricks than the browser itself. Just don't tell anyone you still Google 'center a div' sometimes 😉"
            };
        } else if (percentage >= 80) {
            return {
                title: "⭐ Excellent Work! ⭐",
                message: "Great job! You're definitely not the person who writes CSS like `margin-top: -1000px` to fix layouts. Keep it up! 💪"
            };
        } else if (percentage >= 70) {
            return {
                title: "👍 Pretty Good! 👍",
                message: "Nice work! You've got solid skills. Just remember: friends don't let friends use `<table>` for layouts anymore 😄"
            };
        } else if (percentage >= 60) {
            return {
                title: "📚 Keep Learning! 📚",
                message: "You're on the right track! A few more tutorials and you'll be writing code that doesn't make senior developers cry 😅"
            };
        } else if (percentage >= 50) {
            return {
                title: "🤔 Not Bad, Not Great 🤔",
                message: "You're somewhere between 'I can code' and 'Why isn't my div blue?'. Time to hit those docs! 📖"
            };
        } else if (percentage >= 30) {
            return {
                title: "😅 Room for Improvement 😅",
                message: "Hey, everyone starts somewhere! Remember: even senior devs once wrote `<center>` tags unironically. You got this! 💪"
            };
        } else {
            return {
                title: "🙈 Oops! 🙈",
                message: "No worries! We've all been there. Fun fact: The first website ever created had no CSS at all. You're already ahead of 1991! 🎉"
            };
        }
    }
    
    typeText(element, text, speed = 50) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    restartQuiz() {
        // Reset progress bar
        this.progressBar.style.width = '0%';
        
        // Reset counters
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questionCounter.textContent = '1';
        
        // Shuffle questions again
        this.shuffleArray(this.questions);
        
        // Transition back to welcome screen
        this.transitionScreens(this.resultsScreen, this.welcomeScreen);
    }
    
    shareResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const text = `🎯 I just scored ${this.score}/${this.questions.length} (${percentage}%) on the Web Dev Quiz Challenge! 🚀\n\nThink you can beat my score? Try it out! 💪\n\n#WebDevelopment #Quiz #Challenge`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Quiz Results',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Results copied to clipboard! 📋');
            }).catch(() => {
                // Final fallback: show alert
                alert(text);
            });
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 92, 246, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            backdrop-filter: blur(10px);
            animation: fadeInUp 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Initialize the quiz app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

// Add some fun Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami Code Easter Egg
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    if (!window.konamiIndex) window.konamiIndex = 0;
    
    if (e.code === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            document.body.style.animation = 'rainbow 2s ease infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10000);
            window.konamiIndex = 0;
        }
    } else {
        window.konamiIndex = 0;
    }
});

// Add rainbow animation for Easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%); }
        to { opacity: 0; transform: translate(-50%, -60px); }
    }
`;
document.head.appendChild(style);
