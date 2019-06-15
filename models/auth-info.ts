// More stripped down than the user-info class, strictly used for the logged-in user (Firebase auth object)
export class AuthInfo {
  // Acts as interface to enforce data integrity
  constructor(
    readonly uid: string,
    readonly emailVerified = false,
    readonly displayName?: string,
    readonly email?: string
  ) {}

  isLoggedIn() {
    return !!this.uid;
  }

  isEmailVerified() {
    return !!this.emailVerified;
  }
}
