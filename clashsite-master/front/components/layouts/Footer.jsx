import React from "react";
import { FaYoutube, FaTelegram, FaTiktok } from "react-icons/fa";

const socialLinks = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@l9q",
    icon: FaYoutube,
    className: "text-red-600 hover:text-red-500 focus-visible:outline-red-500",
  },
  {
    name: "Telegram",
    href: "https://t.me/clashvip",
    icon: FaTelegram,
    className: "text-sky-500 hover:text-sky-400 focus-visible:outline-sky-500",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@clash",
    icon: FaTiktok,
    className: "text-gray-100 hover:text-white focus-visible:outline-gray-200",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-1.5">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-evenly gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <a href="#" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Decks
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cards
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Players
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Clans
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Esports
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Strategy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Blog
          </a>
        </div>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <a href="#" className="hover:text-white transition-colors">
            News
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Tournaments
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Help
          </a>
          <a href="#" className="hover:text-white transition-colors">
            About Us
          </a>
          <a href="#" className="hover:text-white transition-colors">
            FAQ
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Business Inquiries
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Feature Requests
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-white text-xl font-bold">Social</div>
          <div className="flex gap-4">
            {socialLinks.map(({ name, href, icon: IconComponent, className }) => (
              <a
                key={name}
                href={href}
                className={`${className} transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={`Open Clash on ${name}`}
                title={`Clash on ${name}`}
              >
                <IconComponent size={24} aria-hidden="true" focusable="false" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-6 text-sm">
        Copyright 2025 Clash Pro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

