import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import ImageSection from "../components/ImageSection";


export function OurValuePage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <Navbar />

      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="w-full bg-black px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-base text-white/80 leading-relaxed">
              Dynasties Capital, founded by China's top trendy toy retailer, specializes in
              animation IP investment, distribution, sub-licensing, and merchandise development.
            </p>
          </div>
        </section>

        {/* Main Title */}
        <section className="w-full bg-black px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-center text-4xl font-bold text-brand-yellow md:text-5xl">
              Our Vision, Mission & Values
            </h1>
          </div>
        </section>

        {/* Our Business Image Section */}
        <section className="w-full bg-black px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <ImageSection locale="en" sectionKey="our_business" />
          </div>
        </section>
        
        {/* Content Section */}
        <section className="w-full bg-black px-6 py-12 pb-20">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Paragraph 1 */}
            <div
              ref={(el) => (sectionRefs.current[0] = el)}
              data-index={0}
              className={`transition-all duration-700 ${
                visibleSections.has(0)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <p className="text-base leading-relaxed text-white">
                In an era where online content is oversaturated with distractions that fragment
                readers' attention spans, we look forward to partnering with well-crafted IPs—
                IPs where authors invest time and effort into building rich backgrounds, a
                distinct worldview, and vivid characters through the characters' encounters
                and interactions. These are the kinds of IPs that require readers to take the time
                to engage with the story to fully appreciate their depth. We believe these
                emotional bonds between IPs and readers will deepen over time—and these are
                the types of IPs we hope to partner with on a long-term basis.
              </p>
            </div>

            {/* Paragraph 2 */}
            <div
              ref={(el) => (sectionRefs.current[1] = el)}
              data-index={1}
              className={`transition-all duration-700 ${
                visibleSections.has(1)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <p className="text-base leading-relaxed text-white">
                We believe our core focus of "leveraging technological advancements in the
                merchandising industry to create high-quality merchandising products", aligns
                well with this type of IPs. This approach offers a new way to foster emotional
                connections with audiences via offline touchpoints, a alternatives route of
                capture the reader's quality attention span, triggering interest of further looking
                into the IP's content that the author took time and effort to accomplish.
                We have the experience in managing and balancing regular merchandising,
                limited-edition releases, exclusive collaborations, and seasonal drops in the
                region.
              </p>
            </div>

            {/* Paragraph 3 */}
            <div
              ref={(el) => (sectionRefs.current[2] = el)}
              data-index={2}
              className={`transition-all duration-700 ${
                visibleSections.has(2)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <p className="text-base leading-relaxed text-white">
                We have track records in maintaining brand integrity while driving consumer
                demand, which creates a win/win situation for specific IP's market expansion
                and brand elevation across Greater China and Southeast Asia. We are confident
                that our collaborative approach will not only enhance the emotional equity of
                your IP but also deliver measurable growth in market share and consumer
                loyalty. we would like to work together with IP creators on a scalable, region-
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}