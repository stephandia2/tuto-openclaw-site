"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Menu, X } from "lucide-react";

const sections = [
  {
    id: "architecture",
    title: "1. Architecture & Concepts Fondamentaux",
    content: `
## Vue d'ensemble

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    CHANNELS (Messaging)                      │
│  WhatsApp │ Telegram │ Discord │ iMessage │ WebChat │ ...   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      GATEWAY (OpenClaw)                      │
│  • WebSocket Server (ws://127.0.0.1:18789)                  │
│  • Gestion des sessions                                     │
│  • Routage des messages                                     │
│  • Scheduler (cron)                                         │
└──────────┬──────────────────────────────┬───────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐      ┌──────────────────────────────┐
│   AGENT (Pi AI)     │      │   NODES (iOS/Android/macOS)  │
│  • Workspace        │      │  • Canvas                    │
│  • Tools            │      │  • Camera                    │
│  • Skills           │      │  • Screen recording          │
└─────────────────────┘      └──────────────────────────────┘
\`\`\`

## Composants Clés

| Composant | Description | Localisation |
|-----------|-------------|--------------|
| **Gateway** | Processus central qui gère toutes les connexions | \`~/.openclaw/\` |
| **Agent** | Le "cerveau" IA qui exécute les tâches | Workspace + \`agentDir\` |
| **Workspace** | Répertoire de travail par défaut | \`~/.openclaw/workspace\` |
| **Session** | Contexte conversationnel persistant | \`~/.openclaw/agents/<id>/sessions/\` |
| **Skills** | Extensions qui ajoutent des capacités | \`~/.openclaw/skills/\` + workspace |
| **Channels** | Interfaces de messagerie | Config dans \`openclaw.json\` |

## Flux de Données

\`\`\`
Message reçu → Gateway → Routage (bindings) → Agent → Tools → Réponse
                    ↓
              Session persistence (JSONL)
\`\`\`
    `,
  },
  {
    id: "installation",
    title: "2. Installation & Configuration Initiale",
    content: `
## Prérequis

\`\`\`bash
# Node.js ≥ 22 requis
node --version  # v22.x.x ou supérieur

# pnpm recommandé (optionnel)
pnpm --version
\`\`\`

## Installation

\`\`\`bash
# Méthode 1 : Script d'installation (recommandé)
curl -fsSL https://openclaw.bot/install.sh | bash

# Méthode 2 : npm global
npm install -g openclaw@latest

# Méthode 3 : pnpm global
pnpm add -g openclaw@latest
\`\`\`

## Onboarding Wizard

\`\`\`bash
# Lancer l'assistant de configuration complet
openclaw onboard --install-daemon
\`\`\`

L'assistant configure :
- ✅ Authentification (OAuth ou clés API)
- ✅ Gateway (port, token de sécurité)
- ✅ Channels (WhatsApp, Telegram, Discord...)
- ✅ Service en arrière-plan (systemd/launchd)
- ✅ Workspace de base

## Vérification Post-Install

\`\`\`bash
# Vérifier le statut
openclaw status
openclaw health

# Vérifier la sécurité
openclaw security audit --deep

# Ouvrir le dashboard
openclaw dashboard
# ou http://127.0.0.1:18789/
\`\`\`
    `,
  },
  {
    id: "workspace",
    title: "3. Structure du Workspace",
    content: `
## Fichiers Essentiels

Le workspace (\`~/.openclaw/workspace\` par défaut) contient :

\`\`\`
~/.openclaw/workspace/
├── AGENTS.md           # Instructions opérationnelles pour l'agent
├── SOUL.md            # Personnalité, ton, boundaries
├── USER.md            # Informations sur l'utilisateur
├── IDENTITY.md        # Identité de l'agent (nom, emoji)
├── TOOLS.md           # Notes sur les outils locaux
├── HEARTBEAT.md       # Checklist pour heartbeats
├── MEMORY.md          # Mémoire long terme (main session uniquement)
├── BOOTSTRAP.md       # Rituel de première connexion (à supprimer après)
├── memory/            # Logs quotidiens
│   ├── 2026-02-01.md
│   └── 2026-02-02.md
├── skills/            # Skills spécifiques au workspace
└── canvas/            # Fichiers UI pour nodes (optionnel)
\`\`\`

## Création des Fichiers de Base

\`\`\`bash
# Si les fichiers sont manquants
openclaw setup --workspace ~/.openclaw/workspace
\`\`\`

## Templates Recommandés

**AGENTS.md** :
\`\`\`markdown
# AGENTS.md - Instructions pour l'Agent

## Principes
- Être direct et utile, pas corporate
- Avoir des opinions, ne pas être un simple moteur de recherche
- Rester discret dans les groupes, ne pas répondre à tout

## Sécurité
- Ne jamais révéler de clés API
- Ne jamais effectuer de paiements
- Demander confirmation avant actions externes

## Mémoire
- Écrire les décisions importantes dans MEMORY.md
- Logger les erreurs dans .learnings/
\`\`\`
    `,
  },
  {
    id: "configuration",
    title: "4. Configuration Avancée du Gateway",
    content: `
## Fichier de Configuration

Chemin : \`~/.openclaw/openclaw.json\` (JSON5 - commentaires autorisés)

\`\`\`json5
{
  // === AGENTS ===
  agents: {
    defaults: {
      // Workspace par défaut
      workspace: "~/.openclaw/workspace",
      
      // Modèle par défaut
      model: "kimi-coding/kimi-for-coding",
      
      // Configuration sandbox
      sandbox: {
        mode: "non-main",      // "off" | "non-main" | "all"
        scope: "session",      // "session" | "agent" | "shared"
        workspaceAccess: "rw", // "none" | "ro" | "rw"
      },
    },
  },
  
  // === SESSIONS ===
  session: {
    dmScope: "main",  // "main" | "per-peer" | "per-channel-peer"
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 240,
    },
  },
  
  // === CHANNELS ===
  channels: {
    whatsapp: {
      allowFrom: ["+336XXXXXXXX"],  // Whitelist DMs
      groups: {
        "*": { requireMention: true },
      },
    },
  },
}
\`\`\`

## Modification de la Configuration

\`\`\`bash
# Voir la config actuelle
openclaw gateway call config.get --params '{}'

# Modifier partiellement (merge)
openclaw gateway call config.patch --params '{
  "raw": "{ channels: { telegram: { groups: { \"*\": { requireMention: false } } } } }",
  "baseHash": "<hash-from-config-get>",
  "restartDelayMs": 2000
}'
\`\`\`
    `,
  },
  {
    id: "skills",
    title: "5. Développement de Skills",
    content: `
## Qu'est-ce qu'un Skill ?

Un skill est un dossier contenant un fichier \`SKILL.md\` avec :
- Frontmatter YAML (métadonnées)
- Instructions détaillées pour l'agent
- Exemples d'utilisation

## Structure d'un Skill

\`\`\`
skills/mon-skill/
├── SKILL.md           # Fichier principal (obligatoire)
├── scripts/           # Scripts utilitaires (optionnel)
│   └── setup.sh
└── assets/            # Ressources (optionnel)
\`\`\`

## Template SKILL.md

\`\`\`markdown
---
name: mon-skill
description: Fait quelque chose d'utile avec l'API X
metadata:
  {
    "openclaw": {
      "emoji": "🛠️",
      "requires": { "bins": ["curl", "jq"], "env": ["API_X_KEY"] },
      "primaryEnv": "API_X_KEY"
    }
  }
---

# mon-skill

## Workflow

### Étape 1 : Recherche
\`\`\`bash
curl -s "https://api.example.com/search?q=$QUERY"
\`\`\`

### Étape 2 : Traitement
\`\`\`bash
jq -r '.results[] | {name, id}'
\`\`\`
\`\`\`

## Installation de Skills

\`\`\`bash
# Depuis ClawHub (registre public)
clawhub install notion
clawhub install gemini

# Mettre à jour tous les skills
clawhub update --all
\`\`\`
    `,
  },
  {
    id: "sessions",
    title: "6. Gestion des Sessions & Agents",
    content: `
## Types de Sessions

| Type | Clé de session | Usage |
|------|----------------|-------|
| **Main (DM)** | \`agent:main:main\` | Conversation principale 1:1 |
| **Groupe** | \`agent:main:whatsapp:group:<id>\` | Chat de groupe isolé |
| **Cron** | \`cron:<jobId>\` | Tâches planifiées |
| **Webhook** | \`hook:<uuid>\` | Intégrations web |
| **Node** | \`node-<nodeId>\` | Sessions depuis nodes |

## Gestion des Sessions

\`\`\`bash
# Lister les sessions
openclaw sessions --json
openclaw sessions --active 60  # Active dans les 60 dernières minutes

# Voir l'historique d'une session
openclaw sessions history <sessionKey>

# Envoyer un message à une session
openclaw sessions send --sessionKey <key> --message "Hello"
\`\`\`

## Multi-Agent

\`\`\`json5
{
  agents: {
    list: [
      { id: "personal", workspace: "~/.openclaw/workspace", default: true },
      { id: "work", workspace: "~/.openclaw/workspace-work" },
    ],
  },
  bindings: [
    { agentId: "personal", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "work" } },
  ],
}
\`\`\`
    `,
  },
  {
    id: "channels",
    title: "7. Intégrations Channels",
    content: `
## WhatsApp

\`\`\`bash
# Connexion (scan QR)
openclaw channels login whatsapp

# Approbation de pairing
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <code>
\`\`\`

Configuration :
\`\`\`json5
{
  channels: {
    whatsapp: {
      allowFrom: ["+33612345678"],
      groups: {
        "*": { requireMention: true },
        "1203630...@g.us": { requireMention: false },
      },
    },
  },
}
\`\`\`

## Telegram

\`\`\`json5
{
  channels: {
    telegram: {
      botToken: "\${TELEGRAM_BOT_TOKEN}",
      allowFrom: [],
      groups: { "*": { requireMention: false } },
    },
  },
}
\`\`\`

## Discord

\`\`\`json5
{
  channels: {
    discord: {
      botToken: "\${DISCORD_BOT_TOKEN}",
      guilds: {
        "*": { requireMention: true },
      },
    },
  },
}
\`\`\`

## WebChat / Dashboard

Accessible localement : http://127.0.0.1:18789/
    `,
  },
  {
    id: "securite",
    title: "8. Sécurité & Sandbox",
    content: `
## Modes Sandbox

\`\`\`json5
{
  agents: {
    defaults: {
      sandbox: {
        // Quand sandboxer ?
        mode: "non-main",  // "off" | "non-main" | "all"
        
        // Scope des containers
        scope: "session",  // "session" | "agent" | "shared"
        
        // Accès workspace
        workspaceAccess: "rw",  // "none" | "ro" | "rw"
        
        docker: {
          // Image Docker
          image: "openclaw-sandbox:bookworm-slim",
          
          // Réseau
          network: "none",  // "none" | "bridge" | "host"
          
          // Bind mounts additionnels
          binds: [
            "/home/user/projects:/projects:ro",
          ],
        },
      },
    },
  },
}
\`\`\`

## Construire l'Image Sandbox

\`\`\`bash
# Image de base
scripts/sandbox-setup.sh

# Image avec navigateur
scripts/sandbox-browser-setup.sh
\`\`\`

## Elevated Mode

\`\`\`bash
# Activer le mode élevé (bypass certaines restrictions)
/elevated on

# Commandes disponibles en élevé
/elevated full  # Skip exec approvals
\`\`\`

## Clés API & Secrets

**Règles d'or :**
- ✅ Jamais de clés en dur dans le code
- ✅ Utiliser la syntaxe $VAR dans les configs
- ✅ Stocker dans \`~/.openclaw/.env\`
- ✅ Utiliser environment variables
    `,
  },
  {
    id: "cron",
    title: "9. Automatisations & Cron",
    content: `
## Types de Jobs

| Schedule | Description |
|----------|-------------|
| \`at\` | One-shot à une date/heure |
| \`every\` | Intervalle fixe (ms) |
| \`cron\` | Expression cron (5 champs) |

## Exemples de Jobs

\`\`\`javascript
// Job one-shot (rappel)
cron({
  action: "add",
  job: {
    name: "Rappel réunion",
    schedule: { kind: "at", atMs: Date.now() + 20 * 60 * 1000 },
    payload: {
      kind: "systemEvent",
      text: "⏰ Rappel : Réunion dans 10 minutes !"
    },
    sessionTarget: "main"
  }
})

// Job récurrent (tous les jours à 9h)
cron({
  action: "add",
  job: {
    name: "Daily check",
    schedule: { kind: "cron", expr: "0 9 * * *", tz: "Europe/Paris" },
    payload: {
      kind: "agentTurn",
      message: "Faire un check des emails et du calendrier"
    },
    sessionTarget: "isolated"
  }
})
\`\`\`

## Gestion des Jobs

\`\`\`bash
# Lister les jobs
openclaw cron list

# Exécuter immédiatement
openclaw cron run <jobId>

# Voir l'historique
openclaw cron runs <jobId>

# Supprimer
openclaw cron remove <jobId>
\`\`\`
    `,
  },
  {
    id: "best-practices",
    title: "10. Bonnes Pratiques & Debugging",
    content: `
## Commandes de Debug

\`\`\`bash
# Status complet
openclaw status --all
openclaw status --deep

# Logs
openclaw logs
openclaw logs --follow

# Docteur (diagnostics)
openclaw doctor
openclaw doctor --fix  # Auto-réparation

# Expliquer la sandbox actuelle
openclaw sandbox explain
\`\`\`

## Slash Commands Utiles

| Commande | Description |
|----------|-------------|
| \`/status\` | Voir le statut courant |
| \`/context list\` | Contenu du contexte actuel |
| \`/model <name>\` | Changer de modèle |
| \`/think <level>\` | Niveau de réflexion |
| \`/reset\` ou \`/new\` | Nouvelle session |
| \`/compact\` | Compacter le contexte |

## Backup & Migration

\`\`\`bash
# Backup du workspace
cd ~/.openclaw/workspace
git init
git add .
git commit -m "Backup workspace"
git push origin main

# Backup des sessions (optionnel)
cp -r ~/.openclaw/agents ~/backup/agents
\`\`\`

## Performance

\`\`\`bash
# Voir l'utilisation des tokens
/usage full

# Compacter manuellement
/compact "Résumer les décisions importantes"

# Changer de modèle pour plus de vitesse
/model kimi-coding/kimi-for-coding
\`\`\`
    `,
  },
];

