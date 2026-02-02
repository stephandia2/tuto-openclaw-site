"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, BookOpen, Zap, Shield, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            🦞 OpenClaw 2026
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Tutoriel Complet
            <br />
            <span className="text-secondary">OpenClaw</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
            Maîtrisez OpenClaw pour le développement d'applications.
            De l'installation à la production, tout ce que vous devez savoir.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutoriel"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              <BookOpen size={20} />
              Commencer le tutoriel
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/usecases"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              <Play size={20} />
              Voir les use cases
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: "10 Sections",
              description: "Architecture, installation, skills, sessions, sécurité...",
            },
            {
              icon: Users,
              title: "4 Use Cases",
              description: "Prospection, événements, veille, multi-agents",
            },
            {
              icon: Shield,
              title: "Prêt pour la prod",
              description: "Bonnes pratiques et configuration avancée",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <feature.icon className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/80 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
