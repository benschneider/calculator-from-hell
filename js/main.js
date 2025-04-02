// js/main.js - The Central Orchestrator

// --- Imports ---
import { applyRandomEffects, moveDemonEyes, flashScreen, showRandomFlashup } from './effects.js';
import * as commentLogic from './commentLogic.js'; // Import all exported functions/constants
import { commentsOperation, commentsMegaCorp } from './commentContent.js';
// --- DOM Elements ---
const display = document.getElementById('display');
const commentElement = document.getElementById('comment'); // Renamed for clarity
const loadingBar = document.getElementById('loading');
const calculatorWrapper = document.getElementById('calculator-wrapper');
const calculator = document.getElementById('calculator');
const buttonsContainer = document.getElementById('buttons-container');
const leftEye = document.getElementById('left-eye');
const rightEye = document.getElementById('right-eye');
const flashupContainer = document.getElementById('flashup-container');
const body = document.body;
const displayArea = document.getElementById('display-area');

// Buttons
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');
const equalsBtn = document.getElementById('equals');
const megaCorpBtn = document.getElementById('megacorp');
const shareBtn = document.getElementById('share');
const numberAndOperatorBtns = document.querySelectorAll('#buttons-container button:not(#clear):not(#backspace):not(#equals):not(#megacorp):not(#share)');
const mildBtn = document.getElementById('mild');
const snarkyBtn = document.getElementById('snarky');
const brutalBtn = document.getElementById('brutal');
const infernalModeCheckbox = document.getElementById('infernal-mode');
const soundCheckbox = document.getElementById('sound');

// Audio Elements (Refs needed for updateSoundState) - Will move to audio.js later
const sounds = {
    evil: document.getElementById('sound-evil-laugh'),
    wrong: document.getElementById('sound-wrong'),
    correct: document.getElementById('sound-correct'),
    sigh: document.getElementById('sound-sigh'),
    ambient: document.getElementById('sound-ambient-hell'),
};

// --- State Variables ---
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetInput = false;
let sarcasmLevel = 'snarky'; // Default (will be set visually on load)
let infernalMode = false;   // Read from checkbox on load
let soundEnabled = true;    // Read from checkbox on load
let interactionLocked = false;
let ambientSoundPlaying = false;

// Constants (Moved relevant ones here from old script)
const BUTTON_ANIMATION_DELAY = 100; // FASTER! Let's make it quicker for testing. Was 1750.
const SOUL_TAX_CHANCE = 0.1;
const INPUT_CORRUPTION_CHANCE = 0.05;
const HELLISH_BUTTON_TEXT_CHANCE = 0.2;

// --- Placeholder for Audio Module ---
// This function will be replaced by an import from audio.js
function playSound(type) {
    if (!soundEnabled || !sounds[type]) return;
    try {
        // Basic playback logic, similar to before
        sounds[type].currentTime = 0;
        sounds[type].play().catch(e => { /* Optional: console.error(`Sound play failed for ${type}:`, e); */ });
    } catch (e) { /* Optional: console.error(`Sound error for ${type}:`, e); */ }
}

// --- Core Application Logic Functions ---

function updateDisplay() {
    if (!display) return;
    display.textContent = currentInput;
}

function handleValueInput(value) {
    if (value === '.' && currentInput.includes('.')) {
        commentLogic.addComment(commentLogic.decimalObsessionComment, commentElement);
        playSound('wrong');
        flashScreen(body); // Call imported effect
        return;
    }
    if (currentInput === '0' || resetInput) {
        currentInput = '';
        resetInput = false;
    }
    if (currentInput.length > 20) {
        commentLogic.addComment(commentLogic.tooLongComment, commentElement);
        playSound('wrong');
        return;
    }
    currentInput += value;
    updateDisplay();

    // Add random input comment sometimes
    if (Math.random() > 0.6) {
        commentLogic.addRandomComment(commentLogic.commentsInput, commentElement, value);
    }
}

