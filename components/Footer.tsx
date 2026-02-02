"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">OC</span>
              </div>
              <span className="font-bold text-xl">OpenClaw</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Tutoriel complet pour maîtriser OpenClaw et développer des applications 
              assistées par IA. De l'installation à la production.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/openclaw/openclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://discord.com/invite/clawd"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/tutoriel" className="text-gray-400 hover:text-white transition-colors">
                  Tutoriel
                </Link>
              </li>
              <li>
                <Link href="/usecases" className="text-gray-400 hover:text-white transition-colors">
                  Use Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://clawhub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ClawHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/openclaw/openclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 Tutoriel OpenClaw. Créé avec <Heart size={14} className="inline text-accent" /> par Stephane Quentin.
          </p>
          <p className="text-gray-500 text-sm">
            Basé sur OpenClaw - Assistant IA pour le développement
          </p>
        </div>
      </div>
    </footer>
  );
}
