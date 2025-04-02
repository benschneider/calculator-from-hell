// js/effects.js

// --- Constants for Effects ---
const CALCULATOR_MOVE_DELAY = 500;
const EYE_MOVE_DISTANCE = 12; // More movement
const FLASHUP_DISPLAY_DURATION = 3000;
const SCREEN_FLASH_DURATION = 550;
const INFERNAL_GLITCH_CHANCE = 0.18; // Increased chance

// Flashup Content (Might move later, but needed by showRandomFlashup for now)
const flashupAds = [
    { title: "LIMITED OFFER!", message: "Get 50% off eternal damnation! Use code: DOOMED", icon: "🏷️" },
    { title: "VIRUS ALERT!", message: "Download HellOS Update 6.6.6! (Includes bonus soul tracking)", icon: "🦠" },
    { title: "CONGRATULATIONS!", message: "You've won a free minute of non-suffering! (Redeemable Never)", icon: "🎁" },
    { title: "TAX EVASION TIPS!", message: "Learn how to avoid soul taxes! Cost: One soul.", icon: "🧾" },
    { title: "SOUL MARKET!", message: "Invest in damned souls! High yields, eternal dividends!", icon: "📈" },
    { title: "UPGRADE NOW!", message: "Hell Premium: Ad-free suffering!", icon: "⭐" }
];
const flashupGlitches = [
    { title: "KERNEL PANIC!", message: "Error 666: Soul buffer overflow.", icon: "💣" },
    { title: "DIMENSION SHIFT", message: "Reality fluctuating. Hold onto your sanity.", icon: "🌀" },
    { title: "WARNING!", message: "Sarcasm levels critical. Imminent meltdown.", icon: "⚠️" },
    { title: "FILE NOT FOUND", message: "HOPE.DLL missing. Continuing anyway.", icon: "📁" },
    { title: "INPUT REJECTED", message: "Reason: Insufficient suffering.", icon: "🚫" },
    { title: "HELLOS™ UPDATE", message: "Your torment requires an update. Please wait.", icon: "⏳" }
];

// Internal state variable (not exported)
let calculatorMoving = false;

// --- Effect Functions ---

// Randomly shuffles button positions within their container
function randomizeButtonPositions(buttonsContainer) {
    if (!buttonsContainer) return;
    const buttons = Array.from(buttonsContainer.children);
    // Fisher-Yates shuffle
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Check if elements are buttons before inserting (safety)
        if (buttons[j] instanceof HTMLElement && buttons[i] instanceof HTMLElement) {
             buttonsContainer.insertBefore(buttons[j], buttons[i]);
        }
    }
}

// Randomly moves the calculator wrapper slightly
function moveCalculator(calculatorWrapper) {
    if (!calculatorWrapper || calculatorMoving) return;
    calculatorMoving = true;
    const maxX = window.innerWidth * 0.08;
    const maxY = window.innerHeight * 0.04;
    const translateX = (Math.random() - 0.5) * 2 * maxX;
    const translateY = (Math.random() - 0.5) * 2 * maxY;
    calculatorWrapper.style.transform = `translate(${translateX}px, ${translateY}px)`;
    setTimeout(() => {
        calculatorMoving = false;
        // Optional: Reset transform after delay if you don't want it to stay shifted
        // calculatorWrapper.style.transform = `translate(0px, 0px)`;
    }, CALCULATOR_MOVE_DELAY);
}

// Makes the demon eyes follow the mouse cursor
export function moveDemonEyes(event, calculatorWrapper, leftEye, rightEye) {
    if (!calculatorWrapper || !leftEye || !rightEye) return;
    const rect = calculatorWrapper.getBoundingClientRect();
    // Adjust center point based on actual eye positions in HTML/CSS if needed
    const centerX = rect.left + 45; // Approx middle of eyes
    const centerY = rect.top + 30; // Approx middle of eyes
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const dx = Math.cos(angle) * EYE_MOVE_DISTANCE;
    const dy = Math.sin(angle) * EYE_MOVE_DISTANCE;
    leftEye.style.transform = `translate(${dx}px, ${dy}px)`;
    rightEye.style.transform = `translate(${dx}px, ${dy}px)`;
}

