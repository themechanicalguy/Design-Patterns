class User1 {
  constructor(name, age, weight, address, gender) {
    this.name = name;
    this.age = age;
    this.weight = weight;
    this.address = address;
    this.gender = gender;
  }
  printUser() {
    return `User: { name: ${this.name}, age: ${this.age}, weight: ${this.weight}, address: ${this.address}, gender: ${this.gender} }`;
  }
}

const userX = new User1("Abhishek", 22, 55, "India", "Male");
console.log(user.printUser());

/*
Before we move to implementing Builder Method we have to analyze what is wrong with this and what issues are solved by 
implementing builder method, at first we see the above code we realized that this is a correct and easy way to create a 
new object but we have to provide all information during initialization. If we look closely at the line:

const user  = new User(‘Abhishek’ , 22 , 55 , ‘India’ , ‘Male’ ); 

we see that properties of this user object can be confusing, like sometime we can mistakenly give age instead of weight 
and weight instead of age . As our code size grows, we will have to look at the class to figure out which properties we 
have to provide when initializing a user object.

*/

//Blueprint for creating a new user using User class

class User {
  constructor(name) {
    this.name = name;
    this.age = null;
    this.weight = null;
    this.address = null;
    this.gender = null;
  }

  // Method to set Age of the user
  setAge(age) {
    this.age = age;
    return this; // Return the object for method chaining
  }

  // Method to set the Weight of the user
  setWeight(weight) {
    this.weight = weight;
    return this; // Return the object for method chaining
  }

  // Method to set the Address of the user
  setAddress(address) {
    this.address = address;
    return this; // Return the object for method chaining
  }
  // Method to set the gender of user
  setGender(gender) {
    this.gender = gender;
    return this; // Return the object for method chaining
  }

  //Method to finalize the user creation
  build() {
    if (!this.name) {
      throw Error("Name is required");
    }
    return this; // Return the object for method chaining
  }

  printUser() {
    return `User: { name: ${this.name}, age: ${this.age}, weight: ${this.weight}, address: ${this.address}, gender: ${this.gender} }`;
  }
}
// Usage
const user = new User("Abhishek").setAge(30).setGender("Male").build();

console.log(user.printUser());