function handleOperatorInput(opValue) {
    if (operation !== null && !resetInput) {
        calculate(); // Auto-calculate if chaining operations
    }
    // Only update if the currentInput is valid (not empty or just '-')
    if (currentInput !== '' && currentInput !== '-') {
         previousInput = currentInput;
         operation = opValue;
         resetInput = true;
         // Add operator-specific comment
         commentLogic.addRandomComment(commentsOperation[operation] || [], commentElement);
    } else if (opValue === '-' && currentInput === '0') {
        // Allow starting with a negative number
        currentInput = '-';
        resetInput = false;
        updateDisplay();
    } else {
        // If trying to add operator on empty input (other than starting negative)
        playSound('wrong');
        // Maybe add a specific comment here?
    }

}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        commentLogic.addComment(commentLogic.gibberishComment, commentElement);
        playSound('wrong');
        flashScreen(body);
        currentInput = 'ERROR'; // Show Error instead of NaN?
        updateDisplay();
        operation = null;
        resetInput = true;
        previousInput = '';
        return;
    }

    switch (operation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) {
                commentLogic.addComment(commentLogic.divisionByZeroComment, commentElement);
                playSound('wrong');
                flashScreen(body);
                currentInput = '∞!';
                updateDisplay();
                operation = null;
                resetInput = true;
                previousInput = '';
                return;
            }
            result = prev / current;
            break;
        default:
            console.warn("Calculate called with no valid operation.");
            return; // Should not happen if logic is correct
    }

    // --- Infernal Mode Taxes & Glitches ---
    if (infernalMode) {
        if (Math.random() < SOUL_TAX_CHANCE) {
            const tax = Math.abs(result * (Math.random() * 0.01 + 0.001)); // 0.1% to 1.1% tax
            result -= tax;
            // Use the function from commentContent/Logic to generate the message
            commentLogic.addComment(commentLogic.soulTaxComment(tax), commentElement);
            playSound('sigh');
        }
        // Random Offset (Increased frequency?)
        if (Math.random() < 0.8) { // 80% chance for *some* minor offset
            const offsetAmount = (Math.random() * 0.6 - 0.3) * (Math.abs(result) * 0.02 + 0.1);
             result += offsetAmount;
             // console.log("Infernal Offset Applied:", offsetAmount); // Optional debug log
        }
        // Totally Wrong Answer (Less frequent)
        if (Math.random() < 0.15) {
            result = Math.random() * 1000 - 500;
            commentLogic.addComment(commentLogic.demonWhisperComment, commentElement);
            playSound('evil');
        }
    } else {
        // Subtle non-infernal floating point "error"
        if (Math.random() < 0.1) {
             result += (Math.random() * 0.000005 - 0.0000025);
             commentLogic.addComment(commentLogic.closeEnoughComment, commentElement);
        }
    }

    // Format & Update Display
    // Limit precision to avoid excessive decimals
    if (result.toString().includes('.') && result.toString().split('.')[1].length > 8) {
         result = parseFloat(result.toFixed(8)); // Limit to 8 decimal places
    }
    currentInput = result.toString();

    // Handle potential exponential formatting for very large/small numbers
    if (currentInput.length > 15 || (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-6 && result !== 0))) {
        try {
             currentInput = parseFloat(result).toExponential(9); // Format exponentially
        } catch(e) {
            currentInput = "OverflowErr"; // Fallback error
        }
    }

    updateDisplay();
    commentLogic.addResultComment(prev, current, operation, commentElement); // Pass numbers and operation
    playSound(infernalMode && Math.random() < 0.4 ? 'evil' : 'correct'); // Check state variable

    // After calculation: Check for special numbers and suggest alternatives
    commentLogic.checkSpecialNumbers(currentInput, commentElement, playSound); // Pass sound function
    if (infernalMode && Math.random() > 0.35) { // Check state variable
         // Let main handle the timing if needed, or keep delay in suggestDemonicAlternative
        commentLogic.suggestDemonicAlternative(commentElement, playSound);
    }

    // Reset for next operation
    operation = null;
    resetInput = true;
    previousInput = ''; // Clear previous input after successful calculation
}


