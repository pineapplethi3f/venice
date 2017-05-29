const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');




let btnClose = document.querySelector('.close');
btnClose.addEventListener('click', ()=>{
remote.BrowserWindow.getFocusedWindow().close();
}, false);





let btnMin = document.querySelector('.min');
btnMin.addEventListener('click', ()=> {
  if (remote.BrowserWindow.getFocusedWindow().isMinimized()) {
    remote.BrowserWindow.getFocusedWindow().unminimize();
  } else {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
},false);


let btnConf = document.querySelector('.button');
btnConf.addEventListener('click', ()=>{
remote.BrowserWindow.getFocusedWindow().close();
}, false);
