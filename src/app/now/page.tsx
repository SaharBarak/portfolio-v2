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

          {/* Current Focus */}
          <section className="mb-12">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Current Focus
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl">
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Building Portfolio v2
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  Creating a new portfolio website with Next.js, WebGL animations,
                  and a modern design system. Focusing on performance and accessibility.
                </p>
              </div>

              <div className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl">
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Learning Advanced ML Techniques
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  Deep diving into transformer architectures, fine-tuning LLMs,
                  and exploring multimodal AI applications.
                </p>
              </div>

              <div className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl">
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)] mb-2">
                  Open Source Contributions
                </h3>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  Contributing to developer tools and libraries that help
                  improve the ecosystem.
                </p>
              </div>
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
                    Based in Israel, working remotely and traveling when possible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                    Focusing on health, continuous learning, and meaningful work.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                    Exploring sustainable living and clean energy solutions.
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
