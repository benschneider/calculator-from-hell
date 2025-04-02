// js/commentContent.js
// This file holds all the user-facing text content for easier management.

export const commentsInput = [
    "Pushing buttons, achieving nothing.", "Is {val} your final answer? Pathetic.",
    "Entropy increases with every press.", "Even demons find this pace tedious.",
    "Go on, poke it again.", "Calculating the heat death of the universe... or just your number.",
    "Input accepted. Reluctantly.", "ERROR 404: Talent not found." // Added a couple more for fun
];

export const commentsEasyResult = [
    "My abacus is faster.", "A truly monumental calculation. For an ant.",
    "Was that supposed to be hard?", "You call that math?"
];

export const commentsHardResult = [
    "Behold! Mediocrity quantified!", "Don't hurt yourself thinking.",
    "Wow. You used the big numbers.", "Did you break a sweat?"
];

export const commentsOperation = {
    '+': ["Addition? Really stretching your limits there.", "More? Always more with you.", "Adding things won’t fill the void.", "+1 to your suffering."],
    '-': ["Subtraction? Trying to make yourself smaller?", "Taking things away, like your motivation?", "Subtracting... your dignity.", "Negative effort detected."],
    '*': ["Multiplying? Someone thinks they're fancy.", "Exponential disappointment incoming.", "Don't get too carried away now.", "Ah, multiplication. The devil's arithmetic."],
    '/': ["Division? Dividing what’s already broken?", "Splitting hairs, are we?", "Divide and... flail.", "Sharing is caring... about your impending doom."]
};

export const commentsMegaCorp = [
    "Calculating worker exploitation rates...", "Does this number fit on your boss's yacht?",
    "Remember: You are expendable. This number isn't.", "Efficiency is key. Unlike your calculation.",
    "MegaCorp™ reminds you: Happiness is mandatory.", "Did you factor in the soul-crushing commute?",
    "Result sponsored by 16 hour shifts.", "Is this your quarterly target? Aim lower.",
    "Buy N-Get 1 Free (Souls only).", "Data harvested. Thank you for your compliance.",
    "Productivity quota unmet. Self-terminate?", "This calculation has been optimized for synergy."
];

// Using the structure from the original file
export const commentsSpecial = {
    666: "Ah, the number of the beast. How... predictable.",
    42: "The answer to life, the universe, and... your pointless calculation.",
    69: "Heh. Nice. Now get back to suffering.", // Kept concise
    420: "Blaze it? More like braise your soul.", // Kept concise
    13: "Unlucky for you. As always.",
    7: "Seven deadly sins... or just your result?",
    1000000: "A million? Trying to count souls condemned?",
    nearZero: "Infinitesimal. Like your chances of escape.", // Key used in checkSpecialNumbers
    negative: "Negative result? How fitting for your outlook.", // Key used in checkSpecialNumbers
    large: "Such a large number. Trying to impress the void?" // Key used in checkSpecialNumbers
    // Add more special numbers or conditions here if you like!
    // 0: "Zero. Zilch. Nada. Like your contribution." // Example
};

export const hellishButtonText = {
    clear: ["PURGE", "RESET?", "OBLIVION", "DAMN IT", "AGAIN?", "NOPE"],
    equals: ["JUDGEMENT", "RECKONING", "ETERNITY?", "CALCULATE DOOM", "ANSWER?", "WHY?"]
};

// Extracted from suggestDemonicAlternative function for consistency
export const demonicAlternatives = [
    `Perhaps the answer is closer to ${ (Math.random() * 1000 - 500).toFixed(2) }?`, // Dynamic calculation kept here
    "Reality is fluid here.",
    "Consult the Oracle (costs 1 soul).",
    "The Abyss whispers... 7.",
    "Did you account for sin^2?",
    "Maybe try crying?",
    "Error: Success detected. Self-correcting..."
];

// Sarcasm level confirmation comments
export const sarcasmLevelComments = {
    mild: "Sarcasm: Mildly threatening.",
    snarky: "Sarcasm: Standard issue torment.",
    brutal: "Sarcasm: Maximum soul erosion."
};

// Initial/Utility comments
export const welcomeComment = "Welcome, mortal. Your suffering begins now.";
export const purgeComment = "Purged. Like your hopes and dreams.";
export const rewindComment = "Rewinding time? Futile, but go ahead.";
export const equalsComment = "Equals what? The void? Specify an operation, mortal.";
export const reckoningComment = "Reckoning... Please wait while we consult the Infernal Abacus.";
export const divisionByZeroComment = "Division by zero?! You tear spacetime? The fabric weeps!";
export const gibberishComment = "Error: Gibberish input detected. Speak numbers or face the void.";
export const tooLongComment = "Trying to count the grains of sand on the shores of Acheron?";
export const decimalObsessionComment = "Decimal point obsession? Trying to reach infinite precision in Hell?";
export const infernalOnComment = "Infernal Mode Unleashed! 🔥 Maximum Suffering Engaged.";
export const infernalOffComment = "Infernal Mode Deactivated. Boring.";
export const soundOnComment = "The cacophony of Hell welcomes you.";
export const soundOffComment = "Silence? Are you deaf to the abyss?";
export const ambientUnlockComment = "Click anywhere to unlock the ambient torment."; // Or specific interaction
export const shareSuccessComment = "Misery shared. Excellent.";
export const shareFailCopySuccessComment = "Share failed. Copied link & despair to clipboard.";
export const shareFailCopyFailComment = "Share failed. Copy failed. All fails.";
export const inputCorruptionComment = (value, corruptedValue) => `Oops, finger slipped? You pressed ${corruptedValue}, not ${value}. My bad.`; // Function to generate this
export const soulTaxComment = (tax) => `Infernal Revenue Service deducts a Soul Tax of ${tax.toFixed(4)}.`; // Function to generate this
export const demonWhisperComment = "A demon whispered a different number. Trust the demon.";
export const closeEnoughComment = "Close enough for Hell.";

// Note: flashupAds and flashupGlitches were moved to effects.js as they are part of that specific visual effect.