const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const ipcMain = require('electron').ipcMain;
const dialog = require('electron').dialog;
const fs = require('fs');
const fse = require('fs-extra')
const {net} = require('electron');
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');




// const log = require('electron-log');
const backup = app.getPath('userData');
const tmp = path.join(__dirname, '/app/config/');
const config = path.join(process.resourcesPath, '/config/');
const bcDeb = path.join(config, 'debit.json')
const idx = path.join('file://', __dirname, '/app/index.html');
const cfg = path.join('file://', __dirname, '/app/');
const lockap = path.join('file://', __dirname, '/app/locked.html');

let upStatWin = null;
let win = null;
let container = [];


const filterFunc = (src, dest) => {
  let result = src.endsWith('venice');
  return result;
}
let locked = false;
let fRun = fs.readFileSync(path.join(config, 'firstRun.json'));
fRun = JSON.parse(fRun);
let shit = fs.readFileSync(path.join(config, 'locked.json'));
shit = JSON.parse(shit);
if(shit.locked == 'true'){
  locked = true;
}else{
  locked = false;
}
// log.info('shhhh');

if(fRun.firstRun){
    fse.copy(path.join(backup,'debit.json'), path.join(config,'debit.json'),(err)=>{
      if (err) {console.error(err);}
    });
    fse.copy(path.join(backup,'cfg.json'), path.join(config,'cfg.json'),(err)=>{
      if (err) {console.error(err);}
    });

    console.log('fuckit');
    
  }else{
    console.log('comon');
}


app.on('ready', ()=> {
  
  
  
  win = new BrowserWindow({width:900, height: 700, frame:false});
  if (shit.locked == 'true') {
    win.loadURL(lockap);
  }
  else {
    win.loadURL(idx);
    win.webContents.openDevTools();
  }

  if(fRun.firstRun){
    openChLog('changelog.html');
    fRun.firstRun = false;
    fs.writeFile(path.join(config, 'firstRun.json'),JSON.stringify(fRun),(err)=>{
      if(err){
        console.error(err);
      }
    });
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


fse.copy(config, path.join(backup, '/config/'), err => {
  if (err) return console.error(err)
  console.log('success!');
});



});




openChLog = (page) => {
  let changeLog = new BrowserWindow({width:900, height: 1200, frame:false, resizable:false});
  changeLog.loadURL(cfg + page);
}



exports.openWindow = (page) => {
  let winchld = new BrowserWindow({width:900, height: 1200, frame:false});
  winchld.loadURL(cfg + page);
  winchld.webContents.openDevTools();

}

exports.openOut = (page) =>{
  let outwin = new BrowserWindow({width:800, height: 1200, frame:true, resizable:false});
  outwin.loadURL(cfg + page);
  outwin.setMenuBarVisibility(false);
  outwin.webContents.openDevTools();

}

openUpdate = (state) =>{
  upStatWin = new BrowserWindow({width:600, height: 800, frame:false, resizable:false});
  upStatWin.loadURL(cfg + 'update.html');
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
  }else if(selector == 'debit'){
    fs.readFile(path.join(config, 'debit.json'), (err, data)=>{
      if(err){
        console.error(err);
      }
      let handle = data.toString();
      event.sender.send('debitreply', handle);
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


ipcMain.on('change-debit', (event, dData)=>{
  fs.writeFile(path.join(config, 'debit.json'), dData, (err)=>{
    if(err){
      console.error(err);
    }
  });


});




//loading config 


ipcMain.on('open-update', (event, state)=>{
  openUpdate(state);
  autoUpdater.checkForUpdates();
  // upStatWin.webContents.openDevTools();
  
});


autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  autoUpdater.quitAndInstall();
});



autoUpdater.on('checking-for-update', () => {
  if(upStatWin == null){
    console.log('shit');
  }else{
    upStatWin.webContents.send('update-stat', 'checking-for-update');

  }
  
});

autoUpdater.on('update-available', (ev, info) => {
  if(upStatWin == null){
    console.log(info);
  }else{
    upStatWin.webContents.send('update-stat', 'update-available');

  }
});
autoUpdater.on('update-not-available', (ev, info) => {
  if(upStatWin == null){
    console.log(info);
  }else{
    upStatWin.webContents.send('update-stat', 'update-not-available');

  }
});
autoUpdater.on('error', (ev, err) => {
  if(upStatWin == null){
    console.error(err);
  }else{
    upStatWin.webContents.send('update-stat', 'error');

  }
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  if(upStatWin == null){
    console.log('progressObj');
  }else{
    upStatWin.webContents.send('update-stat', ' -progress');

  }
});


app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});





