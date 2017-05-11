const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');

const tbl = $('.items');

let cfg = [];


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

ipcRenderer.on('msgReply', (event, cfgData)=>{
  cfg = JSON.parse(cfgData);
});
ipcRenderer.send('getJson', 'cfg');

setTimeout(()=>{
  cfg.pop();
  console.log(JSON.stringify(cfg));


  for (var i = 0; i < cfg.length; i++) {
    console.log(i);
    let clon = $('tr.hidden').clone(true).removeClass('hidden');
    $table.append(clon);
    $('.item').eq(i).html(cfg[i].شرح);
    $('.prc').eq(i).html(cfg[i].قیمت);


  }

},500);



$('.add').click(function(){
  let clon = $('tr.hidden').clone(true).removeClass('hidden');
  $table.append(clon);
});


 $('.deleteRow').click(function () {
  $(this).parents( 'tr').detach();
});

var $table = $('.items');
$table.floatThead({
  position: 'fixed',
  top: 35
});





jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;


$('.confrim').click(function () {
  $table.floatThead('destroy');
  var $rows = tbl.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());

  });

  // Turn all existing rows into a loopable array
  $rows.each(function() {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      if (header != 'undefined' && header != '') {
        h[header] = $td.eq(i).text();

      }
    });

    data.push(h);
  });

  // Output the result
    let pushData = JSON.stringify(data);

    console.log(pushData);
    ipcRenderer.send('DBPush', pushData);
    main.reload();
});

$('.cancel').click(function(){
  remote.BrowserWindow.getFocusedWindow().close();
});


$('.defualt').click(function(){
  ipcRenderer.send('setDefualt', 'd3f4lt.json');
  remote.BrowserWindow.getFocusedWindow().reload();

});




