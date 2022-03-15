function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


export class Elevator {
  elevatorID;
  status;
  stops = [];
  currentFloor;

  constructor(elevatorID, currentFloor) {
    this.elevatorID = elevatorID;
    this.status = 0;
    this.stops = [];
    this.currentFloor = currentFloor;
  }

  getData() {
    const data = {elevatorID: this.elevatorID, status: this.status, stops:this.stops, currentFloor:this.currentFloor};
    return data;
  }

  getStatus() {
    return this.status;
  }

  getDistance = (destination) => {
    return Math.abs(this.currentFloor - destination);
  }

  getCurrentLocation() {
      return this.currentFloor;
  }
  // ugy rendezzuk ha pl felfele halad az elerhetoek sargak lesznek a tobbi piros s ahol halad az zold
  addStop(targetFloor) {
    this.setStatus(targetFloor);
    if (this.status === -1) {
      this.stops.push(targetFloor);
      this.stops.sort(function(a, b) {
        return a - b;
      });
      this.stops.reverse();
    } else {
        
      this.stops.push(targetFloor);
      this.stops.sort(function(a, b) {
        return a - b;
      });
    }
  }

  move() {
    switch (this.status) {
      case -1:
        this.currentFloor--;
        break;
      case 1:
        this.currentFloor++;
        break;
      default:
        break;
    }
  }

  setStatus = (targetFloor) => {
      if (this.status === 0) {
        this.status = this.currentFloor-targetFloor>0 ? -1 : 1;
      }
  } 

  handleMovement = async() => {
        
        while(this.status!==0) {
          
            while((this.currentFloor!== this.stops[this.stops.length-1]) && (this.stops.length!==0))
            { 
                await sleep(1000);
                this.move();
                this.stops=this.stops.filter( (floor) => floor !==this.currentFloor);
                await sleep(1000);
                
            }
            this.status = 0;
        }
  }
}
