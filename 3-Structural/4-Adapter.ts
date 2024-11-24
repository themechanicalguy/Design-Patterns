//Convert the interface of a class into another interface clients expect.
//Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
//Wrap an existing class with a new interface.
//Impedance match an old component to a new system

class APIData {
  fetchData(): any {
    return {
      data: {
        name: "ibrahim",
        age: 25,
        social: {
          email: "ibrahim@sengun.com",
        },
      },
    };
  }
}

// Target
interface JustifiedData {
  name: string;
  age: number;
  email: string;
}

// Adapter
class Conventer implements JustifiedData {
  private apiData: APIData;

  constructor(apiData: APIData) {
    this.apiData = apiData;
  }

  get name(): string {
    return this.apiData.fetchData().data.name;
  }

  get age(): number {
    return this.apiData.fetchData().data.age;
  }

  get email(): string {
    return this.apiData.fetchData().data.social.email;
  }
}

// Client
function displayData(data: JustifiedData) {
  console.log("Name: " + data.name);
  console.log("Age: " + data.age);
  console.log("Email: " + data.email);
}

const apiData = new APIData();
const adaptedData = new Conventer(apiData);
displayData(adaptedData);
