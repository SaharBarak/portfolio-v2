import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Now | Sahar Barak',
  description: 'What I\'m currently working on and focused on',
};

export default function NowPage() {
  return (
    <div className="relative min-h-screen bg-[color:var(--background)]">
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 pt-4 lg:px-8 bg-[color:var(--background)]/80 backdrop-blur-md">
        <Header />
      </div>

      {/* Main Content */}
      <main className="px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="font-heading text-[var(--text-4xl)] font-bold text-[color:var(--text-strong)] mb-4">
            Now
          </h1>

          <p className="font-body text-[var(--text-sm)] text-[color:var(--text-muted)] mb-12">
            Last updated: December 2024 &bull;{' '}
            <a
              href="https://aboutideasnow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[color:var(--text-strong)] transition-colors"
            >
              What is a /now page?
            </a>
          </p>

          {/* Products & Platforms */}
          <section className="mb-12">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Products & Platforms
            </h2>

            <div className="space-y-6">
              <a
                href="https://wessley.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow"
              >
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Wessley AI
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  World&apos;s first AI-powered virtual garage allowing you to examine your car in 3D, plan work, repairs,
                  upgrades, and order replacements with model-specific precision. Building a full pipeline from OEM
                  schematics → graph → 3D wiring → AI &quot;virtual mechanic.&quot;
                </p>
              </a>

              <a
                href="https://karencli.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow"
              >
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Karen AI
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  AI layout regression testing and automatic fixings. Renders your app across viewports,
                  detects layout and responsiveness issues, and generates concrete CSS/layout fixes.
                </p>
              </a>

              <a
                href="https://github.com/saharbarak/karen-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow"
              >
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Karen CLI
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  Open-source command-line tooling for Karen AI. Lets developers run layout checks from the terminal,
                  generate actionable tasks, and plug visual sanity checks into CI/CD.
                </p>
              </a>

              <a
                href="https://thepeaceboard.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow"
              >
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  The Peace Board
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  A decentralized peace art demonstration. Maps peace pledges worldwide, visualizes percentages by country,
                  exploring how civilian majorities can exert real leverage over policy.
                </p>
              </a>
            </div>
          </section>

          {/* Currently Reading */}
          <section className="mb-12">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Currently Reading
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-xl">
                <p className="font-body text-[var(--text-base)] text-[color:var(--text-strong)] font-medium">
                  &ldquo;Designing Data-Intensive Applications&rdquo;
                </p>
                <p className="font-body text-[var(--text-sm)] text-[color:var(--text-muted)]">
                  Martin Kleppmann
                </p>
              </div>

              <div className="p-4 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-xl">
                <p className="font-body text-[var(--text-base)] text-[color:var(--text-strong)] font-medium">
                  &ldquo;The Art of Doing Science and Engineering&rdquo;
                </p>
                <p className="font-body text-[var(--text-sm)] text-[color:var(--text-muted)]">
                  Richard Hamming
                </p>
              </div>
            </div>
          </section>

          {/* Currently Listening */}
          <section className="mb-12">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Currently Listening
            </h2>

            <div className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl">
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                A mix of electronic, ambient, and lo-fi music for focus.
                Podcasts about technology, design, and entrepreneurship.
              </p>
            </div>
          </section>

          {/* Life Updates */}
          <section className="mb-12">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Life Updates
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                    Based in Israel, building with Two Circle Studios and working on ventures.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                    Building an ecosystem of interoperable tools for better human coordination.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                    Exploring AI + physical infrastructure, decentralization + governance, and collaborative systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Connect */}
          <section className="p-8 bg-[color:var(--muted)] rounded-2xl text-center">
            <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-4">
              Want to chat about any of this?
            </h2>
            <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-6">
              Feel free to reach out if you&apos;re working on similar things or just want to connect.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://twitter.com/saharbarak"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] rounded-lg font-medium hover:bg-[color:var(--accent)] transition-colors"
              >
                Twitter
              </a>
              <a
                href="mailto:sahar.h.barak@gmail.com"
                className="px-6 py-3 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Email Me
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
