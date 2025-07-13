# Singleton Pattern

- **Singleton method** is a part of Gang of Four design patterns.It is categorized under creational design patterns.
- _Singleton pattern_ is a design pattern which restricts a class to instanciate its multiple objects. It is nothing but a way of defining a class.
- Class is defined in such a way that only one instance of the class is created in the complete execution of a program or project.

## When to Use:

- **Logging Service :** For a logging service that needs to capture and centralize log entries across the entire application,
  a Singleton can ensure that there’s only one logging instance.
- **Managing Shared Resources :** In scenarios where you need to manage shared resources like database connections, network connections, or thread pools,
  a Singleton can help coordinate and control access to these resources.
- **Service Classes:** For services that should have a single instance, such as a data service, API service, or utility service,
  a Singleton pattern can provide a consistent interface.
- **Preventing Multiple Instantiations:** When instantiating multiple instances of a class would cause issues or inefficiencies,
  a Singleton ensures that there is only one instance in the entire application.
- **Lazy Initialization:** If the instantiation of an object is resource-intensive and you want to delay the creation until it is actually needed,
  a Singleton can provide lazy initialization.
- **Preventing Cloning:** If you want to prevent the cloning of an object, which could lead to multiple instances, a Singleton can include
  logic to prohibit cloning.

## KEY POINTS IN IMPLEMENTING SINGLETON METHOD

- **Private Constructor:** The class should have a private constructor to prevent instantiation of the class from external classes.
- **Private Static Instance :** The class should have a private static instance of itself. This instance is the single instance that the pattern ensures.
- **Public Static Method to Access the Instance :** The class provides a public static method that returns the instance of the class.
  If an instance does not exist, it creates one; otherwise, it returns the existing instance.
- **Lazy Initialization:** The instance is created only when it is first requested. This is known as lazy initialization. It helps improve performance by
  avoiding the unnecessary creation of the instance.
- **Prevention of Cloning and Serialization:** To maintain the Singleton property, you may need to override the clone method to throw an exception and ensure that the class is not serializable or provide custom serialization logic.

## ADVANTAGES:-

- **Controlled access to sole instance:** Because the Singleton class encapsulates its sole instance, it can have strict control over how and
  when clients access it.
- **Reduced name space:** The Singleton pattern is an improvement over global variables. It avoids polluting the name space with global variables
  that store sole instances.
- **Permits a variable number of instances:** The pattern makesit easy to change your mind and allow more than one instance of the Singleton class.Moreover, you can use the same approach to control the number of instances that the application uses. Only the operation that grants access
  to the Singleton instance needs to change.

## Disadvantages :-

- **Concurrency Issues:** If not implemented carefully, Singletons can introduce concurrency issues in multi-threaded applications.
  You may need to use synchronization mechanisms, like locks or mutexes, to ensure safe access to the Singleton instance, which can add
  complexity to your code.
- **Singleton Pattern Overuse:** Due to its convenience, developers might overuse the Singleton pattern, leading to an abundance of Singleton instances in an application. This can defeat the purpose of the pattern and result in increased memory usage.
- **Initialization Overhead:** Lazy initialization, while often an advantage, can introduce some overhead when the Singleton instance is first accessed.If the initialization process is resource-intensive, it can affect the application’s startup time.
- **Difficulties in Debugging:** Debugging a Singleton-based codebase can be challenging, especially when issues related to the Singleton’s state arise. It can be hard to trace the source of problems when multiple parts of the code may have modified the Singleton’s data.

```javascript
const Singleton = (function () {
  let instance;

  function Singleton() {
    if (instance) {
      throw new Error(
        "Singleton instance already exists. Use getInstance method."
      );
    }
    // Initialization code
    this.data = Math.random(); // Example: Initialization with random data
  }

  Singleton.getInstance = function () {
    if (!instance) {
      instance = new Singleton();
    }
    return instance;
  };

  Singleton.prototype.clone = function () {
    throw new Error("Cloning of singleton instance is not allowed.");
  };

  Singleton.prototype.customDeserialize = function () {
    throw new Error("Deserialization of singleton instance is not allowed.");
  };

  // JSON.parse reviver function to prevent deserialization
  function revive(key, value) {
    if (key === "" && value && value.__isSingleton) {
      return instance;
    }
    return value;
  }

  Singleton.prototype.toJSON = function () {
    return JSON.stringify({ __isSingleton: true, data: this.data });
  };

  return Singleton;
})();

// Usage
try {
  const singletonInstance1 = Singleton.getInstance();
  console.log(singletonInstance1);

  // Attempting to create another instance should throw an error
  const singletonInstance2 = new Singleton();
} catch (error) {
  console.error(error.message); // Singleton instance already exists. Use getInstance method.
}

// Cloning prevention
try {
  const clonedInstance = Object.create(singletonInstance1);
  console.log(clonedInstance); // Will throw an error
} catch (error) {
  console.error(error.message); // Cloning of singleton instance is not allowed.
}

// Serialization prevention
try {
  const serializedInstance = JSON.stringify(singletonInstance1);
  console.log(serializedInstance); // Will throw an error
} catch (error) {
  console.error(error.message); // Serialization of singleton instance is not allowed.
}

// Deserialization prevention
const jsonString = JSON.stringify(singletonInstance1);
const deserializedInstance = JSON.parse(jsonString, revive);
console.log(deserializedInstance); // Will be the same instance as singletonInstance1
```
