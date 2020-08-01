import React, { Component, Fragment } from "react";
import { Header, Footer } from "./Layouts";
import Models from "./Models";
import { models } from "../store.js";

export default class extends Component {
  state = {
    models: models
  };

  render() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      console.log("File reading okay");
    } else {
      alert("The File APIs are not fully supported by your browser.");
    }
    // run_model("mobilenetv1_224.onnx", [1, 3, 224, 224]);
    return (
      <Fragment>
        <Header />
        <Models models={this.state.models} />
      </Fragment>
    );
  }
}
