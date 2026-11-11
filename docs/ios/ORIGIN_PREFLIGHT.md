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
