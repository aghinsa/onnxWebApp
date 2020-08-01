export const models = [
  {
    id: "resnet_v1.5_224",
    title: "Resnet50 V1.50",
    description: "Resnet50 V1.50,size 224",
    shape: [1, 3, 224, 224],
    saved_model: "resnetv1.5_224.onnx"
  },
  {
    id: "mobilenet_v1_224",
    title: "MobileNet V1 224",
    description: "MobileNet V1,size 224",
    shape: [1, 3, 224, 224],
    saved_model: "mobilenetv1_224.onnx"
  },
  {
    id: "ssd_resnet34_1200",
    title: "SSD ResNet34 1200",
    description: "SSD ResNet34 ,size 1200",
    shape: [1, 3, 1200, 1200],
    saved_model: "ssd_resnet34_1200_patch.onnx"
  },
  {
    id: "ssd_mobileNet_v1_300",
    title: "SSD MobileNet 300",
    description: "SSD MobileNet 300 ,size 1200",
    shape: [1, 3, 300, 300],
    saved_model: "ssd_mobilenetv1_300_patch.onnx"
  }
];
