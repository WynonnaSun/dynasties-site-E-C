/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true });


interface ScrollCardStackProps {
  images: string[];
  className?: string;
}

export const ScrollCardStack: React.FC<ScrollCardStackProps> = ({
  images,
  className = "",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current;
      const stageEl = stageRef.current;
      const cards = cardsRef.current.filter(Boolean);

      if (!sectionEl || !stageEl || cards.length < 4) return;

      // 只清理当前 section 的触发器
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === sectionEl) t.kill();
      });

      // 居中基准：只设一次，后面不要再覆盖 xPercent/yPercent
      gsap.set(cards, {
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
        willChange: "transform",
      });

      // 
      gsap.set(cards[0], { x: -28, y: -18, rotation: -9, zIndex: 4 });
      gsap.set(cards[1], { x: 28, y: -14, rotation: 13, zIndex: 3 });
      gsap.set(cards[2], { x: -20, y: 20, rotation: 6, zIndex: 2 });
      gsap.set(cards[3], { x: 24, y: 16, rotation: -10, zIndex: 1 });

      const mm = gsap.matchMedia();

      // 桌面端
      mm.add("(min-width: 641px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            pin: true,
            scrub: 1,
            end: () => "+=1200",
            anticipatePin: 1, 
            invalidateOnRefresh: true,
          },
        });

        const stageW = stageEl.clientWidth || window.innerWidth;
        const cardW = (cards[0] as HTMLElement).offsetWidth || 280;

        const margin = 24;
        const maxSpacing = (stageW - margin * 2 - cardW) / 3;
        const idealSpacing = cardW + 40;
        const spacing = Math.max(60, Math.min(idealSpacing, maxSpacing));

        const xs = [-1.5, -0.5, 0.5, 1.5].map((m) => m * spacing);

        tl.to({}, { duration: 0.25 }); 
        tl.fromTo(
          cards,
          { rotation: (i) => [ -9, 13, 6, -10 ][i] },
          { rotation: 0, duration: 1, immediateRender: false },
          ">"
        );

        tl.to(cards[0], { x: xs[0], y: 0, duration: 1, ease: "none" }, "spread")
          .to(cards[1], { x: xs[1], y: 0, duration: 1, ease: "none" }, "spread")
          .to(cards[2], { x: xs[2], y: 0, duration: 1, ease: "none" }, "spread")
          .to(cards[3], { x: xs[3], y: 0, duration: 1, ease: "none" }, "spread");
        tl.to({}, { duration: 1.2 });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      //移动端：不 pin + 进入视口才开始
      mm.add("(max-width: 640px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 75%",
            pin: false,
            scrub: 1,
            end: () => "bottom 50%",
            invalidateOnRefresh: true,
          },
        });

        const cardW = (cards[0] as HTMLElement).offsetWidth || 180;
        const cardH = (cards[0] as HTMLElement).offsetHeight || 240;

        const gap = 12;
        const dx = cardW / 2 + gap;
        const dy = cardH / 2 + gap;

        tl.to(cards, { rotation: 0, duration: 0.8 }, 0);
        tl.to(cards[0], { x: -dx, y: -dy, duration: 1 }, "m")
          .to(cards[1], { x: dx, y: -dy, duration: 1 }, "m")
          .to(cards[2], { x: -dx, y: dy, duration: 1 }, "m")
          .to(cards[3], { x: dx, y: dy, duration: 1 }, "m");

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      const imgs = Array.from(sectionEl.querySelectorAll("img"));
      if (imgs.length) {
        let loaded = 0;
        const onDone = () => ScrollTrigger.refresh();

        const onLoad = () => {
          loaded += 1;
          if (loaded >= imgs.length) onDone();
        };

        imgs.forEach((img) => {
          if ((img as HTMLImageElement).complete) {
            loaded += 1;
          } else {
            img.addEventListener("load", onLoad, { once: true });
            img.addEventListener("error", onLoad, { once: true });
          }
        });

        if (loaded >= imgs.length) onDone();
      } else {
        ScrollTrigger.refresh();
      }

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, [images]);

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-black overflow-x-hidden ${className}`}
      style={{ minHeight: "100vh" }} 
    >
      <div className="relative w-full h-screen flex items-center justify-center">
        <div
          ref={stageRef}
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6"
          style={{ height: "min(520px, 70vh)" }}
        >
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                width: "clamp(160px, 42vw, 280px)",
                height: "clamp(220px, 57vw, 380px)",
              }}
            >
              <div className="w-full h-full overflow-hidden rounded-2xl shadow-2xl bg-white">
                <img
                  src={image}
                  alt={`Card ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
