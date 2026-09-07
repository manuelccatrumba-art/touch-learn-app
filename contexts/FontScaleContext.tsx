import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_FONT_SCALE_INDEX, FONT_SCALE_STEPS } from '../constants/typography';
import { getFontScaleIndex, setFontScaleIndex } from '../services/fontScale';

interface FontScaleContextValue {
  index: number;
  scale: number;
  canDecrease: boolean;
  canIncrease: boolean;
  decrease: () => void;
  increase: () => void;
}

const FontScaleContext = createContext<FontScaleContextValue>({
  index: DEFAULT_FONT_SCALE_INDEX,
  scale: FONT_SCALE_STEPS[DEFAULT_FONT_SCALE_INDEX],
  canDecrease: true,
  canIncrease: true,
  decrease: () => {},
  increase: () => {},
});

export function FontScaleProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(DEFAULT_FONT_SCALE_INDEX);

  useEffect(() => {
    getFontScaleIndex().then(setIndex);
  }, []);

  function change(delta: number) {
    setIndex((current) => {
      const next = Math.min(Math.max(current + delta, 0), FONT_SCALE_STEPS.length - 1);
      setFontScaleIndex(next);
      return next;
    });
  }

  const value = useMemo<FontScaleContextValue>(
    () => ({
      index,
      scale: FONT_SCALE_STEPS[index],
      canDecrease: index > 0,
      canIncrease: index < FONT_SCALE_STEPS.length - 1,
      decrease: () => change(-1),
      increase: () => change(1),
    }),
    [index],
  );

  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}

export function useFontScale() {
  return useContext(FontScaleContext);
}
