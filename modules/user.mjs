
import DBManager from "./storageManager.mjs";

class User {

  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.id;
    this.email;
    this.name;
    this.pswHash;
    this.isAdmin;
    this.highscore;
  }

  async authenticate() {
    return await DBManager.authenticateUser(this);
  }

  async get() {
    if (this.id != null) {
      return await DBManager.getUser(this);
    }
  }

  async save() {

    /// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      console.log("User: Ready to save user" + this.name)
      return await DBManager.createUser(this);
    } else {
      console.log("User: Ready to update user " + this.name)
      return await DBManager.updateUser(this);
    }
  }

  async saveHighscore() {
    return await DBManager.updateUserHighscore(this);
  }

  delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }
}

export default User;
