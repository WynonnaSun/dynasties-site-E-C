import React, { useState, useEffect, useCallback } from 'react';

export type SliderMode = 'slide' | 'fade';
export type FadeEffect = 'default' | 'zoom' | 'ken-burns';

interface BannerSliderProps {
  images: string[];
  mode?: SliderMode;
  fadeEffect?: FadeEffect;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  aspectRatio?: string;
  showTitleOnHover?: boolean;
  hoverTitle?: string;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  images,
  mode = 'slide',
  fadeEffect = 'zoom',
  autoPlayInterval = 5000,
  showArrows = true,
  showIndicators = true,
  pauseOnHover = true,
  className = '',
  aspectRatio = '16/9',
  showTitleOnHover = false,
  hoverTitle = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 下一张
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  // 上一张
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // 跳转到指定索引
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 自动播放
  useEffect(() => {
    if (pauseOnHover && isHovered) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovered, pauseOnHover, nextSlide, autoPlayInterval]);

  // 鼠标悬停控制
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div 
        className="relative w-full"
        style={{ aspectRatio }}
      >
        {mode === 'slide' ? (
          // Slide Mode - 滑动切换
          <div className="relative h-full w-full overflow-hidden">
            <div 
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Slide ${index + 1}`}
                  className="min-w-full h-full object-cover"
                />
              ))}
            </div>
          </div>
        ) : (
          // Fade Mode - 淡入淡出切换
          <>
            {images.map((image, index) => {
              const isActive = index === currentIndex;
              
              // 根据不同效果类型设置类名
              let effectClasses = '';
              switch (fadeEffect) {
                case 'default':
                  effectClasses = isActive ? 'opacity-100' : 'opacity-0';
                  break;
                case 'zoom':
                  effectClasses = isActive 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105';
                  break;
                case 'ken-burns':
                  effectClasses = isActive 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-0 scale-100';
                  break;
              }
              
              return (
                <img
                  key={index}
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${effectClasses}`}
                />
              );
            })}
          </>
        )}

        {/* Hover Title Overlay */}
        {showTitleOnHover && hoverTitle && (
          <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex h-full items-center justify-center">
              <h2 className="text-4xl font-bold text-brand-yellow">
                {hoverTitle}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* Arrow Buttons */}
      {showArrows && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-black/50 px-3 py-4 text-2xl text-white transition-all duration-300 hover:bg-black/80 md:left-6"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-black/50 px-3 py-4 text-2xl text-white transition-all duration-300 hover:bg-black/80 md:right-6"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {showIndicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-brand-yellow'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};