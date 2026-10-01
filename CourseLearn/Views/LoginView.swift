import SwiftUI

struct LoginView: View {
    let onSuccess: () -> Void

    @StateObject private var viewModel = LoginViewModel()
    @FocusState private var focusedField: Field?

    private enum Field { case email, password }

    var body: some View {
        VStack(spacing: 20) {
            Text("Course Learn")
                .font(.largeTitle.bold())

            TextField("Email", text: $viewModel.email)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .focused($focusedField, equals: .email)

            SecureField("Password", text: $viewModel.password)
                .textFieldStyle(.roundedBorder)
                .focused($focusedField, equals: .password)

            if let error = viewModel.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
                    .font(.callout)
            }

            Button {
                focusedField = nil
                Task { await viewModel.login() }
            } label: {
                if viewModel.isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                } else {
                    Text("Login")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(viewModel.isLoading)

            Text("Demo: any email + a password of 6+ characters.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .padding(24)
        .onChange(of: viewModel.isLoggedIn) { _, loggedIn in
            if loggedIn { onSuccess() }
        }
    }
}

#Preview {
    LoginView(onSuccess: {})
}
