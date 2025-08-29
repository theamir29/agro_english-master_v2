import React from "react";
import { Globe, Users } from "lucide-react";

const Footer = ({ t }) => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-20">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌾</span>
                <h3 className="text-xl font-bold">AgroLex</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Comprehensive agricultural terminology platform for students and
                professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/dictionary"
                    className="hover:text-white transition-colors"
                  >
                    Dictionary
                  </a>
                </li>
                <li>
                  <a
                    href="/quiz"
                    className="hover:text-white transition-colors"
                  >
                    Quizzes
                  </a>
                </li>
                <li>
                  <a
                    href="/results"
                    className="hover:text-white transition-colors"
                  >
                    Progress
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: info@AgroLex.com</li>
                <li>Phone: +998 90 123 45 67</li>
                <li>Address: Tashkent, Uzbekistan</li>
              </ul>
              <div className="flex space-x-3 mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Users size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AgroLex. All rights reserved.</p>
            <p className="mt-2">Developed for Agricultural Education</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
