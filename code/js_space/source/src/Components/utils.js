import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import { run_model } from "./model_helper.js";
import { std, mean } from "mathjs";
import { Hook, Console, Decode } from "console-feed";
import React, { Fragment } from "react";
import { Paper } from "@material-ui/core";

export function generate_random_array(
  shape,
  as_tensor = true,
  data_type = "float32"
) {
  const len = shape.reduce((a, b) => a * b, 1);
  const data = ndarray(new Float32Array(len));
  ops.random(data);
  const arr = ndarray(data, shape);
  const tensor = new Tensor(arr.data.data, data_type, shape);
  if (as_tensor) return tensor;
  return arr;
}

export async function handleModelClickSingle(model, epochs, downloadAfterRun) {
  let updateProgress = function (x) {
    return x;
  };
  const { shape, saved_model } = model;
  const { inference_times, output_data_tensors } = await run_model(
    saved_model,
    shape,
    epochs,
    updateProgress,
    false // dont call update progress
  );
  console.log("handling model click done ,", inference_times);
  const inf_data = {
    inference_times: inference_times,
    mean: mean(inference_times),
    std: std(inference_times),
    output_data_tensors: output_data_tensors
  };
  console.log("Inference Data for model " + model.title + " data: ", inf_data);
  console.log("Should save data?:", downloadAfterRun)
  if (downloadAfterRun) {
    const inf_data_json = JSON.stringify(inf_data)
    let jsonContent = "data:text/json;charset=utf-8," + inf_data_json
    var encodedUri = encodeURI(jsonContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "log.json");
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  return inf_data;
}

export async function handleModelClick(model, epochs, updateProgress) {
  const { shape, saved_model } = model;
  const { inference_times, output_data_tensors } = await run_model(
    saved_model,
    shape,
    epochs,
    updateProgress,
    true // Call update progress
  );
  console.log("handling model click done ,", inference_times);
  const inf_data = {
    inference_times: inference_times,
    mean: mean(inference_times),
    std: std(inference_times)
  };
  console.log("Inference Data for model " + model.title + " data: ", inf_data);
  return inf_data;
}

export async function handleRunAllClick(models, epochs, updateProgress) {
  var csv_data = [];

  async function get_model_data_as_csv(model) {
    console.log("Getting model csv :", model);
    const inf_data = await handleModelClick(model, epochs, updateProgress);
    console.log("In runAll inf_data :", inf_data);
    // model_name,mean,std,...timings
    const csv_string = [
      model.id,
      inf_data.mean,
      inf_data.std,
      ...inf_data.inference_times
    ].join(",");
    return csv_string;
  }

  await Promise.all(
    models.map(async model => {
      const csv_string = await get_model_data_as_csv(model);
      csv_data.push(csv_string);
      console.log("Csv string for " + model.title + " : ", csv_string);
    })
  );

  console.log("got all csv strings,csv data", csv_data);

  function range(count, start) {
    return [...Array(count).keys()].map(x => start + x);
  }

  const epoch_heading = range(epochs, 1)
    .map(x => "epoch_" + x)
    .join(",");
  const heading = "model,mean,std," + epoch_heading;
  let csvContent =
    "data:text/csv;charset=utf-8," + heading + "\n" + csv_data.join("\n");
  return csvContent;
}

export class ConsoleLogger extends React.Component {
  state = {
    logs: []
  };

  componentDidMount() {
    Hook(window.console, log => {
      this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }));
    });

    console.log(`Logging to console`);
  }

  render() {
    return (
      <Fragment>
        <Paper>
          <div
            style={{
              backgroundColor: "#242424",
              height: 250,
              overflowY: "auto"
            }}
          >
            <Console logs={this.state.logs} variant="dark" />
          </div>
        </Paper>
      </Fragment>
    );
  }
}
