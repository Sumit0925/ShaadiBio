import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const FEATURES = [
  {
    icon: "✦",
    title: "Beautiful Templates",
    desc: "Traditional gold & red or modern navy minimal design",
  },
  {
    icon: "⚡",
    title: "Live Preview",
    desc: "See your biodata update in real-time as you type",
  },
  {
    icon: "📄",
    title: "Print & PDF",
    desc: "Export high-quality, print-ready PDF documents",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Hide income & contact details with one toggle",
  },
];

export default function HomePage() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-hero-gradient min-h-[90vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-crimson-500/10 blur-3xl" />
          <div className="absolute top-10 left-1/4 w-2 h-2 bg-gold-400/60 rounded-full" />
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-gold-300/40 rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-gold-500/50 rounded-full" />
        </div>

        <div className="relative text-center max-w-2xl mx-auto animate-fade-in">
          <div className="text-5xl sm:text-6xl mb-4">💍</div>
          <p className="text-gold-400 text-xs sm:text-sm font-bold tracking-[0.4em] uppercase mb-3">
            Welcome to
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-4 leading-tight">
            Shaadi<span className="text-gold-gradient">Bio</span>
          </h1>
          <p
            className="text-cream-300 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed"
            style={{ color: "#e8c090" }}
          >
            Create beautiful, professional marriage biodata in minutes.
            Traditional & modern templates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={user ? "/create" : "/register"}
              className="btn btn-gold btn-lg shadow-warm-lg hover:shadow-xl transition-shadow"
            >
              Get Started →
            </Link>

            {!user && (
              <Link
                to="/create"
                className="btn btn-secondary btn-lg border-white/30 text-white hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                Continue as Guest
              </Link>
            )}
          </div>

          {user && (
            <div className="mt-6">
              <Link
                to="/dashboard"
                className="text-sm text-gold-300 hover:text-gold-200 transition-colors underline underline-offset-2"
              >
                View My Biodatas →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-cream-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center text-gray-900 mb-2">
            Everything you need
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            Professional biodata in under 5 minutes
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-hover p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview section */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
            Two Beautiful Templates
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            Choose the style that matches your personality
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                name: "Traditional",
                emoji: "🪷",
                bg: "bg-crimson-gradient",
                desc: "Warm saffron & gold. Perfect for classical Indian families.",
                colors: ["#8b1a1a", "#c8873a", "#fffdf9"],
              },
              {
                name: "Modern Minimal",
                emoji: "✨",
                bg: "bg-navy-gradient",
                desc: "Clean navy sidebar with professional layout.",
                colors: ["#041f2e", "#7cc8e0", "#ffffff"],
              },
            ].map((t, i) => (
              <div key={i} className="card overflow-hidden card-hover">
                <div
                  className={`${t.bg} h-24 flex items-center justify-center`}
                >
                  <span className="text-4xl">{t.emoji}</span>
                </div>
                <div className="p-4">
                  <div className="flex gap-1.5 mb-2">
                    {t.colors.map((c, j) => (
                      <div
                        key={j}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/create" className="btn btn-primary btn-lg">
              Create Your Biodata →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
