export class DestinationFloor {
  constructor(floor, direction) {
    this.floor = floor;
    this.direction = direction;
  }
}

export class Data {
  constructor(elevatorData, callingRequests) {
    this.elevatorData = elevatorData;
    this.callingRequests = callingRequests;
  }
}
