import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'About | Sahar Barak',
  description: 'Software Engineer building at the intersection of AI, clean energy, and developer tools',
};

export default function AboutPage() {
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
          <h1 className="font-heading text-[var(--text-4xl)] font-bold text-[color:var(--text-strong)] mb-8">
            About
          </h1>

          {/* Bio Section */}
          <section className="prose-section mb-16">
            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed mb-6">
              I&apos;m a digital visual artist, entrepreneur, researcher, and developer passionate about building
              innovative solutions at the intersection of technology and real-world impact. From AI-powered tools
              to scientific research, I explore ideas that push boundaries and create value.
            </p>

            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed mb-6">
              I&apos;m a full-stack engineer obsessed with clean code, functional patterns, and architectures that
              feel natural and scalable. My work sits at the crossroads of:
            </p>

            <ul className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed mb-6 list-disc list-inside space-y-2">
              <li>AI + physical infrastructure (cars, cities, food, energy)</li>
              <li>Decentralization + governance (citizen majorities, identity, cooperative economies)</li>
              <li>Networks, fractals, and collaborative systems</li>
              <li>Cool/Artistic stuff that I enjoy</li>
            </ul>

            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed">
              Long-term, I&apos;m building an ecosystem of interoperable tools that let humans coordinate
              more effectively than our current institutions allow.
            </p>
          </section>

          {/* Things I Love Section */}
          <section className="mb-16">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Things I Love
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Yoga', 'Sunsets', 'Kitesurfing', 'Motorbiking',
                'Climbing', 'Nature', 'Running (barefoot)', 'Music',
                'Makam', 'Oud', 'Guitar', 'Creating stuff',
                'Building', 'Cars', 'Making', 'Tinkering',
                'Electronics', 'Learning', 'Researching'
              ].map((thing) => (
                <div
                  key={thing}
                  className="p-3 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-xl text-center hover:shadow-md transition-shadow"
                >
                  <span className="font-body text-[var(--text-sm)] text-[color:var(--text-strong)]">
                    {thing}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Skills & Technologies
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'TypeScript', 'React', 'Next.js', 'Node.js',
                'Python', 'Machine Learning', 'PostgreSQL', 'MongoDB',
                'Docker', 'Kubernetes', 'AWS', 'Git',
                'WebGL', 'Three.js', 'Tailwind CSS', 'GraphQL'
              ].map((skill) => (
                <div
                  key={skill}
                  className="p-4 bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-xl text-center hover:shadow-md transition-shadow"
                >
                  <span className="font-body text-[var(--text-sm)] text-[color:var(--text-strong)]">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-16">
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Experience
            </h2>

            <div className="space-y-8">
              {/* Experience Item */}
              <div className="border-l-2 border-[color:var(--border)] pl-6 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[color:var(--primary)] rounded-[var(--radius-full)]" />
                <h3 className="font-heading text-[var(--text-lg)] font-semibold text-[color:var(--text-strong)]">
                  Software Engineer
                </h3>
                <p className="font-body text-[var(--text-sm)] text-[color:var(--text-muted)] mb-2">
                  Company Name &bull; 2022 - Present
                </p>
                <p className="font-body text-[var(--text-base)] text-[color:var(--text)]">
                  Building scalable applications and leading technical initiatives
                  focused on AI integration and developer experience.
                </p>
              </div>

              {/* Add more experience items as needed */}
            </div>
          </section>

          {/* Connect Section */}
          <section>
            <h2 className="font-heading text-[var(--text-2xl)] font-semibold text-[color:var(--text-strong)] mb-6">
              Let&apos;s Connect
            </h2>

            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] mb-6">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/saharbarak"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] rounded-lg font-medium hover:bg-[color:var(--accent)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/saharbarak"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] rounded-lg font-medium hover:bg-[color:var(--accent)] transition-colors"
              >
                LinkedIn
              </a>
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
