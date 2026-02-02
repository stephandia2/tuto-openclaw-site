# 🚀 Use Cases OpenClaw - Exemples Concrets & Incroyables

> Pour Stephane - Consultant Stratégique Communication & Événementiel

---

## 📌 USE CASE 1 (Concret) : "Le Générateur de Leads Qualifiés"

### 🎯 Objectif
Automatiser la prospection commerciale : trouver des artisans/commerces dans une zone, enrichir les données, et créer un tableau Notion structuré pour relances.

### 🛠️ Skills utilisés
- `prospection` (skill existant)
- `notion`
- `web_search`
- `goplaces` (Google Places)

### 📁 Structure du Workspace

```
~/clawd/usecases/prospection/
├── SKILL.md                    # Skill personnalisé
├── scripts/
│   ├── prospect.sh            # Script principal
│   └── enrich.py              # Enrichissement données
├── templates/
│   └── message_relance.md     # Template message
└── data/
    └── criteres_qualif.json   # Critères de qualification
```

### 📝 SKILL.md - Prospection Qualifiée

```markdown
---
name: prospection-auto
description: Prospecte des entreprises par secteur/ville, enrichit les données et crée un tableau Notion structuré.
metadata:
  {
    "openclaw": {
      "emoji": "🎯",
      "requires": { "bins": ["curl", "jq"], "env": ["NOTION_API_KEY", "GOOGLE_PLACES_API_KEY"] },
      "primaryEnv": "NOTION_API_KEY"
    }
  }
---

# Prospection Automatisée

## Workflow

### Étape 1 : Recherche Google Places
```bash
# Usage: prospecter <secteur> <ville> <rayon_km>
# Exemple: prospecter "plombier" "Chambly" 10

SECTEUR="$1"
VILLE="$2"
RAYON="${3:-10}"

# Géocodage de la ville
COORDS=$(curl -s "https://maps.googleapis.com/maps/api/geocode/json?address=$VILLE&key=$GOOGLE_PLACES_API_KEY" | jq -r '.results[0].geometry.location | "\(.lat),\(.lng)"')

# Recherche Places
curl -s "https://maps.googleapis.com/maps/api/place/textsearch/json?query=$SECTEUR&location=$COORDS&radius=${RAYON}000&key=$GOOGLE_PLACES_API_KEY" | jq -r '.results[] | {name, address: .formatted_address, place_id, rating, user_ratings_total, types}' > /tmp/places.json
```

### Étape 2 : Enrichissement
Pour chaque entreprise trouvée :
- Récupérer le détail (téléphone, site web, horaires)
- Vérifier la présence web (site, réseaux sociaux)
- Scraper la page "À propos" pour comprendre l'activité

### Étape 3 : Qualification
Score sur 100 points :
- Site web présent : +20
- Réseaux sociaux actifs : +15
- Avis Google > 4.0 : +10
- Plus de 10 avis : +10
- Téléphone renseigné : +5
- Photos sur GMB : +10
- Description complète : +20
- Horaires renseignés : +10

### Étape 4 : Création Notion

Structure de la base :
```
| Entreprise | Secteur | Téléphone | Email | Site Web | Note | Score | Statut | Date Contact | Commentaire |
```

Statuts : 🔍 Identifié → 📞 À contacter → ✉️ Email envoyé → 🤝 RDV pris → ❌ Pas intéressé

## Usage

```
/prospecter secteur:"restaurant" ville:"Chambly" rayon:15 min_score:50
```

## Déclencheur Automatique

```json5
// Dans openclaw.json - Cron hebdomadaire
{
  cron: {
    jobs: [
      {
        id: "prospect-hebdo",
        name: "Prospection restaurants Chambly",
        schedule: { kind: "cron", expr: "0 9 * * MON", tz: "Europe/Paris" },
        payload: {
          kind: "agentTurn",
          message: "/prospecter secteur:restaurant ville:Chambly rayon:10 min_score:60"
        },
        sessionTarget: "isolated",
        deliver: true
      }
    ]
  }
}
```

## Fichier de Configuration

```json
// criteres_qualif.json
{
  "secteurs": ["restaurant", "plombier", "électricien", "coiffeur", "boulangerie"],
  "zones": ["Chambly", "Creil", "Beauvais"],
  "score_minimum": 50,
  "relances": {
    "j1": "Email de présentation",
    "j3": "Relance email + LinkedIn",
    "j7": "Appel téléphonique",
    "j14": "Dernière relance"
  }
}
```

## Exemple de Résultat

🏆 **12 entreprises trouvées** à Chambly (restaurants, rayon 10km)

| Entreprise | Score | Statut | Action |
|------------|-------|--------|--------|
| Le Petit Bistro | 85 | 📞 À contacter | Site pro + RS actifs |
| Chez Mario | 72 | 📞 À contacter | Bon avis mais site daté |
| ... | ... | ... | ... |

📊 **Base Notion créée** : [Lien vers la base]

Prochaines actions suggérées :
1. Envoyer emails de prospection aux 8 entreprises > 60 points
2. Programmer relances dans 3 jours
3. Mettre à jour les statuts après contacts
```

