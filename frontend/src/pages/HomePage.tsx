import React, { useState, useEffect, useRef } from "react";
import { submitEmail } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import PartnersMarquee from '../components/PartnersMarquee';

export function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      number: "20+",
      title: "Licensing Specialists",
      description: "Our experienced team drives partnerships and delivers value across Asia's IP market."
    },
    {
      number: "800+",
      title: "Retail Locations",
      description: "Powered by KK Group's ecosystem of 800+ stores and expanding networks."
    },
    {
      number: "5.6B RMB",
      title: "Annual Sales Driven",
      description: "Achieved through collaborations with top domestic manufacturers."
    },
    {
      number: "47.7B RMB",
      title: "Group Ecosystem Revenue",
      description: "Supporting long-term IP value through scarcity and ecosystem advantage."
    }
  ];

  const ipData = [
    { name: "Pingu", country: "Switzerland", desc: "Classic clay animation", img: "pingu" },
    { name: "SpongeBob SquarePants", country: "USA", desc: "Comedy animation", img: "spongebob" },
    { name: "Garfield", country: "USA", desc: "Classic comic series", img: "garfield" },
    { name: "Crayon Shin-chan", country: "Japan", desc: "Iconic anime", img: "shinchan" },
    { name: "Illustration Characters", country: "Japan", desc: "Super-popular illustrations", img: "illustration" },
    { name: "Line Puppy", country: "South Korea", desc: "Top-tier emoji pack", img: "linepuppy" },
    { name: "Siam Lip", country: "China", desc: "Viral emoji pack", img: "siamlip" },
    { name: "Nai Long", country: "China", desc: "Internet-famous animation", img: "nailong" },
    { name: "Boonie Bears", country: "China", desc: "Classic animation", img: "boonie" },
    { name: "Mofy the Cotton Rabbit", country: "Florence", desc: "World's first cotton stop-motion animation", img: "mofy" }
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

  // 无缝滚动逻辑
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPosition = 0;

    const scroll = () => {
      const firstSet = container.querySelector('.partner-set');
      if (!firstSet) return;

      const scrollWidth = firstSet.scrollWidth;
      
      // 每帧移动的像素（调整这个值可以改变速度）
      scrollPosition += 0.5;

      // 当滚动到第一组图片宽度时，重置到0
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
      }

      container.style.transform = `translateX(-${scrollPosition}px)`;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await submitEmail(email, name, message);
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Submission failed");
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <Navbar />

      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="w-full bg-black px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-5xl font-bold text-brand-yellow md:text-6xl">
              Dynasties Capital
            </h1>
            
            <p className="mx-auto mt-8 max-w-4xl text-base leading-relaxed text-white md:text-lg">
              Dynasties Capital, initiated by China's top trendy toy retailer with RMB 8B+ annual sales, 
              specializes in animation IP investment, distribution, sub-licensing, and merchandise development. 
              Covering Greater China and Southeast Asia (excl. Japan/Korea), we prioritize IP long-term value via 
              scarcity control and end-to-end support. Backed by KK's 1,000+ stores and X11's IP retail network, 
              we bridge global creators with Asian markets—turning compelling stories into immersive consumer experiences. 
              Partner with us for scalable, localized IP growth.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-black px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  ref={(el) => (sectionRefs.current[`stat-${index}`] = el)}
                  data-section-id={`stat-${index}`}
                  className={`rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-700 ${
                    visibleSections.has(`stat-${index}`)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-bold text-brand-yellow">{stat.number}</div>
                  <div className="mt-3 text-lg font-semibold text-white">{stat.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Business */}
        <section className="w-full bg-black px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <h2
              ref={(el) => (sectionRefs.current['business-title'] = el)}
              data-section-id="business-title"
              className={`text-center text-4xl font-bold text-brand-yellow mb-12 transition-all duration-700 ${
                visibleSections.has('business-title')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              Our Business
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 - IP Investment */}
              <div
                ref={(el) => (sectionRefs.current['business-0'] = el)}
                data-section-id="business-0"
                className={`group transform rotate-[-8deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ${
                  visibleSections.has('business-0')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl p-3">
                  <div className="overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/4]">
                      <img 
                        src="/assets/business/business1.png" 
                        alt="IP Investment"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-brand-yellow text-black font-bold px-3 py-1 rounded-lg text-sm">
                        NO.01
                      </span>
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                        <p className="text-white text-center text-sm leading-relaxed">
                          Co-produce animated projects with capital support. Leverage our local resources to boost market resonance and ROI for global creators.
                        </p>
                      </div>
                    </div>
                    <div className="bg-brand-yellow px-6 py-3">
                      <h3 className="text-base font-bold text-black text-center">IP Investment</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Content Distribution */}
              <div
                ref={(el) => (sectionRefs.current['business-1'] = el)}
                data-section-id="business-1"
                className={`group transform rotate-[5deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ${
                  visibleSections.has('business-1')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl p-3">
                  <div className="overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/4]">
                      <img 
                        src="/assets/business/business2.png" 
                        alt="Content Distribution"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-brand-yellow text-black font-bold px-3 py-1 rounded-lg text-sm">
                        NO.02
                      </span>
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                        <p className="text-white text-center text-sm leading-relaxed">
                          Distribute content across Greater China & Southeast Asia via direct/indirect channels. Amplify reach through integrated online/offline networks.
                        </p>
                      </div>
                    </div>
                    <div className="bg-brand-yellow px-6 py-3">
                      <h3 className="text-base font-bold text-black text-center">Content Distribution</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - IP Sub-licensing */}
              <div
                ref={(el) => (sectionRefs.current['business-2'] = el)}
                data-section-id="business-2"
                className={`group transform rotate-[-5deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ${
                  visibleSections.has('business-2')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl p-3">
                  <div className="overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/4]">
                      <img 
                        src="/assets/business/business3.png" 
                        alt="IP Sub-licensing"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-brand-yellow text-black font-bold px-3 py-1 rounded-lg text-sm">
                        NO.03
                      </span>
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                        <p className="text-white text-center text-sm leading-relaxed">
                          License IPs across toys, apparel, home goods, etc. Ensure compliance, manage scarcity, and sustain long-term brand equity.
                        </p>
                      </div>
                    </div>
                    <div className="bg-brand-yellow px-6 py-3">
                      <h3 className="text-base font-bold text-black text-center">IP Sub-licensing</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 - Merchandise Development */}
              <div
                ref={(el) => (sectionRefs.current['business-3'] = el)}
                data-section-id="business-3"
                className={`group transform rotate-[8deg] hover:rotate-0 transition-all duration-700 hover:scale-105 ${
                  visibleSections.has('business-3')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl p-3">
                  <div className="overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/4]">
                      <img 
                        src="/assets/business/business4.png" 
                        alt="Merchandise Development"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-brand-yellow text-black font-bold px-3 py-1 rounded-lg text-sm">
                        NO.04
                      </span>
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                        <p className="text-white text-center text-sm leading-relaxed">
                          Develop & wholesale merchandise through robust supply chains and 800+ retail locations. Deliver quality products at scale.
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#E9B132] px-6 py-3">
                      <h3 className="text-base font-bold text-black text-center">Merchandise Development</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global IP Partnerships */}
        <section
          ref={(el) => (sectionRefs.current['ip-section'] = el)}
          data-section-id="ip-section"
          className={`w-full bg-black px-4 sm:px-6 py-12 sm:py-20 text-center transition-all duration-700 ${
            visibleSections.has('ip-section')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-bold text-brand-yellow px-4">
            Global IP Partnerships
          </h2>
          
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {ipData.map((ip, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[`ip-${index}`] = el)}
                data-section-id={`ip-${index}`}
                className={`w-full rounded-xl sm:rounded-2xl border border-[rgba(247,207,70,0.2)] bg-white px-3 py-4 sm:px-5 sm:py-7 shadow-lg transition-all duration-700 hover:-translate-y-2 hover:border-[rgba(247,207,70,0.5)] hover:shadow-2xl ${
                  visibleSections.has(`ip-${index}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <img 
                  src={`/assets/ip/ip-${ip.img}.png`}
                  alt={ip.name}
                  className="mx-auto mb-3 sm:mb-4 h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-full border-[3px] border-[rgba(247,207,70,0.3)] object-cover transition-all duration-300 hover:border-[#F7CF46]"
                />
                <h3 className="mb-1 sm:mb-1.5 text-sm sm:text-base md:text-lg font-bold text-[#F7CF46] line-clamp-1">
                  {ip.name}
                </h3>
                <p className="mb-0.5 sm:mb-1 text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                  {ip.country}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {ip.desc}
                </p>
              </div>
            ))}
          </div>
          
          <p className="mt-6 sm:mt-10 text-xs sm:text-sm italic text-white/70 px-4">
            * Above are some of the partnered IPs.
          </p>
        </section>

        {/* Our Team */}
        <section className="w-full bg-black px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h2
              ref={(el) => (sectionRefs.current['team-title'] = el)}
              data-section-id="team-title"
              className={`mb-14 text-4xl font-bold text-brand-yellow transition-all duration-700 ${
                visibleSections.has('team-title')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              Our Team
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Team Member 1 - Jerry Sun */}
              <div
                ref={(el) => (sectionRefs.current['team-0'] = el)}
                data-section-id="team-0"
                className={`group rounded-2xl border border-brand-yellow/20 bg-white p-6 text-center shadow-lg transition-all duration-700 hover:-translate-y-2 hover:border-brand-yellow/50 hover:shadow-2xl ${
                  visibleSections.has('team-0')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src="/assets/team/team1.png" 
                    alt="Jerry Sun"
                    className="h-full w-full object-contain transition-all duration-400 group-hover:scale-105 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-white opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                      Serial entrepreneur & investor with extensive experience in entertainment licensing and regional content distribution.
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-yellow">Jerry Sun</h3>
                <p className="mt-1 text-sm text-black/80">Partner</p>
              </div>

              {/* Team Member 2 - Grant Hu */}
              <div
                ref={(el) => (sectionRefs.current['team-1'] = el)}
                data-section-id="team-1"
                className={`group rounded-2xl border border-brand-yellow/20 bg-white p-6 text-center shadow-lg transition-all duration-700 hover:-translate-y-2 hover:border-brand-yellow/50 hover:shadow-2xl ${
                  visibleSections.has('team-1')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '100ms' }}
              >
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl">
                  <img 
                    src="/assets/team/team2.png" 
                    alt="Grant Hu"
                    className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105 group-hover:brightness-75"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-white opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                      Senior Investment Partner with 15+ years experience in PE/VC, specializing in cross-border acquisition and IP strategy.
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-yellow">Grant Hu</h3>
                <p className="mt-1 text-sm text-black/80">Managing Partner</p>
              </div>

              {/* Team Member 3 - Lei Zhang */}
              <div
                ref={(el) => (sectionRefs.current['team-2'] = el)}
                data-section-id="team-2"
                className={`group rounded-2xl border border-brand-yellow/20 bg-white p-6 text-center shadow-lg transition-all duration-700 hover:-translate-y-2 hover:border-brand-yellow/50 hover:shadow-2xl ${
                  visibleSections.has('team-2')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl">
                  <img 
                    src="/assets/team/team3.png" 
                    alt="Lei Zhang"
                    className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105 group-hover:brightness-75"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-white opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                      CEO of X11 Group with deep knowledge in toy industry supply chain and retail ecosystem growth across Asia.
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-yellow">Lei Zhang</h3>
                <p className="mt-1 text-sm text-black/80">Partner</p>
              </div>

              {/* Team Member 4 - Vesta Hu */}
              <div
                ref={(el) => (sectionRefs.current['team-3'] = el)}
                data-section-id="team-3"
                className={`group rounded-2xl border border-brand-yellow/20 bg-white p-6 text-center shadow-lg transition-all duration-700 hover:-translate-y-2 hover:border-brand-yellow/50 hover:shadow-2xl ${
                  visibleSections.has('team-3')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl">
                  <img 
                    src="/assets/team/team4.png" 
                    alt="Vesta Hu"
                    className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105 group-hover:brightness-75"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-white opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                      Licensing specialist focusing on strategic brand partnerships, category expansion and manufacturer onboarding.
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-brand-yellow">Vesta Hu</h3>
                <p className="mt-1 text-sm text-black/80">Licensing Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Partners */}
        <PartnersMarquee />

        {/* Contact Us */}
        <section id="contact" className="mx-auto max-w-7xl px-6 pb-20 pt-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-brand-yellow">Contact Us</h2>
            <p className="mx-auto mt-4 text-base text-white/80">
              For specific cooperation process inquiries, please fill out the form below to contact us.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-900">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please leave a message here"
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-brand-yellow py-3 font-bold text-black shadow hover:opacity-95 disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Submit"}
              </button>
              {status === "ok" && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  Received! We will contact you as soon as possible.
                </div>
              )}
              {status === "error" && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}