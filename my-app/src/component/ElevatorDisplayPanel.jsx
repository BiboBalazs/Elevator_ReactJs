import React from "react";
import { Icon, Grid } from "semantic-ui-react";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class ElevatorDisplayPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfFloors: 6,
      floors: [],
      currentFloor: 0,
    };
  }

  componentDidMount = async () => {
    await sleep(10);
    const { floors, numberOfFloors, currentFloor } = this.props;
    this.setState({
      numberOfFloors: numberOfFloors,
      floors: floors,
      currentFloor: currentFloor,
    });
  };
  componentDidUpdate(prevProps) {
    if (this.props.currentFloor !== prevProps.currentFloor) {
      this.setState({ currentFloor: this.props.currentFloor });
    }
  }

  render() {
    return (
      <>
        <Grid textAlign="center" color="black">
          {this.state.floors.map((floor, index) =>
            floor === this.state.currentFloor ? (
              <Grid.Column key={index}>
                {" "}
                <Icon color="red" name="circle "></Icon>
                {floor}{" "}
              </Grid.Column>
            ) : (
              <Grid.Column key={index}>
                {" "}
                <Icon color="green" name="circle "></Icon> {floor}
              </Grid.Column>
            )
          )}
        </Grid>
      </>
    );
  }
}