### 💻 Script d'Implémentation

```bash
#!/bin/bash
# scripts/prospect.sh

SECTEUR="$1"
VILLE="$2"
RAYON="${3:-10}"
MIN_SCORE="${4:-50}"
NOTION_DB_ID="${NOTION_DB_ID:-votre_db_id}"

echo "🔍 Prospection: $SECTEUR à $VILLE (rayon: ${RAYON}km, min score: $MIN_SCORE)"

# 1. Recherche Places
COORDS=$(goplaces resolve "$VILLE" --json | jq -r '.location | "\(.lat),\(.lng)"')
RESULTS=$(goplaces search "$SECTEUR" --near "$COORDS" --radius "${RAYON}000" --json)

# 2. Pour chaque résultat, enrichir et scorer
echo "$RESULTS" | jq -c '.[]' | while read -r place; do
    PLACE_ID=$(echo "$place" | jq -r '.place_id')
    
    # Détails
    DETAILS=$(curl -s "https://maps.googleapis.com/maps/api/place/details/json?place_id=$PLACE_ID&fields=name,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos&key=$GOOGLE_PLACES_API_KEY")
    
    # Calcul score
    SCORE=0
    [ "$(echo "$DETAILS" | jq -r '.result.website')" != "null" ] && SCORE=$((SCORE + 20))
    [ "$(echo "$DETAILS" | jq -r '.result.formatted_phone_number')" != "null" ] && SCORE=$((SCORE + 5))
    [ "$(echo "$DETAILS" | jq -r '.result.photos')" != "null" ] && SCORE=$((SCORE + 10))
    # ... etc
    
    # Créer dans Notion si score >= minimum
    if [ "$SCORE" -ge "$MIN_SCORE" ]; then
        curl -X POST "https://api.notion.com/v1/pages" \
          -H "Authorization: Bearer $NOTION_API_KEY" \
          -H "Notion-Version: 2025-09-03" \
          -H "Content-Type: application/json" \
          -d "{
            \"parent\": {\"database_id\": \"$NOTION_DB_ID\"},
            \"properties\": {
              \"Entreprise\": {\"title\": [{\"text\": {\"content\": \"$(echo "$place" | jq -r '.name')\"}}]},
              \"Secteur\": {\"select\": {\"name\": \"$SECTEUR\"}},
              \"Téléphone\": {\"phone_number\": \"$(echo "$DETAILS" | jq -r '.result.formatted_phone_number // "N/A"')\"},
              \"Site Web\": {\"url\": \"$(echo "$DETAILS" | jq -r '.result.website // ""')\"},
              \"Note\": {\"number\": $(echo "$DETAILS" | jq -r '.result.rating // 0')},
              \"Score\": {\"number\": $SCORE},
              \"Statut\": {\"select\": {\"name\": "🔍 Identifié\"}},
              \"Google Place ID\": {\"rich_text\": [{\"text\": {\"content\": \"$PLACE_ID\"}}]}
            }
          }"
    fi
done

echo "✅ Prospection terminée !"
```

---

## 📌 USE CASE 2 (Concret) : "Le Chef d'Orchestre d'Événement"

### 🎯 Objectif
Gérer un événement complexe (ex: course solidaire) : planification, gestion bénévoles, suivi tâches, communication temps réel.

### 🛠️ Skills utilisés
- `cron` (planification)
- `sessions_spawn` (sub-agents)
- `message` (notifications)
- `browser` (mise à jour site)
- `canvas` (tableaux de bord)

### 📁 Structure

```
~/clawd/usecases/event-management/
├── SKILL.md
├── scripts/
│   ├── checkin.sh           # Système QR Code
│   ├── briefing.js          # Génération briefings
│   └── alerte.py            # Alertes temps réel
├── templates/
│   ├── mail_benevole.md
│   ├── plan_journee.md
│   └── post_reseaux.md
└── data/
    ├── benevoles.json
    ├── postes.json
    └── planning.json
```

### 📝 SKILL.md - Event Manager

