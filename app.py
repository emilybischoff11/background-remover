from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/remove-background', methods=['POST'])
def remove_background():
    try:
        print("[DEBUG] Received request")
        if 'image' not in request.files:
            print("[ERROR] No image in request.files")
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        print(f"[DEBUG] File received: {file.filename}")
        
        if file.filename == '':
            print("[ERROR] Empty filename")
            return jsonify({'error': 'No file selected'}), 400
        
        # Read the image
        print("[DEBUG] Opening image...")
        input_image = Image.open(file.stream)
        print(f"[DEBUG] Image opened: {input_image.size}, {input_image.mode}")
        
        # Remove background
        print("[DEBUG] Removing background...")
        output_image = remove(input_image)
        print(f"[DEBUG] Background removed: {type(output_image)}")
        
        # Convert to bytes
        print("[DEBUG] Converting to PNG...")
        img_io = io.BytesIO()
        output_image.save(img_io, 'PNG')
        img_io.seek(0)
        print("[DEBUG] Image saved to buffer")
        
        return send_file(img_io, mimetype='image/png')
    
    except Exception as e:
        print(f"[ERROR] Exception occurred: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)