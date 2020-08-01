## Running build
* cd `build`
* Files expected in build,the filenames needs to be exact,to change build from source.
    * mobilenetv1_224.onnx
    * resnetv1.5_224.onnx
    * ssd_mobilenetv1_300_patch.onnx
    * ssd_resnet34_1200_patch.onnx
* Run `http-server ./ -c-1 -p 3000` to serve.
* Note to press space after changing number of epochs
* To run each model select the model from the left pane,if download log is checked returns a json file.
* To run all models click `start` on right pane,if download log is checked returns a csv files,if any model fails to run,-1 is returned as inference time.

## Building from source
* cd `source`
* Put onnx models in the `public` folder.
* Update filenames in `src/store.js`.
* Run `npm run build` to export