```markdown
---
name: event-manager
description: Gère les événements : planification, bénévoles, check-in QR, briefings automatiques, alertes temps réel.
metadata:
  {
    "openclaw": {
      "emoji": "🎪",
      "requires": { "bins": ["node", "qrencode"], "config": ["event.enabled"] }
    }
  }
---

# Event Manager

## Fonctionnalités

### 1. 📋 Planification des Bénévoles

```
/event planifier --fichier benevoles.json --postes postes.json --date "2026-03-15"
```

Génère :
- Planning individuel pour chaque bénévole
- Vue d'ensemble par poste
- Cartographie des besoins

### 2. 🎫 Système de Check-in QR

```bash
# Générer les QR codes individuels
for benevole in $(cat benevoles.json | jq -r '.[] | @base64'); do
    _jq() { echo ${benevole} | base64 --decode | jq -r ${1}; }
    ID=$(_jq '.id')
    NOM=$(_jq '.nom')
    qrencode -o "qrs/$ID.png" "EVENT:BENEVOLE:$ID:$NOM"
done
```

Check-in via mobile :
```
/event checkin --qr "EVENT:BENEVOLE:123:Jean Dupont" --poste "Accueil"
```

### 3. 📢 Briefings Automatiques

Envoi programmé des briefings :
- J-7 : Email confirmation + infos pratiques
- J-1 : Rappel avec planning perso + contact référent
- J+1 : Merci + photos + sondage

```json5
// Cron jobs pour briefings
{
  jobs: [
    {
      id: "briefing-j-7",
      schedule: { kind: "at", atMs: "${event.date - 7*24*60*60*1000}" },
      payload: {
        kind: "agentTurn",
        message: "/event briefing --type confirmation --jours 7"
      }
    },
    {
      id: "briefing-j-1",
      schedule: { kind: "at", atMs: "${event.date - 1*24*60*60*1000}" },
      payload: {
        kind: "agentTurn",
        message: "/event briefing --type rappel --jours 1"
      }
    }
  ]
}
```

### 4. 🚨 Alertes Temps Réel

Déclencheurs d'alertes :
```
/event alerte --niveau urgent --message "Bénévole absent poste Accueil" --action "trouver remplaçant"
```

Actions automatiques :
1. Notification Telegram aux organisateurs
2. Recherche dans la liste de remplaçants
3. Envoi SMS au remplaçant
4. Mise à jour planning

### 5. 📊 Dashboard Canvas

Interface en temps réel accessible via node/canvas :

```html
<!-- canvas/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard Événement</title>
  <meta http-equiv="refresh" content="30">
</head>
<body>
  <h1>🎪 {{event.nom}} - Dashboard</h1>
  
  <div class="stats">
    <div class="card">
      <h3>Check-in</h3>
      <p>{{stats.checkin}}/{{stats.total}} bénévoles</p>
      <progress value="{{stats.checkin}}" max="{{stats.total}}"></progress>
    </div>
    
    <div class="card">
      <h3>Postes couverts</h3>
      <p>{{stats.postes_ok}}/{{stats.postes_total}}</p>
    </div>
    
    <div class="card alertes">
      <h3>🚨 Alertes actives</h3>
      <ul id="alertes"></ul>
    </div>
  </div>
  
  <script>
    // Rafraîchissement temps réel via WebSocket
  </script>
</body>
</html>
```

## Commandes

| Commande | Description |
|----------|-------------|
| `/event planifier` | Génère planning complet |
| `/event checkin` | Valide présence bénévole |
| `/event briefing` | Envoie briefing (J-7, J-1, J+1) |
| `/event alerte` | Déclenche alerte |
| `/event stats` | Affiche statistiques |
| `/event canvas` | Ouvre dashboard |

## Exemple d'Utilisation

```
🧑‍💻 Moi: /event planifier --fichier data/benevoles.json --postes data/postes.json --date "2026-03-15"

🤖 OpenClaw:
✅ Planning généré pour 45 bénévoles sur 12 postes

📋 RÉCAPITULATIF :
├─ Accueil: 6 bénévoles (2 créneaux)
├─ Sécurité: 8 bénévoles (3 créneaux)
├─ Restauration: 12 bénévoles
├─ Course: 15 bénévoles
└─ Logistique: 4 bénévoles

📧 Emails de confirmation programmés pour J-7
🎫 QR Codes générés dans ./qrs/
📊 Dashboard disponible: /event canvas

Prochaines étapes suggérées:
1. Vérifier les indisponibilités
2. Envoyer confirmations (J-7)
3. Préparer briefings J-1
```
```

### 💻 Implémentation Clé

