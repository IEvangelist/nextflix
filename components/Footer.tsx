'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Only these two are real external links. Everything else becomes plain text.
  const extLinkBase = "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white";

  const sectionTitle = "text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 mb-3";
  const itemText = "text-[13px] leading-relaxed text-gray-500/80";

  return (
    <footer className="relative mt-32 border-t border-white/10 bg-black/95">
      {/* Full-bleed background already spans 100%; container only constrains content. */}
      <div className="pointer-events-none absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black" aria-hidden />
      <div className="w-full px-[clamp(1.25rem,4vw,4rem)] py-16">
        {/* Responsive auto-fit grid to avoid large empty right gutter on ultrawide */}
        <div className="grid gap-12 md:gap-10 lg:gap-14 [--min:150px] grid-cols-[repeat(auto-fit,minmax(var(--min),1fr))] mb-14 pt-8 pb-8">
          {/* Brand + description */}
          <div className="max-w-sm">
            <div className="text-2xl font-bold tracking-tight text-red-600 mb-4">NEXTFLIX</div>
            <p className="text-sm text-gray-400 leading-relaxed pb-4 pt-2">
              A Netflix-inspired educational demo showcasing modern{' '}
              <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className={extLinkBase + ' underline decoration-red-600/60 underline-offset-4'}
              >
              Next.js
              </a>{' '}
              and API data from{' '}
              <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className={extLinkBase + ' underline decoration-red-600/60 underline-offset-4'}
              >
              TMDB
              </a>. Crafted with care ❤️ by David Pine.
            </p>
          </div>

          {/* Faux sections (static text) */}
          <div>
            <h3 className={sectionTitle}>About</h3>
            <ul className="space-y-1.5">
              <li className={itemText}>About Us</li>
              <li className={itemText}>Careers</li>
              <li className={itemText}>News</li>
              <li className={itemText}>Press</li>
            </ul>
          </div>
          <div>
            <h3 className={sectionTitle}>Support</h3>
            <ul className="space-y-1.5">
              <li className={itemText}>Help Center</li>
              <li className={itemText}>Contact Us</li>
              <li className={itemText}>Account</li>
              <li className={itemText}>Redeem Gift Cards</li>
            </ul>
          </div>
          <div>
            <h3 className={sectionTitle}>Legal</h3>
            <ul className="space-y-1.5">
              <li className={itemText}>Privacy</li>
              <li className={itemText}>Terms of Use</li>
              <li className={itemText}>Cookie Preferences</li>
              <li className={itemText}>Legal Notices</li>
            </ul>
          </div>
          <div>
            <h3 className={sectionTitle}>Connect</h3>
            <ul className="space-y-1.5">
              <li className={itemText}>Social Media</li>
              <li className={itemText}>Blog</li>
              <li className={itemText}>GitHub Repo</li>
              <li className={itemText}>Author Site</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[13px] text-gray-500/80">
          <div>
            <span className="text-white/60">© {currentYear} Nextflix, Inc.</span>
          </div>
          <div>
            <span>
              Built by{' '}
              <a
                href="https://davidpine.net"
                target="_blank"
                rel="noopener noreferrer"
                className={extLinkBase + ' underline decoration-red-600/60 underline-offset-4 inline-flex items-center gap-1.5'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                David Pine
              </a>{' '}•{' '}
              <a
                href="https://github.com/IEvangelist/nextflix"
                target="_blank"
                rel="noopener noreferrer"
                className={extLinkBase + ' underline decoration-red-600/60 underline-offset-4 inline-flex items-center gap-1.5'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Open Source
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}