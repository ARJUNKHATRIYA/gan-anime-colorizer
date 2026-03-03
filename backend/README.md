---
title: gan-anime-colorizer
emoji: 🎨
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# gan-anime-colorizer

This project provides a Docker-based Flask API for anime colorization using a Pix2Pix GAN model.


## gan-anime-colorizer Backend

gan-anime-colorizer is a backend system that automatically converts grayscale manga or anime panels into colored images. It uses a Pix2Pix GAN architecture to process uploaded images, divide them into smaller fragments, apply intelligent colorization, and reconstruct the final enhanced result.

## Features

* **Pix2Pix GAN Model**: Transforms grayscale anime or manga panels into colored outputs using a trained generator and discriminator.
* **Image Fragmentation**: Breaks large manga pages into smaller panels for more accurate processing.
* **Automated Colorization**: Applies GAN-based color prediction to every fragment.
* **Image Enhancement**: Improves contrast, saturation, and overall visual clarity after colorization.
* **Reconstruction Pipeline**: Combines processed fragments back into a complete image.
* **REST API Support**: Flask API endpoint that allows users to upload images and receive results programmatically.

## Project Structure

* `app.py`: Flask server handling the `/process` API route for image uploads.
* `generator.py`: Defines the GAN generator and loads pretrained weights.
* `helper.py`: Contains utilities for fragmenting, colorizing, enhancing, reconstructing, and cleaning temporary data.
* `main.ipynb`: Notebook used for model training, testing, and experimentation.
* `model/`: Stores trained GAN checkpoints.
* `uploads/`: Temporary directory for incoming and processed images.
* `fragments/`: Stores intermediate image fragments during processing.

## Processing Pipeline

1. **Upload** – A grayscale manga or anime page is uploaded through the `/process` API.
2. **Fragmentation** – The image is divided into smaller panels for detailed processing.
3. **GAN Colorization** – Each fragment is colorized using the trained Pix2Pix generator.
4. **Post-Processing** – Visual quality is improved through enhancement steps.
5. **Reconstruction** – All fragments are merged back into one final image.
6. **Cleanup** – Temporary files are removed automatically.
7. **Delivery** – The final colored image is returned to the user.

## Quick Start

1. Install required dependencies:

   ```bash
   pip install -r requirements.txt
   ```
2. Place the trained model checkpoint inside the `model/` directory (example: `checkpoint24.pth`).
3. Start the Flask server:

   ```bash
   python app.py
   ```
4. Send grayscale anime or manga images to the `/process` endpoint to receive colorized outputs.

## Notes

* The GAN model is trained on 128×128 grayscale manga panels.
* Training experiments and model development steps are available in `main.ipynb`.
* Higher quality segmented images generally produce better colorization results.

---

**Author:** Arjun Khatriya
