const spawn = require('child_process').spawn;
const fs = require('fs');
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
      req.files.forEach(file => zip.addLocalFile(`${baseImagePath}/tested_images/${file.filename}`));
      zip.writeZip(`${baseImagePath}/testing_zip_file.zip`);

      return res.status(200).send(zip.toBuffer());
    });
  } catch(error) {
    return res.status(422).json({ error: 'An error occured while processing image. Our team is working on resovling the issue.' });
  }
};

exports.runTestData = async (req, res, baseImagePath) => {
  try {
    const folderPath = `${baseImagePath}/flower_count_test_data/`;
    const zip = new AdmZip(`${baseImagePath}/flower_count_test_data.zip`);
    zip.extractAllTo(folderPath, true);
    const unzippedFiles = await fs.readdirSync(`${folderPath}/test`);
    const mediaFiles = unzippedFiles.filter(file => (
      ['.png', '.svg', '.jpeg', '.jpg', '.gif', '.avif', '.apng', '.webp'].includes(path.extname(file))
    ));
    const unzippedFilePaths = mediaFiles.map(file => `${folderPath}test/${file}`);
    const pythonProcess = await spawn('python3', [
      `${baseImagePath}/test.py`, unzippedFilePaths.join(', ')
    ]);

    pythonProcess.stdout.on('data', (data) => {
      dataToSend = data.toString();
      console.log('Receiving data from python script...', dataToSend);
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Closing child process with code ${code}`);
      const newZip = new AdmZip();
      mediaFiles.forEach(file => newZip.addLocalFile(`${baseImagePath}/tested_images/${file}`));
      newZip.writeZip(`${baseImagePath}/flower_count_test_results.zip`);

      return res.status(200).send(newZip.toBuffer());
    });
  } catch(error) {
    return res.status(422).json({ error: 'An error occured while processing test data. Our team is working on resovling the issue.' });
  }
}
