"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLenis } from '@/contexts/LenisContext';
import gsap from 'gsap';
import { LINKS } from '@/config/links';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { scrollTo } = useLenis();

  const headerRef = useRef<HTMLElement>(null);
  const profilePicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profilePic = profilePicRef.current;
    if (!profilePic) return;

    const handleEnter = () => {
      gsap.to(profilePic, {
        scale: 1.2,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    };

    const handleLeave = () => {
      gsap.to(profilePic, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    profilePic.addEventListener('mouseenter', handleEnter);
    profilePic.addEventListener('mouseleave', handleLeave);

    return () => {
      profilePic.removeEventListener('mouseenter', handleEnter);
      profilePic.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const handleProfileClick = () => {
    router.push('/about');
  };

  const isActivePage = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header ref={headerRef} className="header scene z-50">
      {/* Profile & Name */}
      <h1 className="me guest">
        <div
          ref={profilePicRef}
          onClick={handleProfileClick}
          tabIndex={0}
          aria-label="Profile picture"
          style={{
            cursor: 'pointer',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Image
            src="/sahar-showcase.jpeg"
            alt="Sahar Barak"
            width={56}
            height={56}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            priority
          />
        </div>
        <p className="title">
          <strong className="name">Sahar Barak</strong>
          <em className="tagline">Software Engineer</em>
        </p>
      </h1>

      {/* Social Links & AIN Navigation */}
      <nav className="links guest chapter-0">
        {/* GitHub */}
        <a
          className="link is-github"
          target="_blank"
          href={LINKS.social.github}
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
            <path d="M208,104v8a48,48,0,0,1-48,48H136a32,32,0,0,1,32,32v40H104V192a32,32,0,0,1,32-32H112a48,48,0,0,1-48-48v-8a49.28,49.28,0,0,1,8.51-27.3A51.92,51.92,0,0,1,76,32a52,52,0,0,1,43.83,24h32.34A52,52,0,0,1,196,32a51.92,51.92,0,0,1,3.49,44.7A49.28,49.28,0,0,1,208,104Z" className="transparent"></path>
            <path d="M208.3,75.68A59.74,59.74,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58,58,0,0,0,208.3,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.76,41.76,0,0,1,200,104Z"></path>
          </svg>
        </a>

        {/* HuggingFace */}
        <a
          className="link word-delay is-huggingface"
          target="_blank"
          href={LINKS.social.huggingface}
          rel="noopener noreferrer"
        >
          <Image src="/huggingface_logo-noborder.svg" alt="Hugging Face" width={20} height={20} />
        </a>

        {/* LinkedIn */}
        <a
          className="link word-delay is-linkedin"
          target="_blank"
          href={LINKS.social.linkedin}
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        {/* AIN Links */}
        <Link
          className={`ain-link is-about ${isActivePage('/about') ? 'is-active' : ''}`}
          href="/about"
        >
          about
        </Link>
        <Link
          className={`ain-link is-ideas ${isActivePage('/ideas') ? 'is-active' : ''}`}
          href="/ideas"
        >
          ideas
        </Link>
        <Link
          className={`ain-link is-now ${isActivePage('/now') ? 'is-active' : ''}`}
          href="/now"
        >
          now
        </Link>

        {/* AIN Info Link */}
        <a
          className="ain-info"
          href={LINKS.external.aboutIdeasNow}
          target="_blank"
          title="Understand the about/ideas/now concept"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
            <path d="M168,96v48a8,8,0,0,1-16,0V115.31l-50.34,50.35a8,8,0,0,1-11.32-11.32L140.69,104H112a8,8,0,0,1,0-16h48A8,8,0,0,1,168,96Zm64,32A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
          </svg>
        </a>
      </nav>

      {/* Right Section: Home, Previews, Theme Toggle */}
      <div className="header-end">
        <nav className="nav guest chapter-1">
          <Link
            className={`line is-home ${isActivePage('/') ? 'is-active' : ''}`}
            href="/"
          >
            Home
          </Link>

          <button
            className="line is-pov"
            onClick={() => {
              if (pathname !== '/') {
                router.push('/');
                setTimeout(() => {
                  scrollTo('#featured-work');
                }, 100);
              } else {
                scrollTo('#featured-work');
              }
            }}
          >
            Previews
          </button>
        </nav>

        {/* Theme Toggle */}
        <div className="seasons guest chapter-2">
          <button
            id="moon"
            className={`word-delay season is-moon ${isDarkMode ? '' : 'is-off'}`}
            onClick={() => toggleTheme('dark')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#4067CC" viewBox="0 0 256 256">
              <path d="M210.69,158.18A88,88,0,1,1,97.82,45.31,96.08,96.08,0,0,0,192,160,96.78,96.78,0,0,0,210.69,158.18Z" className="transparent"></path>
              <path d="M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33,8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z"></path>
            </svg>
          </button>
          <button
            id="sun"
            className={`word-delay season is-sun ${!isDarkMode ? '' : 'is-off'}`}
            onClick={() => toggleTheme('light')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffcc15" viewBox="0 0 256 256">
              <path d="M184,128a56,56,0,1,1-56-56A56,56,0,0,1,184,128Z" className="transparent"></path>
              <path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
