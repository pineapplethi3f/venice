const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');

const tbl = $('.items');

let debit = [];


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

ipcRenderer.on('debitreply', (event, debData)=>{
  debit = JSON.parse(debData);
});
ipcRenderer.send('getJson', 'debit');

setTimeout(()=>{
  
  console.log(JSON.stringify(debit));


  for (var i = 0; i < debit.length; i++) {
    console.log(i);
    let clon = $('tr.hidden').clone(true).removeClass('hidden');
    $table.append(clon);
    $('.item').eq(i).html(debit[i].name);
    $('.prc').eq(i).html(debit[i].debit);
    $('.deleteRow').eq(i).attr('data', debit[i].id);
    console.log(debit[i].id);




  }

},500);



$('.add').click(function(){
  let count =$('#list tr').length;
  let clon = $('tr.hidden').clone(true).removeClass('hidden');
  clon.find('.deleteRow').attr('data', count-1);
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
    headers.push($(this).attr('data').toLowerCase());

  });

  // Turn all existing rows into a loopable array
  $rows.each(function() {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      if (!(header === undefined) && header != '' && header) {
        if(header=='id'){
        h[header] =$td.eq(i).attr('data'); 
        }else{
        h[header] = $td.eq(i).text();
        }
      }

      
      
    });

    data.push(h);
  });

    data.pop();
  // Output the result
    let pushData = JSON.stringify(data);

    console.log(pushData);
    ipcRenderer.send('change-debit', pushData);
    main.reload();
});

$('.cancel').click(function(){
  remote.BrowserWindow.getFocusedWindow().close();
});






