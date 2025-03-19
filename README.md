# Image Upload API

A Node.js API for uploading, retrieving, and deleting images with image compression.

## Features

- Upload images (JPG, PNG, JPEG formats)
- Store image metadata in MongoDB
- Image compression using Sharp
- Ability to capture images using device camera
- Retrieve images by ID
- Delete images

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Storage**: Local File System

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/image-upload-api
   ```

## Running the Application

1. Make sure MongoDB is running on your system
2. Start the server:
   ```
   npm run dev
   ```
3. The server will start at http://localhost:3000

## API Endpoints

### Upload Image
- **URL**: POST /api/upload
- **Accept**: multipart/form-data
- **Field**: image (file)
- **Response**: JSON object with image details and URL

### Get Image by ID
- **URL**: GET /api/images/:id
- **Response**: JSON object with image details

### Delete Image
- **URL**: DELETE /api/images/:id
- **Response**: Success message

## Web Demo

A simple web demo is included in the `/public` folder. You can access it at http://localhost:3000 when the server is running.

The web demo includes:
- File upload form
- Camera capture for taking photos
- Display of uploaded images

## Image Compression

All uploaded images are automatically compressed using Sharp:
- Resized to a maximum width of 800px
- Converted to JPEG with 80% quality

## Requirements

- Node.js (v14+)
- MongoDB
- Modern web browser (for camera functionality) 