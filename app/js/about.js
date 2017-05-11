const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');






let btnClose = document.querySelector('.close');
btnClose.addEventListener('click', ()=>{
    remote.BrowserWindow.getFocusedWindow().close();
}, false);


let btnMax = document.querySelector('.max');
btnMax.addEventListener('click', ()=>{
  if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
    remote.BrowserWindow.getFocusedWindow().unmaximize();
  } else {
    remote.BrowserWindow.getFocusedWindow().maximize();
  }
}, false);


let btnMin = document.querySelector('.min');
btnMin.addEventListener('click', ()=> {
  if (remote.BrowserWindow.getFocusedWindow().isMinimized()) {
    remote.BrowserWindow.getFocusedWindow().unminimize();
  } else {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
},false);