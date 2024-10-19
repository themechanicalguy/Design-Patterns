class Order0 {
  id: number;
  items: string[];
  shipping: string;

  // constructor

  getTotalCost(): number | any {
    // calculates total cost
  }

  getShippingCosts(): number {
    const totalCost = this.getTotalCost();

    if (this.shipping === "ground") {
      return totalCost > 50 ? 0 : 5.95;
    }

    if (this.shipping === "air") {
      return 10.95;
    }

    return 0;
  }
}

//After following Open Closed Principle

class Order {
  id: number;
  items: string[];
  shipping: Shipping;

  // constructor

  getTotalCost(): number {
    // calculates total cost
  }
}

interface Shipping {
  getShippingCosts(totalCost: number): number;
}

class Ground implements Shipping {
  getShippingCosts(totalCost: number): number {
    return totalCost > 50 ? 0 : 5.95;
  }
}

class Air implements Shipping {
  getShippingCosts(): number {
    return 10.95;
  }
}

class PickUpInStore implements Shipping {
  getShippingCosts(): number {
    return 0;
  }
}
