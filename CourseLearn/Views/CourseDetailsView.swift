import SwiftUI

struct CourseDetailsView: View {
    @StateObject private var viewModel: CourseDetailsViewModel
    private let onUpdate: (Course) -> Void

    init(course: Course, onUpdate: @escaping (Course) -> Void) {
        _viewModel = StateObject(wrappedValue: CourseDetailsViewModel(course: course))
        self.onUpdate = onUpdate
    }

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text(viewModel.course.instructor)
                        .foregroundStyle(.secondary)
                    Text("Progress: \(viewModel.course.progress)%")
                        .font(.headline)
                    ProgressView(value: Double(viewModel.course.progress), total: 100)
                }
                .padding(.vertical, 4)
            }

            Section("Lessons") {
                ForEach(viewModel.course.lessons) { lesson in
                    Button {
                        viewModel.toggleLesson(lesson)
                    } label: {
                        HStack {
                            Text(lesson.title)
                                .foregroundStyle(.primary)
                            Spacer()
                            Image(systemName: lesson.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(lesson.isCompleted ? .green : .secondary)
                            Text(lesson.isCompleted ? "Completed" : "Pending")
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
        .navigationTitle(viewModel.course.title)
        .navigationBarTitleDisplayMode(.inline)
        .onChange(of: viewModel.course) { _, updatedCourse in
            onUpdate(updatedCourse)
        }
    }
}

#Preview {
    NavigationStack {
        CourseDetailsView(
            course: Course(
                id: 1,
                title: "Python Programming",
                instructor: "John Smith",
                lessons: [
                    Lesson(id: 1, title: "Introduction", isCompleted: true),
                    Lesson(id: 2, title: "Variables & Data Types", isCompleted: false)
                ]
            ),
            onUpdate: { _ in }
        )
    }
}
