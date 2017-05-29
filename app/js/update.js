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

let upStat = document.querySelector('.stat');
ipcRenderer.on('update-stat', (event, stat)=>{
    switch (stat) {
        case 'checking-for-update':
            upStat.innerHTML = '...در حال بررسی آپدیت';
            console.log('checking');
            break;

        case 'update-available':
            upStat.textContent = '.نسخه جدید یافت شد';
            console.log('found');

            break;

         case 'update-not-available':
            upStat.textContent = '.در حال استفاده از آخرین نسخه هستید';
            console.log('not found');

            
         case 'error':
            upStat.textContent = 'خطا در آپدیت،با توسعه دهنده تماس بگیرید';
            console.log('err');

        case 'download-progress':
            upStat.textContent = 'در حال دریافت ...';
            console.log('dl');
            break;                  
        case 'update-downloaded':
            $('.install').show();
        default:
            break;
    }
});