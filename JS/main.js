/**
 * Created by Admin on 26.03.14.
 */
'use strict'
var req;
var getTimeUrl;
var timer;
javascript:(/** @version 0.5.2 */function() {document.cookie='XDEBUG_SESSION='+'PHPSTORM'+';path=/;';})();

//харосы get and head кешируются браузером
//не передавать в get and head запросах личную инфу и т.п. так как в логах видно что и кто.
//грит типа что если сделать скрипт print_r ($_GET), то выведется содержимое гет даже при посте!тоесть гет заполняется всегда,
// массив пост заполняется только когда передается форма...можно эмулировать заголовком content-type(multipart from data or application x www form urlencode)
// + обязательно content.length
// массив get походу заполняется всегда.


function init() {
  var btn_runTaimer = document.getElementById("btn_runTaimer");
  var btn_stopTaimer = document.getElementById("btn_stopTaimer");
  var btn_lab1_search = document.getElementById("btn_lab1_search");
  var btn_lab2_search = document.getElementById("btn_lab2_search");
  var btn_testConnect = document.getElementById("btn_testConnect");
  var btn_createSpisokBooks = document.getElementById("btn_createSpisokBooks");
  var btn_showBookByCat = document.getElementById("btn_showBookByCat");
  //еще один вариант добавления события
  //btn_runTaimer.onclick =  (function(){runTaimer()});
  //btn_stopTaimer.onclick = (function(){clearInterval(timer)});
  //добавление через новую библиотеку
  Event.add(btn_runTaimer,'click', (function(){runTaimer()}))
  Event.add(btn_stopTaimer,'click', (function(){clearInterval(timer)}))
  Event.add(btn_lab1_search,'click',(function(){showBook()}));
  Event.add(btn_lab2_search,'click',(function(){searchBook()}));
  Event.add(btn_testConnect,'click',(function(){testConnect()}));
  Event.add(btn_createSpisokBooks,'click',(function(){showCategories()}));
  Event.add(btn_showBookByCat,'click',(function(){showBookByCat()}));
}

function testConnect() {
    req = getXmlHttp();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                var resultConnect = document.getElementById("resultConnect");
                resultConnect.firstChild.nodeValue = req.responseText;
                req = null;
            }
        }
       };
    req.open("GET", "PHP/connect.php", true);
    req.send (null);
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
								//console.log('my' +req.responseText);
	 		    result.innerHTML = req.responseText;
	     		req = null;
	 	   }
	   }
}

function runTaimer (){
  timer = setInterval(function(){showAsyncRequest()}, 100);
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

function showCategories() {
    req = getXmlHttp();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                var selCategory = document.getElementById("selCategory");
                // Получим строку ответа
                var responseText = req.responseText;
                // Разделим строку на массив
                var category = responseText.split("\n");
                // Создадим необходимое количество элементов option с кодами категорий
                for (var i = 0; i < category.length; i++){
                    if (category[i] == '') continue;
                    // Разделим строку по символу ":"
                    var parts = category[i].split(":");
                    // Создадим новый элемент option
                    var option = document.createElement("option");
                    	   option.setAttribute("value", parts[0]);
                    //var optionText = document.createTextNode(parts[1]);
                    	   option.innerHTML=parts[1];//тоже самое = appendChild(optionText);
                    selCategory.appendChild(option);
                }
													  	selCategory.size=selCategory.options.length;
                req = null;
            }
        }
    };
    req.open("GET", "PHP/workwithbook.php?typeoper="+encodeURIComponent('getCategory'), true);
    req.send (null);
}
// Класс книга
function Book(author, title, image)
{
    this.author = author;
    this.title = title;
    this.image = image;
}


