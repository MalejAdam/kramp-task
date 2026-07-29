import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './RouteProgress.module.css';

export function RouteProgress() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const hideRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const clearTimers = () => {
      clearInterval(trickleRef.current);
      clearTimeout(hideRef.current);
    };

    const start = () => {
      clearTimers();
      setVisible(true);
      setProgress(10);
      trickleRef.current = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + (90 - prev) * 0.1 : prev));
      }, 200);
    };

    const done = () => {
      clearInterval(trickleRef.current);
      setProgress(100);
      hideRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    };

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
      clearTimers();
    };
  }, [router.events]);

  if (!visible) return null;

  return (
    <div className={styles.bar} role="progressbar" aria-label="Loading page" aria-busy="true">
      <div className={styles.indicator} style={{ width: `${progress}%` }} />
    </div>
  );
}
