# Sécurité

## Rapporter une Vulnérabilité

Ne créez PAS d'issue publique pour une vulnérabilité de sécurité. 
Envoyez un email à [security@adaptivelearning.dev](mailto:security@adaptivelearning.dev) avec :

- Description de la vulnérabilité
- Étapes pour la reproduire
- Contexte et impact potentiel

Nous répondrons dans 48h et travaillerons sur un correctif.

## Sécurité en Production

### Authentification
✅ NextAuth.js avec JWT
✅ Passwords hashés avec bcrypt (10 rounds)
✅ HTTPS obligatoire
✅ CSRF protection

### Données
✅ Validation Zod stricte
✅ SQL injection protected (Prisma ORM)
✅ Rate limiting (Express rate-limit)
✅ Input sanitization

### Headers
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: SAMEORIGIN
✅ X-XSS-Protection: 1; mode=block
✅ Strict-Transport-Security
✅ Content-Security-Policy

### Logs
✅ Winston logging
✅ PII masking
✅ Audit trail
✅ Error monitoring

## Meilleures Pratiques

1. Utilisez des variables d'environnement pour les secrets
2. Mettez à jour régulièrement les dépendances
3. Exécutez `npm audit` régulièrement
4. Validez toutes les entrées utilisateur
5. Utilisez HTTPS en production
6. Implémentez les en-têtes de sécurité
7. Utilisez des sessions sécurisées (HttpOnly, Secure, SameSite)
