// Service interface
interface UserService {
  getUserById(userId: number): string;
}

// Service
class RealUserService implements UserService {
  getUserById(userId: number): string {
    return `User#${userId}`;
  }
}

// Proxy
class UserProxyService implements UserService {
  private realUserService: RealUserService;

  constructor() {
    this.realUserService = new RealUserService();
  }

  getUserById(userId: number): string {
    console.log(
      `Proxy: Before calling RealUserService.getUserById for userId ${userId}`
    );
    const user = this.realUserService.getUserById(userId);
    console.log(
      `Proxy: After calling RealUserService.getUserById for userId ${userId}`
    );
    return user;
  }
}

// Client
const userService = new UserProxyService();
const userResult = userService.getUserById(123);
console.log(`Result: ${userResult}`);
/*
Proxy: Before calling RealUserService.getUserById for userId 123
Proxy: After calling RealUserService.getUserById for userId 123
Result: User#123
*/

//----------------Example-2

class RealImage {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log("Loading " + this.fileName);
  }

  public display(): void {
    console.log("Displaying " + this.fileName);
  }
}

class ProxyImage {
  private realImage: RealImage | null = null;
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  public display(): void {
    if (this.realImage == null) {
      this.realImage = new RealImage(this.fileName);
    }
    this.realImage.display();
  }
}

let image1: ProxyImage = new ProxyImage("test_10mb.jpg");
let image2: ProxyImage = new ProxyImage("test_10mb.jpg");

// image will be loaded from disk
image1.display();

// image will not be loaded from disk
image2.display();