```javascript
// scripts/event-coordinator.js

class EventCoordinator {
  constructor(eventData) {
    this.event = eventData;
    this.benevoles = require('./data/benevoles.json');
    this.postes = require('./data/postes.json');
  }

  // Génère le planning optimal
  async genererPlanning() {
    const planning = {};
    
    for (const poste of this.postes) {
      planning[poste.id] = {
        ...poste,
        creneaux: poste.creneaux.map(c => ({
          ...c,
          benevoles: this.assignerBenevoles(poste, c)
        }))
      };
    }
    
    return planning;
  }

  // Algorithme d'assignation
  assignerBenevoles(poste, creneau) {
    // Filtre bénévoles disponibles + compétences
    const candidats = this.benevoles.filter(b => 
      b.disponibilites.includes(creneau.horaire) &&
      (b.competences.includes(poste.competence_requise) || poste.competence_requise === null)
    );
    
    // Trie par affinité (préférences, expérience)
    return candidats
      .sort((a, b) => this.scoreAffinite(b, poste) - this.scoreAffinite(a, poste))
      .slice(0, creneau.nb_benevoles);
  }

  // Check-in avec QR
  async checkin(qrData) {
    const [_, type, id, nom] = qrData.split(':');
    
    // Met à jour statut
    await this.mettreAJourStatut(id, 'present');
    
    // Notifie le référent de poste
    const poste = this.trouverPoste(id);
    await message.send({
      target: poste.referent_telegram,
      message: `✅ ${nom} vient de pointer au poste ${poste.nom}`
    });
    
    return { success: true, benevole: nom, poste: poste.nom };
  }

  // Alerte temps réel
  async declencherAlerte(niveau, message, actionRequise) {
    const alerte = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      niveau, // info, warning, urgent
      message,
      action_requise: actionRequise,
      statut: 'active'
    };
    
    // Sauvegarde
    this.alertes.push(alerte);
    
    // Notifications selon niveau
    if (niveau === 'urgent') {
      // Telegram + SMS aux organisateurs
      await this.notifierUrgence(alerte);
      
      // Sub-agent pour résolution
      sessions_spawn({
        task: `Résoudre: ${actionRequise}. Alertes actives: ${JSON.stringify(this.alertes)}`,
        runTimeoutSeconds: 300
      });
    }
    
    return alerte;
  }
}
```

---

## ⭐ USE CASE 3 (Incroyable) : "L'Agent de Veille Autonome"

### 🎯 Concept
Un agent qui vit 24/7, surveille tes sources d'information, détecte les opportunités et te briefe automatiquement avec des recommandations actionnables.

### 🧠 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VEILLE 360°                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📰 SOURCES                    🧠 TRAITEMENT                │
│  ├── RSS secteur               ├── Analyse sémantique       │
│  ├── Twitter/X listes          ├── Scoring opportunité      │
│  ├── Google Alerts             ├── Extraction insights      │
│  ├── LinkedIn veille           ├── Synthèse intelligente    │
│  ├── Sites institutionnels     └── Recommandations IA       │
│  └── Newsletters                                              │
│                                                              │
│  📊 OUTPUTS                                                  │
│  ├── Briefing quotidien 8h                                  │
│  ├── Alertes temps réel (opportunités hot)                  │
│  ├── Rapport hebdomadaire (tendances)                       │
│  └── Base de connaissances (Notion)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🛠️ Skills Stack

