import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BookOpen, ChevronDown, ExternalLink, Menu, Moon, Share2, Sun, Users,
} from 'lucide-react';
import GithubMark from './components/GithubMark';

interface MinistryView {
  name: string;
  blurb: string;
  linkUrl: string | null;
  linkLabel: string | null;
  badge: string | null;
  style: 'FEATURE' | 'LIGHT' | 'DARK' | 'OUTLINE';
  imageUrl: string | null;
  statusNote: string | null;
}
interface LabView { name: string; repo: string; linkUrl: string }
interface Network { ministries: MinistryView[]; labs: LabView[] }

/** Fades a section up the first time it scrolls into view. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-active');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-brand-500 w-full z-[100] origin-left"
      style={{ transform: `scaleX(${pct})` }}
      aria-hidden="true"
    />
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('rwn-theme', next ? 'dark' : 'light');
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors ml-4"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

/** The four bento treatments. Which one a ministry gets is data; how it looks is here. */
function MinistryCard({ m }: { m: MinistryView }) {
  if (m.style === 'FEATURE') {
    return (
      <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bento-card shadow-lg">
        {m.imageUrl && (
          <img
            src={m.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {m.badge && (
          <div className="absolute top-8 right-8 flex gap-2">
            <span className="bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              {m.badge}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-10">
          <h3 className="text-4xl font-serif text-white mb-4">{m.name}</h3>
          <p className="text-stone-300 mb-6 max-w-md">{m.blurb}</p>
          {m.linkUrl && (
            <a
              href={m.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-500 font-bold hover:text-white transition-colors"
            >
              {m.linkLabel} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  if (m.style === 'LIGHT') {
    return (
      <div className="md:col-span-4 md:row-span-1 bg-brand-100 dark:bg-stone-800 rounded-[2.5rem] p-10 flex flex-col justify-between bento-card">
        <div>
          <h3 className="text-2xl font-serif mb-2">{m.name}</h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm">{m.blurb}</p>
        </div>
        {m.linkUrl && (
          <a
            href={m.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-500 font-bold flex items-center gap-2"
          >
            {m.linkLabel} <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  if (m.style === 'DARK') {
    return (
      <div className="md:col-span-4 md:row-span-1 bg-stone-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between bento-card overflow-hidden relative">
        <Share2 className="absolute -right-4 -top-4 w-24 h-24 opacity-5" aria-hidden="true" />
        <div className="relative z-10">
          <h3 className="text-2xl font-serif mb-2">{m.name}</h3>
          <p className="text-stone-400 text-sm">{m.blurb}</p>
        </div>
        {m.linkUrl && (
          <a
            href={m.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 font-bold flex items-center gap-2 relative z-10"
          >
            {m.linkLabel} <Users className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="md:col-span-12 md:row-span-1 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between bento-card group">
      <div className="max-w-xl text-center md:text-left">
        <h3 className="text-2xl font-serif mb-2">{m.name}</h3>
        <p className="text-stone-500 text-sm leading-relaxed">{m.blurb}</p>
      </div>
      <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">
          Archive Research
        </span>
        {m.statusNote && (
          <div className="px-6 py-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-400 text-xs font-mono">
            {m.statusNote}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [network, setNetwork] = useState<Network | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const ministriesRef = useReveal<HTMLDivElement>();
  const labsRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    fetch('/api/network', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setNetwork)
      .catch(() => setNetwork(null));
  }, []);

  const nav = [
    ['#about', 'Vision'],
    ['#ministries', 'Ministries'],
    ['#labs', 'Labs'],
  ];

  return (
    <div className="bg-brand-50 dark:bg-obsidian text-stone-900 dark:text-stone-100 transition-colors duration-500">
      <ScrollProgress />

      <header className="fixed w-full top-0 z-50 glass border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-500 rounded-lg text-white group-hover:rotate-12 transition-transform duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-serif tracking-tight">
              RWN<span className="text-brand-500">.</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-xs uppercase tracking-[0.2em]">
            {nav.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-brand-500 transition-colors">{label}</a>
            ))}
            <ThemeToggle />
            <a
              href="https://subsplash.com/reformedwitness/give"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-900 dark:bg-brand-500 text-white px-6 py-2.5 rounded-full transition-all"
            >
              Support
            </a>
          </nav>

          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Menu />
          </button>
        </div>

        {/* The old site had a menu button that opened nothing on mobile. */}
        {menuOpen && (
          <nav className="lg:hidden border-t border-stone-200/50 dark:border-stone-800/50 px-6 py-4 flex flex-col gap-4 text-xs uppercase tracking-[0.2em]">
            {nav.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-brand-500 transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="flex items-center justify-between">
              <a
                href="https://subsplash.com/reformedwitness/give"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-900 dark:bg-brand-500 text-white px-6 py-2.5 rounded-full"
              >
                Support
              </a>
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="about" className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-50 dark:to-obsidian z-10" />
            <img
              src="https://s3.thebennett.net/rwn/images/hero-library.webp"
              className="w-full h-full object-cover opacity-20 dark:opacity-10 scale-105 hero-zoom"
              alt=""
              fetchPriority="high"
            />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-[1.1]">
                Timeless Truth. <br />
                <span className="italic text-brand-500">Modern Witness.</span>
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 mb-10 max-w-2xl leading-relaxed">
                Upholding the historic Reformed tradition through accessible media, scholarship, and
                community.
              </p>
              <a
                href="#ministries"
                className="px-8 py-4 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-all inline-flex items-center gap-2"
              >
                Our Network <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="ministries" className="py-24 bg-white dark:bg-neutral-900 transition-colors">
          <div ref={ministriesRef} className="container mx-auto px-6 reveal-init">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
              {(network?.ministries ?? []).map((m) => <MinistryCard key={m.name} m={m} />)}
            </div>
          </div>
        </section>

        <section
          id="labs"
          className="py-24 bg-brand-50 dark:bg-obsidian border-y border-stone-200 dark:border-stone-800"
        >
          <div ref={labsRef} className="container mx-auto px-6 reveal-init">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-serif">RWN Labs</h2>
              <div className="h-px flex-grow bg-brand-500/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(network?.labs ?? []).map((l) => (
                <div
                  key={l.repo}
                  className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-brand-500 transition-all"
                >
                  <h3 className="text-xl font-serif mb-2">{l.name}</h3>
                  <p className="text-stone-500 text-xs font-mono mb-4">repo: {l.repo}</p>
                  <a
                    href={l.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 font-bold text-xs flex items-center gap-2"
                  >
                    VIEW SOURCE <GithubMark className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-50 dark:bg-obsidian py-16 text-center border-t border-stone-200 dark:border-stone-800">
        <div className="font-serif text-2xl mb-8">
          RWN<span className="text-brand-500">.</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400">
          © {new Date().getFullYear()} Reformed Witness Network
        </p>
      </footer>
    </div>
  );
}
