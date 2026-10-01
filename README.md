# Course Learn

Small SwiftUI course-learning app: Login → Course Dashboard → Course Details → mark lessons completed, with offline caching.

**Run:** open `CourseLearn.xcodeproj` in **Xcode 16+**, run on any iOS 17+ simulator.
**Demo login:** any email + password with 6+ characters (shorter password shows the error state). Tests: `Cmd+U`.

## 1. Architecture

MVVM + Repository:

```
SwiftUI Views → ViewModels → CourseRepository → MockCourseAPI (bundled JSON) + CourseStorage (UserDefaults)
```

Views contain UI only, ViewModels hold UI state and user actions, the Repository decides between network and cache. Few files, no protocols/abstractions that aren't needed — easy to explain in an interview.

## 2. Offline Support

On a successful fetch, courses are encoded as JSON into `UserDefaults` (`CourseStorage`). `CourseRepository.fetchCourses()` first checks `NetworkMonitor` (NWPathMonitor): if offline it returns the cached list; if the fetch fails it also falls back to cache. The dashboard shows an "Offline — showing saved courses" note. Completing a lesson re-saves the list, so progress persists offline too.

**Try it:** load courses online → disable the Mac's network (or device Wi‑Fi) → pull-to-refresh → same courses appear.

## 3. Security

Authentication tokens must never live in `UserDefaults`/plist. In production store them in the **Keychain** (`kSecClassGenericPassword`, `kSecAttrAccessibleAfterFirstUnlock`), use short-lived access tokens + refresh tokens, and prefer `ASWebAuthenticationSession` for OAuth. This app mocks auth and stores nothing sensitive.

## 4. Scale (1M users, hundreds of courses)

1. **API pagination + diff payloads** — never ship the full catalog in one response.
2. **Server-side caching + CDN** — cache API responses and static assets at the edge to cut latency and load.
3. **Local database (SwiftData/Core Data)** — replace UserDefaults with a real store for incremental updates and queries.
4. **Session/auth service** — proper token refresh, rate limiting, server-side sessions.
5. **Monitoring** — crash reporting, APNs-independent metrics (e.g. Sentry/Datadog) plus background sync for progress updates.

## 5. Android Version

Same architecture with **Kotlin + Jetpack Compose + ViewModel + Repository**. `StateFlow` replaces `@Published`, `DataStore`/Room replaces UserDefaults, Retrofit/MockWebService replaces the mock API, `ConnectivityManager` replaces NWPathMonitor, `Hilt` for injection (optional), JUnit + Turbine for the progress-calculation unit test.
