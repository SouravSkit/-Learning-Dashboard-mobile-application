# Course Learn

Small React Native (Expo) course-learning app: Login → Course Dashboard → Course Details → mark lessons completed, with offline caching.

**Run:** requires Node 20.19+ (22 LTS recommended). `npm install`, then `npx expo start` — press `i` for the iOS simulator, `a` for an Android emulator, or scan the QR code with **Expo Go**.
**Demo login:** any email + password with 6+ characters (shorter password shows the error state). Tests: `npm test`.

## 1. Architecture

MVVM + Repository:

```
Expo Router screens → ViewModels (hooks) → CourseRepository → MockCourseAPI (bundled JSON) + CourseStorage (AsyncStorage)
```

```
src/
  app/            Expo Router routes (the screens)
    (app)/        authenticated stack: dashboard, course-details
  viewModels/     useLoginViewModel, useDashboardViewModel, toggleLesson
  repository/     CourseRepository, MockCourseAPI, CourseStorage, NetworkMonitor
  context/        AuthContext (login guard), CoursesContext (shared dashboard state)
  models/         Course + courseProgress()
  data/           Courses.json (bundled)
  components/     CourseRow
  __tests__/      Jest port of the XCTest suite
```

Screens contain UI only, view-model hooks hold UI state and user actions, the repository decides between network and cache. Few files, no abstractions that aren't needed — easy to explain in an interview.

Navigation and the login → dashboard switch are file-based: `Stack.Protected` in `src/app/_layout.tsx` guards the authenticated group (the Swift `RootView` equivalent), and `CoursesContext` shares one dashboard view model between the dashboard and details screens (the Swift `onUpdate` closure equivalent).

## 2. Offline Support

On a successful fetch, courses are encoded as JSON into **AsyncStorage** (`CourseStorage`). `CourseRepository.fetchCourses()` first checks `NetworkMonitor` (NetInfo): if offline it returns the cached list; if the fetch fails it also falls back to cache. The dashboard shows an "Offline — showing saved courses" note. Completing a lesson re-saves the list, so progress persists offline too.

**Try it:** load courses online → disable the network (airplane mode / disconnect Wi‑Fi) → pull-to-refresh → same courses appear.

## 3. Security

Authentication tokens must never live in AsyncStorage/plaintext storage. In production store them in the **Keychain/Keystore** — e.g. `expo-secure-store` (`KeychainItemAccessibility.afterFirstUnlock`) — use short-lived access tokens + refresh tokens, and prefer the system browser via `expo-auth-session` for OAuth. This app mocks auth and stores nothing sensitive.

## 4. Scale (1M users, hundreds of courses)

1. **API pagination + diff payloads** — never ship the full catalog in one response.
2. **Server-side caching + CDN** — cache API responses and static assets at the edge to cut latency and load.
3. **Local database (expo-sqlite/MMKV)** — replace the JSON blob in AsyncStorage with a real store for incremental updates and queries.
4. **Session/auth service** — proper token refresh, rate limiting, server-side sessions.
5. **Monitoring** — crash reporting (e.g. Sentry/Datadog) plus background sync for progress updates.

## 5. Tooling

One codebase runs on iOS, Android, and web. Useful commands:

```sh
npx expo start       # dev server (Expo Go or development build)
npm test             # Jest unit tests
npx tsc --noEmit     # typecheck
npx expo lint        # lint
npx expo-doctor      # diagnose dependency/config issues
```

Native `ios/` and `android/` folders are generated on demand (Continuous Native Generation) — never edit them by hand; configure native behavior in `app.json`.