function handleClear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetInput = false;
    updateDisplay();
    commentLogic.addComment(commentLogic.purgeComment, commentElement);
    playSound('sigh');
    // Optional: Reset effects explicitly on clear?
    displayArea.classList.remove('glyph-active');
    calculatorWrapper.classList.remove('distorted');
    loadingBar.classList.remove('active'); // Stop loading bar if clear pressed during calc
}

function handleBackspace() {
    if (currentInput.length <= 1 || currentInput === '-0') {
         currentInput = '0';
    } else if (currentInput === 'ERROR' || currentInput === '∞!') {
         currentInput = '0'; // Clear error states
    }
    else {
        currentInput = currentInput.slice(0, -1);
    }
    resetInput = false; // Allow further typing after backspace
    updateDisplay();
    commentLogic.addComment(commentLogic.rewindComment, commentElement);
}

function handleEquals() {
    if (operation === null || previousInput === '') {
        commentLogic.addComment(commentLogic.equalsComment, commentElement);
        playSound('wrong');
        flashScreen(body);
        return;
    }
    // Prevent calculation if current input is invalid (e.g., just ".")
    if (isNaN(parseFloat(currentInput))) {
         commentLogic.addComment(commentLogic.gibberishComment, commentElement);
         playSound('wrong');
         flashScreen(body);
         return;
    }

    loadingBar.classList.add('active');
    commentLogic.addComment(commentLogic.reckoningComment, commentElement);
    const delay = 1000; // Keep calculation delay

    // Optional: Show flashup during calculation? Requires passing functions
    // showRandomFlashup(flashupContainer, playSound, (text) => commentLogic.addComment(text, commentElement));


    setTimeout(() => {
        loadingBar.classList.remove('active');
        calculate(); // This now handles the rest (result comments, special checks, etc.)
    }, delay);
}

function handleMegaCorp() {
    // Select random comment from the imported array
    commentLogic.addRandomComment(commentsMegaCorp, commentElement);
    playSound('evil');
}

