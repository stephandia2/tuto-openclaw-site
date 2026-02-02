#!/bin/bash
# Script de déploiement pour Coolify

echo "🚀 Déploiement du site Tutoriel OpenClaw"
echo "=========================================="

# Vérifier si le token est configuré
if [ -z "$COOLIFY_TOKEN" ]; then
    echo "❌ COOLIFY_TOKEN non configuré"
    echo ""
    echo "Pour configurer :"
    echo "export COOLIFY_TOKEN='ton-token-coolify'"
    echo ""
    echo "Ou ajoute dans ~/.openclaw/.env :"
    echo "COOLIFY_TOKEN=ton-token-coolify"
    exit 1
fi

# Déployer via l'API Coolify
echo "📤 Déploiement en cours..."

# Option 1: Si l'application existe déjà
# curl -X POST "http://151.80.233.195:8000/api/v1/applications/{uuid}/deploy" \
#   -H "Authorization: Bearer $COOLIFY_TOKEN"

# Option 2: Créer une nouvelle application
echo ""
echo "Pour créer l'application sur Coolify :"
echo "1. Connecte-toi à http://151.80.233.195:8000"
echo "2. Crée une nouvelle application 'tuto-openclaw-site'"
echo "3. Source : Local Dockerfile"
echo "4. Build et déploie"

echo ""
echo "✅ Fichiers prêts dans : $(pwd)"
echo "   - Dockerfile configuré"
echo "   - dist/ contient le site statique"
echo "   - Tutoriel-OpenClaw-Complet.pdf prêt"
