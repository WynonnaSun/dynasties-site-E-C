import React, { useState, useEffect, useRef } from 'react';

interface StreamingPlatformsProps {
  images: string[];
}

export const StreamingPlatforms: React.FC<StreamingPlatformsProps> = ({ images }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id');
          if (entry.isIntersecting && id) {
            setVisibleSections((prev) => new Set(prev).add(id));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="w-full bg-black px-6 pt-16 pb-6">
      <div className="mx-auto max-w-7xl">
        {/* 标题 - 无动画 */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-brand-yellow">
          Content Streaming Platforms
        </h2>

        {/* 平台Logo网格 - 5张一排 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => (sectionRefs.current[`platform-${index}`] = el)}
              data-section-id={`platform-${index}`}
              className={`flex items-center justify-center p-6 transition-all duration-700 ${
                visibleSections.has(`platform-${index}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={image}
                alt={`Platform ${index + 1}`}
                className="w-full h-auto object-contain max-h-20"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};