import Combine

@MainActor
final class DashboardViewModel: ObservableObject {
    enum State {
        case loading
        case loaded
        case empty
        case failed(String)
    }

    @Published private(set) var state: State = .loading
    @Published private(set) var courses: [Course] = []
    @Published private(set) var isShowingSavedData = false

    private let repository: CourseRepository
    private var hasLoaded = false

    init(repository: CourseRepository = .shared) {
        self.repository = repository
    }

    /// Initial load / retry. Also used by pull-to-refresh.
    func load() async {
        state = .loading
        do {
            let (courses, isFromCache) = try await repository.fetchCourses()
            self.courses = courses
            self.isShowingSavedData = isFromCache
            state = courses.isEmpty ? .empty : .loaded
            hasLoaded = true
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    /// Loads once, then keeps the in-memory list (e.g. when returning
    /// from the details screen).
    func loadIfNeeded() async {
        guard !hasLoaded else { return }
        await load()
    }

    /// Called by the details screen after a lesson is toggled,
    /// so the dashboard shows the updated progress and caches it.
    func updateCourse(_ course: Course) {
        guard let index = courses.firstIndex(where: { $0.id == course.id }) else { return }
        courses[index] = course
        repository.save(courses)
    }
}
