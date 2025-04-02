/* //Old code 
import { setupAudio, playSound, updateSoundState } from './audio.js';
import { setSarcasmLevel, commentsOperation, addComment, addRandomComment, addResultComment, checkSpecialNumbers } from './comments.js';
import { applyRandomEffects, flashScreen } from './effects.js';
import { isNumeric } from './utils.js';
import { commentsOperation } from './content/operations.js';
import { extraButtons } from './content/buttons-extra.js';
import { megaCorpModes } from './content/billionaires.js';

let currentCorpIndex = 0;

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
        case 'megacorp': actionFn = handleMegaCorp; break;
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

function randomizeMegaCorpButton() {
    const mode = megaCorpModes[currentCorpIndex];
    if (mode.label) {
        megaCorpBtn.textContent = mode.label;
    } else {
        megaCorpBtn.textContent = "MegaCorp™";
    }
    currentCorpIndex = (currentCorpIndex + 1) % megaCorpModes.length;
}

function handleMegaCorp() {
    const mode = megaCorpModes[(currentCorpIndex - 1 + megaCorpModes.length) % megaCorpModes.length];
    const quoteList = [...mode.comments];
    const quote = quoteList[Math.floor(Math.random() * quoteList.length)];
    addComment(quote);
    playSound('evil');
    randomizeMegaCorpButton();
}

function renderExtraButtons() {
    const container = document.getElementById('buttons-container');
    extraButtons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.textContent = btn.label;
      button.className = 'special'; // Style it as needed
      button.addEventListener('click', btn.onClick);
      container.appendChild(button);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupAudio();
    updateDisplay();
    renderExtraButtons();
    randomizeMegaCorpButton();
});

// Trigger random glitch after inactivity
let glitchTimer;
function triggerGlitchEffect() {
    const randomButton = document.querySelector('#buttons-container button[data-value]');
    if (randomButton) {
        randomButton.classList.add('glitching');
        setTimeout(() => randomButton.classList.remove('glitching'), 2000);
    }
}
function resetGlitchTimer() {
    clearTimeout(glitchTimer);
    glitchTimer = setTimeout(triggerGlitchEffect, 12000); // 12s inactivity
}
['mousemove', 'keydown', 'click'].forEach(e =>
    document.addEventListener(e, resetGlitchTimer)
);
resetGlitchTimer();
*/

// js/main.js //New Code
import { applyRandomEffects, moveDemonEyes, showRandomFlashup, flashScreen } from './effects.js';
// We will import other modules here later (audio, comments, etc.)

// --- DOM Elements (Centralized in main.js for now) ---
const display = document.getElementById('display');
const comment = document.getElementById('comment');
const loadingBar = document.getElementById('loading');
const calculatorWrapper = document.getElementById('calculator-wrapper');
const calculator = document.getElementById('calculator');
const buttonsContainer = document.getElementById('buttons-container');
const leftEye = document.getElementById('left-eye');
const rightEye = document.getElementById('right-eye');
const flashupContainer = document.getElementById('flashup-container');
const body = document.body;
const displayArea = document.getElementById('display-area');
const infernalModeCheckbox = document.getElementById('infernal-mode'); // Need this

// We will define state variables (currentInput, operation, infernalMode etc.) here later
let infernalMode = false; // Initial state example

// Placeholder functions for sound/comments (to be replaced by imports later)
function playSound(type) { console.log(`DEBUG: Play sound ${type}`); /* TODO: Import real function */ }
function addComment(text) { console.log(`DEBUG: Add comment: ${text}`); /* TODO: Import real function */ }

// --- Event Listeners Setup (Partial) ---
function setupEventListeners() {
    // Mouse move listener for eyes
    document.addEventListener('mousemove', (e) => {
        // Pass event and necessary elements to the imported function
        moveDemonEyes(e, calculatorWrapper, leftEye, rightEye);
    });

    // Example: How applyRandomEffects might be called after a button press
    // (This button listener logic will be more complex later)
    buttonsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            console.log("Button clicked - applying random effects (example)");
            // Pass necessary state and elements
            applyRandomEffects(infernalMode, calculatorWrapper, displayArea, buttonsContainer, flashupContainer, playSound, addComment);

            // Example of calling flashScreen directly
            if (Math.random() < 0.1) { // 10% chance on any button click
                console.log("Flashing screen (example)");
                flashScreen(body);
            }
        }
    });

    // Infernal Mode Toggle Listener (essential for applyRandomEffects)
     infernalModeCheckbox.addEventListener('change', (e) => {
        infernalMode = e.target.checked;
        console.log(`Infernal mode set to: ${infernalMode}`);
        // Add comment/sound related to toggle later
    });

    // TODO: Add ALL other event listeners here later (numbers, operators, clear, etc.)
}

// --- Initialization ---
console.log("Main.js loaded");
setupEventListeners();
// TODO: Add initial display updates, etc. here later