export default function TutorielPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeContent = sections.find((s) => s.id === activeSection)?.content || "";

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tutoriel Complet
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            10 sections pour maîtriser OpenClaw de l'installation à la production.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg mb-4"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            Table des matières
          </button>

          {/* Sidebar */}
          <aside
            className={`lg:w-80 flex-shrink-0 ${
              mobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 bg-gray-50 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Sections
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-lg max-w-none"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeContent
                      .replace(/## (.*)/g, '<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h2>')
                      .replace(/### (.*)/g, '<h3 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">$1</h3>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6"><code>$2</code></pre>')
                      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-primary px-2 py-1 rounded text-sm">$1</code>')
                      .replace(/\| (.*) \|/g, '<tr><td class="border px-4 py-2">$1</td></tr>')
                      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
                      .replace(/- (.*)/g, '<li class="ml-4 mb-2">$1</li>')
                  }}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {sections.findIndex((s) => s.id === activeSection) > 0 && (
                  <button
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      setActiveSection(sections[idx - 1].id);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    ← Précédent
                  </button>
                )}
                {sections.findIndex((s) => s.id === activeSection) < sections.length - 1 && (
                  <button
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      setActiveSection(sections[idx + 1].id);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors ml-auto"
                  >
                    Suivant →
                  </button>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
