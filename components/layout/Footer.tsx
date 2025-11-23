

import React from 'react';
import { APP_NAME, COMPANY_LINKS, PARTNER_LINKS, SOCIAL_LINKS, COLORS } from '../../constants';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-gray-200 py-10 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <Link to="/" className="text-3xl font-bold text-white flex items-center" aria-label={`${APP_NAME} Home`}>
            <img src="https://assets-global.website-files.com/62c01991206f74a0678d85f6/62cf9b152d244c062c3e1644_bant-confirm-favicon.png" alt="BANTConfirm Logo" className="h-8 w-8 mr-2" />
            {APP_NAME}
          </Link>
          <p className="text-gray-400 text-sm">
            The intelligent B2B marketplace for AI-qualified IT and software leads.
          </p>
          <div className="flex space-x-4 mt-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-800 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 text-lg font-bold"
                aria-label={link.name}
              >
                {link.name.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" aria-label={link.name}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Partners Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">For Partners</h3>
          <ul className="space-y-2">
            {PARTNER_LINKS.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" aria-label={link.name}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info (Placeholder) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <p className="text-gray-400 text-sm">Email: <a href="mailto:info@bantconfirm.com" className="hover:text-white">info@bantconfirm.com</a></p>
          <p className="text-gray-400 text-sm">Phone: +91 12345 67890</p> {/* Placeholder */}
          <p className="text-gray-400 text-sm">Address: 123 AI Street, Bengaluru, India</p> {/* Placeholder */}
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;