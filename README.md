# File Upload to a server using Formidable

Formidable is "A Node.js module for parsing form data, especially file uploads."
It is an popular npm package for uploading files to a server. Around 8 million downloads happens per week. In this article I will demonstrate a way to upload files in server using formidable version 3. 
This article explores how to use formidable version 3 inorder to upload file to a server.


## Installing required packages

First we need to install required packages for the application.

```bash
  npm install express formidable@3 ejs 

```
The application directory should look like: 

```
main-directory
│   README.md
│   app.js  
|   package.json
│   package-lock.json
|   
└───views
│   │   index.ejs

```



    
## Importing package :

We need express,formidable,nodejs file system and url. 

```bash
  import express from 'express';
  import fs from 'node:fs';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import { IncomingForm } from 'formidable';

```
To run the app we need to include below line in the package.json file

```bash
  "type": "module"

```

## Configuration the app:

For parsing data we are using built-in express parser express.json(). Also We need to set ejs as view engine .

``` bash
//defining app 
const app = express();

//configuring json parser 
app.use(express.json());

//set ejs as view engine 
app.set('view engine', 'ejs');

//Finding the present working directory. We need this at while saving the file in server. 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### Start the Server and Routes: 
App is listening at port 3400. Best practice is use .env file and use a callback function in app.liste() to see if there is any error while running the app.
```bash
  //listeninng to port 3400
  app.listen(3400);

```
The index file is in views folder. The directory name should be views. Otherwise the Ejs will invoke error. However we can set other directory by configuring ejs. 
```bash
  // rendering home page
  app.get('/', (req, res) => {
  res.status(200).render('index');
});

```

Inside the index.ejs file is [ The HTML content is collected from the npm formidable ]

```bash
  <div style="width:800px; margin:0 auto;" >
  <h2> File upload Using Formidable </h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <!--<div>Text field title: <input type="text" name="title" /></div> --> 
      <div>File: <input type="file" name="myfiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
</div>

```

At the sumition of upload it invoke a post request to the upload route

```bash
  app.post('/upload', upload);

```
In the next section we will explore the main upload function that upload and save file in the server.






## Uploading in Server: 

Let initiate the upload directory first. If the upload directory does not exists first create the directory.

```bash
  const uploadDir = path.join(__dirname + '/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,'0777', true);

```
Now a have look to official readme file of formidable. 
```
    app.post('/api/upload', (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
        next(err);
        return;
        }
        res.json({ fields, files });
    });
    });

```

First we need to initiate a form. There are options that can can be set by passing object to fomidable [ 👉️ const form = formidable({ multiples: true });]. For example we can set multiple files true in order to upload more than one files, maximum file size and many more. The set of options are stated in the official site.
For our app we are setting upload directory,maximum file size , keep extension of files, empty files and also a filter function. The filter function is discussed later. First look at the custom options for initiating the form. 

```bash
    const customOptions = { uploadDir: uploadDir , keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: true ,filter: filterFunction };
```

Now lets initiate the form in our app.js file 

```bash
    const form = new IncomingForm(customOptions);

```

Lets see the form object. you will have clear understanding how we replace the default setting using the custom otions.

```bash
    console.log(form)
```
```
    IncomingForm {
    _events: [Object: null prototype] { field: [Function (anonymous)] },
    _eventsCount: 1,
    _maxListeners: undefined,
    options: {
        maxFields: 1000,
        maxFieldsSize: 20971520,
        maxFiles: Infinity,
        maxFileSize: 5368709120,
        maxTotalFileSize: 5368709120,
        minFileSize: 1,
        allowEmptyFiles: false,
        keepExtensions: true,
        encoding: 'utf-8',
        hashAlgorithm: false,
        uploadDir: '/home/runner/Formidable-file-upload/uploads',
        enabledPlugins: [
        [Function: plugin],
        [Function: plugin],
        [Function: plugin],
        [Function: plugin]
        ],
        fileWriteStreamHandler: null,
        defaultInvalidName: 'invalid-name',
        filter: [Function: filterFunction],
        filename: undefined,
        multiples: true
    },
    uploaddir: '/home/runner/Formidable-file-upload/uploads',
    uploadDir: '/home/runner/Formidable-file-upload/uploads',
    error: null,
    headers: null,
    type: undefined,
    bytesExpected: null,
    bytesReceived: null,
    _parser: null,
    req: null,
    _getNewName: [Function (anonymous)],
    _flushing: 0,
    _fieldsSize: 0,
    _totalFileSize: 0,
    _plugins: [
        [Function: bound plugin],
        [Function: bound plugin],
        [Function: bound plugin],
        [Function: bound plugin]
    ],
    openedFiles: [],
    ended: undefined,
    [Symbol(kCapture)]: false
    }

