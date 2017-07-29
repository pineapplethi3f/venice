const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');

const fs = require('fs');
const path = require('path')


let jsn = [];
let sumWDeb = 0;
let scrImage = Buffer.alloc(2000);

//async fetch json
ipcRenderer.on('msgReply', (event, data)=>{
  console.log(data);
  jsn = JSON.parse(data);
  sumWDeb = parseInt(jsn[jsn.length-1].debit) + parseInt(jsn[jsn.length-1].sumall); 
  console.log(jsn);


});

ipcRenderer.send('getJson', 'out');
//time out to w8 callback complete
 setTimeout(function(){
  console.log(jsn[0].شرح);
  // jsn.pop();

  for (var i = 0; i < jsn.length-1; i++) {
    $('.item').eq(i).html(toPersianNum(jsn[i].شرح));
    $('.num').eq(i).html(toPersianNum(jsn[i].تعداد));
    $('.prc').eq(i).html(toPersianNum(jsn[i].فی));
    $('.sum').eq(i).html(toPersianNum(jsn[i].جمع));

  }

  $('.name').val(jsn[jsn.length-1].name);
  $('.date').val(toPersianNum(jsn[jsn.length-1].date));
  $('.numeric').val(toPersianNum(jsn[jsn.length-1].sumall) + 'تومان');

  $('.al').val(convertNumberToString(jsn[jsn.length-1].sumall) + 'تومان');

  console.log(jsn[jsn.length-1].debit);
  if (!(jsn[jsn.length-1].debit === undefined)) {
    document.getElementById('foot').style.visibility = 'visible';
    $('.debit').val(toPersianNum(jsn[jsn.length-1].debit) + 'تومان');
    $('.sumWDeb').val(toPersianNum(sumWDeb) + 'تومان');

  }
 



}, 500);



//screen shot
let btnScr = document.querySelector('.scr');
btnScr.addEventListener('click', ()=>{
  let date = persianDate().format("MMMM DD YYYY, h,mm,ss a");
  console.log(date);
  ipcRenderer.send('save-dialog', date.toString());
});

$('.button').click(function(){
  $('.button').hide();
})

ipcRenderer.on('saved-file', (event, path) =>{
  if (path) {
    remote.BrowserWindow.getFocusedWindow().webContents.capturePage((image)=>{
    scrImage = image.resize({ // resize
          width: 1800,
          height: 2400,
          quality: 'best'
        }).toJPEG(100);
    console.log(scrImage.toString());
    fs.writeFile(path, scrImage, (err) => {
      if (err) {
        console.error(err);
      }
      console.log(path);
      $('.button').show();

    })
  });
    
  }


   
});


let btnPrnt = document.querySelector('.prnt');
btnPrnt.addEventListener('click', ()=>{
  remote.BrowserWindow.getFocusedWindow().webContents.print({silent: false, printBackground: true});
})



//  for (var i = 0; i < jsn.length; i++) {
//   $('.item').eq(i).html(jsn[i].شرح);
//   $('.num').eq(i).html(jsn[i].تعداد);
//   $('.prc').eq(i).html(jsn[i].فی);
//   $('.sum').eq(i).html(jsn[i].جمع);


//   }


// $('.item').each(function(i){
//   if (i <= jsn.length) {
//     $(this).html(jsn[i].شرح);
//
//   }
// });
