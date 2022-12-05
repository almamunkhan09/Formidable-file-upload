//importing required packages 
//dependencies are express formidable
import express from 'express';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';

//Finding the present working directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//defining app 
const app = express();

//configuring json parser 
app.use(express.json());

//set ejs as view engine 
app.set('view engine', 'ejs');

const upload = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname + '/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, '0777', true);
    const filterFunction = ({ name, originalFilename, mimetype }) => {
      if (!(originalFilename && name)) return 0;
      return 1;  // return mimetype && mimetype.includes("image"); uncomment for uploading only image file
    };
    
    const customOptions = { uploadDir: uploadDir, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: true, filter: filterFunction };
    
    const form = new IncomingForm(customOptions);
    
    form.parse(req, (err, field, file) => {
      if (err) throw err;
      if (!file.myfiles) return res.status(401).json({ message: 'No file Selected' });
      file.myfiles.forEach((file) => {
        const newFilepath = `${uploadDir}/${file.originalFilename}`;
        fs.rename(file.filepath, newFilepath, err => err);
      });
      return res.status(200).json({ message: ' File Uploaded ' });
    });
  }
  catch (err) {
    res.status(401).json({ message: 'Error occured', error: err });
  }

}

// rendering home page
app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.post('/upload', upload);


//listeninng to port 3400
app.listen(3400);
