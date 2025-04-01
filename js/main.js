

import { setupAudio, playSound, updateSoundState } from './audio.js';
import { setSarcasmLevel, commentsOperation, addComment, addRandomComment, addResultComment, checkSpecialNumbers } from './comments.js';
import { applyRandomEffects, flashScreen } from './effects.js';
import { isNumeric } from './utils.js';

const display = document.getElementById('display');
const comment = document.getElementById('comment');
const loadingBar = document.getElementById('loading');
const calculatorWrapper = document.getElementById('calculator-wrapper');
const calculator = document.getElementById('calculator');
const buttonsContainer = document.getElementById('buttons-container');
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');
const equalsBtn = document.getElementById('equals');
const megaCorpBtn = document.getElementById('megacorp');
const shareBtn = document.getElementById('share');

let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;
let sarcasmLevel = 'snarky';
let infernalMode = false;
let soundEnabled = true;
let interactionLocked = false;

function setupEventListeners() {
    document.getElementById('mild').addEventListener('click', () => setSarcasmLevel('mild'));
    document.getElementById('snarky').addEventListener('click', () => setSarcasmLevel('snarky'));
    document.getElementById('brutal').addEventListener('click', () => setSarcasmLevel('brutal'));

    document.getElementById('infernal-mode').addEventListener('change', (e) => {
        infernalMode = e.target.checked;
        addComment(infernalMode ? "Infernal Mode Unleashed!" : "Infernal Mode Deactivated.");
        playSound(infernalMode ? 'evil' : 'sigh');
    });

    document.getElementById('sound').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        addComment(soundEnabled ? "The sounds of your suffering will now commence." : "Silence it is.");
        updateSoundState(soundEnabled);
    });

    buttonsContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => handleButtonPress(button));
    });
}

function handleButtonPress(button) {
    if (interactionLocked) return;

    const value = button.dataset.value;
    const id = button.id;
    let actionFn;

    const operators = ['/', '*', '-', '+'];
    const isOperator = value && operators.includes(value);

    switch (id) {
        case 'clear': actionFn = handleClear; break;
        case 'backspace': actionFn = handleBackspace; break;
        case 'equals': actionFn = handleEquals; break;
        case 'megacorp': actionFn = () => addComment("MegaCorp™ has claimed your soul."); break;
        case 'share': actionFn = () => navigator.clipboard.writeText(currentInput); break;
    }

    if (!actionFn && value !== undefined) {
        let corruptedValue = value;
        if (infernalMode && isNumeric(value) && Math.random() < 0.05) {
            corruptedValue = Math.floor(Math.random() * 10).toString();
            addComment(`Oops. You pressed ${corruptedValue} instead of ${value}. My bad.`);
            playSound('wrong');
            flashScreen();
        }

        if (isOperator) {
            actionFn = () => handleOperatorInput(corruptedValue);
        } else {
            actionFn = () => handleValueInput(corruptedValue);
        }
    }

    if (!actionFn) return;

    interactionLocked = true;
    setTimeout(() => {
        actionFn();
        applyRandomEffects(id || value);
        interactionLocked = false;
    }, 150);
}

function handleValueInput(val) {
    if (val === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' || resetInput) {
        currentInput = '';
        resetInput = false;
    }
    currentInput += val;
    updateDisplay();
}

function handleOperatorInput(opValue) {
    if (operation !== null && !resetInput) calculate();
    previousInput = currentInput;
    operation = opValue;
    resetInput = true;
    addRandomComment(commentsOperation[operation]);
}

function handleClear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetInput = false;
    updateDisplay();
    addComment("Back to square one.");
    playSound('sigh');
}

function handleBackspace() {
    currentInput = currentInput.length <= 1 ? '0' : currentInput.slice(0, -1);
    updateDisplay();
    addComment("Whoopsie!");
}

function handleEquals() {
    if (!operation) return;
    loadingBar.classList.add('active');
    addComment("Crunching souls...");

    setTimeout(() => {
        loadingBar.classList.remove('active');
        calculate();
        checkSpecialNumbers(currentInput);
    }, 700);
}

function calculate() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) {
        currentInput = 'NaN';
        updateDisplay();
        return;
    }

    let result;
    switch (operation) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': result = curr === 0 ? '∞' : prev / curr; break;
        default: return;
    }

    currentInput = result.toString();
    resetInput = true;
    operation = null;
    updateDisplay();
    addResultComment(prev, curr);
    playSound('correct');
}

function updateDisplay() {
    display.textContent = currentInput;
}

window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupAudio();
    updateDisplay();
});