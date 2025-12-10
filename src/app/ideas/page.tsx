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
            Concepts, prototypes, and directions that are in exploration mode.
          </p>

          {/* Ideas Grid */}
          <div className="space-y-8">
            {/* Taro */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-[var(--radius-full)]">
                  Prototype
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Taro
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                A real-time visual graph of chords and harmonies, turning music theory into an evolving network
                of tensions and resolutions. Play a chord and watch a graph of harmonies and progressions unfold—
                making learning music theory interactive and informative.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Music
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Visualization
                </span>
              </div>
            </article>

            {/* Brief Me */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-[var(--radius-full)]">
                  Concept
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Brief Me
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                A personal &quot;sense-making&quot; layer that summarizes your data-flooded digital life into timelines,
                decisions, and action items. An AI that sits on your data—WhatsApp groups, emails, messages—and
                filters the influx into actionables and calendar events.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  AI
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Productivity
                </span>
              </div>
            </article>

            {/* SYNC */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-[var(--radius-full)]">
                  Active
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                SYNC
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                A Web6-flavored identity layer built from SDS/SEL-DIDs and a user-owned data graph,
                purposed to fulfill SYNC&apos;s vision of a fully decentralized civilian-powered governance system.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Decentralization
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Identity
                </span>
              </div>
            </article>

            {/* Been There */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-[var(--radius-full)]">
                  Exploring
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Been There
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                Decentralized human-centered rental reputation: experiences, gossip verification, value-for-money ratings,
                street and neighbor scores—not just listing photos. Includes a Gossip Verification Risk Engine for
                risk scoring from crowdsourced claims.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Real Estate
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Reputation
                </span>
              </div>
            </article>

            {/* Cherry */}
            <article className="p-6 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-[var(--radius-full)]">
                  Vision
                </span>
              </div>
              <h2 className="font-heading text-[var(--text-xl)] font-semibold text-[color:var(--text-strong)] mb-3">
                Cherry
              </h2>
              <p className="font-body text-[var(--text-base)] text-[color:var(--text)] mb-4">
                A network for transforming grey urban surfaces into rooftop agriculture and regenerative infrastructure:
                rooftop farming, localized food and energy, and city-scale collaboration.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Urban Agriculture
                </span>
                <span className="px-3 py-1 text-[var(--text-xs)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] rounded-[var(--radius-full)]">
                  Sustainability
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
