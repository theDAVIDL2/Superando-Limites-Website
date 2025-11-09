/**
 * Throttle usando requestAnimationFrame para performance otimizada
 * Garante que callback executa no máximo 1x por frame (~60fps)
 */
export function throttleRAF(callback) {
  let rafId = null;
  let lastArgs = null;
  
  return function throttled(...args) {
    lastArgs = args;
    
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      callback.apply(this, lastArgs);
      rafId = null;
    });
  };
}

/**
 * Throttle com tempo customizado
 * @param {Function} callback - Função a ser executada
 * @param {number} limit - Limite em ms entre execuções
 */
export function throttle(callback, limit = 100) {
  let waiting = false;
  let lastArgs = null;
  
  return function throttled(...args) {
    if (!waiting) {
      callback.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
        if (lastArgs) {
          callback.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

