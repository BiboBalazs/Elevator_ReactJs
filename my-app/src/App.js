import "./App.css";
import React from "react";
import { Grid, Header } from "semantic-ui-react";
import Floors from "./component/Floors";
import ElevatorController from "./component/ElevatorController";
import { DestinationFloor } from "./util/structs";
import Building from "./component/Building";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfFloor: 6,
      floors: [],
      selectedFloorA: 0,
      selectedFloorB: 6,
      scheduleA: [], // next stops
      scheduleB: [],
      holding: [],
      currentFloorA: 0,
      currentFloorB: 6,
      directionA: 0, // -1,0,1
      directionB: 0,
      movingA: false,
      movingB: false,
      callUp: [], // floors
      callDown: [],
      requestSetter: DestinationFloor,
    };
  }
  componentDidMount() {
    const floors = Array.from(Array(this.state.numberOfFloor + 1).keys());
    this.setState({ floors: floors });
  }

  isMoving = (name) => {
    if (name === "A") {
      this.setState({ movingA: true });
    } else {
      this.setState({ movingB: true });
    }
  };

  handleFloor = (floor, name) => {
    if (name === "A") {
      this.setState({ selectedFloorA: floor, movingA:true }, function() {
        this.handlerMovementA();
      });
    } else {
      this.setState({ selectedFloorB: floor, movingB:true }, function() {
        this.handlerMovementB();
      });
    }
  };

  async handlerMovementA() {
    if (
      this.state.currentFloorA < 0 ||
      this.state.currentFloorA > this.state.numberOfFloor
    ) {
      this.setState({ currentFloorA: 0, directionA: 0 });
      return;
    }
    if (this.state.currentFloorA < this.state.selectedFloorA) {
      while (
        this.state.currentFloorA !== this.state.selectedFloorA &&
        this.state.currentFloorA >= 0 &&
        this.state.currentFloorA <= this.state.numberOfFloor
      ) {
        await sleep(500);
        this.setState({
          currentFloorA: this.state.currentFloorA + 1,
          directionA: +1,
        });
        await sleep(500);
      }
      const callUp = this.state.callUp.filter(
        (e) => e !== this.state.currentFloorA
      );
      this.setState({ callUp: callUp });
    }
    while (
      this.state.currentFloorA !== this.state.selectedFloorA &&
      this.state.currentFloorA >= 0 &&
      this.state.currentFloorA <= this.state.numberOfFloor
    ) {
      await sleep(500);
      this.setState({
        currentFloorA: this.state.currentFloorA - 1,
        directionA: -1,
      });
      await sleep(1000);
    }
    this.setState({ directionA: 0, movingA: false });
  }

  async handlerMovementB() {
    if (
      this.state.currentFloorB < 0 ||
      this.state.currentFloorB > this.state.numberOfFloor
    ) {
      this.setState({ currentFloorB: 0, directionB: 0 });
      return;
    }
    if (this.state.currentFloorB < this.state.selectedFloorB) {
      while (
        this.state.currentFloorB !== this.state.selectedFloorB &&
        this.state.currentFloorB >= 0 &&
        this.state.currentFloorB <= this.state.numberOfFloor
      ) {
        await sleep(500);
        this.setState({
          currentFloorB: this.state.currentFloorB + 1,
          directionB: +1,
        });
        await sleep(500);
      }
    }
    while (
      this.state.currentFloorB !== this.state.selectedFloorB &&
      this.state.currentFloorB >= 0 &&
      this.state.currentFloorB <= this.state.numberOfFloor
    ) {
      await sleep(500);
      this.setState({
        currentFloorB: this.state.currentFloorB - 1,
        directionB: -1,
      });
      await sleep(1000);
    }
    this.setState({ directionB: 0, movingB: false });
  }

  selectedFloor = (floor, direction) => {
    if (direction === 1) {
      this.state.callUp.push(floor);
      this.setState({ callUp: this.state.callUp });
    } else {
      this.state.callDown.push(floor);
      this.setState({ callDown: this.state.callDown });
    }
    const holdingS = new DestinationFloor(floor, direction);
    this.state.holding.push(holdingS);
    this.setState({ requestSetter:holdingS, holding: this.state.holding }, function(){this.elevatorControllerFunction()});
  };

  numberOfFreeElevator = () => {
    if (!this.state.movingA && !this.state.movingB) {
      return 2;
    } else {
      if (!this.state.movingA || !this.state.movingB) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  freeElevator = async () => {
    if (this.numberOfFreeElevator()===1)
    {
      if (!this.state.movingA) {
        return 1;
      } else {
        return 2;
      }
    } 
    while (!this.state.movingA || !this.state.movingB) {
      await sleep(50);
    }
    if (!this.state.movingA) {
      return 1;
    } else {
      return 2;
    }
    
  };

  elevatorControllerFunction = async () => {
    const direction = this.state.holding.shift();
    if (this.numberOfFreeElevator() === 2) {
      if (
        Math.abs(this.state.currentFloorA - direction.floor) >
        Math.abs(this.state.currentFloorB - direction.floor)
      ) {
        this.setState(
          {
            directionB: direction.direction,
            selectedFloorB: direction.floor,
            movingB: true,
          },
          function() {
            this.handlerMovementB();
          }
        );
      } else {
        if (
          Math.abs(this.state.currentFloorA - direction.floor) <
          Math.abs(this.state.currentFloorB - direction.floor)
        ) {
          this.setState(
            {
              directionA: direction.direction,
              selectedFloorA: direction.floor,
              movingA: true,
            },
            function() {
              this.handlerMovementA();
            }
          );
        } else {
          if (this.state.currentFloorA < this.state.currentFloorB) {
            this.setState(
              {
                directionA: direction.direction,
                selectedFloorA: direction.floor,
                movingA: true,
              },
              function() {
                this.handlerMovementA();
              }
            );
          } else {
            this.setState(
              {
                directionB: direction.direction,
                selectedFloorB: direction.floor,
                movingB: true,
              },
              function() {
                this.handlerMovementB();
              }
            );
          }
        }
      }
    } else {
      if (this.numberOfFreeElevator() === 1) {
        const nameElevator = await this.freeElevator();
        if (nameElevator === 1) {
          this.setState(
            {
              directionA: direction.direction,
              selectedFloorA: direction.floor,
              movingA: true,
            },
            function() {
              this.handlerMovementA();
            }
          );
        } else {
          this.setState(
            {
              directionB: direction.direction,
              selectedFloorB: direction.floor,
              movingB: true,
            },
            function() {
              this.handlerMovementB();
            }
          );
        }
      }
      const nameElevator = await this.freeElevator();
      if (nameElevator === 1) {
        this.setState(
          {
            directionA: direction.direction,
            selectedFloorA: direction.floor,
            movingA: true,
          },
          function() {
            this.handlerMovementA();
          }
        );
      } else {
        this.setState(
          {
            directionB: direction.direction,
            selectedFloorB: direction.floor,
            movingB: true,
          },
          function() {
            this.handlerMovementB();
          }
        );
      }
    }
  };

  render() {
    return (
      <> 
        <Header as='h1' size="huge" block inverted color="red" textAlign="center">Elevator System</Header>
        <Grid centered columns={3}>
          <Grid.Row>
            <Grid.Column>
              <ElevatorController
                name={"A"}
                currentFloor={this.state.currentFloorA}
                numberOfFloor={this.state.numberOfFloor}
                selectedFloorInElevetor={this.handleFloor}
                moving={this.state.movingA}
                destination={this.state.selectedFloorA}
                isMoving={this.isMoving}
              ></ElevatorController>
            </Grid.Column>
            <Grid.Column>
              <Floors
                directionA={this.state.directionA}
                directionB={this.state.directionB}
                numberOfFloors={this.state.numberOfFloor}
                selectedFloor={this.selectedFloor}
                callDown={this.state.callDown}
                callUp={this.state.callUp}
                currentA={this.state.currentFloorA}
                currentB={this.state.currentFloorB}
                movingA={this.state.movingA}
                movingB={this.state.movingB}
              ></Floors>
            </Grid.Column>
            <Grid.Column>
              <ElevatorController
                name={"B"}
                currentFloor={this.state.currentFloorB}
                numberOfFloor={this.state.numberOfFloor}
                selectedFloorInElevetor={this.handleFloor}
                moving={this.state.movingB}
                destination={this.state.selectedFloorB}
                isMoving={this.isMoving}
              ></ElevatorController>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Building requestSetter={this.state.requestSetter} numberOfFloors = {this.state.numberOfFloor} ></Building>
      </>
    );
  }
}

export default App;
