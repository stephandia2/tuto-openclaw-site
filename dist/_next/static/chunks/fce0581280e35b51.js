(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,29888,e=>{"use strict";var s=e.i(81243),n=e.i(23505),a=e.i(95320),o=e.i(31897),t=e.i(28269),i=e.i(48024);let r=[{id:"architecture",title:"1. Architecture & Concepts Fondamentaux",content:`
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

## Composants Cl\xe9s

| Composant | Description | Localisation |
|-----------|-------------|--------------|
| **Gateway** | Processus central qui g\xe8re toutes les connexions | \`~/.openclaw/\` |
| **Agent** | Le "cerveau" IA qui ex\xe9cute les t\xe2ches | Workspace + \`agentDir\` |
| **Workspace** | R\xe9pertoire de travail par d\xe9faut | \`~/.openclaw/workspace\` |
| **Session** | Contexte conversationnel persistant | \`~/.openclaw/agents/<id>/sessions/\` |
| **Skills** | Extensions qui ajoutent des capacit\xe9s | \`~/.openclaw/skills/\` + workspace |
| **Channels** | Interfaces de messagerie | Config dans \`openclaw.json\` |

## Flux de Donn\xe9es

\`\`\`
Message re\xe7u → Gateway → Routage (bindings) → Agent → Tools → R\xe9ponse
                    ↓
              Session persistence (JSONL)
\`\`\`
    `},{id:"installation",title:"2. Installation & Configuration Initiale",content:`
## Pr\xe9requis

\`\`\`bash
# Node.js ≥ 22 requis
node --version  # v22.x.x ou sup\xe9rieur

# pnpm recommand\xe9 (optionnel)
pnpm --version
\`\`\`

## Installation

\`\`\`bash
# M\xe9thode 1 : Script d'installation (recommand\xe9)
curl -fsSL https://openclaw.bot/install.sh | bash

# M\xe9thode 2 : npm global
npm install -g openclaw@latest

# M\xe9thode 3 : pnpm global
pnpm add -g openclaw@latest
\`\`\`

## Onboarding Wizard

\`\`\`bash
# Lancer l'assistant de configuration complet
openclaw onboard --install-daemon
\`\`\`

L'assistant configure :
- ✅ Authentification (OAuth ou cl\xe9s API)
- ✅ Gateway (port, token de s\xe9curit\xe9)
- ✅ Channels (WhatsApp, Telegram, Discord...)
- ✅ Service en arri\xe8re-plan (systemd/launchd)
- ✅ Workspace de base

## V\xe9rification Post-Install

\`\`\`bash
# V\xe9rifier le statut
openclaw status
openclaw health

# V\xe9rifier la s\xe9curit\xe9
openclaw security audit --deep

# Ouvrir le dashboard
openclaw dashboard
# ou http://127.0.0.1:18789/
\`\`\`
    `},{id:"workspace",title:"3. Structure du Workspace",content:`
## Fichiers Essentiels

Le workspace (\`~/.openclaw/workspace\` par d\xe9faut) contient :

\`\`\`
~/.openclaw/workspace/
├── AGENTS.md           # Instructions op\xe9rationnelles pour l'agent
├── SOUL.md            # Personnalit\xe9, ton, boundaries
├── USER.md            # Informations sur l'utilisateur
├── IDENTITY.md        # Identit\xe9 de l'agent (nom, emoji)
├── TOOLS.md           # Notes sur les outils locaux
├── HEARTBEAT.md       # Checklist pour heartbeats
├── MEMORY.md          # M\xe9moire long terme (main session uniquement)
├── BOOTSTRAP.md       # Rituel de premi\xe8re connexion (\xe0 supprimer apr\xe8s)
├── memory/            # Logs quotidiens
│   ├── 2026-02-01.md
│   └── 2026-02-02.md
├── skills/            # Skills sp\xe9cifiques au workspace
└── canvas/            # Fichiers UI pour nodes (optionnel)
\`\`\`

## Cr\xe9ation des Fichiers de Base

\`\`\`bash
# Si les fichiers sont manquants
openclaw setup --workspace ~/.openclaw/workspace
\`\`\`

## Templates Recommand\xe9s

**AGENTS.md** :
\`\`\`markdown
# AGENTS.md - Instructions pour l'Agent

## Principes
- \xcatre direct et utile, pas corporate
- Avoir des opinions, ne pas \xeatre un simple moteur de recherche
- Rester discret dans les groupes, ne pas r\xe9pondre \xe0 tout

## S\xe9curit\xe9
- Ne jamais r\xe9v\xe9ler de cl\xe9s API
- Ne jamais effectuer de paiements
- Demander confirmation avant actions externes

## M\xe9moire
- \xc9crire les d\xe9cisions importantes dans MEMORY.md
- Logger les erreurs dans .learnings/
\`\`\`
    `},{id:"configuration",title:"4. Configuration Avancée du Gateway",content:`
## Fichier de Configuration

Chemin : \`~/.openclaw/openclaw.json\` (JSON5 - commentaires autoris\xe9s)

\`\`\`json5
{
  // === AGENTS ===
  agents: {
    defaults: {
      // Workspace par d\xe9faut
      workspace: "~/.openclaw/workspace",
      
      // Mod\xe8le par d\xe9faut
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
  "raw": "{ channels: { telegram: { groups: { "*": { requireMention: false } } } } }",
  "baseHash": "<hash-from-config-get>",
  "restartDelayMs": 2000
}'
\`\`\`
    `},{id:"skills",title:"5. Développement de Skills",content:`
## Qu'est-ce qu'un Skill ?

Un skill est un dossier contenant un fichier \`SKILL.md\` avec :
- Frontmatter YAML (m\xe9tadonn\xe9es)
- Instructions d\xe9taill\xe9es pour l'agent
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

### \xc9tape 1 : Recherche
\`\`\`bash
curl -s "https://api.example.com/search?q=$QUERY"
\`\`\`

### \xc9tape 2 : Traitement
\`\`\`bash
jq -r '.results[] | {name, id}'
\`\`\`
\`\`\`

## Installation de Skills

\`\`\`bash
# Depuis ClawHub (registre public)
clawhub install notion
clawhub install gemini

# Mettre \xe0 jour tous les skills
clawhub update --all
\`\`\`
    `},{id:"sessions",title:"6. Gestion des Sessions & Agents",content:`
## Types de Sessions

| Type | Cl\xe9 de session | Usage |
|------|----------------|-------|
| **Main (DM)** | \`agent:main:main\` | Conversation principale 1:1 |
| **Groupe** | \`agent:main:whatsapp:group:<id>\` | Chat de groupe isol\xe9 |
| **Cron** | \`cron:<jobId>\` | T\xe2ches planifi\xe9es |
| **Webhook** | \`hook:<uuid>\` | Int\xe9grations web |
| **Node** | \`node-<nodeId>\` | Sessions depuis nodes |

## Gestion des Sessions

\`\`\`bash
# Lister les sessions
openclaw sessions --json
openclaw sessions --active 60  # Active dans les 60 derni\xe8res minutes

# Voir l'historique d'une session
openclaw sessions history <sessionKey>

# Envoyer un message \xe0 une session
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
    `},{id:"channels",title:"7. Intégrations Channels",content:`
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
    `},{id:"securite",title:"8. Sécurité & Sandbox",content:`
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
        
        // Acc\xe8s workspace
        workspaceAccess: "rw",  // "none" | "ro" | "rw"
        
        docker: {
          // Image Docker
          image: "openclaw-sandbox:bookworm-slim",
          
          // R\xe9seau
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
# Activer le mode \xe9lev\xe9 (bypass certaines restrictions)
/elevated on

# Commandes disponibles en \xe9lev\xe9
/elevated full  # Skip exec approvals
\`\`\`

## Cl\xe9s API & Secrets

**R\xe8gles d'or :**
- ✅ Jamais de cl\xe9s en dur dans le code
- ✅ Utiliser la syntaxe $VAR dans les configs
- ✅ Stocker dans \`~/.openclaw/.env\`
- ✅ Utiliser environment variables
    `},{id:"cron",title:"9. Automatisations & Cron",content:`
## Types de Jobs

| Schedule | Description |
|----------|-------------|
| \`at\` | One-shot \xe0 une date/heure |
| \`every\` | Intervalle fixe (ms) |
| \`cron\` | Expression cron (5 champs) |

## Exemples de Jobs

\`\`\`javascript
// Job one-shot (rappel)
cron({
  action: "add",
  job: {
    name: "Rappel r\xe9union",
    schedule: { kind: "at", atMs: Date.now() + 20 * 60 * 1000 },
    payload: {
      kind: "systemEvent",
      text: "⏰ Rappel : R\xe9union dans 10 minutes !"
    },
    sessionTarget: "main"
  }
})

// Job r\xe9current (tous les jours \xe0 9h)
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

# Ex\xe9cuter imm\xe9diatement
openclaw cron run <jobId>

# Voir l'historique
openclaw cron runs <jobId>

# Supprimer
openclaw cron remove <jobId>
\`\`\`
    `},{id:"best-practices",title:"10. Bonnes Pratiques & Debugging",content:`
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
openclaw doctor --fix  # Auto-r\xe9paration

# Expliquer la sandbox actuelle
openclaw sandbox explain
\`\`\`

## Slash Commands Utiles

| Commande | Description |
|----------|-------------|
| \`/status\` | Voir le statut courant |
| \`/context list\` | Contenu du contexte actuel |
| \`/model <name>\` | Changer de mod\xe8le |
| \`/think <level>\` | Niveau de r\xe9flexion |
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
/compact "R\xe9sumer les d\xe9cisions importantes"

# Changer de mod\xe8le pour plus de vitesse
/model kimi-coding/kimi-for-coding
\`\`\`
    `}];function l(){let[e,l]=(0,n.useState)(r[0].id),[c,d]=(0,n.useState)(!1),p=r.find(s=>s.id===e)?.content||"";return(0,s.jsxs)("div",{className:"min-h-screen bg-white pt-16",children:[(0,s.jsx)("div",{className:"bg-gradient-to-r from-primary to-secondary py-16",children:(0,s.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[(0,s.jsx)("h1",{className:"text-4xl md:text-5xl font-bold text-white mb-4",children:"Tutoriel Complet"}),(0,s.jsx)("p",{className:"text-white/90 text-lg max-w-2xl",children:"10 sections pour maîtriser OpenClaw de l'installation à la production."})]})}),(0,s.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:(0,s.jsxs)("div",{className:"flex flex-col lg:flex-row gap-8",children:[(0,s.jsxs)("button",{onClick:()=>d(!c),className:"lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg mb-4",children:[c?(0,s.jsx)(i.X,{size:20}):(0,s.jsx)(t.Menu,{size:20}),"Table des matières"]}),(0,s.jsx)("aside",{className:`lg:w-80 flex-shrink-0 ${c?"block":"hidden lg:block"}`,children:(0,s.jsxs)("div",{className:"sticky top-24 bg-gray-50 rounded-2xl p-6",children:[(0,s.jsxs)("h2",{className:"font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[(0,s.jsx)(o.BookOpen,{size:20,className:"text-primary"}),"Sections"]}),(0,s.jsx)("nav",{className:"space-y-1",children:r.map(n=>(0,s.jsx)("button",{onClick:()=>{l(n.id),d(!1)},className:`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${e===n.id?"bg-primary text-white shadow-md":"text-gray-600 hover:bg-gray-100"}`,children:n.title},n.id))})]})}),(0,s.jsx)("main",{className:"flex-1 min-w-0",children:(0,s.jsxs)(a.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"prose prose-lg max-w-none",children:[(0,s.jsx)("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12",children:(0,s.jsx)("div",{dangerouslySetInnerHTML:{__html:p.replace(/## (.*)/g,'<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h2>').replace(/### (.*)/g,'<h3 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">$1</h3>').replace(/```(\w+)?\n([\s\S]*?)```/g,'<pre class="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6"><code>$2</code></pre>').replace(/`([^`]+)`/g,'<code class="bg-gray-100 text-primary px-2 py-1 rounded text-sm">$1</code>').replace(/\| (.*) \|/g,'<tr><td class="border px-4 py-2">$1</td></tr>').replace(/\*\*(.*)\*\*/g,"<strong>$1</strong>").replace(/- (.*)/g,'<li class="ml-4 mb-2">$1</li>')}})}),(0,s.jsxs)("div",{className:"flex justify-between mt-8",children:[r.findIndex(s=>s.id===e)>0&&(0,s.jsx)("button",{onClick:()=>{let s=r.findIndex(s=>s.id===e);l(r[s-1].id)},className:"flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors",children:"← Précédent"}),r.findIndex(s=>s.id===e)<r.length-1&&(0,s.jsx)("button",{onClick:()=>{let s=r.findIndex(s=>s.id===e);l(r[s+1].id)},className:"flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors ml-auto",children:"Suivant →"})]})]},e)})]})})]})}e.s(["default",()=>l])}]);