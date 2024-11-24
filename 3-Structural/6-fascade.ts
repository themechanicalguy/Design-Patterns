// Subsystem classes
class Engine {
  start(): void {
    console.log("Engine started");
  }

  stop(): void {
    console.log("Engine stopped");
  }
}

class Lights {
  turnOn(): void {
    console.log("Lights turned on");
  }

  turnOff(): void {
    console.log("Lights turned off");
  }
}

class AirConditioner {
  turnOn(): void {
    console.log("Air conditioner turned on");
  }

  turnOff(): void {
    console.log("Air conditioner turned off");
  }
}

// Facade
class CarFacade {
  private engine: Engine;
  private lights: Lights;
  private airConditioner: AirConditioner;

  constructor() {
    this.engine = new Engine();
    this.lights = new Lights();
    this.airConditioner = new AirConditioner();
  }

  startCar(): void {
    this.engine.start();
    this.lights.turnOn();
    this.airConditioner.turnOn();
    console.log("Car is ready to go!");
  }

  stopCar(): void {
    this.engine.stop();
    this.lights.turnOff();
    this.airConditioner.turnOff();
    console.log("Car stopped");
  }
}

// Client
const carFacade = new CarFacade();
carFacade.startCar();

/*
Engine started
Lights turned on
Air conditioner turned on
Car is ready to go!
*/

console.log("------------------");
carFacade.stopCar();

/*
------------------
Engine stopped
Lights turned off
Air conditioner turned off
Car stopped
*/
