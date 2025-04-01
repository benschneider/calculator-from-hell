let sounds = {};
let ambientSoundPlaying = false;

export function setupAudio() {
    sounds = {
        evil: document.getElementById('sound-evil-laugh'),
        wrong: document.getElementById('sound-wrong'),
        correct: document.getElementById('sound-correct'),
        sigh: document.getElementById('sound-sigh'),
        ambient: document.getElementById('sound-ambient-hell'),
    };

    // Unlock ambient sound on first user interaction
    document.addEventListener('click', unlockAmbientSound, { once: true });
}

function unlockAmbientSound() {
    if (!ambientSoundPlaying && sounds.ambient) {
        sounds.ambient.volume = 0.15;
        sounds.ambient.play()
            .then(() => {
                ambientSoundPlaying = true;
                console.log("Ambient sound unlocked.");
            })
            .catch(err => console.warn("Ambient unlock failed:", err));
    }
}

export function updateSoundState(enabled = true) {
    if (enabled && !ambientSoundPlaying) {
        unlockAmbientSound();
    } else if (!enabled && ambientSoundPlaying) {
        sounds.ambient.pause();
        ambientSoundPlaying = false;
    }

    Object.values(sounds).forEach(sound => {
        if (sound) sound.muted = !enabled;
    });
}

export function playSound(type) {
    const sound = sounds[type];
    if (!sound) return;

    try {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    } catch (e) {
        console.warn(`Failed to play sound: ${type}`, e);
    }
}
