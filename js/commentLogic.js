// js/commentLogic.js
// Handles the logic for selecting, formatting, and displaying comments.

import {
    commentsInput,
    commentsEasyResult,
    commentsHardResult,
    commentsOperation,
    commentsSpecial,
    hellishButtonText,
    demonicAlternatives,
    sarcasmLevelComments,
    // Import specific comment strings if needed, or just use them directly in main.js?
    // Better to have functions return strings where possible, except for core addComment
    welcomeComment,
    purgeComment,
    rewindComment,
    equalsComment,
    reckoningComment,
    divisionByZeroComment,
    gibberishComment,
    tooLongComment,
    decimalObsessionComment,
    infernalOnComment,
    infernalOffComment,
    soundOnComment,
    soundOffComment,
    ambientUnlockComment,
    shareSuccessComment,
    shareFailCopySuccessComment,
    shareFailCopyFailComment,
    inputCorruptionComment, // This is a function
    soulTaxComment, // This is a function
    demonWhisperComment,
    closeEnoughComment
} from './commentContent.js';

// --- Core Comment Display Function ---
// This directly manipulates the DOM element passed to it.
export function addComment(text, commentElement) {
    if (!commentElement) {
        console.error("addComment called without commentElement!");
        return;
    }
    commentElement.textContent = text;
    // Auto-scroll to bottom
    commentElement.scrollTop = commentElement.scrollHeight;
}

// --- Random Comment Selection ---
// Selects a random comment from an array and formats it if needed.
// It now calls the passed-in addComment function.
export function addRandomComment(commentArray, commentElement, value = null) {
    if (!commentElement) return; // Need element to display
    if (!Array.isArray(commentArray) || commentArray.length === 0) {
        console.warn("addRandomComment called with invalid array");
        // Maybe add a default fallback comment?
        // addComment("...", commentElement);
        return;
    }

    let chosenComment = commentArray[Math.floor(Math.random() * commentArray.length)];

    // Handle placeholder replacement if needed
    if (value !== null && typeof chosenComment === 'string') {
        chosenComment = chosenComment.replace('{val}', value);
    }

    addComment(chosenComment, commentElement); // Use the core display function
}

// --- Specific Comment Logic ---

// Chooses between easy/hard result comments based on numbers/operation
export function addResultComment(num1, num2, operation, commentElement) {
    if (!commentElement) return;
    // Use placeholder values if calculation resulted in NaN/undefined, just in case
    const n1 = Math.abs(num1) || 0;
    const n2 = Math.abs(num2) || 0;

    // Simple operation check (avoiding division/multiplication)
    const isSimpleOperation = operation === '+' || operation === '-';
    // Simple numbers check
    const areSimpleNumbers = n1 < 10 && n2 < 10;

    if (isSimpleOperation && areSimpleNumbers) {
        addRandomComment(commentsEasyResult, commentElement);
    } else {
        addRandomComment(commentsHardResult, commentElement);
    }
}

// Checks for special numbers and adds the corresponding comment
export function checkSpecialNumbers(currentInput, commentElement, playSoundFn) {
    if (!commentElement) return;
    const num = parseFloat(currentInput);
    if (isNaN(num)) return; // Don't comment on NaN results specifically here

    let specialComment = null;

    // Check number-based keys in commentsSpecial
    for (const val in commentsSpecial) {
        if (!isNaN(Number(val))) { // Is the key a number?
            if (Math.abs(num - Number(val)) < 0.001) { // Close enough check
                specialComment = commentsSpecial[val];
                break; // Found a match
            }
        }
    }

    // Check descriptive keys if no number match found
    if (!specialComment) {
        if (Math.abs(num) < 0.001 && num !== 0 && commentsSpecial.nearZero) {
            specialComment = commentsSpecial.nearZero;
        } else if (num < 0 && commentsSpecial.negative) {
            specialComment = commentsSpecial.negative;
        } else if (num > 1e12 && commentsSpecial.large) { // Check if result is large
            specialComment = commentsSpecial.large;
        }
        // Add more conditions like isInteger, etc. if desired
    }


    if (specialComment) {
        addComment(specialComment, commentElement);
        // Play sound only for specific *numbers* matched
        if (Math.abs(num - 666) < 0.001 || Math.abs(num - 13) < 0.001) {
            if (playSoundFn) playSoundFn('evil');
        }
    }
}