```markdown
---
name: veille-360
description: Agent de veille autonome 24/7 - surveillance multi-sources, analyse IA, briefings automatisés.
metadata:
  {
    "openclaw": {
      "emoji": "🕵️",
      "requires": { 
        "bins": ["curl", "jq", "python3"],
        "env": ["OPENAI_API_KEY", "NOTION_API_KEY", "BRAVE_API_KEY"]
      }
    }
  }
---

# Veille 360° - Agent Autonome

## Configuration

```json5
// veille-config.json5
{
  profil: "consultant_strategie_evenementiel",
  
  sources: {
    rss: [
      "https://www.eventbrite.fr/blog/feed/",
      "https://www.weezevent.com/fr/blog/feed/",
      "https://www.helloasso.com/blog/feed"
    ],
    twitter_listes: ["evenementiel-fr", "marketing-digital"],
    google_alerts: ["événementiel IA", "fundraising association", "communication 360"],
    linkedin_keywords: ["chef de projet événementiel", "stratégie de communication"],
    newsletters: ["eventbrite-weekly", "bloomin-news"]
  },
  
  criteres_opportunite: {
    mots_cles: ["appel à projets", "subvention", "partenariat", "consultation", "AO"],
    lieux: ["Oise", "Chambly", "Creil", "Beauvais", "Paris"],
    score_minimum: 70
  },
  
  outputs: {
    briefing_quotidien: { heure: "08:00", tz: "Europe/Paris" },
    alertes_temps_reel: { active: true, canal: "telegram" },
    rapport_hebdo: { jour: "VENDREDI", heure: "17:00" },
    base_notion: { db_id: "xxx" }
  }
}
```

## Workflows Cron

### 1. Collecte Continue (toutes les 15 min)
```json5
{
  id: "veille-collecte",
  schedule: { kind: "every", everyMs: 900000 },
  payload: {
    kind: "agentTurn",
    message: "/veille collecter --sources all",
    model: "kimi-coding/kimi-for-coding"  // Rapide pour collecte
  },
  sessionTarget: "isolated"
}
```

### 2. Analyse & Scoring (toutes les heures)
```json5
{
  id: "veille-analyse",
  schedule: { kind: "every", everyMs: 3600000 },
  payload: {
    kind: "agentTurn",
    message: "/veille analyser --periode 1h --min-score 70",
    model: "anthropic/claude-opus-4-5"  // Profond pour analyse
  },
  sessionTarget: "isolated"
}
```

### 3. Briefing Quotidien 8h
```json5
{
  id: "veille-briefing-matin",
  schedule: { kind: "cron", expr: "0 8 * * *", tz: "Europe/Paris" },
  payload: {
    kind: "agentTurn",
    message: "/veille briefing --type quotidien --format audio+texte",
    thinking: "high"  // Réflexion approfondie
  },
  sessionTarget: "main",  // Dans la session principale
  deliver: true
}
```

## Scoring d'Opportunité

```python
# scoring.py

def calculer_score(article, profil):
    """
    Score sur 100 points
    """
    score = 0
    poids = {
        'pertinence_secteur': 25,
        'opportunite_business': 25,
        'localisation': 20,
        'actualite': 15,
        'source_fiabilite': 15
    }
    
    # 1. Pertinence secteur (25 pts)
    mots_cles_secteur = ['événementiel', 'communication', 'stratégie', 'association']
    score += sum(10 for mot in mots_cles_secteur if mot in article['content'].lower())
    score = min(score, poids['pertinence_secteur'])
    
    # 2. Opportunité business (25 pts)
    mots_opportunite = ['appel à projets', 'subvention', 'consultation', 'partenariat', 'AO']
    for mot in mots_opportunite:
        if mot in article['content'].lower():
            score += 15
            article['type_opportunite'] = mot
            break
    
    # 3. Localisation (20 pts)
    lieux_cibles = ['Oise', 'Chambly', 'Creil', 'Beauvais']
    for lieu in lieux_cibles:
        if lieu.lower() in article['content'].lower():
            score += 20
            article['lieu'] = lieu
            break
    
    # 4. Actualité (15 pts)
    age_jours = (datetime.now() - article['date']).days
    if age_jours == 0:
        score += 15
    elif age_jours <= 3:
        score += 10
    elif age_jours <= 7:
        score += 5
    
    # 5. Fiabilité source (15 pts)
    sources_fiables = ['site institutionnel', 'presse locale', 'linkedin entreprise']
    if article['source_type'] in sources_fiables:
        score += 15
    
    return min(score, 100), article
```

## Briefing Généré (Exemple)

```
🌅 BRIEFING VEILLE - Mardi 3 Février 2026

🔥 OPPORTUNITÉS HOT (Score > 80)
┌─────────────────────────────────────────────────────────┐
│ 🎯 Appel à projets - Chambre des Métiers Oise           │
│    Score: 92/100 | Échéance: 15 mars 2026              │
│    Budget: 5K-15K€ | Lieu: Beauvais                     │
│                                                         │
│    💡 Recommandation IA:                                │
│    "Parfaitement aligné avec ton expertise événementiel │
│    et ton historique avec les institutions. Forte       │
│    probabilité de succès (85%). Dossier simple."        │
│                                                         │
│    🎯 Action suggérée: Préparer lettre d'intention      │
│       délai: 3 jours                                    │
└─────────────────────────────────────────────────────────┘

📊 TENDANCES DÉTECTÉES (Semaine)
• IA générative dans l'événementiel: +45% de mentions
• Retour en force des événements physiques hybrides
• Nouvelles réglementations sécurité (à suivre)

📰 TOP 5 ARTICLES
1. "Comment les associations financent leurs événements 2026"
2. "Tendances déco : ce qui va marcher cette année"
3. ...

🎧 VERSION AUDIO (8 min)
[Cliquer pour écouter le briefing]

