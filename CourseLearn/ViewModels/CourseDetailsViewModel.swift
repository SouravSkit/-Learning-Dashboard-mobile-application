import Combine

@MainActor
final class CourseDetailsViewModel: ObservableObject {
    @Published private(set) var course: Course

    init(course: Course) {
        self.course = course
    }

    func toggleLesson(_ lesson: Lesson) {
        guard let index = course.lessons.firstIndex(where: { $0.id == lesson.id }) else { return }
        course.lessons[index].isCompleted.toggle()
        // `course.progress` is recomputed automatically from the lessons.
    }
}
