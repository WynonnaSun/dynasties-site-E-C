import React, { useState, useEffect, useRef } from 'react';

interface ProductGridProps {
  title: string;
  images: string[];
  backgroundColor?: string;
  singleRow?: boolean; 
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  images,
  backgroundColor = 'bg-black',
  singleRow = false,
}) => {
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
    <section className={`w-full ${backgroundColor} px-6 pt-2 pb-12 py-32`}>
      <div className="mx-auto max-w-7xl">
        {/* 标题 - */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-brand-yellow">
          {title}
        </h2>

        {/* 图片网格 */}
        <div
          className={`grid gap-4 md:gap-6 ${
            singleRow
              ? // Blind Box: 自适应单行
                images.length === 1
                ? 'grid-cols-1'
                : images.length === 2
                ? 'grid-cols-2'
                : images.length === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : images.length === 4
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : // Others: 响应式多行网格
                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => (sectionRefs.current[`item-${index}`] = el)}
              data-section-id={`item-${index}`}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-700 hover:shadow-2xl hover:scale-105 ${
                visibleSections.has(`item-${index}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-square w-full">
                <img
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};