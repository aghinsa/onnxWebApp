#!/usr/bin/env bash

git clone https://github.com/qfgaohao/pytorch-ssd.git
patch -s -p0 < patch_pytorch-ssd.patch