# F-Insight Mobile - Guia de Publicação

Este guia detalha o processo completo para publicar o app F-Insight na App Store (iOS) e Google Play (Android).

## Pré-requisitos

### Contas Necessárias
1. **Apple Developer Account** ($99/ano) - https://developer.apple.com
2. **Google Play Console** ($25 único) - https://play.google.com/console
3. **Expo Account** (gratuito) - https://expo.dev
4. **RevenueCat Account** (gratuito até $2.5k/mês) - https://www.revenuecat.com

### Ferramentas
```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Fazer login no Expo
eas login

# Verificar configuração
eas whoami
```

## Configuração Inicial

### 1. Configurar Projeto no Expo

```bash
# Navegar para o diretório do app
cd finsight-mobile

# Configurar projeto EAS
eas build:configure

# Isso criará/atualizará eas.json
```

### 2. Configurar App Store Connect (iOS)

1. Acesse https://appstoreconnect.apple.com
2. Clique em "My Apps" → "+" → "New App"
3. Preencha:
   - Platform: iOS
   - Name: F-Insight
   - Primary Language: Portuguese (Brazil)
   - Bundle ID: org.finsight.mobile
   - SKU: finsight-mobile-001
4. Configure:
   - App Information (categoria, classificação etária)
   - Pricing and Availability
   - App Privacy (política de privacidade)

### 3. Configurar Google Play Console (Android)

1. Acesse https://play.google.com/console
2. Clique em "Create app"
3. Preencha:
   - App name: F-Insight
   - Default language: Portuguese (Brazil)
   - App or game: App
   - Free or paid: Free
4. Complete:
   - Store listing (descrição, screenshots)
   - Content rating questionnaire
   - Target audience
   - Privacy policy

## Configurar In-App Purchases

### App Store Connect

1. Vá em "Features" → "In-App Purchases"
2. Clique em "+" para adicionar produtos:

**Premium Mensal:**
- Reference Name: F-Insight Premium Monthly
- Product ID: finsight_premium_monthly
- Type: Auto-Renewable Subscription
- Price: R$ 29,90/mês

**Premium Anual:**
- Reference Name: F-Insight Premium Yearly
- Product ID: finsight_premium_yearly
- Type: Auto-Renewable Subscription
- Price: R$ 249,90/ano

3. Configure Subscription Group: "F-Insight Premium"

### Google Play Console

1. Vá em "Monetize" → "Products" → "Subscriptions"
2. Clique em "Create subscription"
3. Configure os mesmos produtos do iOS

### RevenueCat

1. Crie um projeto em https://app.revenuecat.com
2. Adicione apps iOS e Android
3. Configure produtos:
   - Vá em "Products" → "Add Product"
   - Vincule com App Store e Google Play
4. Configure entitlements:
   - Crie "premium" entitlement
   - Associe aos produtos
5. Copie as API Keys:
   - iOS: `appl_xxxxxxxxxx`
   - Android: `goog_xxxxxxxxxx`
6. Adicione ao `.env`:
   ```
   REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxx
   REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxx
   ```

## Build e Submissão

### iOS

```bash
# Build para App Store
eas build --platform ios --profile production

# Submeter para App Store
eas submit --platform ios --latest
```

**Checklist antes de submeter:**
- [ ] Screenshots para todos os tamanhos de tela
- [ ] Ícone 1024x1024 sem transparência
- [ ] Descrição em português
- [ ] Política de privacidade URL
- [ ] Classificação etária preenchida
- [ ] In-App Purchases configurados
- [ ] App Review Information (conta de teste)

### Android

```bash
# Build para Google Play
eas build --platform android --profile production

# Submeter para Google Play
eas submit --platform android --latest
```

**Checklist antes de submeter:**
- [ ] Screenshots para phone e tablet
- [ ] Ícone 512x512
- [ ] Feature graphic 1024x500
- [ ] Descrição curta (80 chars) e longa
- [ ] Política de privacidade URL
- [ ] Content rating preenchido
- [ ] Target audience configurado

## Certificados e Credenciais

### iOS (Automático com EAS)

O EAS gerencia automaticamente:
- Distribution Certificate
- Provisioning Profiles
- Push Notification Certificate

Para gerenciar manualmente:
```bash
eas credentials --platform ios
```

### Android

1. Gere uma keystore (ou deixe EAS gerar):
```bash
# EAS gera automaticamente na primeira build
# Para usar keystore existente:
eas credentials --platform android
```

2. Para Google Play Console API:
   - Vá em "Setup" → "API access"
   - Crie uma Service Account
   - Baixe o JSON e salve como `google-service-account.json`

## Push Notifications

### iOS (APNs)

1. No Apple Developer Portal:
   - Certificates → Create Certificate
   - Apple Push Notification service SSL
   - Baixe e instale no Keychain

2. Ou use APNs Key (recomendado):
   - Keys → Create Key
   - Enable Apple Push Notifications service
   - Baixe o .p8 file

### Android (FCM)

1. No Firebase Console:
   - Crie projeto ou use existente
   - Project Settings → Cloud Messaging
   - Gere Server Key

2. Baixe `google-services.json`:
   - Project Settings → Your apps → Android
   - Download google-services.json
   - Coloque na raiz do projeto

## Atualizações OTA (Over-The-Air)

Configure EAS Update para atualizações sem passar pela loja:

```bash
# Configurar EAS Update
eas update:configure

# Publicar atualização
eas update --branch production --message "Bug fixes"
```

**Limitações OTA:**
- Apenas código JS/TS
- Não pode alterar código nativo
- Não pode adicionar novas permissões

## Checklist Final

### Antes do Lançamento

- [ ] Testar em dispositivos reais (iOS e Android)
- [ ] Testar compras in-app em sandbox
- [ ] Verificar deep links funcionando
- [ ] Testar push notifications
- [ ] Verificar analytics configurado
- [ ] Testar login com biometria
- [ ] Verificar modo offline
- [ ] Testar em diferentes tamanhos de tela

### Pós-Lançamento

- [ ] Monitorar crash reports
- [ ] Responder reviews
- [ ] Acompanhar métricas de retenção
- [ ] Planejar próximas atualizações

## Comandos Úteis

```bash
# Ver status dos builds
eas build:list

# Cancelar build em andamento
eas build:cancel

# Ver logs de build
eas build:view

# Testar localmente (development)
eas build --platform ios --profile development
eas build --platform android --profile development

# Instalar build de desenvolvimento
# iOS: Scan QR code no Expo Go
# Android: Download APK e instalar
```

## Suporte

- Documentação Expo: https://docs.expo.dev
- Documentação EAS: https://docs.expo.dev/eas
- RevenueCat Docs: https://docs.revenuecat.com
- Apple Developer: https://developer.apple.com/support
- Google Play Help: https://support.google.com/googleplay/android-developer

## Custos Estimados

| Item | Custo |
|------|-------|
| Apple Developer Account | $99/ano |
| Google Play Console | $25 (único) |
| RevenueCat | Gratuito até $2.5k/mês |
| EAS Build | 30 builds/mês gratuitos |
| Total Inicial | ~$124 |

## Tempo Estimado de Aprovação

- **App Store**: 24-48 horas (primeira submissão pode levar até 1 semana)
- **Google Play**: 1-7 dias (primeira submissão pode levar mais)

---

Última atualização: Dezembro 2024
