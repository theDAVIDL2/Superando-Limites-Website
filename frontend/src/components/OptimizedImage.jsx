import React, { useState, useEffect, useRef, memo } from 'react';

/**
 * Componente de Imagem Otimizada
 * 
 * Características:
 * - Suporte automático a AVIF com fallback para WebP
 * - Lazy loading inteligente com Intersection Observer
 * - Preload de imagens críticas (LCP)
 * - Imagens responsivas com srcset
 * - Placeholder blur-up effect
 * - Decode assíncrono para melhor performance
 * 
 * @example
 * <OptimizedImage
 *   src="/images/capa-1024w"
 *   alt="Capa do livro"
 *   sizes="(max-width: 768px) 92vw, 640px"
 *   widths={[640, 768, 1024]}
 *   width={1024}
 *   height={1366}
 *   priority={true}
 *   className="rounded-xl"
 * />
 */
export const OptimizedImage = memo(({
  src, // Path sem extensão, ex: "/images/capa-1024w"
  alt,
  sizes = "100vw",
  widths = [640, 768, 1024, 1280, 1536, 1920],
  width,
  height,
  priority = false, // Se true, não faz lazy load e adiciona fetchpriority="high"
  className = "",
  objectFit = "cover",
  // Quando true e priority, forçar WebP como formato principal para reduzir latência de decode
  preferWebpForLcp = false,
  loading,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Se priority, já começa visível
  const imgRef = useRef(null);
  const [isMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth <= 768
  );

  // Gerar srcSet para AVIF e WebP
  const generateSrcSet = (format) => {
    const extension = format === 'avif' ? '.avif' : '.webp';
    return widths
      .map(w => {
        const imagePath = src.includes('-') 
          ? src.replace(/(-\d+w)?$/, `-${w}w${extension}`)
          : `${src}-${w}w${extension}`;
        return `${imagePath} ${w}w`;
      })
      .join(', ');
  };

  // Obter src padrão (maior resolução)
  const defaultSrc = src.includes('.webp') ? src : `${src}.webp`;

  // Intersection Observer para lazy loading (menos agressivo no mobile)
  useEffect(() => {
    if (priority) return;
    
    // No mobile, carregar mais cedo
    if (isMobile) {
      setIsInView(true);
      return;
    }

    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Carregar 200px antes (mais que antes)
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, isMobile]);

  // Handler de carregamento
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // Determinar loading strategy
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');

  return (
    <>
      {/* Placeholder blur enquanto carrega */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Picture element com AVIF + WebP fallback */}
      {isInView && (
        <picture ref={imgRef}>
          {/* Para LCP, opcionalmente preferir WebP para reduzir latência de decode */}
          {!preferWebpForLcp && (
            <source 
              type="image/avif"
              srcSet={generateSrcSet('avif')}
              sizes={sizes}
            />
          )}
          <source 
            type="image/webp"
            srcSet={generateSrcSet('webp')}
            sizes={sizes}
          />
          
          {/* IMG - Fallback final */}
          <img
            src={defaultSrc}
            alt={alt}
            width={width}
            height={height}
            loading={loadingStrategy}
            // Para LCP (priority), não usar decoding=async para evitar atrasar pintura
            {...(priority ? {} : { decoding: 'async' })}
            fetchpriority={priority ? "high" : undefined}
            onLoad={handleLoad}
            className={`
              w-full h-full object-${objectFit} ${priority ? '' : 'transition-opacity duration-300'}
              ${priority ? '' : (isLoaded ? 'opacity-100' : 'opacity-0')}
              ${className}
            `}
            {...props}
          />
        </picture>
      )}
      {!isInView && <div ref={imgRef} />}
    </>
  );
}, (prevProps, nextProps) => {
  // Evita re-render se props críticas não mudarem
  return prevProps.src === nextProps.src &&
         prevProps.priority === nextProps.priority &&
         prevProps.className === nextProps.className;
});

/**
 * Hook para preload de imagens críticas
 * Use para imagens LCP (Largest Contentful Paint)
 * 
 * @example
 * useImagePreload('/images/capa-1024w', ['avif', 'webp']);
 */
export const useImagePreload = (src, formats = ['avif', 'webp']) => {
  useEffect(() => {
    formats.forEach(format => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.type = `image/${format}`;
      link.href = `${src}.${format}`;
      link.fetchpriority = 'high';
      document.head.appendChild(link);

      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    });
  }, [src, formats]);
};

export default OptimizedImage;

