import { useEffect, useState, type ReactNode } from 'react';

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
}

export function PageTransition({ pageKey, children }: PageTransitionProps) {
  const [displayed, setDisplayed] = useState<ReactNode>(children);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    setDisplayed(children);
    setEntering(true);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(false));
    });
    return () => cancelAnimationFrame(timer);
  }, [pageKey, children]);

  return (
    <div
      key={pageKey}
      className={entering ? 'animate-page-enter' : ''}
    >
      {displayed}
    </div>
  );
}
