# Use the Stereolabs ZED base image with NVIDIA runtime support


FROM stereolabs/zed:4.1-tools-devel-l4t-r36.3
#4.1-devel-jetson-jp6.0.0, 4.1-devel-l4t-r36.2
# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install essential packages
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git

RUN apt install -y\
   xdg-user-dirs uuid-runtime libgstreamer1.0-0 gstreamer1.0-libav libgstrtspserver-1.0-0 gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio libgstreamer1.0-dev libgstrtspserver-1.0-dev libgstreamer-plugins-base1.0-0 libgstreamer-plugins-base1.0-dev libgstreamer-plugins-good1.0-0 libgstreamer-plugins-good1.0-dev libgstreamer-plugins-bad1.0-0 libgstreamer-plugins-bad1.0-dev

RUN git clone https://github.com/stereolabs/zed-gstreamer.git /usr/local/zed-gstreamer

# Set environment variables for CUDA
ENV PATH=/usr/local/cuda/bin:$PATH
ENV LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH

# Build and install the ZED GStreamer plugin
WORKDIR /usr/local/zed-gstreamer
RUN mkdir build && cd build && \
    cmake -DCMAKE_BUILD_TYPE=Release -DCUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/stubs/libcuda.so .. && \
    make && \
    make install

# Expose the RTSP port
EXPOSE 8554

# Command to start the RTSP server
CMD ["gst-zed-rtsp-launch", "zedsrc", "!", "videoconvert", "!", "video/x-raw, format=(string)I420", "!", "x264enc", "!", "rtph264pay", "pt=96", "name=pay0"]