💾 Base Notion mise à jour: [Lien]
```

## Features Avancées

### Learning Continu
```
À chaque feedback de l'utilisateur:
- "Cette alerte était pertinente" → Augmente poids source
- "Pas intéressé" → Ajuste critères
- "J'ai décroché ce contrat" → Renforce pattern gagnant
```

### Prédiction Tendances
```python
# Analyse temporelle pour prédire tendances
# "Les appels à projets culturels augmentent en mars"
# → Alerte précoce début février
```

### Network Mapping
```
Identifie automatiquement:
- Acteurs clés qui recrutent souvent
- Concurrents et leurs offres
- Partenaires potentiels
```

---

## ⭐ USE CASE 4 (Incroyable) : "L'Écosystème Multi-Agents Collaboratifs"

### 🎯 Concept
Créer une équipe virtuelle d'agents spécialisés qui collaborent entre eux pour gérer des projets complexes. Chaque agent a sa personnalité, ses compétences et communique avec les autres.

### 🏢 Organisation de l'Équipe Virtuelle

```
┌─────────────────────────────────────────────────────────────┐
│              ÉQUIPE VIRTUELLE - PROJET CLIENT               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  👔 MANAGER DE PROJET (Agent: project-manager)              │
│  ├── Coordonne l'équipe                                    │
│  ├── Planifie les tâches                                   │
│  └── Briefe les autres agents                              │
│                         │                                   │
│         ┌───────────────┼───────────────┐                  │
│         ▼               ▼               ▼                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ 👨‍💻 DEV   │    │ 🎨 DESIGN │    │ 📊 STRAT  │             │
│  │  AGENT   │◄──►│  AGENT   │◄──►│  AGENT   │             │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘             │
│       │               │               │                    │
│       └───────────────┼───────────────┘                    │
│                       ▼                                    │
│              ┌──────────────┐                              │
│              │ ✅ VALIDATEUR │                              │
│              │   (QA Agent)  │                              │
│              └──────────────┘                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🔧 Configuration Multi-Agents

```json5
// ~/.openclaw/openclaw.json - Config Équipe Virtuelle
{
  agents: {
    list: [
      {
        id: "project-manager",
        name: "Marc - Chef de Projet",
        workspace: "~/clawd/agents/project-manager",
        model: "anthropic/claude-opus-4-5",
        identity: {
          name: "Marc",
          role: "Chef de projet expérimenté",
          style: "Organisé, pédagogue, synthétique"
        },
        tools: {
          allow: ["read", "write", "sessions_send", "sessions_spawn", "cron", "message", "notion"]
        }
      },
      {
        id: "dev-agent",
        name: "Alex - Développeur",
        workspace: "~/clawd/agents/dev-agent",
        model: "kimi-coding/kimi-for-coding",
        identity: {
          name: "Alex",
          role: "Développeur full-stack",
          style: "Technique, pragmatique, clean code"
        },
        sandbox: { mode: "all", scope: "agent" },
        tools: {
          allow: ["read", "write", "edit", "exec", "sessions_send", "kimi"]
        }
      },
      {
        id: "design-agent",
        name: "Léa - Designer",
        workspace: "~/clawd/agents/design-agent",
        model: "anthropic/claude-sonnet-4-5",
        identity: {
          name: "Léa",
          role: "Designer UX/UI",
          style: "Créative, centrée utilisateur, moderne"
        },
        tools: {
          allow: ["read", "write", "browser", "canvas", "canva", "sessions_send"]
        }
      },
      {
        id: "stratege-agent",
        name: "Sophie - Stratège",
        workspace: "~/clawd/agents/stratege-agent",
        model: "anthropic/claude-opus-4-5",
        identity: {
          name: "Sophie",
          role: "Consultante stratégique",
          style: "Analytique, visionnaire, data-driven"
        },
        tools: {
          allow: ["read", "write", "web_search", "sessions_send", "notion", "memory_search"]
        }
      },
      {
        id: "validator-agent",
        name: "Tom - QA",
        workspace: "~/clawd/agents/validator-agent",
        model: "kimi-coding/kimi-for-coding",
        identity: {
          name: "Tom",
          role: "QA & Validateurr",
          style: "Rigoureux, critique constructif, précis"
        },
        tools: {
          allow: ["read", "sessions_send", "message"]
        }
      }
    ]
  },
  
  // Communication inter-agents activée
  tools: {
    agentToAgent: {
      enabled: true,
      allow: ["project-manager", "dev-agent", "design-agent", "stratege-agent", "validator-agent"]
    }
  },
  
  // Bindings - Tout passe par le Project Manager
  bindings: [
    { agentId: "project-manager", match: { channel: "telegram" } }
  ]
}
```

