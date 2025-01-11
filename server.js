const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

//supabase config PLEASE REPLACE WITH YOUR SUPBASE URL & KEY 
const supabaseUrl = "https://zvlayyynjpbdanndbhbv.supabase.co";  
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bGF5eXluanBiZGFubmRiaGJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzIyNDQyNiwiZXhwIjoyMDQ4ODAwNDI2fQ.L4B7BGo-LmEha6xgK9-J7Zgla6pyXd6sOyvrsWJKwlY"; // Replace with your actual service role key
const supabase = createClient(supabaseUrl, supabaseKey);

// Enable CORS for cross-origin requests
app.use(cors());

// Configure multer for file uploads (saving images to the "uploads" folder)
const upload = multer({ dest: "uploads/" });

// Serve static files 
app.use(express.static(path.join(__dirname)));

// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the index.html file when accessing the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to handle image upload and text extraction
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { file } = req; // Get the uploaded file from the request

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Received file:", file); 

    // Extracting text using Tesseract.js OCR
    const extractedText = await Tesseract.recognize(file.path, "eng", {
      logger: (m) => console.log(m), 
    }).then((result) => {
      console.log("Tesseract OCR Result:", result); // Log the full OCR result
      return result.data.text; // Extract text from the result
    });

    console.log("Extracted text:", extractedText);

    if (!extractedText) {
      return res.status(400).json({ error: "No text extracted from the image" });
    }

    // Prepare the file for upload to Supabase (convert to buffer)
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const filePath = `${Date.now()}_${file.originalname}`; // Create a unique file name
    console.log("Uploading image to Supabase with file path:", filePath);

    const buffer = fs.readFileSync(file.path); // Read the file as buffer

    // Upload the file to Supabase
    const { data, error } = await supabase.storage
      .from("public1") // Ensure the bucket name is correct
      .upload(filePath, buffer, {
        contentType: file.mimetype, // Set the correct MIME type
        cacheControl: "3600", // Optional: Set cache control
        upsert: false, // Optional: Set upsert to false to prevent overwriting
      });

    if (error) {
      console.error("Supabase upload error:", error); // Log Supabase error
      throw error;
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public1/${data.path}`; // Construct the URL for the uploaded file
    console.log("File uploaded to Supabase:", imageUrl);

    // Clean up the uploaded file after processing
    fs.unlinkSync(file.path);

    // Respond with the extracted text and uploaded image URL
    res.status(200).json({
      message: "Image uploaded and processed successfully",
      extractedText,
      imageUrl, // Include the image URL in the response
    });
  } catch (err) {
    console.error("Error processing image:", err); // Log detailed error
    res.status(500).json({ error: "An error occurred", details: err.message });
  }
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
