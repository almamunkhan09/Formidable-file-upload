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

Now the form can start to parse data from the request [👉️ form.parse(req, (err, fields, files) ]. It is a callback appoach. It takes request and run a callback function. The call back function takes three argument error,field and file. The order should be the same. If we use console.log(file) we can see different attributes of the file. File path where it saved,file name, size and many more.  

