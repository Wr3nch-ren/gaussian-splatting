# Use NVIDIA CUDA base image
FROM nvidia/cuda:11.6.2-devel-ubuntu20.04

# Set the working directory inside the container
WORKDIR /app

# Install required system dependencies and avoid interactive prompts
RUN apt-get update && apt-get -y upgrade && DEBIAN_FRONTEND=noninteractive apt-get -y install wget bzip2 build-essential curl git ninja-build unzip ffmpeg gcc g++ gcc-10 g++-10 libgl-dev mono-mcs cmake

# Install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh
RUN bash /tmp/miniconda.sh -b -p /opt/conda

# Add Conda to the PATH environment variable
ENV PATH="/opt/conda/bin:$PATH"
ENV LD_LIBRARY_PATH=/usr/local/cuda/lib64:${LD_LIBRARY_PATH}
ENV CUDA_HOME=/usr/local/cuda

# Copy the environment file to the working directory
COPY dockerenv.yml .
COPY environment.yml .
COPY ./ ./app/
COPY submodules /app/submodules

ENV TORCH_CUDA_ARCH_LIST="3.5;5.0;6.0;6.1;7.0;7.5;8.0;8.6+PTX"

# Create the conda environment based on the environment.yml
RUN conda update -n base conda
RUN conda install -n base conda-libmamba-solver
RUN conda config --set solver libmamba

RUN conda env create -f dockerenv.yml

#RUN conda env create -f environment.yml

RUN conda init bash
SHELL ["conda", "run", "-n", "gaussian_splatting", "/bin/bash", "-c"]
ENV PATH=/opt/conda/envs/gaussian_splatting/bin:$PATH
RUN export PATH=/usr/local/cuda:$PATH
RUN /bin/bash -c "source activate gaussian_splatting"

# Verfiy CUDA inside docker container
RUN nvcc --version

# Install Python packages
RUN pip install --upgrade torch
RUN pip install --verbose submodules/diff-gaussian-rasterization
RUN pip install --verbose submodules/simple-knn

# Uncomment if using newer version code
# RUN pip install --verbose submodules/fused-ssim
# RUN pip install --verbose opencv-python
# RUN pip install --verbose joblib

# Clean up the apt cache and temp conda
RUN rm -rf /var/lib/apt/lists/*
RUN rm /tmp/miniconda.sh

# Activate conda environment for shell
CMD ["bash", "-c", "source /opt/conda/etc/profile.d/conda.sh && conda activate gaussian_splatting && exec bash"]
