Text Extraction Project

Required Libraries
Ensure the following libraries are installed for the project to function correctly:

Frontend Libraries
1. Cropper.js
   - Description: Used for cropping images on the client side.
   - Installation:
     html
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css">
     <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
     

2. Tesseract.js
   Description: JavaScript library for OCR, used to extract text from images.
   - Installation:
     html
     <script src="https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4/dist/tesseract.min.js"></script>
     

### Backend Libraries
1. Express.js
   - Description: Web framework for Node.js, used to build the server-side application.
   - Installation:
     bash
     npm install express
     

2. Multer
   - Description: Middleware for handling `multipart/form-data`, primarily used for file uploads.
   - Installation:
     bash
     npm install multer
     

3. Supabase-js
   - Description: Official JavaScript client library for interacting with Supabase.
   - Installation:
     bash
     npm install @supabase/supabase-js
     

4. Tesseract.js
   - Description: JavaScript library for OCR on the server side.
   - Installation:
     bash
     npm install tesseract.js
     

5. Cors
   - Description: Middleware for enabling CORS (Cross-Origin Resource Sharing).
   - Installation:
     bash
     npm install cors
     

6. Path and FS (File System)
   - Description: Node.js core modules for handling file paths and file system operations.
   - No installation required as they are built into Node.js.

Configuration Changes
1. Supabase Configuration:
   - Supabase URL and Key: Replace the placeholders in the server file with actual Supabase URL and key.

2. Port Configuration:
   - Default Port: The server runs on port `3000`. This can be changed if needed by updating the `port` variable in the server file.
   - Example:
     javascript
     const port = process.env.PORT || 3000;
     

3. File Storage Path:
   - Uploads Folder: Ensure that the `uploads` folder exists in the project directory to store uploaded files temporarily.

4. Bucket Name in Supabase:
   - Update the `bucket name` in the upload section of the server code to match the actual bucket name in Supabase storage.
   - Example:
     javascript
     const { data, error } = await supabase.storage
       .from("<YOUR_BUCKET_NAME>")
       .upload(filePath, buffer, { ... });
     

Usage Instructions
1. Frontend:
   - Open the `index.html` file in a web browser to interact with the application.
   - Upload an image, crop it, and click on "Extract Text" to get the text extracted from the image.

2. Backend:
   - Start the server by running:
   bash
     node server.js
   
   - The server will be available at `http://localhost:3000`.

## Notes
- Ensure that the Supabase storage bucket is configured to allow public access for retrieving the uploaded images.
