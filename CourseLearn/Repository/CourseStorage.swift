import Foundation

/// Saves/loads the course list as JSON in UserDefaults.
/// Simple offline cache — no database needed for this app.
struct CourseStorage {
    private let key = "cached_courses"
    private let defaults = UserDefaults.standard

    func save(_ courses: [Course]) {
        guard let data = try? JSONEncoder().encode(courses) else { return }
        defaults.set(data, forKey: key)
    }

    func load() -> [Course]? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode([Course].self, from: data)
    }
}