function showBookByCat() {
    // Параметры поиска
    // Узнаем код выбранной категории
    var selCategory = document.getElementById("selCategory");
    if (selCategory.selectedIndex < 0) {
        alert("Необходимо выбрать категорию в списке");
        return;
    }
    var catId = selCategory.options[selCategory.selectedIndex].value;
    req = getXmlHttp();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                var responseText = req.responseText;
                var c = document.getElementById("div_tableBooks");
														//обнуляем предыдуще загруженные данные
														//притоМ!!! если обнулять так а нетак - innerHTML то все рабит...
                    c.firstChild.nodeValue='';
                // Разделим строку на массив
                // Таблица tableBooks
                var tableBooks = document.getElementById("tableBooks");
                if (responseText.length==0) {
                    while (tableBooks.hasChildNodes())
                        tableBooks.removeChild(tableBooks.lastChild);
                    var c = document.getElementById("div_tableBooks");
                    c.firstChild.nodeValue="Книги не найдены в категории";
                    return;
                }
                var bookStrings = responseText.split("\n");
                // Сформируем и заполним массив books
                // Массив книг указанной категории
                var books = new Array();
                for (var i = 0; i < bookStrings.length; i++){
                    if (bookStrings[i] == "") continue;
                    var parts = bookStrings[i].split("|");
                    books[books.length] = new Book(parts[0], parts[1], parts[2]);
                }
                // Очистка таблицы от предыдущей информации
                while (tableBooks.hasChildNodes())
                    tableBooks.removeChild(tableBooks.lastChild);
                // Заполним таблицу данными по книгам
                var thead = tableBooks.appendChild(document.createElement('thead'));
                var trH = thead.appendChild(document.createElement('tr'));
                var th1 = trH.appendChild(document.createElement('th'));
                    th1.appendChild(document.createTextNode("Автор"));
                var th2 = trH.appendChild(document.createElement('th'));
                    th2.appendChild(document.createTextNode("Название"));
                var tbody = tableBooks.appendChild(document.createElement('tbody'));
                for (var i = 0; i < books.length; i++)
                {
                    // Создадим новый ряд таблицы
                    var tr = tbody.insertRow(tbody.rows.length);//всегда пишем так. индекс доавляемого столюца = макс индексу в табл
                    // Добавим ячейки в строку
                    var tdAuthor = tr.insertCell(tr.cells.length);
                        tdAuthor.appendChild(document.createTextNode(books[i].author));
                    var tdTitle = tr.insertCell(tr.cells.length);
                        tdTitle.appendChild(document.createTextNode(books[i].title));
                    // Добавим подсветку при наведении мышки
                    tr.onmouseover = new Function("trHighLight(this, '#fcc')");
                    tr.onmouseout = (function (){trHighLight(this,'')});//new Function("trHighLight(this, '')");
                    // Сохраним картинку книги в атрибуте title элемента TR
                    tr.title = books[i].image;
                    // Добавим обработку щелчка
                    tr.onclick = new Function("showImage(this)");
                }
                req = null;
            }
        }
    };
    // Метод POST
    var postData = "typeoper="+encodeURIComponent('showBooksByCat')+"&category=" + catId;
    req.open("POST", "PHP/workwithbook.php", true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-Length", postData.length);
    req.send(postData);
}

// Функция подсветки ряда таблицы
function trHighLight(trObject, color)
{
    if (color != "")
        trObject.style.backgroundColor = color;
    else
        trObject.style.backgroundColor = "";
}

// Функция проверки файла на сервере
function isExists(url){
    // Запрос к серверу
    var req = getXmlHttp();
    // Запрашиваем URL методом HEAD в синхронном режиме
    req.open("HEAD", url, false);
    req.send(null);
    // Если файл есть - статус == 200
    return (req.status == 200);
}

// Функция показа картинки
function showImage(trObject){
    // Путь к файлам изображений на сервере
    var imagePath = "images/";
    var image = imagePath + trObject.title;
    var divBookInfo = document.getElementById("divBookInfo");
    var img = divBookInfo.getElementsByTagName("img")[0];

    if (isExists(image)) {
        // Файл есть, покажем картинку
        img.src = image;
        divBookInfo.style.display = "block";
    } else {
        // Файла нет, картинку не показываем
        img.src = "";
        divBookInfo.style.display = "none";
    }
}
//поиск книг
function searchBook() {
    // Параметры поиска
    var title = document.getElementById("txtTitle").value;
    var author = document.getElementById("txtAuthor").value;
    // Формирование строки поиска
    var postData = "typeoper="+encodeURIComponent('searchBook')+"&title=" + encodeURIComponent(title) + "&author=" + encodeURIComponent(author);
    req = getXmlHttp();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                var responseText = new String(req.responseText);
                var books = responseText.split('\n');
                clearList();
														  if (responseText.length==0) {addListItem('Ничего не найдено')}
                for (var i=0; i< books.length; i++) addListItem(books[i]);
                req = null;
            }
        }
    };
    req.open("POST", "PHP/workwithbook.php", true);
	// обязательно устанавливаем заголовок, иначе массив post вообще не виден
	// заголовки обязательны для post
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		  req.setRequestHeader("Content-Length", postData.length);
    req.send(postData);
};








