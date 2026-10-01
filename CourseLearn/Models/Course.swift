import Foundation

/// A single lesson inside a course.
struct Lesson: Identifiable, Codable, Equatable {
    let id: Int
    let title: String
    var isCompleted: Bool
}

/// A course offered in the app.
///
/// `progress` is always derived from the lessons so it can never
/// get out of sync when a lesson is marked as completed.
struct Course: Identifiable, Codable, Equatable {
    let id: Int
    let title: String
    let instructor: String
    var lessons: [Lesson]

    /// completed lessons / total lessons * 100
    var progress: Int {
        guard !lessons.isEmpty else { return 0 }
        let completed = lessons.filter { $0.isCompleted }.count
        return completed * 100 / lessons.count
    }
}
