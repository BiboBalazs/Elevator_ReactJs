import { Data } from "../util/structs";
import { Elevator } from "./Elevator";


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


export class ElevatorControllerClass {
  building;
  callingRequests = [];
  elevators = [];
  numberOfFloor;

  constructor(numberOfFloor,building) {
    this.building=building;
    this.numberOfFloor = numberOfFloor;
    this.elevators.push(new Elevator(0, 0, this));
    this.elevators.push(new Elevator(1, numberOfFloor, this));
  }

  pushRequest = (request) => {
    this.callingRequests.push(request);
    this.elevatorController();
  };

  pushRequestToElevator = (request, id) => {
    this.elevators[id].addStop(request);
    this.elevators[id].handleMovement();

  }

  finishRequest = (request) => {
    this.callingRequests = this.callingRequests.filter(
      (req) => req !== request
    );
  };

  // kap egy elevatorDatat: minden relevans infot tole
  // kellene: a nem a sajat id-jatol lekeri az adatokat plusz
  //  a sajatjava osszefuzi es csinal egy data-t
  updateData = () => {
    this.building.setData(this.getData());
  } 

  getData = () => {
    const elevatorData = [];
    elevatorData[0] = this.elevators[0].getData();
    elevatorData[1] = this.elevators[1].getData();
    console.log(elevatorData);
    return new Data(elevatorData,this.callingRequests);
  };

  getFreeElevators = () => {
    const elev = this.elevators;
    return elev.filter((elevator) =>
    elevator.getStatus() === 0).map((e)=> e.getData().elevatorID);
  };

  getSameDirectionElevators = (destination) => {
    const elev = this.elevators;
    let fl = [];
    if (destination.direction === 1) {
      fl = elev.filter((elevator) => 
          (elevator.getStatus() === destination.direction) &&
          (elevator.getCurrentLocation() <= destination.floor)).map((e)=> e.getData().elevatorID);
    }

    if (destination.direction === -1) {
        fl = elev.filter((elevator) =>
            (elevator.getStatus() === destination.direction) &&
            (elevator.getCurrentLocation() >= destination.floor)).map((e)=> e.getData().elevatorID);
      }

    return fl;
  };

  waitingForElevator = () => {
    while(this.getFreeElevators().length!==0){
        console.log('alma1');
        sleep(50);
        if (this.getFreeElevators().length!==0) {
          break;
        }
    }
  }

  elevatorController = async() => {
    if (this.callingRequests.length !== 0) {
      const dest = this.callingRequests[0];
      const numElev = this.getFreeElevators();
      //ha mind a ketto szabad + kell hogy az also jojjon fel
      if (numElev.length === 2) {
        //ha az elso van kozelebb
        if (
          this.elevators[0].getDistance(dest.floor) <
          this.elevators[1].getDistance(dest.floor)
        ) {
          this.elevators[0].addStop(dest.floor);
          this.elevators[0].handleMovement();
          this.finishRequest(dest);
        }

        // ha a masodik van kozeled
        if (
          this.elevators[0].getDistance(dest.floor) >
          this.elevators[1].getDistance(dest.floor)
        ) {
          this.elevators[1].addStop(dest.floor);
          this.elevators[1].handleMovement();
          this.finishRequest(dest);
        }
        //ha egyenlo tavolsagra vanak az also megy fel
        if (
          this.elevators[0].getDistance(dest.floor) ===
          this.elevators[1].getDistance(dest.floor)
        ) {
          if (
            this.elevators[0].getCurrentLocation() >
            this.elevators[1].getCurrentLocation()
          ) {
            this.elevators[1].addStop(dest.floor);
            this.elevators[1].handleMovement();
            this.finishRequest(dest);
          } else {
            this.elevators[0].addStop(dest.floor);
            this.elevators[0].handleMovement();
            this.finishRequest(dest);
          }
        }
      } else {
        // vizsgaljuk ha mar van egy mozgo lift, ami pont jo iranyba megy
        // es az emelet felett/ alatt van a lift
        const sameDirEl = this.getSameDirectionElevators(dest);
        if (sameDirEl.length !== 0) {
          // ha mindket lift megfelel akkor a kozelebb
          //TODO
          if (sameDirEl.length === 2) {
          }
          this.elevators[sameDirEl[0]].addStop(dest.floor);
          this.finishRequest(dest);
        } else {
            const freeElev = this.getFreeElevators()
            if (freeElev.length===1) {
                this.elevators[freeElev[0]].addStop(dest.floor);
                this.elevators[freeElev[0]].handleMovement();
                this.finishRequest(dest);
            } else {
                if (freeElev.length===0) {
                  // console.log('alma');

                  this.waitingForElevator().then(this.elevatorController());
                  // sleep(1000);
                    // this.elevatorController();
                }
            }
        }
      }
    }
  };
}
