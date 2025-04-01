import { playSound } from './audio.js';
import { addComment } from './comments.js';

const calculatorWrapper = document.getElementById('calculator-wrapper');
const displayArea = document.getElementById('display-area');
const flashupContainer = document.getElementById('flashup-container');
const body = document.body;

export function applyRandomEffects(triggerId) {
    if (Math.random() < 0.1) {
        calculatorWrapper.classList.toggle('distorted');
    }

    if (Math.random() < 0.2) {
        displayArea.classList.toggle('glyph-active');
    }

    randomizeButtonPositions();
    moveCalculator();

    if (triggerId !== 'equals' && Math.random() < 0.18) {
        showRandomFlashup(2400);
    }

    if (Math.random() < 0.05) {
        document.body.classList.add('power-surge');
        setTimeout(() => document.body.classList.remove('power-surge'), 200);
    }
}

export function flashScreen() {
    body.classList.add('screen-flash');
    setTimeout(() => body.classList.remove('screen-flash'), 150);
}

export function moveCalculator() {
    const maxX = window.innerWidth * 0.08;
    const maxY = window.innerHeight * 0.04;
    const translateX = (Math.random() - 0.5) * 2 * maxX;
    const translateY = (Math.random() - 0.5) * 2 * maxY;
    calculatorWrapper.style.transform = `translate(${translateX}px, ${translateY}px)`;
    setTimeout(() => {
        calculatorWrapper.style.transform = `translate(0, 0)`;
    }, 500);
}

export function randomizeButtonPositions() {
    const container = document.getElementById('buttons-container');
    const buttons = Array.from(container.children);
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.insertBefore(buttons[j], buttons[i]);
    }
}

export function showRandomFlashup(duration = 3000) {
    flashupContainer.innerHTML = '';
    const ads = [
        { title: "LIMITED OFFER!", message: "Get 50% off eternal damnation! Use code: DOOMED", icon: "🏷️" },
        { title: "VIRUS ALERT!", message: "Download HellOS Update 6.6.6! (Includes bonus soul tracking)", icon: "🦠" },
        { title: "CONGRATULATIONS!", message: "You've won a free minute of non-suffering! (Redeemable Never)", icon: "🎁" }
    ];
    const glitches = [
        { title: "KERNEL PANIC!", message: "Error 666: Soul buffer overflow.", icon: "💣" },
        { title: "DIMENSION SHIFT", message: "Reality fluctuating. Hold onto your sanity.", icon: "🌀" },
        { title: "FILE NOT FOUND", message: "HOPE.DLL missing. Continuing anyway.", icon: "📁" }
    ];

    const useAds = Math.random() > 0.45;
    const collection = useAds ? ads : glitches;
    const data = collection[Math.floor(Math.random() * collection.length)];

    const el = document.createElement('div');
    el.classList.add('flashup');
    el.innerHTML = `
        <span class="flashup-icon">${data.icon}</span>
        <div class="flashup-title">${data.title}</div>
        <div class="flashup-message">${data.message}</div>
        ${useAds ? '<div class="spinner"></div>' : ''}
    `;
    el.addEventListener('click', () => el.remove());
    flashupContainer.appendChild(el);
    playSound(useAds ? 'evil' : 'wrong');

    const dismissButton = document.createElement('button');
    dismissButton.textContent = 'X';
    dismissButton.classList.add('flashup-dismiss');
    flashupElement.appendChild(dismissButton);

    let dismissCount = 0;
    dismissButton.addEventListener('click', () => {
        dismissCount++;
        if (dismissCount === 1) {
            dismissButton.textContent = 'Try Again';
            flashupElement.querySelector('.flashup-message').textContent = 'Nice try. Try harder.';
        } else if (dismissCount === 2) {
            dismissButton.textContent = 'Buy Now';
            flashupElement.querySelector('.flashup-message').textContent = 'Redirecting your soul to commerce...';
        } else {
            window.open('https://www.amazon.com/s?k=calculator+from+hell', '_blank');
            flashupElement.remove();
        }
    });

}
