/**
 * Created by Admin on 26.03.14.
 */
'use strict'
var req;
var getTimeUrl;
var timer;
javascript:(/** @version 0.5.2 */function() {document.cookie='XDEBUG_SESSION='+'PHPSTORM'+';path=/;';})();

function init() {
  var btn_runTaimer = document.getElementById("btn_runTaimer");
  var btn_stopTaimer = document.getElementById("btn_stopTaimer");
  var btn_lab1_search = document.getElementById("btn_lab1_search");
  var btn_lab2_search = document.getElementById("btn_lab2_search");
  //еще один вариант добавления события
  btn_runTaimer.onclick =  (function(){runTaimer()});
  btn_stopTaimer.onclick = (function(){clearInterval(timer)});
  //добавление через новую библиотеку
  Event.add(btn_runTaimer,'click', (function(){runTaimer()}))
  Event.add(btn_stopTaimer,'click', (function(){clearInterval(timer)}))
  Event.add(btn_lab1_search,'click',(function(){showBook()}));
  Event.add(btn_lab2_search,'click',(function(){searchBook()}));
}

if(window.addEventListener){
    window.addEventListener("load", init, false);
} else if(window.attachEvent){
    window.attachEvent("onload", init);
} else {
    document.addEventListener("load", init, false);
}

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
}

function showDemo () {
    var url= location.href;
    var request = getXmlHttp();
    request.open("GET", url,false);
    request.send(null);
    alert (request.responseText);
}

function showAsyncRequest () {
    //возможно надо не с 0....
    getTimeUrl = "PHP/gettime.php?delay=0";
    req = getXmlHttp();
    req.onreadystatechange = showAsyncRequestComplete;
    req.open("GET", getTimeUrl, true);
    req.send (null);
}

function showAsyncRequestComplete() {
	 //console.log(req.status);
 	  if (req.readyState == 4) {
	    	if(req.status == 200) {
	 	    	var result = document.getElementById("asyncresult");
							//	console.log('my' +req.responseText);
	 		    result.firstChild.nodeValue = req.responseText;
	     		req = null;
	 	   }
	   }
}

function runTaimer (){
  timer = setInterval(function(){showAsyncRequest()}, 1000);
}

function showBook () {
		var txt = document.getElementById("text_lab1_search");
		  getBookByNumber(txt.value);
}

function getBookByNumber (number) {
	 req = getXmlHttp();
	 req.onreadystatechange = function () {
	 		if (req.readyState == 4) {
 					if(req.status == 200) {
						 	var result = document.getElementById("search_result");
					 		result.firstChild.nodeValue = req.responseText;
				 			req = null;
			 		}
		 	}
	 };
		req.open("GET", 'PHP/getbooks.php?num='+encodeURIComponent(number), true);
		req.send (null);
}

//----------------------------------ЛАБА 2
function searchBook() {
    // Параметры поиска
    var title = document.getElementById("txtTitle").value;
    var author = document.getElementById("txtAuthor").value;
    // Формирование строки поиска
    var searchString = "title=" + encodeURIComponent(title) + "&" + "author=" + encodeURIComponent(author);
    req = getXmlHttp();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                var responseText = new String(req.responseText);
                var books = responseText.split('\n');
                clearList();
                for (var i=0; i< books.length; i++) addListItem(books[i]);
                req = null;
            }
        }
    };
    req.open("POST", 'PHP/searchbooks.php", true);
    req.send (null);
}