function handleShare() {
    const shareText = `I survived the Calculator from Hell (barely) and got: ${currentInput}. Witness my torment: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: 'My Hellish Calculation', text: shareText, url: window.location.href })
            .then(() => commentLogic.addComment(commentLogic.shareSuccessComment, commentElement))
            .catch(err => {
                console.warn("Share API failed, using fallback.", err);
                fallbackShare(shareText); // Call local fallback
            });
    } else {
        console.warn("Share API not supported, using fallback.");
        fallbackShare(shareText); // Call local fallback
    }
}

// --- Toggle Handlers ---
function handleInfernalToggle(e) {
    infernalMode = e.target.checked; // Update state variable
    commentLogic.addComment(infernalMode ? commentLogic.infernalOnComment : commentLogic.infernalOffComment, commentElement);
    playSound(infernalMode ? 'evil' : 'sigh');
    // Optionally trigger an immediate effect?
    // if (infernalMode) { flashScreen(body); }
}

function handleSoundToggle(e) {
    soundEnabled = e.target.checked; // Update state variable
    // Add comment based on the new state
    commentLogic.addComment(soundEnabled ? commentLogic.soundOnComment : commentLogic.soundOffComment, commentElement);
    updateSoundState(); // Call function to handle playing/pausing/muting
}

// Handles playing/pausing ambient sound and muting all sounds based on state
function updateSoundState() {
    // Handle Ambient sound
    if (soundEnabled && !ambientSoundPlaying && sounds.ambient) {
        sounds.ambient.volume = 0.15; // Keep it subtle
        sounds.ambient.play().then(() => {
            ambientSoundPlaying = true;
            console.log("Ambient sound started.");
        }).catch(e => {
            // Autoplay likely blocked
            console.warn("Ambient sound failed to play:", e);
            if (e.name === 'NotAllowedError') {
                 // Don't add comment here repeatedly, handle initial message elsewhere
            }
            ambientSoundPlaying = false; // Ensure state is correct
        });
    } else if ((!soundEnabled || !sounds.ambient) && ambientSoundPlaying) {
        if (sounds.ambient) sounds.ambient.pause();
        ambientSoundPlaying = false;
        console.log("Ambient sound stopped.");
    }

    // Mute/unmute all registered sound elements based on master toggle
    Object.values(sounds).forEach(sound => {
         if(sound) sound.muted = !soundEnabled;
     });
    // Ensure ambient matches the master toggle explicitly
    if (sounds.ambient) sounds.ambient.muted = !soundEnabled;
}

// --- Fallback Share Function --- (Remains here as it uses body/DOM directly)
function fallbackShare(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent display issues
    textarea.style.left = '-9999px';
    body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    try {
        document.execCommand('copy');
        commentLogic.addComment(commentLogic.shareFailCopySuccessComment, commentElement);
        playSound('sigh');
    } catch (err) {
        console.error("Fallback copy failed:", err);
        commentLogic.addComment(commentLogic.shareFailCopyFailComment, commentElement);
        playSound('wrong');
    }
    body.removeChild(textarea);
}


// --- Core Button Handling Logic ---
// This function orchestrates actions based on button clicks
function handleButtonPress(button) {
    if (!button) return; // Safety check
    if (interactionLocked) {
         console.log("Interaction locked, button press ignored.");
         return; // Ignore clicks if already processing
     }
    interactionLocked = true;
    console.log(`Button Press: ${button.id || button.dataset.value || 'Unknown Button'}`); // Debug log

    const value = button.dataset.value;
    const id = button.id;
    let actionFn; // Function to execute

    const operators = ['/', '*', '-', '+'];
    const isOperator = typeof value === 'string' && operators.includes(value);
    const isNumberOrDecimal = typeof value === 'string' && (!isNaN(parseFloat(value)) || value === '.');

    // Determine action based on button ID first
    switch (id) {
        case 'clear':       actionFn = handleClear; break;
        case 'backspace':   actionFn = handleBackspace; break;
        case 'equals':      actionFn = handleEquals; break;
        case 'megacorp':    actionFn = handleMegaCorp; break;
        case 'share':       actionFn = handleShare; break;
        // Add cases for mild/snarky/brutal if they have direct actions beyond setting state
        case 'mild':
        case 'snarky':
        case 'brutal':
             actionFn = () => {
                sarcasmLevel = id; // Set state variable
                commentLogic.setSarcasmLevel(id, commentElement, playSound, button); // Call logic
             };
            break;
    }

    // If no ID match, determine action based on value (number, operator)
    if (!actionFn && value !== undefined) {
        let finalValue = value;

        // Input Corruption Check (Only for numbers)
        if (infernalMode && !isNaN(Number(value)) && Math.random() < INPUT_CORRUPTION_CHANCE) {
            const corruptedValue = Math.floor(Math.random() * 10).toString();
            // Use the generator function from commentContent
            commentLogic.addComment(commentLogic.inputCorruptionComment(value, corruptedValue), commentElement);
            playSound('wrong');
            flashScreen(body); // Trigger effect
            finalValue = corruptedValue; // Use the corrupted value!
        }

        // Assign action based on value type
        if (isOperator) {
            actionFn = () => handleOperatorInput(finalValue);
        } else if (isNumberOrDecimal) {
            actionFn = () => handleValueInput(finalValue);
        } else {
            console.warn("Button has value but is not number/decimal/operator:", value);
            // Fallback or ignore?
        }
    }

    // --- Execute Action & Effects ---
    if (actionFn) {
        // Use setTimeout to simulate processing time / allow animations
        setTimeout(() => {
            console.log(`Running action for ${id || value}`);
            try {
                actionFn(); // Execute the determined action
                // Apply general random effects after the action
                applyRandomEffects(infernalMode, calculatorWrapper, displayArea, buttonsContainer, flashupContainer, playSound, (text) => commentLogic.addComment(text, commentElement));
                // Randomize button text specifically
                commentLogic.randomizeButtonText(clearBtn, equalsBtn, HELLISH_BUTTON_TEXT_CHANCE);
            } catch (error) {
                console.error("Error during button action execution:", error);
                commentLogic.addComment("A critical error occurred. The system demons are laughing.", commentElement); // Error comment
            } finally {
                console.log(`Unlocking interaction after ${id || value}`);
                interactionLocked = false; // Ensure interaction unlocks
            }
        }, BUTTON_ANIMATION_DELAY);
    } else {
        console.warn("No action defined for button:", button);
        interactionLocked = false; // Unlock if no action is taken
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Number and Operator Buttons
    numberAndOperatorBtns.forEach(button => {
        button.addEventListener('click', () => handleButtonPress(button));
    });

    // Specific Function Buttons
    clearBtn.addEventListener('click', () => handleButtonPress(clearBtn));
    backspaceBtn.addEventListener('click', () => handleButtonPress(backspaceBtn));
    equalsBtn.addEventListener('click', () => handleButtonPress(equalsBtn));
    megaCorpBtn.addEventListener('click', () => handleButtonPress(megaCorpBtn));
    shareBtn.addEventListener('click', () => handleButtonPress(shareBtn));

    // Sarcasm Level Buttons
    mildBtn.addEventListener('click', () => handleButtonPress(mildBtn));
    snarkyBtn.addEventListener('click', () => handleButtonPress(snarkyBtn));
    brutalBtn.addEventListener('click', () => handleButtonPress(brutalBtn));

    // Toggle Checkboxes
    infernalModeCheckbox.addEventListener('change', handleInfernalToggle);
    soundCheckbox.addEventListener('change', handleSoundToggle);

    // Demon Eye Movement
    document.addEventListener('mousemove', (e) => {
        moveDemonEyes(e, calculatorWrapper, leftEye, rightEye);
    });

    // Initial ambient sound unlock attempt on first interaction
    // Use 'pointerdown' for broader interaction detection (touch/mouse)
    document.addEventListener('pointerdown', function handleFirstInteraction() {
         console.log("First user interaction detected.");
        // Try playing ambient sound if enabled and not already playing
        if (soundEnabled && !ambientSoundPlaying && sounds.ambient && sounds.ambient.paused) {
             console.log("Attempting to play ambient sound after interaction...");
            updateSoundState(); // This will attempt to play ambient
        }
        // Remove this listener after the first interaction
        document.removeEventListener('pointerdown', handleFirstInteraction);
    }, { once: true }); // Ensure listener runs only once

    console.log("Event listeners set up.");
}

// --- Initialization ---
function initializeCalculator() {
    console.log("Initializing Calculator from Hell...");
    // Read initial state from HTML checkboxes
    infernalMode = infernalModeCheckbox.checked;
    soundEnabled = soundCheckbox.checked;

    // Set initial UI states
    updateDisplay();
    commentLogic.addComment(commentLogic.welcomeComment, commentElement); // Use uuported constant

    // Update sound state (including trying ambient)
    updateSoundState();

     // Highlight default sarcasm level visually (if desired)
     document.querySelectorAll('.sarcasm-buttons button').forEach(btn => btn.classList.remove('sarcasm-active'));
     document.getElementById(sarcasmLevel)?.classList.add('sarcasm-active'); // Add active class to default


    // Add initial prompt for sound interaction if needed
    // Check after a short delay to allow updateSoundState to attempt playback
    setTimeout(() => {
        if (soundEnabled && !ambientSoundPlaying && sounds.ambient && sounds.ambient.paused) {
            commentLogic.addComment(commentLogic.ambientUnlockComment, commentElement);
        }
    }, 500); // Delay slightly

    // Setup all event listeners
    setupEventListeners();

    console.log("Calculator Initialized.");
}

// --- START THE MACHINE ---
initializeCalculator();