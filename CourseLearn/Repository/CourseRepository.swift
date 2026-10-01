import Foundation

/// Single source of course data for the app.
///
/// Flow: offline? → cached courses. Online? → mock API, then cache
/// the result so it is available the next time the device is offline.
final class CourseRepository {
    static let shared = CourseRepository()

    private let api = MockCourseAPI()
    private let storage = CourseStorage()
    private let network = NetworkMonitor.shared

    /// Returns the courses plus a flag telling whether they came from the local cache.
    func fetchCourses() async throws -> (courses: [Course], isFromCache: Bool) {
        if !network.isOnline {
            guard let cached = storage.load() else { throw CourseError.offlineNoCache }
            return (cached, true)
        }

        do {
            let courses = try await api.fetchCourses()
            storage.save(courses)
            return (courses, false)
        } catch {
            // Network failed → fall back to whatever we cached before.
            guard let cached = storage.load() else { throw error }
            return (cached, true)
        }
    }

    /// Persists the latest course list (e.g. after a lesson is completed).
    func save(_ courses: [Course]) {
        storage.save(courses)
    }
}
