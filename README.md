# F-Insight Mobile

Aplicativo mobile da F-Insight para iOS e Android, desenvolvido com React Native e Expo.

## Funcionalidades

- **Home**: Resumo do mercado, maiores movimentações e acesso rápido
- **Radar**: Busca e filtro de ativos por setor e região (BR/US/Crypto)
- **Watchlist**: Lista personalizada de ativos favoritos com atualização em tempo real
- **Alertas**: Alertas de preço, RSI, MACD e volume com notificações push
- **Portfólio**: Gestão de portfólio virtual com métricas de risco

## Tecnologias

- **React Native** com Expo SDK 50
- **Expo Router** para navegação
- **React Query** para gerenciamento de dados
- **Zustand** para estado global
- **Expo Notifications** para push notifications
- **Expo Secure Store** para armazenamento seguro

## Requisitos

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) ou Android Emulator
- Conta Expo (para builds)

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npx expo start

# Rodar no iOS Simulator
npx expo start --ios

# Rodar no Android Emulator
npx expo start --android
```

## Build para Produção

### Configurar EAS Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Configurar projeto
eas build:configure
```

### Build Android (APK/AAB)

```bash
# Build para Google Play Store (AAB)
eas build --platform android --profile production

# Build APK para distribuição direta
eas build --platform android --profile preview
```

### Build iOS (IPA)

```bash
# Build para App Store
eas build --platform ios --profile production

# Build para TestFlight
eas build --platform ios --profile preview
```

## Estrutura do Projeto

```
finsight-mobile/
├── app/                    # Telas (Expo Router)
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Home
│   │   ├── radar.tsx      # Radar de ativos
│   │   ├── watchlist.tsx  # Watchlist
│   │   ├── alerts.tsx     # Alertas
│   │   └── portfolio.tsx  # Portfólio
│   ├── asset/[ticker].tsx # Detalhes do ativo
│   ├── search.tsx         # Busca
│   ├── settings.tsx       # Configurações
│   └── login.tsx          # Login
├── lib/                   # Utilitários
│   ├── api.ts            # Cliente API
│   └── store.ts          # Estado global (Zustand)
├── assets/               # Imagens e fontes
├── app.json              # Configuração Expo
└── package.json
```

## Configuração de Notificações Push

### Android

1. Crie um projeto no Firebase Console
2. Baixe o `google-services.json`
3. Coloque na raiz do projeto

### iOS

1. Configure o Apple Push Notification Service (APNs)
2. Gere os certificados necessários no Apple Developer Portal
3. Configure no EAS Build

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
EXPO_PUBLIC_API_URL=https://f-insight.org/api
EXPO_PUBLIC_WS_URL=wss://f-insight.org/ws
```

## Offline Support

O app suporta modo offline através do Zustand com persistência em AsyncStorage:

- Watchlist e alertas são salvos localmente
- Dados de mercado são cacheados
- Sincronização automática quando online

## Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT License - Veja LICENSE para detalhes.
