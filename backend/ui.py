import gradio as gr
import torch
from PIL import Image
import numpy as np
from generator import Generator

device = torch.device("cpu")

model = Generator()
checkpoint = torch.load("model/checkpoint24.pth", map_location=device)
model.load_state_dict(checkpoint["model_state_dict"])
model.to(device)
model.eval()

def colorize(image):
    image = image.convert("L")
    image = image.resize((128, 128))

    img_array = np.array(image) / 255.0
    img_tensor = torch.tensor(img_array).unsqueeze(0).unsqueeze(0).float()

    with torch.no_grad():
        output = model(img_tensor)

    output = (output + 1) / 2
    output = output.squeeze().permute(1, 2, 0).numpy()
    output = (output * 255).clip(0, 255).astype(np.uint8)

    return Image.fromarray(output)

demo = gr.Interface(
    fn=colorize,
    inputs=gr.Image(type="pil"),
    outputs=gr.Image(type="pil"),
    title="GAN Anime Colorizer",
    description="Upload grayscale anime image and get colorized output."
)

demo.queue().launch(server_name="0.0.0.0", server_port=7860)