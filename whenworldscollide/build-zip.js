const packager = require('electron-packager');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const appName = require('./package.json').name;

async function packageApp() {
  try {
    const appPaths = await packager({
      dir: '.',
      out: 'out/make',
      platform: process.platform,
      arch: process.arch,
      asar: true,
      overwrite: true,
      icon: path.join(__dirname, 'public', 'icon.ico'), // Optional icon
      extraResources: [
        path.join(__dirname, 'backend')
      ]
    });

    console.log(`Application packaged to: ${appPaths}`);

    const platform = os.platform();
    const arch = os.arch();
    const appDir = path.join(__dirname, 'out', 'make', `${appName}-${platform}-${arch}`);
    const zipPath = path.join(__dirname, 'out', 'make', `${appName}-${platform}-${arch}.zip`);

    let zipCommand = "";

    if (platform === "win32") {
      // Use proper PowerShell string interpolation
      zipCommand = `powershell -Command "Compress-Archive -Path '${appDir}' -DestinationPath '${zipPath}'"`;
    } else if (platform === "darwin" || platform === "linux") {
      zipCommand = `zip -r "${zipPath}" "${appDir}"`;
    }

    console.log(`Executing zip command: ${zipCommand}`); // Important for debugging

    exec(zipCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating zip: ${error}`);
        console.error(`stderr: ${stderr}`); // Log stderr for more details
        return;
      }
      console.log(`Zip created at: ${zipPath}`);
    });

  } catch (error) {
    console.error('Error packaging application:', error);
  }
}

packageApp();