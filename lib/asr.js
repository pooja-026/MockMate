import express, { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 5001;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../client/build')));


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}


interface TranscriptionResponse {
  transcript?: string;
  error?: string;
  details?: string;
}

//@ts-ignore
app.post('/transcribe', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }


  //const pythonScript = path.join(__dirname, '../python/transcribe.py');




  const pythonScript = 'C:\\Users\\USER\\Desktop\\Projects\\Final Year\\tracked\\py-backend\\transcribe.py';


  const pythonProcess = spawn('python', [pythonScript, req.file.path]);

  let transcriptData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    transcriptData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });


  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script error:', errorData);
      return res.status(500).json({
        error: 'Transcription failed',
        details: errorData.trim(),
      });
    }

    res.json({ transcript: transcriptData.trim() });
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
