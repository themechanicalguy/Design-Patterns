//In the following example we are breaking the substitution principle because
//the parent class has the method markAsPaid which does not throw any errors.
//On the contrary, the subclass DraftOrder throws an error in that method
//because draft orders cannot be payed.Replacing the parent class Order by
//its subclass DraftOrder may break the code if we were calling markAsPaid.

class Order {
  id: number;
  items: string[];
  payed: boolean;

  // constructor

  markAsPaid(): void {
    this.payed = true;
  }
}

class DraftOrder extends Order {
  markAsPaid(): void {
    throw new Error("Draft orders can't be payed");
  }
}

//We can improve this by making draft orders the parent class and confirmed
//orders the subclass.This way it is possible to replace the parent class
//by the subclass without breaking the code.

class Order {
  id: number;
  items: string[];

  // constructor
}

class ConfirmedOrder extends Order {
  payed: boolean;

  // constructor

  markAsPaid(): void {
    this.payed = true;
  }
}
