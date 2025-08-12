import { faker } from "@faker-js/faker";

let products = [];

for (let i = 0; i < 5; i++) {
  const name = faker.commerce.product();
  products.push(name);
}

export default products;
