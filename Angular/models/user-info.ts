// This simple TypeScript class provides a convenient interface for working with a user object.
export class UserInfo {
  // The constructor acts as an interface to enforce clean data structures and excellent intellisense.
  constructor(
    public alias: string,
    public fName: string,
    public lName: string,
    public uid?: string,
    public imageUrl?: string,
    public email?: string,
    public zipCode?: string,
    public bio?: string,
    public city?: string,
    public state?: string
  ) {}

  // Display the optional alias by default, or the required first name as a backup
  displayName() {
    return this.alias ? this.alias : this.fName;
  }

  // Display the user's provided profile image by default, or stand-in as backup
  displayImageUrl() {
    if (!this.imageUrl || this.imageUrl === "") {
      return "assets/images/backup_profile_image.svg";
    }
    return this.imageUrl;
  }

  // Quickly determine whether the object was properly initialized
  // and/or whether a specific user has been loaded or cached, or
  // should be retrieved from the server before displaying info
  exists() {
    return !!this.uid;
  }
}
