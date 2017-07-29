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
},false);

let btnNVDebit = document.querySelector('.debit');
btnNVDebit.addEventListener('click', ()=>{
  main.openWindow(btnNVDebit.attributes['data-name'].value + '.html');
},false);

let btnNVUpdate = document.querySelector('.updt');
btnNVUpdate.addEventListener('click', ()=>{
  ipcRenderer.send('open-update', 'clicked');

}, false);

let btnNVAbout = document.querySelector('.about');
btnNVAbout.addEventListener('click', ()=>{
  main.openWindow(btnNVAbout.attributes['data-name'].value + '.html');
},false);


let btnExport = document.querySelector('.exp');
btnExport.addEventListener('click', ()=>{
  main.openOut(btnExport.attributes['data-name'].value + '.html');
},false);


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
      $(this).parents('tr').find('.prc').html(suggestion.data);


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
      $(this).parents('tr').find('.prc').html(suggestion.data);

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



$('.prc').focusout(function(){
  let num = parseInt($(this).parents('tr').find('.num').html());
  let prc = parseInt($(this).html());
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




let debList = [
  { value: 'حمید رحیمی', data: '2000'}
];

let debit = [
  { value: 'حمید رحیمی', data: '2000'}
];
let dIdx = -1;


ipcRenderer.on('debitreply', (event, srchData)=>{
  
  debit= JSON.parse(srchData);
  var map = {
   name: 'value',
   id: 'data'
};
  let cnt = srchData.replace(/name|id/gi, (matched)=>{
    return map[matched];
  })
  debList = JSON.parse(cnt);
});
ipcRenderer.send('getJson', 'debit');


setTimeout(()=>{
  $('#clnt').autocomplete({
    lookup: debList,
    triggerSelectOnValidInput: false,
    autoSelectFirst: false,
    forceFixPosition: true,
    onSelect: function(suggestion){
      console.log(JSON.stringify(debList));
      console.log(suggestion.data);
      dIdx = parseInt(suggestion.data) - 1;
    }
});
}, 500);


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
  if(document.getElementById('c1').checked){
    if(dIdx == -1){
      let temp = {};
      temp['id'] = debit.length + 1;
      temp['name'] = info['name'];
      temp['debit'] = info['sumall'];
      debit.push(temp);
    }else{
      console.log(dIdx);
      console.log(JSON.stringify(debit));
    info['debit'] = debit[dIdx].debit;
    debit[dIdx].debit = parseInt(info['debit']) + parseInt(info['sumall']);
    }

  }

  
  data.pop();
  data.push(info);
  let expData = JSON.stringify(data);
  let debData = JSON.stringify(debit);
  // Output the result
  console.log(expData);
  console.log(debData);
  
  ipcRenderer.send('export', expData);
  ipcRenderer.send('change-debit', debData);
  ipcRenderer.send('getJson', 'debit');
  dIdx = -1;
  $('#clnt').autocomplete().dispose();
  $('#clnt').val('');
setTimeout(()=>{
  $('#clnt').autocomplete({
    lookup: debList,
    triggerSelectOnValidInput: false,
    autoSelectFirst: false,
    forceFixPosition: true,
    onSelect: function(suggestion){
      dIdx = parseInt(suggestion.data) - 1;
    }
});
}, 500);

});


$(function() {
  $('.bdy').on('keydown', '.i', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
})


