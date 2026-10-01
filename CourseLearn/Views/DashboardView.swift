import SwiftUI

struct DashboardView: View {
    @StateObject private var viewModel = DashboardViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Courses")
                .task { await viewModel.loadIfNeeded() }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .loading:
            ProgressView("Loading courses…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)

        case .empty:
            Text("No courses available")
                .foregroundStyle(.secondary)

        case .failed(let message):
            VStack(spacing: 12) {
                Text(message)
                    .foregroundStyle(.red)
                    .multilineTextAlignment(.center)
                Button("Retry") {
                    Task { await viewModel.load() }
                }
                .buttonStyle(.bordered)
            }
            .padding()

        case .loaded:
            courseList
        }
    }

    private var courseList: some View {
        List {
            if viewModel.isShowingSavedData {
                Text("Offline — showing saved courses")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            ForEach(viewModel.courses) { course in
                NavigationLink {
                    CourseDetailsView(course: course, onUpdate: viewModel.updateCourse)
                } label: {
                    CourseRow(course: course)
                }
            }
        }
        .refreshable { await viewModel.load() }
    }
}

/// One course card: name, instructor, progress, lessons, continue button.
struct CourseRow: View {
    let course: Course

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(course.title)
                .font(.headline)
            Text(course.instructor)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Text("Progress: \(course.progress)%")
            Text("Lessons: \(course.lessons.count)")

            Text("Continue")
                .font(.subheadline.bold())
                .padding(.horizontal, 14)
                .padding(.vertical, 6)
                .background(Color.accentColor, in: Capsule())
                .foregroundStyle(.white)
                .padding(.top, 4)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    DashboardView()
}
