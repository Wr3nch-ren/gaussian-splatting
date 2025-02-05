# Use NVIDIA CUDA base image
FROM nvidia/cuda:11.8.0-devel-ubuntu20.04

# Set the working directory inside the container
WORKDIR /app

# Install required system dependencies and avoid interactive prompts
RUN apt-get update
RUN apt-get -y install wget
RUN apt-get -y install bzip2
RUN apt-get -y install build-essential
RUN apt-get -y install curl
RUN apt-get -y install git
# RUN apt-get -y install cmake
RUN apt-get -y install ninja-build

# Clean up the apt cache
RUN rm -rf /var/lib/apt/lists/*

# Install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh
RUN bash /tmp/miniconda.sh -b -p /opt/conda
RUN rm /tmp/miniconda.sh

# Add Conda to the PATH environment variable
ENV PATH="/opt/conda/bin:$PATH"
ENV LD_LIBRARY_PATH=/usr/local/cuda/lib64:${LD_LIBRARY_PATH}

# Copy the environment file to the working directory
COPY environment.yml .
COPY submodules /app/submodules

# Create the conda environment based on the environment.yml
RUN conda env create -f environment.yml

CMD ["bash", "-c", "source /opt/conda/etc/profile.d/conda.sh && conda activate gaussian_splatting && exec bash"]