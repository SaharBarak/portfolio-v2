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
              I&apos;m Sahar Barak, a software engineer passionate about creating technology that makes a positive impact.
              I specialize in building products at the intersection of AI, clean energy, and developer tools.
            </p>

            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed mb-6">
              Currently, I&apos;m focused on developing innovative solutions that help businesses and individuals
              navigate the complexities of modern technology while maintaining a commitment to sustainability
              and ethical practices.
            </p>

            <p className="font-body text-[var(--text-lg)] text-[color:var(--text)] leading-relaxed">
              When I&apos;m not coding, you can find me exploring new ideas, contributing to open source projects,
              or connecting with the global developer community.
            </p>
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
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[color:var(--primary)] rounded-full" />
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
