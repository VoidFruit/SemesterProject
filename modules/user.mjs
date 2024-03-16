import DBManager from "./storageManager.mjs";

class User {

    constructor() {
      ///TODO: Are these the correct fields for your project?
      this.email;
      this.pswHash;
      this.name;
      this.id;
      this.score;
      this.rank;
      this.isAdmin;
    }
  
    // New
    async get() {
      if (this.id != null) {
        return await DBManager.getUser(this);
      }
    }
    // End new
  
    async save() {
  
      /// TODO: What happens if the DBManager fails to complete its task?
  
      // We know that if a user object dos not have the ID, then it cant be in the DB.
      if (this.id == null) {
        console.log("Ready to save user" + this.name)
        return await DBManager.createUser(this);
      } else {
        console.log("Ready to update user " + this.name)
        return await DBManager.updateUser(this);
      }
    }
  
    delete() {
  
      /// TODO: What happens if the DBManager fails to complete its task?
      DBManager.deleteUser(this);
    }
  }
  
  export default User;
