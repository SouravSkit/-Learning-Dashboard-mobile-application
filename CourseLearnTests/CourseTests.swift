import XCTest
@testable import CourseLearn

final class CourseTests: XCTestCase {

    /// Progress must be (completed / total) * 100, not a stored value.
    func testProgressIsCompletedOverTotalLessons() {
        let course = Course(
            id: 1,
            title: "Test Course",
            instructor: "Tester",
            lessons: [
                Lesson(id: 1, title: "L1", isCompleted: true),
                Lesson(id: 2, title: "L2", isCompleted: true),
                Lesson(id: 3, title: "L3", isCompleted: false),
                Lesson(id: 4, title: "L4", isCompleted: false)
            ]
        )

        XCTAssertEqual(course.progress, 50)
    }

    /// Marking the pending lesson complete must recalculate progress to 100%.
    @MainActor
    func testCompletingLastPendingLessonUpdatesProgress() {
        let viewModel = CourseDetailsViewModel(
            course: Course(
                id: 1,
                title: "Test Course",
                instructor: "Tester",
                lessons: [
                    Lesson(id: 1, title: "L1", isCompleted: true),
                    Lesson(id: 2, title: "L2", isCompleted: false)
                ]
            )
        )
        XCTAssertEqual(viewModel.course.progress, 50)

        viewModel.toggleLesson(viewModel.course.lessons[1])

        XCTAssertTrue(viewModel.course.lessons[1].isCompleted)
        XCTAssertEqual(viewModel.course.progress, 100)
    }

    /// A course without lessons must not divide by zero.
    func testEmptyCourseHasZeroProgress() {
        let course = Course(id: 9, title: "Empty", instructor: "—", lessons: [])
        XCTAssertEqual(course.progress, 0)
    }
}
