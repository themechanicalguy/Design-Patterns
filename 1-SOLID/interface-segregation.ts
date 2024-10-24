// Interface should be defined in such a way that,Clients shouldn’t be forced to depend on methods they do not use.
/*
 It states that “do not force any client to implement an interface which is irrelevant to them“

 Suppose if you enter a restaurant and you are pure vegetarian. 
 The waiter in that restaurant gave you the menu card which includes vegetarian items, 
 non-vegetarian items, drinks, and sweets. 

-> The idea behind this principle is that it is better to have smaller and more specific 
   interfaces rather than a big interface.
-> If we had just one interface that covered a lot of features, clients of that interface 
    would have to implement behavior that they didn't need. 
    Instead, if we have smaller interfaces, clients can implement just the needed behavior.
-> Another advantage is that when we update an interface, the changes will affect less clients, 
    so there is less risk of breaking the code.
-> Remember that a class can implement multiple interfaces, 
  so there is no need to include everything in just one interface.

*/

//Violates ISP
interface Animal {
  walk(): void;
  fly(): void;
}

class Dog implements Animal {
  walk() {
    console.log("Walking");
  }

  fly() {
    throw new Error("Dogs cannot fly");
  }
}

class Duck implements Animal {
  walk() {
    console.log("Walking");
  }

  fly() {
    console.log("Flying");
  }
}

//Later ----After
interface AnimalCanWalk {
  walk(): void;
}

interface AnimalCanFly {
  fly(): void;
}

class Dog2 implements AnimalCanWalk {
  walk() {
    console.log("Walking");
  }
}

class Duck2 implements AnimalCanWalk, AnimalCanFly {
  walk() {
    console.log("Walking");
  }

  fly() {
    console.log("Flying");
  }
}
