import "./App.css";
import React from "react";
import Building from "./component/Building";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfFloor: 6,
      floors: [],
    };
  }
  componentDidMount() {
    const floors = Array.from(Array(this.state.numberOfFloor + 1).keys());
    this.setState({ floors: floors });
  }

  render() {
    return (
      <> 
        <Building  numberOfFloors = {this.state.numberOfFloor} ></Building>
      </>
    );
  }
}

export default App;
