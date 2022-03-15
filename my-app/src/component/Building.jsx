import React from "react";
import { ElevatorControllerClass } from "../service/ElevatorController";
import { Data, DestinationFloor } from "../util/structs";



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
    };
  }

  componentDidMount= async()=> {
    const numberOfFloors = this.props.numberOfFloors;
    const elevatorController = new ElevatorControllerClass(numberOfFloors);
    const data = elevatorController.getData();
    this.setState({
      data: data,
      numberOfFloors: numberOfFloors,
      elevatorController: elevatorController,
      directionA: data.elevatorData[0].status,
      directionB: data.elevatorData[1].status,
      currentA: data.elevatorData[0].currentFloor,
      currentB: data.elevatorData[1].currentFloor,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.numberOfFloors!== prevProps.numberOfFloors) {
        this.setState({numberOfFloors:this.props.numberOfFloors});
        this.getData();
    }
    if (this.props.requestSetter !== prevProps.requestSetter) {
      this.pushRequest(this.props.requestSetter);
    }
    if (this.props.update !== prevProps.update) {
      this.getData();
    }
  }

  pushRequest = (request) => {
    this.state.elevatorController.pushRequest(request);
  };

  selectedFloor = (floor, direction) => {
    const holdingS = new DestinationFloor(floor, direction);
    this.pushRequest(holdingS);
  };

  getData = () => {
    this.setState({ data: this.state.elevatorController.getData() });
    // console.log(this.state.elevatorController.getData());
  };

  render() {
    console.log(this.state);
    const data = this.state.data;
    return (
      <>
        
      </>
    );
  }
}