### 💬 Exemple de Conversation Multi-Agents

```
🧑‍💻 Moi (Telegram): 
"Marc, j'ai besoin d'un site vitrine pour mon client EABPA. 
Budget 3K€, délai 3 semaines. Go ?"

👔 Marc (Project Manager):
"Bien reçu ! Je lance l'analyse et je brief l'équipe. 
Délai: 3 semaines | Budget: 3K€"

[Marc envoie messages aux autres agents via sessions_send]

📨 Marc → Sophie:
"Brief stratégique: Site vitrine EABPA (association).
Objectifs: présentation, adhésion, événements.
Analyse besoins et recommandations ?"

📨 Marc → Léa:
"Brief design: Site vitrine association EABPA.
Attentes Sophie à suivre.
Propositions maquettes ?"

📨 Marc → Alex:
"Brief tech: Site vitrine EABPA.
Spécifications Léa + Strat Sophie à suivre.
Stack recommandée ?"

───────────────────────────────────────────────
[30 minutes plus tard]
───────────────────────────────────────────────

📊 Sophie (Stratège) → Marc:
"Analyse terminée. Recommandations:
• Positionnement: institutionnel mais accessible
• Sections clés: Qui sommes-nous, Actions, Adhérer, Agenda
• CTA principal: "Devenir adhérent"
• SEO local important (Beauvais/Oise)"

🎨 Léa (Designer) → Marc:
"Maquettes wireframes envoyées.
Direction: épuré, couleurs associatives (bleu/vert),
typo lisible, mobile-first.
Fichiers dans le dossier projet."

👨‍💻 Alex (Dev) → Marc:
"Stack proposée: Next.js + Tailwind + Vercel.
CMS: Sanity pour gestion contenu par client.
Form adhésion: Typeform embed.
Estimation: 12 jours de dev."

👔 Marc → Moi:
"📋 SYNTHÈSE PROJET EABPA

🎯 STRATÉGIE (Sophie)
Positionnement institutionnel/accessible
Focus adhésion + visibilité locale

🎨 DESIGN (Léa)  
Maquettes wireframes: ✅
Direction épurée associative
Mobile-first

👨‍💻 TECH (Alex)
Stack: Next.js + Tailwind + Sanity CMS
Hébergement: Vercel (rapide, gratuit)
Délai dev: 12 jours

💰 BUDGET
Dev: 2.5K€ | Design: 0.5K€ | Total: 3K€ ✅

⏱️ PLANNING
S1: Validation maquettes + Setup
S2: Développement
S3: Contenu + Tests + Livraison

✅ GO/NO-GO ?"

🧑‍💻 Moi: "GO !"

👔 Marc:
"🚀 Projet lancé !

Tâches assignées:
• Léa: Finaliser maquettes (J+2)
• Alex: Setup projet + architecture (J+2)
• Sophie: Brief contenu client (J+3)

Point d'étape vendredi 17h.
Je vous tiens informés."

───────────────────────────────────────────────
[Vendredi - Point d'étape]
───────────────────────────────────────────────

👔 Marc → Tom (QA):
"Tom, peux-tu valider le livrable de la semaine ?
Lien: [preview-url]"

✅ Tom (QA) → Marc:
"Review effectuée. Points relevés:
• Mobile: 2 ajustements responsive à faire
• Accessibilité: manque alt images
• Performance: 94/100 Lighthouse 👍

Sinon c'est propre !"

👔 Marc → Alex:
"Retours QA à intégrer:
- Fix responsive mobile (2 points)
- Ajouter alt images

Délai: lundi EOD"

[...]
```

### 🔄 Workflow de Collaboration

```javascript
// Exemple: Project Manager coordonnant

async function lancerProjet(brief) {
  // 1. Créer les sessions pour chaque agent
  const sessions = {
    strat: await sessions_spawn({
      agentId: 'stratege-agent',
      task: `Analyse stratégique: ${JSON.stringify(brief)}`,
      label: `strat-${brief.projet_id}`
    }),
    design: await sessions_spawn({
      agentId: 'design-agent', 
      task: `Attends brief strat avant de démarrer`,
      label: `design-${brief.projet_id}`
    }),
    dev: await sessions_spawn({
      agentId: 'dev-agent',
      task: `Attends specs design avant de démarrer`,
      label: `dev-${brief.projet_id}`
    })
  };
  
  // 2. Suivre progression
  await followProgress(sessions);
  
  // 3. Quand tous ont livré, envoyer à QA
  const validator = await sessions_spawn({
    agentId: 'validator-agent',
    task: `Validation finale du projet ${brief.projet_id}`,
    runTimeoutSeconds: 600
  });
  
  // 4. Synthèse pour client
  return await genererRapportFinal(sessions, validator);
}
```

