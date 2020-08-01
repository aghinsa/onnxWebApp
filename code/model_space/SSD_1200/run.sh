#!/usr/bin/env bash

git clone https://github.com/qfgaohao/pytorch-ssd.git
mv inference inference-master
patch -s -p0 < patch_inference_master.patch