import { useEffect, useRef, useState } from "react";

export default function PartnersMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!firstSetRef.current) return;

    const measure = () => {
      const w = firstSetRef.current!.scrollWidth;
      setDistance(w);
    };

    measure();

    // 监听尺寸变化
    const ro = new ResizeObserver(() => measure());
    ro.observe(firstSetRef.current);

    // 图片加载完成后再测
    const imgs = firstSetRef.current.querySelectorAll("img");
    const onLoad = () => measure();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad);
    });

    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
    };
  }, []);

  return (
    <section className="w-full overflow-hidden bg-black px-6 py-20 text-center">
      <h2 className="mb-12 text-4xl font-bold text-brand-yellow">
        Business Partners
      </h2>
      <div className="relative overflow-hidden py-4">
        <div
          ref={trackRef}
          className="marquee-track flex w-max items-center"
          style={{
            // @ts-ignore - CSS custom properties
            "--marquee-distance": `${distance}px`,
            "--marquee-duration": "60s", // 滚动速度
          }}
        >
          {/* 第一 */}
          <div ref={firstSetRef} className="flex items-center">
            {[...Array(31)].map((_, i) => (
              <img
                key={`first-${i}`}
                src={`/assets/partners/${String(i + 1).padStart(2, "0")}.png`}
                alt={`Partner ${i + 1}`}
                className="mx-0.5 h-20 flex-shrink-0 object-contain"
                draggable="false"
              />
            ))}
          </div>
          {/* 第二 */}
          <div className="flex items-center" aria-hidden="true">
            {[...Array(31)].map((_, i) => (
              <img
                key={`second-${i}`}
                src={`/assets/partners/${String(i + 1).padStart(2, "0")}.png`}
                alt=""
                className="mx-0.5 h-20 flex-shrink-0 object-contain"
                draggable="false"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}