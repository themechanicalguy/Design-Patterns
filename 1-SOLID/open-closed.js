/**
 * This Principle states that software entites like class should be able to extend a class behaviour without modifying it.
 * This Principles seperated the existing code from modified code to provide better stability, maintainability,
     and minimize the changes in the code.
 */
//As JS dont have enums
let Color = Object.freeze({
  red: "red",
  green: "green",
  blue: "blue",
});

let Size = Object.freeze({
  small: "small",
  medium: "medium",
  large: "large",
  yuge: "yuge",
});

class Product {
  constructor(name, color, size) {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}
//filter object by certain criterias
class ProductFilter {
  filterByColor(products, color) {
    return products.filter((p) => p.color === color);
  }
  //Added later after deployed to prod
  filterBySize(products, size) {
    return products.filter((p) => p.size === size);
  }
  //Added later after deployed to prod
  filterBySizeAndColor(products, size, color) {
    return products.filter((p) => p.size === size && p.color === color);
  }

  // state space explosion - violating OCP
  // 3 criteria (+weight) = 7 methods

  // OCP = open for extension, closed for modification
}

let apple = new Product("Apple", Color.green, Size.small);
let tree = new Product("Tree", Color.green, Size.large);
let house = new Product("House", Color.blue, Size.large);

let products = [apple, tree, house];

// let pf = new ProductFilter();
// console.log(`Green products (old):`);
// for (let p of pf.filterByColor(products, Color.green))
//   console.log(` * ${p.name} is green`);

// ↑↑↑ BEFORE

// ↓↓↓ AFTER

// general interface for a specification
class ColorSpecification {
  constructor(color) {
    this.color = color;
  }

  isSatisfied(item) {
    return item.color === this.color;
  }
}

class SizeSpecification {
  constructor(size) {
    this.size = size;
  }

  isSatisfied(item) {
    return item.size === this.size;
  }
}

class BetterFilter {
  filter(items, spec) {
    return items.filter((x) => spec.isSatisfied(x));
  }
}

// specification combinator
class AndSpecification {
  constructor(...specs) {
    this.specs = specs;
  }

  isSatisfied(item) {
    return this.specs.every((x) => x.isSatisfied(item));
  }
}

let bf = new BetterFilter();
console.log(`Green products (new):`);
const filteredProds = bf.filter(products, new ColorSpecification(Color.green));
for (let p of filteredProds) {
  console.log(` * ${p.name} is green`);
}

console.log(`Large products:`);
const filteredProds2 = bf.filter(products, new SizeSpecification(Size.large));
for (let p of filteredProds2) {
  console.log(` * ${p.name} is large`);
}

console.log(`Large and green products:`);
let spec = new AndSpecification(
  new ColorSpecification(Color.green),
  new SizeSpecification(Size.large)
);
for (let p of bf.filter(products, spec))
  console.log(` * ${p.name} is large and green`);
