import { useEffect, useState, useRef } from 'react';

// Observer singleton compartilhado para reduzir overhead
let observer = null;
const callbacks = new WeakMap();

/**
 * Obtém ou cria o IntersectionObserver singleton
 */
function getObserver(options = {}) {
  if (!observer) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const cb = callbacks.get(entry.target);
        if (cb) {
          cb(entry.isIntersecting, entry);
        }
      });
    }, { ...defaultOptions, ...options });
  }
  return observer;
}

/**
 * Hook para detectar quando elemento entra na viewport
 * Usa singleton observer para melhor performance
 * 
 * @param {Object} options - Opções do IntersectionObserver
 * @returns {Array} [ref, inView, entry]
 * 
 * @example
 * const [ref, inView] = useInView();
 * <div ref={ref} className={inView ? 'visible' : 'hidden'}>
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const callback = (isIntersecting, observerEntry) => {
      setInView(isIntersecting);
      setEntry(observerEntry);
    };

    callbacks.set(element, callback);
    getObserver(options).observe(element);

    return () => {
      callbacks.delete(element);
      if (observer) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin]); // Apenas recriar se opções mudarem

  return [ref, inView, entry];
}

/**
 * Hook simplificado que só retorna boolean
 */
export function useIsVisible(options = {}) {
  const [ref, inView] = useInView(options);
  return [ref, inView];
}