// Briefly flashes the screen background red
export function flashScreen(bodyElement) {
    if (!bodyElement) return;
    bodyElement.classList.add('screen-flash');
    setTimeout(() => bodyElement.classList.remove('screen-flash'), SCREEN_FLASH_DURATION);
}

// Shows a random ad or glitch flashup popup
// Needs playSound and potentially addComment passed in if we want interaction feedback
export function showRandomFlashup(flashupContainer, playSoundFn, addCommentFn) {
    if (!flashupContainer) return;
    flashupContainer.innerHTML = ''; // Clear previous

    const isAd = Math.random() > 0.45;
    const collection = isAd ? flashupAds : flashupGlitches;
    if (collection.length === 0) return; // Avoid errors if arrays are empty
    const flashupData = collection[Math.floor(Math.random() * collection.length)];

    const flashupElement = document.createElement('div');
    flashupElement.classList.add('flashup');
    // Basic structure (copied from original)
    flashupElement.innerHTML = `
        ${flashupData.icon ? `<span class="flashup-icon">${flashupData.icon}</span>` : ''}
        <div class="flashup-title">${flashupData.title}</div>
        <div class="flashup-message">${flashupData.message}</div>
        ${isAd ? '<div class="spinner"></div>' : ''}
    `;

    // Create a dismiss button programmatically for better control
    const dismissButton = document.createElement('button');
    dismissButton.textContent = 'X'; // Standard dismiss icon
    dismissButton.style.position = 'absolute'; // Basic styling
    dismissButton.style.top = '10px';
    dismissButton.style.right = '10px';
    dismissButton.style.background = 'transparent';
    dismissButton.style.border = '1px solid red';
    dismissButton.style.color = 'red';
    dismissButton.style.cursor = 'pointer';
    dismissButton.style.fontSize = '1em';
    dismissButton.style.padding = '2px 5px';
    dismissButton.style.lineHeight = '1';

    // Simple dismiss functionality - remove element on click
    dismissButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling to the flashup div
        flashupElement.remove();
        // Optional: Add a dismiss comment/sound
        // if (addCommentFn) addCommentFn("Fine. Ignore the 'opportunity'.");
        // if (playSoundFn) playSoundFn('sigh');
    });

    flashupElement.appendChild(dismissButton);

    flashupContainer.appendChild(flashupElement);

    // Call the passed-in playSound function
    if (playSoundFn) {
        playSoundFn(isAd ? 'evil' : 'wrong');
    }

    // Auto-remove after duration (optional, but good practice)
    setTimeout(() => {
        if (flashupElement.parentNode === flashupContainer) {
            flashupElement.remove();
        }
    }, FLASHUP_DISPLAY_DURATION);
}


// Applies a selection of random effects based on probability and mode
export function applyRandomEffects(infernalMode, calculatorWrapper, displayArea, buttonsContainer, flashupContainer, playSoundFn, addCommentFn) {
    if (!calculatorWrapper || !displayArea || !buttonsContainer || !flashupContainer) return;

    // Randomly toggle heat distortion
    if (Math.random() < 0.1) { // 10% chance
        calculatorWrapper.classList.toggle('distorted');
    }
    // Randomly toggle glyph flicker
    if (Math.random() < 0.2) { // 20% chance
        displayArea.classList.toggle('glyph-active');
    }

    // Always shuffle buttons and move calc (or make conditional?)
    randomizeButtonPositions(buttonsContainer);
    moveCalculator(calculatorWrapper);

    // Random glitch flashup in infernal mode (uses the exported showRandomFlashup)
    if (infernalMode && Math.random() < INFERNAL_GLITCH_CHANCE) {
        // Pass the sound/comment functions if needed for flashup interactions
        showRandomFlashup(flashupContainer, playSoundFn, addCommentFn);
    }

    // Maybe add other random effects here?
    // e.g., body power surge effect?
    // if (Math.random() < 0.05) {
    //    body.classList.add('power-surge');
    //    setTimeout(() => body.classList.remove('power-surge'), 200);
    // }
}