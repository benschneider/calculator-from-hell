import { addComment } from '../js/comments.js';
import { flashScreen } from '../js/effects.js';

export const extraButtons = [
    {
      id: "crypto", label: "💸 Crypto Gamble",
      onClick: () => {
        const fluctuation = (Math.random() * 1000 - 500).toFixed(2);
        addComment(`Market crashed. You now owe ${fluctuation} Dogecoin.`);
      }
    },
    {
      id: "burnCar", label: "🔥 Tesla Fire",
      onClick: () => {
        addComment("Your result spontaneously combusted.");
        flashScreen();
      }
    }
  ];