```

Now the form can start to parse data from the request [👉️ form.parse(req, (err, fields, files) ]. It is a callback appoach. It takes request and run a callback function. The call back function takes three argument error,field and file. The order should be the same. If we use console.log(file) we can see different attributes of the file. File path where it saved,file name, size and many more. 
Lets see what it return in file when the route upload invokes.

```
    {
    myfiles: [
        PersistentFile {
        _events: [Object: null prototype],
        _eventsCount: 1,
        _maxListeners: undefined,
        lastModifiedDate: 2022-12-05T17:18:37.994Z,
        filepath: '/home/runner/Formidable-file-upload/uploads/1352c3f06b5cfcf8bd70ff000.png',
        newFilename: '1352c3f06b5cfcf8bd70ff000.png',
        originalFilename: 'profileGithub.png',
        mimetype: 'image/png',
        hashAlgorithm: false,
        size: 216948,
        _writeStream: [WriteStream],
        hash: null,
        [Symbol(kCapture)]: false
        }
    ]
    }

```

It returns an object consists of an array. The name of the array here is myfiles. Note that the name is set as we named the form as myfiles in ejs file [ 👉️ div>File: <input type="file" name="myfiles" multiple="multiple" /></div> ]. 
See the filepath is the uploads directory. The name filename is encoded and saved as random name. So we need to change the name as our requirement. The original file name is the name of the file we uploaded. We can filter the filetype using mimetype.
Good understading of parsing the file? 

Now lets change the file as the original name. 

```bash
    file.myfiles.forEach((file) => {
        const newFilepath = `${uploadDir}/${file.originalFilename}`;
        fs.rename(file.filepath, newFilepath, err => err);
      });
      return res.status(200).json({ message: ' File Uploaded ' });

```

This code works for multiple file uploads. Note that the myfiles returned as array in version 3, But it is an object in formidable version 2. Then the code need to be changed as per the returned my files. 

### The filter function: 
Remember we set a filter function in customOptions? The filter function is 
```bash
    const filterFunction = ({ name, originalFilename, mimetype }) => {
      if (!(originalFilename && name)) return 0;
      return 1;  // return mimetype && mimetype.includes("image"); uncomment for uploading only image file
    };

```
The function takes three arguaments,the form name, original file and mimetype. We can set the function so that no unexpected upload happens. Some times the client can submit the form without selecting file. If there is no file slection the API should return a message. 
we 

```
    if (!file.myfiles) return res.status(401).json({ message: 'No file Selected' });

```






## The full code: 

```bash

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
        console.log(file)
        if (err) throw err;

        if (!file.myfiles) return res.status(400).json({ message: 'No file Selected' });
        file.myfiles.forEach((file) => {
            const newFilepath = `${uploadDir}/${file.originalFilename}`;
            fs.rename(file.filepath, newFilepath, err => err);
        });
        return res.status(200).json({ message: ' File Uploaded ' });


        });

    }
    catch (err) {
        res.status(400).json({ message: 'Error occured', error: err });
    }

    }

    // rendering home page
    app.get('/', (req, res) => {
    res.status(200).render('index');
    });

    app.post('/upload', upload);


    //listeninng to port 3400
    app.listen(3400);


```
You can find the full code in https://replit.com/@almamunkhan09/Formidable-file-upload and my github repository https://github.com/almamunkhan09/Formidable-file-upload.
The code is developed in Browser IDE replit. Its an excellent tool for developement https://replit.com/. 

## Feedback: 

Please write a feedback if the article needs a revision. If you like it you can appreciate the work by staring in github repo. 