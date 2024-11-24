//Flyweight factory
class SessionManager {
  private sessions: { [key: string]: Session } = {};

  getSession(userId: string): Session {
    if (!this.sessions[userId]) {
      this.sessions[userId] = new Session(userId);
    }
    return this.sessions[userId];
  }
}

//Flyweight
class Session {
  private userId: string;
  private actions: string[] = [];

  constructor(userId: string) {
    this.userId = userId;
  }

  addAction(action: string): void {
    this.actions.push(action);
  }

  getActions(): string[] {
    return this.actions;
  }

  getUserId(): string {
    return this.userId;
  }
}

//Context
class ShoppingCart {
  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  addItem(item: string): void {
    console.log(
      `Item '${item}' added to the cart for user ${this.session.getUserId()}`
    );
    this.session.addAction(`Added item: ${item}`);
  }
}

// Client
const sessionManager = new SessionManager();

/*
Item 'Laptop' added to the cart for user user1
Item 'Headphones' added to the cart for user user1
User 1 Actions: [ 'Added item: Laptop', 'Added item: Headphones' ]
*/
const user1Session = sessionManager.getSession("user1");
const shoppingCartUser1 = new ShoppingCart(user1Session);
shoppingCartUser1.addItem("Laptop");
shoppingCartUser1.addItem("Headphones");
console.log("User 1 Actions:", user1Session.getActions());

/*
Item 'Smartphone' added to the cart for user user2
User 2 Actions: [ 'Added item: Smartphone' ]
*/
const user2Session = sessionManager.getSession("user2");
const shoppingCartUser2 = new ShoppingCart(user2Session);
shoppingCartUser2.addItem("Smartphone");
console.log("User 2 Actions:", user2Session.getActions());
