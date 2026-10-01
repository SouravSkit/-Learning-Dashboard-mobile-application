import Foundation

enum CourseError: LocalizedError {
    case invalidCredentials
    case offlineNoCache
    case dataNotFound

    var errorDescription: String? {
        switch self {
        case .invalidCredentials: return "Invalid email or password"
        case .offlineNoCache: return "You are offline and no saved courses were found"
        case .dataNotFound: return "Could not load course data"
        }
    }
}

/// Simulates a network API: short delays + bundled JSON data.
/// No real backend is involved.
struct MockCourseAPI {
    private let latency: UInt64 = 800_000_000 // 0.8s in nanoseconds

    /// Mocked login. Any email works, the password must be at least
    /// 6 characters — this gives us a simple way to demo the error state.
    func login(email: String, password: String) async throws {
        try await Task.sleep(nanoseconds: 1_000_000_000)
        guard password.count >= 6 else {
            throw CourseError.invalidCredentials
        }
    }

    /// Loads the mock course list from the bundled Courses.json.
    func fetchCourses() async throws -> [Course] {
        try await Task.sleep(nanoseconds: latency)
        guard let url = Bundle.main.url(forResource: "Courses", withExtension: "json") else {
            throw CourseError.dataNotFound
        }
        let data = try Data(contentsOf: url)
        return try JSONDecoder().decode([Course].self, from: data)
    }
}