// Adds a random "demonic alternative" suggestion comment
export function suggestDemonicAlternative(commentElement, playSoundFn) {
    if (!commentElement || demonicAlternatives.length === 0) return;
    // Regenerate dynamic comment if it exists
    const alternatives = demonicAlternatives.map(alt => {
        if (alt.includes('${')) { // Crude check for template literal placeholder
            // Re-evaluate the dynamic part. CAUTION: Eval is evil, but this is controlled.
            // A safer way would be a function in commentContent.js
            try {
                 // Simple case replacement
                 return alt.replace('${ (Math.random() * 1000 - 500).toFixed(2) }', (Math.random() * 1000 - 500).toFixed(2));
            } catch(e) { return alt; /* fallback */}
        }
        return alt;
    });
    const chosenAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];

    // Use setTimeout within this module or let main.js handle timing?
    // Keeping it simple here for now.
    // We might remove the setTimeout later and just return the string.
    setTimeout(() => {
        addComment(chosenAlternative, commentElement);
        if (playSoundFn) playSoundFn('evil');
    }, 700); // Delay remains as per original logic
}

// Randomizes the text on Clear and Equals buttons
export function randomizeButtonText(clearBtn, equalsBtn, hellishChance) {
    if (!clearBtn || !equalsBtn) return;

    // Check random chance for Clear button
    if (Math.random() < hellishChance && hellishButtonText.clear.length > 0) {
        const clearText = hellishButtonText.clear[Math.floor(Math.random() * hellishButtonText.clear.length)];
        clearBtn.textContent = clearText;
    } else {
        clearBtn.textContent = "AC"; // Reset to default
    }

    // Check random chance for Equals button
    if (Math.random() < hellishChance && hellishButtonText.equals.length > 0) {
        const equalsText = hellishButtonText.equals[Math.floor(Math.random() * hellishButtonText.equals.length)];
        equalsBtn.textContent = equalsText;
    } else {
        equalsBtn.textContent = "="; // Reset to default
    }
}

// Sets sarcasm level and displays confirmation comment
export function setSarcasmLevel(level, commentElement, playSoundFn, /* Optional: activeBtnElement */) {
    if (!commentElement || !sarcasmLevelComments[level]) return;

    addComment(sarcasmLevelComments[level], commentElement);
    if (playSoundFn) playSoundFn('evil');

    // Optional: Update active class on buttons if element passed
    // if (activeBtnElement && activeBtnElement.parentElement) {
    //     activeBtnElement.parentElement.querySelectorAll('button').forEach(btn => btn.classList.remove('sarcasm-active'));
    //     activeBtnElement.classList.add('sarcasm-active');
    // }

    // Note: The actual sarcasmLevel state variable should be managed in main.js
}

// Export constants for specific comments that main logic might trigger directly
export {
    welcomeComment,
    purgeComment,
    rewindComment,
    equalsComment,
    reckoningComment,
    divisionByZeroComment,
    gibberishComment,
    tooLongComment,
    decimalObsessionComment,
    infernalOnComment,
    infernalOffComment,
    soundOnComment,
    soundOffComment,
    ambientUnlockComment,
    shareSuccessComment,
    shareFailCopySuccessComment,
    shareFailCopyFailComment,
    inputCorruptionComment, // Function exported
    soulTaxComment, // Function exported
    demonWhisperComment,
    closeEnoughComment
};

// Export comments needed by specific handlers (like operators)
export { commentsOperation };