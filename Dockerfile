# cuda image as base
FROM nvidia/cuda:11-6.1-cudnn8-devel-ubuntu20.04

WORKDIR /app

# Miniconda3
RUN apt-get update && apt-get -y upgrade && apt-get install -y git wget unzip bzip2
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh -b -p /opt/conda
RUN rm Miniconda3-latest-Linux-x86_64.sh

# Set PATH
ENV PATH="/opt/conda/bin:/usr/local/nvidia/bin:/usr/local/cuda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

RUN git clone https://github.com/Wr3nch-ren/gaussian-splatting.git .

WORKDIR /app/gaussian-splatting

# Gaussian Splatting Environment
RUN conda env create -f extra.yml

RUN conda activate gaussian-splatting