const remote = require('electron').remote;
const main = remote.require('./main.js');
const {ipcRenderer} = require('electron');


const tbl = $('.inovic')
const table = document.querySelector('.bdy');
var $TABLE = $('.bdy');
const clon = document.querySelector('.clon');
let sumall = 0;


let btnClose = document.querySelector('.close');
btnClose.addEventListener('click', ()=>{
  ipcRenderer.send('close-app');
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

let btnNav = document.querySelector('.navic');
btnNav.addEventListener('click', ()=>{
  document.getElementById('navDrawer').style.width = '250px';
  document.getElementById('pop-ovrly').style.visibility = 'visible';
  document.getElementById('pop-ovrly').style.opacity = '1';
},false);


let btnNVClose = document.querySelector('.nvcls');
btnNVClose.addEventListener('click', ()=>{
  document.getElementById('navDrawer').style.width = '0px';
  document.getElementById('pop-ovrly').style.visibility = 'hidden';
  document.getElementById('pop-ovrly').style.opacity = '0';

}, false);


let btnNVSetting = document.querySelector('.setting');
btnNVSetting.addEventListener('click', ()=>{
  main.openWindow(btnNVSetting.attributes['data-name'].value + '.html');
});



let btnNVUpdate = document.querySelector('.updt');
btnNVUpdate.addEventListener('click', ()=>{
  remote.dialog.showMessageBox({title:"update", message: "در حال استفاده از آخرین نسخه هستید", buttons: ["OK"] });
});

let btnNVAbout = document.querySelector('.about');
btnNVAbout.addEventListener('click', ()=>{
  main.openWindow(btnNVAbout.attributes['data-name'].value + '.html');
});


let btnExport = document.querySelector('.exp');
btnExport.addEventListener('click', ()=>{
  main.openOut(btnExport.attributes['data-name'].value + '.html');
});


// let addRow = document.querySelector('.add');
// addRow.addEventListener('click', ()=>{
//   let row = clon.cloneNode(true);
//   row.removeAttribute('class');
//   table.appendChild(row);
//   let rmwRow = document.querySelector('.rowdlt');
//   rmwRow.addEventListener('click',()=>{
//     table.deleteRow(this);
//   }, false);
//
//
//
// },false);



// let item = document.getElementById('auto');
// let awesomplete = new Awesomplete(item, {
//   minChars:2,
//   autoFirst: true,
//   list: ["چاپ عکس3در4", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"]
// });

// ipcRenderer.send('checkPay', 'https://api.myjson.com/bins/14scix');



$('.add').click(function () {
  var $clone = $('tr.clon').clone(true).removeClass('clon');
  $TABLE.append($clone);

  $('.item-srch').autocomplete({
    lookup: list,
    autoSelectFirst: true,
    forceFixPosition: true,
    onSelect: function(suggestion){
      $(this).parents('tr').find('.prc').html(suggestion.data + 't');


    }
  });


});


let list = [
  { value: 'عکس ۳x۴', data: '2000'},
  { value: 'عکس ۴x۶', data: '4500'},
  { value: 'عکس ۱۰x۱۵', data: '6000'},
  { value: 'Local', data: 'LC'}

];

ipcRenderer.on('msgReply', (event, srchData)=>{
  var map = {
   شرح: 'value',
   قیمت: 'data'
};
  srchData = srchData.replace(/شرح|قیمت/gi, (matched)=>{
    return map[matched];
  })
  list = JSON.parse(srchData);
});
ipcRenderer.send('getJson', 'cfg');


setTimeout(()=>{
  $('.item-srch').autocomplete({
    lookup: list,
    autoSelectFirst: true,
    forceFixPosition: true,
    onSelect: function(suggestion){
      $(this).parents('tr').find('.prc').html(suggestion.data + 't');

    }

  });
}, 500);


$('.num').keyup(function(){
  let prc = parseInt($(this).parents('tr').find('.prc').html());
  let num = parseInt($(this).html());
  sumall += prc * num;
  if(isNaN(sumall)){

    sumall = prc * num;
  }
  console.log(sumall);

  $(this).parents('tr').find('.sum').html(prc * num);
    let container = 0;
  $('.sum').each(function(i){
    let tmp = parseInt($(this).html());
    if(!isNaN(tmp)){
      container += tmp;
    }
  });
  console.log(container);
  $('#sumall').val(container);

});


$('.sum').keyup(function(){
  let container = 0;
  $('.sum').each(function(i){
    let tmp = parseInt($(this).html());
    if(!isNaN(tmp)){
      container += tmp;
    }
  });
  console.log(container);
  $('#sumall').val(container);


});


 $('.rowdlt').click(function () {
  $(this).parents('tr').detach();
  $(this).parents('tr').find('.item-srch').autocomplete().dispose();
});


//
// let options = {
//   data: ["shit", "blah", "blah blah", "holyfrog"],
//   list: {
//
// 		match: {
// 			enabled: true
// 		}
// 	},
//   theme: "plate-dark",
//   autocompleteOff: false
// };
//
//
// $('#auto').easyAutocomplete(options);

$(document).ready(function(){
  $('#datepick').pDatepicker({
    persianDigit: true,
    format: 'YYYY/MM/DD'

  });
});

//export section

jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$('.exp').click(function () {
  var $rows = tbl.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      if (header=='شرح') {
        h[header] = $td.eq(i).parents('tr').find('.item-srch').val()

      }else if (header != 'undefined' && header != ' ') {
        h[header] = $td.eq(i).text();

      }
    });
    
    
    data.push(h);
  });
  let info = {};
  info['name'] = $('#clnt').val();
  info['date'] = $('#datepick').val();
  info['sumall'] = $('#sumall').val();
  data.pop();
  data.push(info);
  let expData = JSON.stringify(data);
  // Output the result
  console.log(expData);
  ipcRenderer.send('export', expData);

});