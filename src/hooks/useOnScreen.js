import { useState, useEffect } from 'react';

export default function useOnScreen(ref, rootMargin = '0px', root = null) {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const elem = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold: 0.5
      }
    );

    if (elem) {
      observer.observe(elem);
    }

    return () => {
      observer.unobserve(elem);
    };
    // eslint-disable-next-line
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}
