const spawn = require('child_process').spawn;
const path = require('path');
const AdmZip = require("adm-zip");

exports.batchProcess = async (req, res, baseImagePath) =>  {
  try {
    let dataToSend;
    const imagePaths = req.files.map(file => `${baseImagePath}/${file.path}`);
    const pythonProcess = await spawn('python3', [
      `${baseImagePath}/test.py`, imagePaths.join(', ')
    ]);

    pythonProcess.stdout.on('data', (data) => {
      dataToSend = data.toString();
      console.log('Receiving data from python script...', dataToSend);
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Closing child process with code ${code}`);
      const zip = new AdmZip();
      zip.addLocalFolder(`${baseImagePath}/tested_images`);
      zip.writeZip(`${baseImagePath}/testing_zip_file.zip`);

      return res.status(200).send(zip.toBuffer());
    });
  } catch(error) {
    return res.status(422).json({ error: 'An error occured while processing image. Our team is working on resovling the issue.' });
  }
};
