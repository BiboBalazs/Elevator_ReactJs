import React from "react";
import { Grid } from "semantic-ui-react";
import { ElevatorControllerClass } from "../service/ElevatorController";
import { Data, DestinationFloor } from "../util/structs";
import ElevatorDisplay from "./ElevatorDisplay";
import Floors from "./Floors";

export default class Building extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestSetter: DestinationFloor,
      numberOfFloors: 0,
      elevatorController: ElevatorControllerClass,
      data: Data,
      directionA: 0,
      directionB: 0,
      currentA: 0,
      currentB: 0,
      update: 0,
      loading: 0,
    };
  }

  componentDidMount = async () => {
    const numberOfFloors = this.props.numberOfFloors;
    const elevatorController = new ElevatorControllerClass(
      numberOfFloors,
      this
    );
    const data = elevatorController.getData();
    this.setState({
      data: data,
      numberOfFloors: numberOfFloors,
      elevatorController: elevatorController,
      directionA: data.elevatorData[0].status,
      directionB: data.elevatorData[1].status,
      currentA: data.elevatorData[0].currentFloor,
      currentB: data.elevatorData[1].currentFloor,
      loading: 1,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      this.setState({ loading: this.props.loading });
    }
    if (this.props.numberOfFloors !== prevProps.numberOfFloors) {
      this.setState({ numberOfFloors: this.props.numberOfFloors });
      this.getData();
    }
    if (this.props.requestSetter !== prevProps.requestSetter) {
      this.pushRequest(this.props.requestSetter);
    }
    if (this.props.update !== prevProps.update) {
      this.getData();
    }
    if (this.props.data !== prevProps.data) {
      this.setState({ data: this.props.data });
      this.setState({
        currentA: this.props.data.elevatorData[0].currentFloor,
        currentB: this.props.data.elevatorData[1].currentFloor,
      });
    }
  }

  pushRequest = (request) => {
    this.state.elevatorController.pushRequest(request);
  };

  selectedFloor = (floor, direction) => {
    const holdingS = new DestinationFloor(floor, direction);
    this.pushRequest(holdingS);
  };

  selectedFloorInElevetor = (floor, id) => {
    // const dest = new DestinationFloor(floor, direction);
    //ide meg kell hivni a elevator sajat hizzaadojat
    this.state.elevatorController.pushRequestToElevator(floor,id);
  }

  getData = () => {
    this.setState({ data: this.state.elevatorController.getData() });
  };

  setData = (data) => {
    this.setState({ data: data }, function() {
      this.render();
    });
    this.setState({
      currentA: data.elevatorData[0].currentFloor,
      currentB: data.elevatorData[1].currentFloor,
    });
  };

  render() {
    // const data = this.state.data;
    return (
      <>
        <Grid centered columns={3}>
          <Grid.Row>
            <Grid.Column>
              <ElevatorDisplay
                name={"A"}
                id={0}
                currentFloor={this.state.currentA}
                numberOfFloors={this.state.numberOfFloors}
                selectedFloorInElevetor={this.selectedFloorInElevetor}
                moving={this.state.movingA}
                destination={this.state.selectedFloorA}
                isMoving={this.isMoving}
                data={this.state.data}
              ></ElevatorDisplay>
            </Grid.Column>
            <Grid.Column>
              <Floors
                numberOfFloors={this.state.numberOfFloors}
                loading={this.state.loading}
                selectedFloor={this.selectedFloor}
                setData={this.setData}
                data={this.state.data}
              ></Floors>
            </Grid.Column>

            <Grid.Column>
              <ElevatorDisplay
                name={"B"}
                id={1}
                currentFloor={this.state.currentB}
                numberOfFloors={this.state.numberOfFloors}
                selectedFloorInElevetor={this.selectedFloorInElevetor}
                moving={this.state.movingA}
                destination={this.state.selectedFloorA}
                isMoving={this.isMoving}
                data={this.state.data}
              ></ElevatorDisplay>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
