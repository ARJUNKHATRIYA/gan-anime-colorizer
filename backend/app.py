from flask import Flask, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import generator
import helper
import torch
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Create required folders
# -----------------------------
UPLOAD_FOLDER = "uploads"
FRAGMENTS_FOLDER = "fragments"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAGMENTS_FOLDER, exist_ok=True)

# -----------------------------
# Image Transform
# -----------------------------
target_size = (128, 128)
transform = generator.transforms.Compose([
    generator.transforms.Resize((128, 128)),
    generator.transforms.ToTensor(),
])

# -----------------------------
# Load GAN Model (SAFE VERSION)
# -----------------------------
model_path = os.path.join("model", "checkpoint24.pth")

if os.path.exists(model_path):
    print("Loading model from:", model_path)

    checkpoint = torch.load(
        model_path,
        map_location=torch.device("cpu")
    )

    generator.gen.load_state_dict(checkpoint["model_state_dict"])
    generator.opt_gen.load_state_dict(checkpoint["opt_gen_state_dict"])
    epoch = checkpoint["epoch"]

    generator.gen.eval()
else:
    print("⚠️ Model file not found:", model_path)

# -----------------------------
# API Endpoint
# -----------------------------
@app.route("/process", methods=["POST"])
def process_image():

    if "file" not in request.files:
        return "No file part", 400

    file = request.files["file"]

    if file.filename == "":
        return "No selected file", 400

    filename = secure_filename(file.filename)
    img_path = os.path.join(UPLOAD_FOLDER, filename + ".png")
    file.save(img_path)

    print("Image saved:", img_path)

    # -----------------------------
    # Processing Pipeline
    # -----------------------------
    helper.breakIntoPieces()
    helper.colorise(generator.gen)
    helper.reconstruct()

    # IMPORTANT: Output image path
    output_path = "return.png"

    if not os.path.exists(output_path):
        return "Output image not generated", 500

    # -----------------------------
    # Send Result
    # -----------------------------
    response = send_file(
        output_path,
        mimetype="image/png",
        as_attachment=True,
        download_name="result.png"
    )

    # OPTIONAL CLEANUP (SAFE)
    try:
        helper.delete_all_files_in_folder("uploads")
        helper.delete_all_files_in_folder("fragments")
    except Exception as e:
        print("Cleanup error:", e)

    return response

# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(debug=False, host="0.0.0.0", port=port)