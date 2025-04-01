
const commentsEasyResult = [
    "Wow, such complex math. Did you need a calculator for this?",
    "Even my hellhound could do this in its sleep.",
    "Seriously? You needed help with this?",
    "I'm embarrassed for you. This is basic.",
    "My abacus is faster.",
    "A truly monumental calculation. For an ant."
];

const commentsHardResult = [
    "There you go. Was that so hard?",
    "The answer is... oh wait, you can see it.",
    "I did the math so you don't have to.",
    "Congratulations. You've successfully used a calculator.",
    "Behold! Mediocrity quantified!",
    "Don't hurt yourself thinking."
];

const commentsSpecial = {
    13: "Unlucky for you. As always.",
    7: "Seven deadly sins... or just your result?",
    42: "The answer to life, the universe, and everything. Too bad it won't help your math skills.",
    69: "Nice. (I'm a demon but I'm not dead inside)",
    420: "Blaze it! (Literally, we're in hell after all)",
    666: "Ah, my favorite number! You're speaking my language now.",
    1000000: "A million! That's like 0.0001% of what MegaCorp™ makes in a minute.",
    nearZero: "Close enough to zero, just like your chances of being good at math.",
    negative: "Negative numbers? How emo of you.",
    large: "Now you're thinking in MegaCorp numbers!"
};

export function addComment(text) {
    const commentEl = document.getElementById('comment');
    commentEl.textContent = text;
    commentEl.scrollTop = commentEl.scrollHeight;
}

export function addRandomComment(commentArray, value = null) {
    if (!Array.isArray(commentArray) || commentArray.length === 0) return;
    let chosen = commentArray[Math.floor(Math.random() * commentArray.length)];
    if (value !== null && typeof chosen === 'string') {
        chosen = chosen.replace('{val}', value);
    }
    addComment(chosen);
}

export function addResultComment(num1, num2) {
    if (Math.abs(num1) < 10 && Math.abs(num2) < 10) {
        addRandomComment(commentsEasyResult);
    } else {
        addRandomComment(commentsHardResult);
    }
}

export function checkSpecialNumbers(inputStr) {
    const num = parseFloat(inputStr);
    if (isNaN(num)) return;

    let specialComment = null;
    for (const key in commentsSpecial) {
        const target = Number(key);
        if (!isNaN(target) && Math.abs(num - target) < 0.001) {
            specialComment = commentsSpecial[key];
            break;
        }
    }

    if (!specialComment) {
        if (Math.abs(num) < 0.001 && num !== 0) specialComment = commentsSpecial.nearZero;
        else if (num < 0) specialComment = commentsSpecial.negative;
        else if (num > 1e12) specialComment = commentsSpecial.large;
    }

    if (specialComment) addComment(specialComment);
}
