/**
 * Created by Admin on 26.03.14.
 */
'use strict'
var req;
var getTimeUrl;
var timer;

function getXmlHttp(){
 if (window.XMLHttpRequest)
 {
     try
     {
         return new XMLHttpRequest();
     }
    catch (e) {}
 }
 else if (window.ActiveXObject)
 {
     try
     {
         return new ActiveXObject('Msxml2.XMLHTTP');
     } catch (e){}
     try
     {
         return new ActiveXObject('Microsoft.XMLHTTP');
     } catch (e) {}
 }
 return null;
};

function showDemo () {
    var url= location.href;
    var request = getXmlHttp();
    request.open("GET", url,false);
    request.send(null);
    alert (request.responseText);
};

function showAsyncRequest () {
    getTimeUrl = "PHP/gettime.php?delay=1";
    req = getXmlHttp();
    req.onreadystatechange = showAsyncRequestComplete;
    req.open("GET", getTimeUrl, true);
    req.send (null);
};

function showAsyncRequestComplete() {
 if (req.readyState == 4){
   if(req.status == 200) {
     var result = document.getElementById("asyncresult");
     result.firstChild.nodeValue = req.responseText;
     req = null;
   }
 }
};

function runTaimer (){
  timer = setInterval(function(){showAsyncRequest()}, 1000);
};

function init() {
    var btn_runTaimer = document.getElementById("btn_runTaimer");
    var btn_stopTaimer = document.getElementById("btn_stopTaimer");
    //добавление события на кнопку;
    /*if(button.addEventListener){
        button.addEventListener("click", function() { alert("alert");}, false);
    } else if(button.attachEvent){
        button.attachEvent("onclick", function() { alert("alert");});
    }*/
    //еще один вариант добавления события
    btn_runTaimer.onclick = (function(){runTaimer()});
    btn_stopTaimer.onclick = (function(){clearInterval(timer)});
};

if(window.addEventListener){
    window.addEventListener("load", init, false);
} else if(window.attachEvent){
    window.attachEvent("onload", init);
} else{
    document.addEventListener("load", init, false);
}


