import SwiftUI

@main
struct CourseLearnApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}

/// Switches between login and the dashboard — no real session storage needed.
struct RootView: View {
    @State private var isLoggedIn = false

    var body: some View {
        if isLoggedIn {
            DashboardView()
        } else {
            LoginView { isLoggedIn = true }
        }
    }
}
