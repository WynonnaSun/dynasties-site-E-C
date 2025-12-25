import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitEmail } from "../lib/api";

export function ChinesePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [language, setLanguage] = useState("zh");

  const year = useMemo(() => new Date().getFullYear(), []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === "en") {
      navigate("/");
    }
  };

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
      setError(err?.message ?? "提交失败");
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar with Logo and Language Selector */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-brand-yellow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex-1"></div>
          <img src="/assets/logo.png" alt="Dynasties Capital" className="h-12 md:h-14" />
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded-lg border-2 border-black bg-brand-yellow px-3 py-2 text-sm font-bold text-black hover:bg-black hover:text-brand-yellow focus:outline-none"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-[70vh] w-full overflow-hidden">
        <img
          src="/assets/hero.png"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
          <div className="mt-10">
            <img src="/assets/flow.png" alt="Flow" className="h-24 md:h-28" />
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              无论您是品牌方还是制造商，都很高兴与您合作，
              <span className="font-semibold text-brand-yellow"> 请尽快联系我们!</span>
            </p>
            
            {/* Contact Button */}
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block rounded-full bg-brand-yellow px-8 py-3 text-base font-bold text-black shadow-lg hover:opacity-90 transition-opacity"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Business Introduction */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-yellow md:text-4xl">
            IP转授权与衍生品批发 | 盛世资本 (Dynasties Capital)
          </h1>
          
          <div className="mt-12 space-y-12">
            {/* 核心业务 */}
            <div>
              <h2 className="text-2xl font-bold text-brand-yellow">核心业务</h2>
              <p className="mx-auto mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                盛世资本专注于动漫IP在大中华地区（含港澳台）的转授权运营，及基于授权开发的衍生品批发业务。
              </p>
              <p className="mx-auto mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                已获得的动漫IP包括但不限于： FLOW
              </p>
            </div>

            {/* 授权范围 */}
            <div>
              <h2 className="text-2xl font-bold text-brand-yellow">授权范围</h2>
              <p className="mx-auto mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                覆盖全品类IP衍生品转授权合作，包括但不限于潮玩、文创、家居、服饰等品类的授权开发，以及授权衍生品的批量供货。
              </p>
            </div>

            {/* 合作优势 */}
            <div>
              <h2 className="text-2xl font-bold text-brand-yellow">合作优势</h2>
              <p className="mx-auto mt-4 text-base leading-relaxed text-white/90 md:text-lg">
                基于我们已经合作的多个零售网络与延伸品制造商的强大供应链能力，我们确保授权合规性与衍生品品质，为合作方提供高效、本地化的IP商业化解决方案，快速落地授权合作与衍生品批发需求。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-center text-3xl font-bold tracking-tight text-brand-yellow md:text-4xl">
          合作案例
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <div key={num} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img 
                src={`/assets/pic${num}.png`} 
                alt={`Showcase ${num}`} 
                className={`w-full object-cover ${num <= 6 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 联系我们*/}
      <section id="contact" className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-brand-yellow">联系我们</h2>
          <p className="mx-auto mt-4 text-white/80">
            具体合作流程咨询，请填写下方表格与我们联系。
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-8 text-black shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold">姓名</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您的名字"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">邮箱地址</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">内容</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请在此处留言"
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-brand-yellow py-3 font-bold text-white shadow hover:opacity-95 disabled:opacity-60"
            >
              {status === "loading" ? "提交中..." : "提交"}
            </button>

            {status === "ok" && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                已收到！我们会尽快联系你。
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

      {/* Footer */}
      <footer className="w-full bg-brand-yellow text-black">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed">
              如需了解具体IP授权清单、批发政策及合作流程,{" "}
              <span className="font-semibold">欢迎合作咨询！</span>
            </p>
          </div>
          <div className="text-sm">
            <div className="font-semibold">联系邮箱：</div>
            <div className="mt-1 text-black/80">Contact@dynastiescapital.com</div>
            <div className="mt-2 text-xs text-black/60">© {year} Romance of Dynasties Investment Management Limited</div>
          </div>
        </div>
      </footer>
    </div>
  );
}