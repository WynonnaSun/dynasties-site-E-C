import React, { useMemo, useState } from "react";
import { submitEmail } from "../lib/api";

export function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");

  const year = useMemo(() => new Date().getFullYear(), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      // Backend only records email, but we keep the UI like Figma (Name/Message)
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
      {/* Hero */}
      <header className="relative min-h-[70vh] w-full overflow-hidden">
        <img
          src="/assets/hero.png"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <div className="flex items-center justify-between">
            <img src="/assets/logo.png" alt="Dynasties Capital" className="h-12 md:h-14" />
            <a
              href="#contact"
              className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-black shadow hover:opacity-90"
            >
              联系我们
            </a>
          </div>

          <div className="mt-10 max-w-3xl">
            <img src="/assets/flow.png" alt="Flow" className="h-24 md:h-28" />
            <p className="mt-6 text-lg leading-relaxed text-white/90">
              无论您是品牌方还是制造商，都很高兴与您合作，
              <span className="font-semibold text-brand-yellow"> 请尽快联系我们!</span>
            </p>
          </div>
        </div>
      </header>

      {/* Showcase */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-bold tracking-tight text-brand-yellow">Showcase</h2>
     

        <div className="mt-8 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img src="/assets/carousel1.png" alt="Carousel 1" className="w-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img src="/assets/carousel2.png" alt="Carousel 2" className="w-full object-cover" />
          </div>
        </div>
      </section>

      {/* 联系我们*/}
      <section id="contact" className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-brand-yellow">联系我们</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            我们很高兴与您合作！欢迎填写下方表格与我们联系。
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
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
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
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">内容</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请在此处留言"
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-yellow"
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
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed">
              无论您是品牌方还是制造商，都很高兴与您合作,{" "}
              <span className="font-semibold">let&apos;s chat!</span>
            </p>
          </div>
          <div className="text-sm">
            <div className="font-semibold">For all inquiries, reach us at:</div>
            <div className="mt-1 text-black/80">hello@example.com</div>
            <div className="mt-2 text-xs text-black/60">© {year} Dynasties Capital (Hong Kong)</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
