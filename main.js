const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const ipcMain = require('electron').ipcMain;
const dialog = require('electron').dialog;
const fs = require('fs');
const {net} = require('electron')



// const log = require('electron-log');
const tmp = path.join(__dirname, '/app/config/');
const config = path.join(process.resourcesPath, '/config/');
const idx = path.join('file://', __dirname, '/app/index.html');
const cfg = path.join('file://', __dirname, '/app/');
const lockap = path.join('file://', __dirname, '/app/locked.html');

let win = null;
let container = [];

let locked = false;
let shit = fs.readFileSync(path.join(config, 'locked.json'));
shit = JSON.parse(shit);
if(shit.locked == 'true'){
  locked = true;
}else{
  locked = false;
}
// log.info('shhhh');



app.on('ready', ()=> {
  
  win = new BrowserWindow({width:800, height: 600, frame:false});
  if (shit.locked == 'true') {
    win.loadURL(lockap);
  }
  else {
    win.loadURL(idx);
    // win.webContents.openDevTools();
  }

  

  const {net} = require('electron')
  const request = net.request('http://crystalcore.herokuapp.com/locked')
  request.on('error', (err)=>{
    console.error(err);
  });
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    response.on('error', (err)=>{
      console.error(err);
    });
    response.on('data', (chunk) => {
      if(response.statusCode == '200')
      console.log(`BODY: ${chunk}`)
      fs.writeFile(path.join(config, 'locked.json'),chunk,(err)=>{
        if(err){
          console.error(err);
        }
      });
    });
    response.on('end', () => {
      console.log('No more data in response.')
    });
  });
  request.end()



});






exports.openWindow = (page) => {
  let winchld = new BrowserWindow({width:900, height: 1200, frame:false});
  winchld.loadURL(cfg + page);
  // winchld.webContents.openDevTools();

}

exports.openOut = (page) =>{
  let outwin = new BrowserWindow({width:800, height: 1200, frame:true, resizable:false});
  outwin.loadURL(cfg + page);
  // outwin.webContents.openDevTools();

}

exports.reload = ()=>{
  win.reload();
}

ipcMain.on('close-app', ()=> {
  app.quit();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('export', (event, cnt) => {
  container = cnt;
  console.log(container);

});

//handle json between procceses
ipcMain.on('getJson', (event, selector) => {
  console.log(selector);
  if (selector == 'out') {
    event.sender.send('msgReply', container);
  }else if (selector == 'cfg') {
    fs.readFile(path.join(config, 'cfg.json'), (err, data)=>{
      if (err) {
        console.error(err);

      }
      let handle = data.toString();
      event.sender.send('msgReply', handle);
      
    });
  }

});

// get scr path from user
ipcMain.on('save-dialog', function (event, fName) {
  const options = {
    title: 'Save an Image',
    defaultPath: fName,
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ]
  }
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', filename);
  });
});

// save new setting

ipcMain.on('DBPush', (event, pData) =>{

  fs.writeFile(path.join(config, 'cfg.json'), pData, (err) =>{
    if (err) {
      console.error(err);

    }
    console.log('shit');
    console.log(path.join(config ,'cfg.json'));
  });
});


ipcMain.on('setDefualt', (event, cFile)=>{
  fs.readFile(path.join(config, cFile), (err, data)=>{
    if (err) {
      console.err(err);
    }
    fs.writeFile(path.join(config, 'cfg.json'), data, (err)=>{
      if(err){
        console.error(err);
      }
    });
  })
});

// ipcMain.on('checkPay', (event, url)=>{
//   const {app} = require('electron')
//   const {net} = require('electron')
//   const request = net.request('url')
//   request.on('response', (response)=>{
//     console.log(`STATUS: ${response.statusCode}`)
//     if(`STATUS: ${response.statusCode}` == '200'){
//       response.on('data', (chunk) => {
//         fs.writeFile(path.join(tmp, 'locked.json'), chunk, (err)=>{
//           if(err){
//             console.error(err);
//           }
//         });
//       });
//       response.on('end', () => {
//       console.log('No more data in response.')
//       });
//     }else{
//       console.log('timed out');
//     }
//       request.end();
//   });


//loading config 



