abstract class UI {
  protected backend: Backend;

  constructor(backend: Backend) {
    this.backend = backend;
  }

  abstract render(): void;
}

abstract class Backend {
  abstract getData(): string;
}

class AndroidUI extends UI {
  public render() {
    const data = this.backend.getData();
    console.log("AndroidUI: Rendering data from the backend ->", data);
  }
}

class IPhoneUI extends UI {
  public render() {
    const data = this.backend.getData();
    console.log("IPhoneUI: Rendering data from the backend ->", data);
  }
}

class MobileBackend implements Backend {
  public getData() {
    return "MobileBackend: Data from the backend";
  }
}

const mobileBackend = new MobileBackend();
const androidUI = new AndroidUI(mobileBackend);
androidUI.render();

// Output:
// AndroidUI: Rendering data from the backend -> MobileBackend: Data from the backend

const iphoneUI = new IPhoneUI(mobileBackend);
iphoneUI.render();

// Output:
// IPhoneUI: Rendering data from the backend -> MobileBackend: Data from the backend

class WebUI extends UI {
  public render() {
    const data = this.backend.getData();
    console.log("WebUI: Rendering data from the backend ->", data);
  }
}

class WebBackend implements Backend {
  public getData() {
    return "WebBackend: Data from the backend";
  }
}

const webBackend = new WebBackend();
const webUI = new WebUI(webBackend);
webUI.render();

// Output:
// WebUI: Rendering data from the backend -> WebBackend: Data from the backend

const androidBrowserUI = new AndroidUI(webBackend);
androidBrowserUI.render();

// Output:
// AndroidUI: Rendering data from the backend -> WebBackend: Data from the backend