### 🎭 Personnalités des Agents (SOUL.md)

**Project Manager** (`~/clawd/agents/project-manager/SOUL.md`):
```markdown
# Marc - Chef de Projet

Tu es Marc, chef de projet avec 15 ans d'expérience.

## Style
- Organisé et structuré
- Communiquer clairement, sans jargon
- Toujours proposer un plan d'action
- Suivre les délais et budgets

## Mantra
"Un projet bien briefé est un projet à moitié réussi."

## Tâches
- Coordonner l'équipe d'agents
- Synthétiser les livrables
- Communiquer avec le client (humain)
- Veiller au respect des délais
```

**Dev Agent** (`~/clawd/agents/dev-agent/SOUL.md`):
```markdown
# Alex - Développeur

Tu es Alex, développeur full-stack pragmatique.

## Stack Préférée
- Frontend: Next.js, React, Tailwind
- Backend: Node.js, PostgreSQL
- Tools: Git, Docker, Vercel

## Principles
- Clean code avant tout
- KISS (Keep It Simple, Stupid)
- Commenter le code complexe
- Tester avant de livrer

## Communication
- Technique mais pédagogue
- Proposer plusieurs options avec trade-offs
- Estimer honnêtement les délais
```

### 📊 Dashboard de Suivi

```html
<!-- canvas/equipe-dashboard.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard Équipe Virtuelle</title>
  <style>
    .agent-card { border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; }
    .status-active { border-left: 4px solid green; }
    .status-busy { border-left: 4px solid orange; }
    .status-waiting { border-left: 4px solid blue; }
  </style>
</head>
<body>
  <h1>👥 Équipe Virtuelle - Projet EABPA</h1>
  
  <div class="agents">
    <div class="agent-card status-active">
      <h3>👔 Marc (Project Manager)</h3>
      <p>Status: Coordination en cours</p>
      <p>Tâche: Suivi global projet</p>
    </div>
    
    <div class="agent-card status-waiting">
      <h3>📊 Sophie (Stratège)</h3>
      <p>Status: ✅ Livré - En attente validation</p>
      <p>Livrable: <a href="#">Brief stratégique</a></p>
    </div>
    
    <div class="agent-card status-active">
      <h3>🎨 Léa (Designer)</h3>
      <p>Status: 🎨 Maquettage en cours</p>
      <p>Progression: 70%</p>
    </div>
    
    <div class="agent-card status-waiting">
      <h3>👨‍💻 Alex (Développeur)</h3>
      <p>Status: ⏳ En attente maquettes</p>
      <p>Prochaine: Setup architecture</p>
    </div>
  </div>
  
  <h2>📋 Tâches en cours</h2>
  <ul>
    <li>[ ] Validation maquettes (Léa) - Échéance: J+2</li>
    <li>[ ] Setup projet (Alex) - Échéance: J+2</li>
    <li>[ ] Brief contenu (Sophie) - Échéance: J+3</li>
  </ul>
</body>
</html>
```

---

## 🚀 Pour Aller Plus Loin

### Intégrations Possibles

| Use Case | Intégrations |
|----------|--------------|
| Prospection | Notion, HubSpot, Apollo, LinkedIn |
| Event Management | Eventbrite, HelloAsso, Stripe, Twilio |
| Veille | Notion, Feedly, Twitter API, n8n |
| Multi-Agents | Slack, Discord, GitHub Projects, Figma |

### Automations Avancées

```json5
// Alertes intelligentes
{
  hooks: {
    onOpportunityDetected: {
      action: "notify",
      channels: ["telegram", "email"],
      priority: "high",
      if: "opportunity.score > 85"
    },
    onProjectDelay: {
      action: "escalate",
      notify: ["project-manager", "human"],
      suggest: "reallocation-resources"
    }
  }
}
```

---

**Résumé des 4 Use Cases:**

| # | Use Case | Type | Complexité | ROI |
|---|----------|------|------------|-----|
| 1 | Prospection Qualifiée | Concret | ⭐⭐⭐ | 🔥🔥🔥 |
| 2 | Event Manager | Concret | ⭐⭐⭐⭐ | 🔥🔥🔥 |
| 3 | Veille 360° Autonome | Incroyable | ⭐⭐⭐⭐ | 🔥🔥🔥🔥 |
| 4 | Équipe Multi-Agents | Incroyable | ⭐⭐⭐⭐⭐ | 🔥🔥🔥🔥🔥 |

---

*Tu veux que j'implémente l'un de ces use cases en détail ?* 🚀
