import { generate_random_array } from "./utils.js";
import { InferenceSession } from "onnxjs";


export async function run_inference(
  session, //InferenceSession,
  sample_input // Tensor
) {
  console.log("running inference");
  const start = new Date();
  console.log("Starting session profiling");
  session.startProfiling();
  const outputData = await session.run([sample_input]); // output data is a promise
  session.endProfiling();
  const outputDataTensor = outputData.values().next().value.data;
  console.log("Output data", outputData);
  console.log("got output");
  console.log("OtputDataTensor :", outputDataTensor)
  const end = new Date();
  const time_taken = end.getTime() - start.getTime();
  console.log("Ran model, Time taken:", time_taken);
  return [time_taken, outputDataTensor];
}

export async function run_model(
  model_path,
  input_shape,
  epochs,
  updateProgress,
  updateLog
) {
  /**
   * Runs model in model path and returs array of inference times
   */
  // backends cpu,wasm,webgl
  // const session = new InferenceSession({ backendHint: "wasm" });
  const profiler_configs = {
    maxNumberEvents: 10000,
    flushIntervalInMilliseconds: 10000,
    flushBatchSize: 32
  };
  const session = new InferenceSession({ Profiler: profiler_configs });

  console.log("New config");
  console.log("New session ", session);
  // load model
  const full_model_path = process.env.PUBLIC_URL + "/" + model_path;
  console.log("Loading model from path ", full_model_path);

  // uncomment to load model from path
  // await session.loadModel(full_model_path);

  let model_file = await fetch(full_model_path);
  model_file = await model_file.blob();
  console.log("MODEL FILE ", model_file);
  await session.loadModel(model_file);
  console.log("model loaded");
  console.log("running input of shape ", input_shape);
  const sample_input = generate_random_array(input_shape);
  var inference_times = [];
  var output_data_tensors = [];
  var i;
  var inferenceTime;
  var outputDataTensor;

  console.log("running epochs :", epochs);
  for (i = 0; i < epochs; i++) {
    try {
      [inferenceTime, outputDataTensor] = await run_inference(session, sample_input);
    } catch (err) {
      console.log("Running failed with ", err);
      console.log("Returning -1");
      inferenceTime = -1;
    }
    inference_times.push(inferenceTime);
    output_data_tensors.push(outputDataTensor)
    console.log("Epoch: " + (i + 1) + " Time taken: " + inferenceTime);
    if (updateLog) updateProgress(1);
  }
  // inference_times = await Promise.all(inference_times);
  console.log("Inference times : ", inference_times);
  console.log("running model done");
  return { inference_times, output_data_tensors };
}
