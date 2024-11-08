/**
 * The composite design pattern is a structural design pattern also known as the object tree design pattern. 
 * It composes objects to form a tree structure and provides the ability to use individual objects within the tree structure.
 * There are several terminologies in the composite design pattern. These are:
        Component Interface: It defines the common properties for the tree structure.
        Leaf: It’s the lowest-level object; it doesn’t have any sub-elements. Hence, it performs tasks without delegating to another object.
        Composite: It’s the object that contains various types of subclasses or leaves. It doesn’t need to know the dependencies of its children; 
            it works via the component interface.
        Client: It’s the application or function that communicates with the component interface.
 */

// Composite interface
interface ProductComponent {
  getPrice(): number;
}

// Leaf
class Product implements ProductComponent {
  private price: number;

  constructor(price: number) {
    this.price = price;
  }

  getPrice(): number {
    return this.price;
  }
}

// Leaf
class DiscountedProduct implements ProductComponent {
  private price: number;
  private discount: number;

  constructor(price: number, discount: number) {
    this.price = price;
    this.discount = discount;
  }

  getPrice(): number {
    return this.price - this.discount;
  }
}

// Composite
class ProductContainer implements ProductComponent {
  private children: ProductComponent[] = [];

  add(component: ProductComponent): void {
    this.children.push(component);
  }

  getPrice(): number {
    return this.children.reduce(
      (totalPrice, child) => totalPrice + child.getPrice(),
      0
    );
  }
}

// Client
const laptop = new Product(300);
const phone = new DiscountedProduct(200, 50);

const smallBox = new ProductContainer();
smallBox.add(laptop);

// Output: Total price of small Box: 300
console.log("Total price of small Box:", smallBox.getPrice());

const bigBox = new ProductContainer();
bigBox.add(phone);
bigBox.add(smallBox);

// Output: Total price of big Box: 450
console.log("Total price of big Box:", bigBox.getPrice());
