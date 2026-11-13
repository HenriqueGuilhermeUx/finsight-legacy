# F-Insight legacy React Native — exploratory origin preflight

This repository has an Expo SDK 50 React Native mobile application with the source Android `package` and iOS `bundleIdentifier` both set to `org.finsight.mobile` in `app.json`, and another Expo config `app.config.js`. These definitions may disagree or load dynamically; CI validates the **active** Expo configuration without editing it.

**Do not infer this is the Android app presently distributed in Google Play.** The separate `f-insight` repository has a newer Vite web frontend and an *experimental* Capacitor candidate in PR #28. The legacy native app could be obsolete. This CI is only for source identification and iOS JS export; it does **not** claim a successful Xcode native simulator build or launch.

- No Apple registration, app id changes, provisioning, certificate, IPA, TestFlight, signing, app submission, repo merge or Android changes.
- After export results, decide whether this repository can safely be modernized in a separate PR; do not upgrade Expo SDK 50 or risk changing the Android product solely for a preflight.
- Verify live Play listing/package and ownership first, then assess active API endpoints, auth, notification permissions, entitlements, legal disclosures and actual business workflows.
- The `app.config.js` includes placeholder Apple submit credentials and links requiring validation; they must **never** be used for a real submission.

Correspondence task: [Alternative Ventures iOS inventory](https://github.com/HenriqueGuilhermeUx/alternativeventures/issues/4).

## CI results (11 November 2026)

- Run [43090195572](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43090195572) **PASS**: dependencies, active-or-fallback Expo configuration, and offline iOS JavaScript export. The earlier runs failed on Expo config reading. This does not prove the active dynamic `app.config.js` itself works; the runner may have used the `app.json` fallback.
- A separate `native-ios-simulator` job was added to verify a real **unsigned** Xcode build on a disposable macOS runner. It produces diagnostics and a simulator-only `.app` artifact when successful, never an IPA for distribution.
- The legacy SDK is not to be upgraded until the Google Play product mapping and regression risks are independently verified. No changes to `app.json`, `app.config.js`, Android configuration, app source or production deployments were made.

## Native Xcode diagnostic — 12 November 2026

[GitHub Actions run 43286970468](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43286970468) confirmed success in Expo config/JS export, transient asset fixtures, native `expo prebuild`, and CocoaPods installation. **Unsigned Xcode build FAILED** (exit 65) on Xcode 26.6/iPhoneSimulator SDK 26.5:

```text
node_modules/expo-device/ios/UIDevice.swift:188:12:
error: cannot find 'TARGET_OS_SIMULATOR' in scope
```

This is a concrete Swift compilation failure in the legacy `expo-device` dependency, not proof of an app source-code failure. No simulator `.app` was produced. Avoid blind changes to production dependencies, Android, Expo SDK, or permanent replacement of icon/splash/notification assets.

### Proposed next isolated compatibility investigation

1. Inspect the affected Swift source around line 188 and determine its available native alternatives (e.g., Swift's platform compile-time checks) before proposing a narrow CI-only diagnostic change.
2. Collect any further Swift/Clang errors after a minimal *runner-only* adaptation and flag them separately; do not silently mask compile errors.
3. Cross-check the latest Google Play AAB source/commit before deciding whether `finsight-legacy` merits modernization at all. A modern Vite/Capacitor candidate also exists in `f-insight` PR #28.
4. Require a real unsigned Xcode build, installation and launch before marking this legacy source iOS-ready. A repaired native build still does not authorize TestFlight or App Store release.

Full build evidence: [native diagnostic artifact](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43286970468/artifacts/13975114921).

## Encerramento do diagnóstico técnico — 13/11/2026

**Etapa exploratória de build + launch iOS concluída.** [Run 43296419099](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43296419099) concluiu com **SUCCESS**: exportação Expo, geração do projeto iOS, CocoaPods, Xcode unsigned, instalação via `simctl`, lançamento e captura de tela do iPhone simulado.

Evidências do próprio workflow:
- [Screenshot/smoke](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43296419099/artifacts/13982292133).
- [Arquivo .app unsigned](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43296419099/artifacts/13982965430).
- [Diagnósticos nativos](https://github.com/HenriqueGuilhermeUx/finsight-legacy/actions/runs/43296419099/artifacts/13982870531).

**Limite deste encerramento:** o teste usou arquivos substitutos de ícone/splash/som e shim Swift somente no runner. `simctl launch` + screenshot não são validação visual, login, persistência, consentimento, rede/API, integridade clínica/financeira nem conformidade App Store. A configuração Expo dinâmica e a correspondência com o AAB Play ainda precisam ser comprovadas.

**Decisão:** encerrar a investigação **de viabilidade técnica unsigned**, mantendo o PR em **draft, sem merge**, e não promover para homologação comercial, release ou TestFlight. O próximo gate depende da identificação do repositório Android comercial e recursos definitivos. Prosseguir com o próximo produto do portfólio sem reabrir testes redundantes neste projeto.
