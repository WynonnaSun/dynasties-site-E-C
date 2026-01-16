import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BannerSlider } from "../components/BannerSlider";
import { ScrollCardStack } from "../components/CardStack";
import { ProductGrid } from "../components/ProductGrid";
import { StreamingPlatforms } from "../components/StreamingPlatforms";

export function PortfolioPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const storeImages = ["/assets/portfolio/design1.png", "/assets/portfolio/design2.png"];

  const productImages = [
    "/assets/portfolio/product1.png",
    "/assets/portfolio/product2.png",
    "/assets/portfolio/product3.png",
  ];

  const bannerImages = [
    "/assets/portfolio/store1.png",
    "/assets/portfolio/store2.png",
    "/assets/portfolio/store3.png",
    "/assets/portfolio/store4.png",
  ];

  const plushImages = [
    "/assets/portfolio/Plush1.png",
    "/assets/portfolio/Plush2.png",
    "/assets/portfolio/Plush3.png",
    "/assets/portfolio/Plush4.png",
  ];

  const blindBoxImages = [
    "/assets/portfolio/blindbox1.png",
    "/assets/portfolio/blindbox2.png",
    "/assets/portfolio/blindbox3.png",
    "/assets/portfolio/blindbox4.png",
  ];

  const othersImages = [
    "/assets/portfolio/others1.png",
    "/assets/portfolio/others2.png",
    "/assets/portfolio/others3.png",
    "/assets/portfolio/others4.png",
    "/assets/portfolio/others5.png",
    "/assets/portfolio/others6.png",
    "/assets/portfolio/others7.png",
    "/assets/portfolio/others8.png",
  ];

  const streamingPlatforms = [
    "/assets/portfolio/platform1.png",
    "/assets/portfolio/platform2.png",
    "/assets/portfolio/platform3.png",
    "/assets/portfolio/platform4.png",
    "/assets/portfolio/platform5.png",
  ];

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
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        {/* Main Title */}
        <section className="w-full bg-black px-6 pt-16 pb-6">
          <div className="mx-auto max-w-6xl">
            <h1
              ref={(el) => (sectionRefs.current['main-title'] = el)}
              data-section-id="main-title"
              className={`text-center text-4xl font-bold text-brand-yellow md:text-5xl transition-all duration-700 ${
                visibleSections.has('main-title')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              Stores
            </h1>
          </div>
        </section>

        {/* Two Carousels */}
        <section className="w-full bg-black px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div
                ref={(el) => (sectionRefs.current['carousel-1'] = el)}
                data-section-id="carousel-1"
                className={`transition-all duration-700 ${
                  visibleSections.has('carousel-1')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <BannerSlider
                  images={storeImages}
                  mode="fade"
                  fadeEffect="zoom"
                  autoPlayInterval={3000}
                  showArrows={false}
                  showIndicators={true}
                  pauseOnHover={true}
                  aspectRatio="16/9"
                  showTitleOnHover={true}
                  hoverTitle="Store Design"
                />
              </div>

              <div
                ref={(el) => (sectionRefs.current['carousel-2'] = el)}
                data-section-id="carousel-2"
                className={`transition-all duration-700 ${
                  visibleSections.has('carousel-2')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <BannerSlider
                  images={productImages}
                  mode="fade"
                  fadeEffect="zoom"
                  autoPlayInterval={3000}
                  showArrows={false}
                  showIndicators={true}
                  pauseOnHover={true}
                  aspectRatio="16/9"
                  showTitleOnHover={true}
                  hoverTitle="Product Merchandising"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className="w-full bg-black px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div
              ref={(el) => (sectionRefs.current['banner'] = el)}
              data-section-id="banner"
              className={`transition-all duration-700 ${
                visibleSections.has('banner')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <BannerSlider
                images={bannerImages}
                mode="slide"
                fadeEffect="zoom"
                autoPlayInterval={3000}
                showArrows={true}
                showIndicators={true}
                pauseOnHover={true}
                aspectRatio="21/9"
              />
            </div>
          </div>
        </section>

        {/* Plush Collection Section */}
        <section className="w-full bg-black px-6 pt-16 pb-6">
          <div className="mx-auto max-w-6xl">
            <h2
              ref={(el) => (sectionRefs.current['plush-title'] = el)}
              data-section-id="plush-title"
              className={`text-center text-4xl font-bold text-brand-yellow md:text-5xl transition-all duration-700 ${
                visibleSections.has('plush-title')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              Plush Collection
            </h2>
          </div>
        </section>

        {/* Plush CardStack */}
        <section className="w-full bg-black py-4">
          <ScrollCardStack images={plushImages} />
        </section>

        {/* Blind Box */}
        <ProductGrid
          title="Blind Box"
          images={blindBoxImages}
          backgroundColor="bg-black"
          singleRow={true}
        />

        {/* Others */}
        <ProductGrid
          title="Others"
          images={othersImages}
          backgroundColor="bg-black"
          singleRow={false}
        />

        {/* Content Streaming Platforms */}
        <StreamingPlatforms images={streamingPlatforms} />

      </div>

      <Footer />
    </div>
  );
}