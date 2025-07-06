import { useRef, useCallback } from "react";
import confetti from "canvas-confetti";

export function useFireworks() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFireworks = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      disableForReducedMotion: true,
    };

    const randomInRange = (min: number, max: number): number =>
      Math.random() * (max - min) + min;

    intervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const particleCount = Math.floor(50 * (timeLeft / duration));

      // Fire from left
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      // Fire from right
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }, []);

  return { triggerFireworks };
}
