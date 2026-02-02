"use client";

import { motion } from "framer-motion";
import { Target, Calendar, Search, Users, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";

const useCases = [
  {
    id: "leads",
    icon: Target,
    title: "Le Générateur de Leads Qualifiés",
    type: "Concret",
    difficulty: "⭐⭐⭐",
    roi: "🔥🔥🔥",
    description: "Automatisez la prospection commerciale : trouvez des artisans/commerces dans une zone, enrichissez les données, et créez un tableau Notion structuré pour relances.",
    skills: ["prospection", "notion", "web_search", "goplaces"],
    features: [
      "Recherche Google Places par secteur/ville/rayon",
      "Scoring intelligent (0-100) sur critères multiples",
      "Création automatique base Notion structurée",
      "Relances programmées (J1, J3, J7, J14)",
      "Templates d'emails de prospection",
    ],
    example: `/prospecter secteur:restaurant ville:Chambly rayon:10 min_score:60`,
    result: "12 prospects qualifiés avec base Notion prête",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "event",
    icon: Calendar,
    title: "Le Chef d'Orchestre d'Événement",
    type: "Concret",
    difficulty: "⭐⭐⭐⭐",
    roi: "🔥🔥🔥",
    description: "Gérez un événement complexe (type course solidaire) : planification, gestion bénévoles, suivi tâches, communication temps réel.",
    skills: ["cron", "sessions_spawn", "message", "browser", "canvas"],
    features: [
      "Planification bénévoles par compétences/dispos",
      "Système de check-in QR codes",
      "Briefings automatiques (J-7, J-1, J+1)",
      "Alertes temps réel et remplaçants auto",
      "Dashboard Canvas temps réel",
    ],
    example: `/event planifier --fichier benevoles.json --postes postes.json`,
    result: "45 bénévoles gérés sur 12 postes, check-in QR",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "veille",
    icon: Search,
    title: "L'Agent de Veille Autonome 24/7",
    type: "Incroyable",
    difficulty: "⭐⭐⭐⭐",
    roi: "🔥🔥🔥🔥",
    description: "Un agent qui vit en permanence, surveille vos sources d'information, détecte les opportunités et vous briefe automatiquement avec des recommandations actionnables.",
    skills: ["cron", "web_search", "notion", "tts"],
    features: [
      "Surveillance multi-sources (RSS, Twitter, Google Alerts)",
      "Scoring IA des opportunités",
      "Alertes temps réel (opportunités >80 points)",
      "Briefing quotidien 8h (texte + audio)",
      "Learning continu des préférences",
    ],
    example: "Briefing automatique quotidien avec recommandations",
    result: "Détection automatique d'appels à projets pertinents",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "multi-agent",
    icon: Users,
    title: "L'Écosystème Multi-Agents Collaboratifs",
    type: "Incroyable",
    difficulty: "⭐⭐⭐⭐⭐",
    roi: "🔥🔥🔥🔥🔥",
    description: "Créez une équipe virtuelle d'agents spécialisés qui collaborent entre eux pour gérer des projets complexes. Chaque agent a sa personnalité et communique avec les autres.",
    skills: ["sessions_spawn", "sessions_send", "notion", "canvas"],
    features: [
      "Équipe de 5 agents spécialisés (PM, Dev, Design, Strat, QA)",
      "Communication inter-agents via sessions",
      "Workflows parallèles et coordination",
      "Dashboard de suivi en temps réel",
      "Livrables coordonnés automatiquement",
    ],
    example: "Marc (PM) coordonne un projet site web avec toute l'équipe",
    result: "Projet livré avec 5 agents travaillant en parallèle",
    color: "from-green-500 to-emerald-500",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Use Cases
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            4 exemples concrets et inspirants pour comprendre comment utiliser
            OpenClaw dans des situations réelles.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Use Cases", value: "4" },
              { label: "Concrets", value: "2" },
              { label: "Incroyables", value: "2" },
              { label: "Skills Utilisés", value: "20+" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${useCase.color} p-8 text-white`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <useCase.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2">
                          {useCase.type}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold">{useCase.title}</h2>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="bg-white/10 px-4 py-2 rounded-lg">
                        <span className="opacity-80">Complexité:</span> {useCase.difficulty}
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg">
                        <span className="opacity-80">ROI:</span> {useCase.roi}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 text-lg mb-8">{useCase.description}</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Features */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-primary" />
                        Fonctionnalités
                      </h3>
                      <ul className="space-y-3">
                        {useCase.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills & Example */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-secondary" />
                        Skills utilisés
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {useCase.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="bg-gray-900 rounded-xl p-4 mb-4">
                        <p className="text-gray-400 text-sm mb-2">Exemple d'utilisation:</p>
                        <code className="text-green-400 text-sm">{useCase.example}</code>
                      </div>

                      <div className="flex items-center gap-2 text-primary font-medium">
                        <BarChart3 size={18} />
                        Résultat: {useCase.result}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à implémenter ces use cases ?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Consultez le tutoriel complet pour apprendre à configurer OpenClaw
            et déployer ces solutions dans votre environnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutoriel"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Voir le tutoriel
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://docs.openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Documentation officielle
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
