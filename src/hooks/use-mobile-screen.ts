import { useState, useEffect } from 'react';

export function useMobileScreen() {
  const [isMobileScreen, setIsMobileScreen] = useState(true);
  useEffect(() => {
    setIsMobileScreen(window.document.body.clientWidth <= 600);
    window.addEventListener('resize', () => {
      setIsMobileScreen(window.document.body.clientWidth <= 600);
    });
  }, []);

  return isMobileScreen;
}
