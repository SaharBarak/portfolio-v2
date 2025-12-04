import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Ideas | Sahar Barak',
  description: 'Thoughts, concepts, and projects I\'m exploring',
};

export default function IdeasPage() {
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
            Ideas
          </h1>

          <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] mb-12">
            A collection of thoughts, concepts, and projects I&apos;m exploring or thinking about.
          </p>

          {/* Ideas Grid */}
          <div className="space-y-8">
            {/* Idea Card */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                  Active
                </span>
                <span className="text-[var(--text-sm)] text-[color:var(--text-muted)]">
                  Dec 2024
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                AI-Powered Code Review Assistant
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                Building a tool that uses LLMs to provide contextual code reviews,
                focusing on architectural patterns and best practices rather than just syntax.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  AI/ML
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  Developer Tools
                </span>
              </div>
            </article>

            {/* Idea Card */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
                  Exploring
                </span>
                <span className="text-[var(--text-sm)] text-[color:var(--text-muted)]">
                  Nov 2024
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Decentralized Energy Grid Management
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                Researching how blockchain and IoT can be combined to create
                more efficient, community-driven renewable energy distribution systems.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  Clean Energy
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  Blockchain
                </span>
              </div>
            </article>

            {/* Idea Card */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                  Concept
                </span>
                <span className="text-[var(--text-sm)] text-[color:var(--text-muted)]">
                  Oct 2024
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Collaborative World-Building Platform
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                A platform where writers, artists, and creators can collaboratively
                build shared fictional universes with consistent lore and visual styles.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  Creative Tools
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-full">
                  Collaboration
                </span>
              </div>
            </article>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-[color:var(--muted)] rounded-2xl text-center">
            <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-4">
              Have an idea to discuss?
            </h2>
            <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-6">
              I&apos;m always excited to explore new concepts and collaborate on interesting projects.
            </p>
            <a
              href="mailto:sahar.h.barak@gmail.com"
              className="inline-block px-6 py-3 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
