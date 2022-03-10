import React from "react";
import { Button, Icon, Label, Segment } from "semantic-ui-react";

export default class Floor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directionA: 0,
      directionB: 0,
      currentA:0,
      currentB:0,
      numberOfFloor: 0,
      statusUp: 1,
      statusDown: 1,
      selectedFloor: function() {},
    };
  }
  componentDidMount() {
    const { directionA, directionB, numberOfFloor, selectedFloor } = this.props;
    this.setState({
      directionA: directionA,
      directionB: directionB,
      numberOfFloor: numberOfFloor,
      selectedFloor: selectedFloor,
    });
  }
  componentDidUpdate(prevProps) {
    if (this.state.currentA!== prevProps.currentA || this.state.currentB!== prevProps.currentB) {
        this.setState({currentA: this.props.currentA, currentB: this.props.currentB}, function() {this.render()});  
    }

    if(this.state.statusDown === 0){
        if(this.state.currentA === this.state.numberOfFloor || this.state.currentB === this.state.numberOfFloor){
            this.setState({statusDown: 1}, function() {this.render()});
        }
    }
    if(this.state.statusUp === 0){
        if(this.state.currentA === this.state.numberOfFloor || this.state.currentB === this.state.numberOfFloor){
            this.setState({statusUp: 1}, function() {this.render()});
        }
    }

    if (
      this.props.directionA !== prevProps.directionA ||
      this.props.directionB !== prevProps.directionB
    ) {
      this.setState({
        directionA: this.props.directionA,
        directionB: this.props.directionB,
      });
    }
   

  }

  makeRequest = (floor, destination) => {
    if(destination===1){
        this.setState({statusUp:0});
    } else {
        this.setState({statusDown:0});
    }
    this.state.selectedFloor(floor,destination);
  }

  render()
    {
    const { directionA, directionB, numberOfFloor } = this.state;
    let dirA;
    switch (directionA) {
      case -1:
        dirA = <Icon name="arrow down"></Icon>;
        break;
      case 1:
        dirA = <Icon name="arrow up"></Icon>;
        break;

      default:
        dirA = <Icon name="arrows alternate horizontal"></Icon>;
        break;
    }

    let dirB;
    switch (directionB) {
      case -1:
        dirB = <Icon name="arrow down"></Icon>;
        break;
      case 1:
        dirB = <Icon name="arrow up"></Icon>;
        break;

      default:
        dirB = <Icon name="arrows alternate horizontal"></Icon>;
        break;
    }

    let btnUp;
    if(this.state.statusUp===1){
        btnUp=<Button onClick={() => this.makeRequest(numberOfFloor, 1)}><Icon name="angle up"> </Icon></Button>;
    } else{
        btnUp=<Button color="red" disabled onClick={() => this.makeRequest(numberOfFloor, 1)}><Icon name="angle up"> </Icon></Button>;
    }

    let btnDown;
    if(this.state.statusDown===1){
        btnDown=<Button color='green' onClick={() => this.makeRequest(numberOfFloor, -1)}><Icon name="angle down"> </Icon></Button>;
    } else{
        btnDown=<Button color="red" disabled  onClick={() => this.makeRequest(numberOfFloor, -1)}><Icon name="angle down"> </Icon></Button>;
    }

    if (numberOfFloor === 0) {
      return (
        <>
          <Segment padded>
            <Label attached="top" style={{ "text-align": "center" }}>
              {" "}
              {numberOfFloor}{" "}
            </Label>
            {dirA}
            {dirB}
            {btnUp}
          </Segment>
        </>
      );
    }

    if (numberOfFloor === 6) {
      return (
        <>
          <Segment padded>
            <Label attached="top" style={{ "text-align": "center" }}>
              {" "}
              {numberOfFloor}{" "}
            </Label>
            {dirA}
            {dirB}
            {btnDown}
          </Segment>
        </>
      );
    }

    return (
      <>
        <Segment padded>
          <Label attached="top" style={{ "text-align": "center" }}>
            {" "}
            {numberOfFloor}{" "}
          </Label>
          {dirA}
          {dirB}
          <Button.Group>
          {btnUp}
            <Button.Or />
        {btnDown}
          </Button.Group>
        </Segment>
      </>
    );
  }
}
