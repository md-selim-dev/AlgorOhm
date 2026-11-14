import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly interpolates numeric values for telemetry & financial calculators
 * while respecting prefers-reduced-motion and ensuring initial render rounding.
 */
export function useAnimatedNumber(
  targetValue: number,
  duration = 320,
  decimals = 0
): number {
  const roundToDecimals = (val: number) => Number(val.toFixed(decimals));
  const [displayValue, setDisplayValue] = useState<number>(() =>
    roundToDecimals(targetValue)
  );
  const previousRef = useRef<number>(roundToDecimals(targetValue));

  useEffect(() => {
    const startValue = previousRef.current;
    const endValue = targetValue;

    if (Math.abs(endValue - startValue) < 0.0001) {
      const rounded = roundToDecimals(endValue);
      setDisplayValue(rounded);
      previousRef.current = rounded;
      return;
    }

    // Respect user reduced-motion setting
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      const rounded = roundToDecimals(endValue);
      setDisplayValue(rounded);
      previousRef.current = rounded;
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(roundToDecimals(current));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        const finalRounded = roundToDecimals(endValue);
        setDisplayValue(finalRounded);
        previousRef.current = finalRounded;
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [targetValue, duration, decimals]);

  return displayValue;
}
