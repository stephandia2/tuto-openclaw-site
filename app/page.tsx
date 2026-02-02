import Hero from "@/components/Hero";
import { BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Quick Access Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Commencez votre apprentissage
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Deux parcours disponibles : le tutoriel complet pour tout apprendre,
              ou les use cases pour voir des exemples concrets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tutorial Card */}
            <Link href="/tutoriel" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm card-hover h-full">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  Tutoriel Complet
                </h3>
                <p className="text-gray-600 mb-6">
                  10 sections détaillées couvrant l'architecture, l'installation,
                  les skills, les sessions, la sécurité et les bonnes pratiques.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Architecture & Concepts",
                    "Installation & Configuration",
                    "Développement de Skills",
                    "Gestion des Sessions",
                    "Sécurité & Sandbox",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Lire le tutoriel
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Use Cases Card */}
            <Link href="/usecases" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm card-hover h-full">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                  Use Cases
                </h3>
                <p className="text-gray-600 mb-6">
                  4 exemples concrets et inspirants pour comprendre comment utiliser
                  OpenClaw dans des situations réelles.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Générateur de Leads Qualifiés",
                    "Chef d'Orchestre d'Événement",
                    "Agent de Veille Autonome 24/7",
                    "Écosystème Multi-Agents",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-secondary font-semibold">
                  Découvrir les use cases
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10", label: "Sections du tutoriel" },
              { number: "4", label: "Use cases détaillés" },
              { number: "50+", label: "Pages de contenu" },
              { number: "∞", label: "Possibilités" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
