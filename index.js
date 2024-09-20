require('dotenv').config();
const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const spawn = require('child_process').spawn;
const userController = require('./controllers/v1/userController');
const imageController = require('./controllers/v1/imageController');

const app = express();
const port = 8080;
const corsOptions = {
  AccessControlAllowOrigin: '*',
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
});

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage });

app.options('/v1', cors(corsOptions));

app.get('/', (request, response) => {
  response.json({info: 'Node.js, Express, and Postgres API'})
});

app.post('/v1/login', userController.login);
app.post('/v1/signup', userController.signup);

const pythonPackagesProcess = spawn('python3', [
  `${__dirname}/test_packages.py`
]);

pythonPackagesProcess.stdout.on('data', (data) => {
  dataToSend = data.toString();
  console.log('Receiving data from python script...', dataToSend);
});

pythonPackagesProcess.on('close', (code) => {
  console.log(`Closing child process after package installation with code ${code}`);
});

app.post('/v1/batch-process', upload.array('files'), (req, res) => {
  imageController.batchProcess(req, res, __dirname);
});
app.post('/v1/run-test-data', upload.array('files'), (req, res) => {
  imageController.runTestData(req, res, __dirname);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`)
});
