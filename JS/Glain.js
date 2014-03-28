var json_data = [];
var loading_data = 0;

$(document).ready( function(){
    var mapGL  = document.getElementById('mapGL'); 
    if ( mapGL.clientWidth < 1000 ) $('.closemap').hide();

    ymaps.ready(init);

    //навигация
    $('#mapGL .nav li').click( function(){
        if ( $(this).hasClass('active') ) {
            $(this).removeClass('active');
            return false;
        }
        closeNav();
        $(this).addClass('active');
    });
    $('#mapGL .change').click( function(){
        if ( $(this).hasClass('loader') ) return false;
        $(this).toggleClass('changed');
        $(this).addClass('loader');
        
        if ( !$('#mapGL .changed').length ) {
            $('#mapGL .nav .sub .first .clear').attr('onclick', 'checkAll()');
            $('#mapGL .nav .sub .first .clear').text('Отметить все');
        } else {
            $('#mapGL .nav .sub .first .clear').attr('onclick', 'clearAll()');
            $('#mapGL .nav .sub .first .clear').text('Сброс');
        } 

        getJsonData();
        getPayDescription( $(this).find('a').attr('href'), $(this).hasClass('changed') );
    });
    $('#mapGL .change a').click( function(){
        $(this).parent().click();
        return false;
    });

    $('#mapGL .filter input').click( function(){
        if ( $(this).attr('id') == "filter_nearest" && typeof(Human) == 'undefined' ) {
            alert( "Необходимо установить маркер вашего местоположения!" );
            setManually();
            $(this).attr('checked', false);
            return false;
        }
        getJsonData();
    });
    $('#mapGL .city').click( function(){
        $('#mapGL .city.current').removeClass('current');
        $(this).addClass('current');
        $('#mapGL .nav .curCity span').text( $(this).text() );
        $('#mapGL .nav .active').removeClass('active');

        getJsonData(true);
        return false;
    });

    $('#mapGL .search input').keyup( function(e){
        //console.log(event.keyCode);
        if ( event.keyCode == 13 ) getJsonData();
        if ( event.keyCode == 27 && $(this).val('').length > 0 ) $('#mapGL .search .clear').click();
        if ( $(this).val().length == 0 && $('#mapGL .search .clear').length != 0 ) $('#mapGL .search .clear').click();
        if ( $(this).val().length > 0 && $('#mapGL .search .clear').length == 0 ) {
            $('#mapGL .search').append("<div class='clear'></div>");
            $('#mapGL .search-btm').show();
        }
    });
    $('#mapGL .search .clear').live("click", function(){
        $('#mapGL .search input').val('');
        $('#mapGL .search .clear').remove();
        $('#mapGL .search').removeClass("active");
        $('#mapGL .search-btm').hide();
    });
    $('#mapGL .search input').click( function(){
        if ( $(this).val().length == 0 || $('#mapGL .search ul').html() == '' ) return;
        closeNav();
        $('#mapGL .search').addClass("active");
    });
    $('#mapGL .search ul a').live('click', function(){
        var val_id = $(this).attr('rel');
        var placemark = createPlacemark( val_id );

        myMap.geoObjects.add( placemark );
        placemark.balloon.open();
        placemark.events.add('balloonclose', function(){
            myMap.geoObjects.remove(placemark);
        });
    });
    $('#mapGL .search-btm').live('click', function(){
        getJsonData();
    });

    $('#YMapsID').mousedown(function(){
        closeNav();
    });

    //report mess
    $('#YMapsID .report').live('click', function(){
        //новая высота балуна
        var height_new = 350;
        var content = $(this).parent().parent().parent().parent().parent().parent();
        var content_head = $(this).parent().parent().parent().parent().find('h3');
        var content_body = $(this).parent();

        var frm_text = '<span class="introtext">Если Вы заметили несоответствие между реальными данными о точках оплаты и нашей информацией, просим сообщить нам об этом! мы регулярно проводим проверку нашей информации о точках оплаты, надеемся, что вместе с Вами мы сможем делать еще быстрее и эффективнее!</span>';
        frm_text += '<form action="" method="post">';
        frm_text += '   <label for="name">Представьтесь, пожалуйста</label>';
        frm_text += '   <input type="text" name="name" id="name">';
        frm_text += '   <label for="email">Оставьте свой E-mail адрес</label>';
        frm_text += '   <input type="text" name="email" id="email">';
        frm_text += '   <label for="message">Ваше сообщение</label>';
        frm_text += '   <textarea name="message" id="message"></textarea>';
        frm_text += '   <div class="frmAction"><a class="button" href="javascript: void(0);"><span>Отправить</span><b></b></a> или <a href="javascript: void(0);" class="balloon_close">отменить</a></div>';
        frm_text += '</form>';

        //старая высота балуна
        var height_old = content.height();
        var top_old = parseInt( content.parent().parent().css('top') );
        var top_new = top_old + height_old - height_new;
        content.parent().parent().css('top', top_new + "px");

        content.height( height_new );
        content_head.text( "Обратная связь" );
        content_body.html( frm_text );
    });

    //send report
    $('#YMapsID form .button').live('click', function(){
        //новая высота балуна
        var height_new = 100;
        var content = $(this).parent().parent().parent().parent().parent().parent().parent().parent();
        var content_body = $(this).parent().parent().parent();
        var frm_text = '<span class="introtext">Спасибо за ваще сообщение!</span>';

        //старая высота балуна
        var height_old = content.height();
        var top_old = parseInt( content.parent().parent().css('top') );
        var top_new = top_old + height_old - height_new;
        content.parent().parent().css('top', top_new + "px");

        content.height( height_new );
        content_body.html( frm_text );
    });

    //close baloon
    $('#YMapsID form .balloon_close').live('click', function(){
        $(this).closest('.ymaps-b-balloon').find('.ymaps-b-balloon__close').click();
    });
});

///////////////////////////////////////////////////   INIT   ///////////////////////////////////////////////////////////
function init() {
    var clusterIcons = [
        {
            href: 'image/cluster-small.png',
            size: [28, 28],
            offset: [-14, -14]
        },
        {
            href: 'image/cluster-big.png',
            size: [39, 39],
            offset: [-20, -20]
        }]

    window.myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterIcons: clusterIcons,
        clusterBalloonSidebarWidth: 160,
        clusterBalloonHeight: 350
    });

    myClusterer.events.add('balloonopen', function(e){ loadContentClusterer(e.get('target')); });

    window.myMap = new ymaps.Map( "YMapsID", {
        center:     ['55.344825', '86.118337'],
        behaviors:  ['default', 'scrollZoom'],
        type:       'yandex#publicMap',
        zoom:       14
    },{
        minZoom: 13,
        maxZoom: 16
    });

    myMap.controls.add('zoomControl', { left: 30, top: 80 });

    
    if ( window.location.search != '' ) {
        regexp = /[0-9]{1,2}/;
        result = regexp.exec( window.location.search );
        if ( result[0] != '' ) {
            $('#mapGL a.city[rel="'+result[0]+'"]').click();
            return false;
        }
    }

    getJsonData();
}

var clearAll = function() {
    $('#mapGL .changed').removeClass('changed');
    // Удаляем все  метки из кластера
    myClusterer.removeAll();
    // Удаляем кластер с карты
    myMap.geoObjects.remove(myClusterer);
    $('#mapGL .nav .sub .first .clear').attr('onclick', 'checkAll()');
    $('#mapGL .nav .sub .first .clear').text('Отметить все');
}
var checkAll = function() {
    $('#mapGL .change').addClass('changed');
    $('#mapGL .change').addClass('loader');
    $('#mapGL .nav .sub .first .clear').attr('onclick', 'clearAll()');
    $('#mapGL .nav .sub .first .clear').text('Сброс');
    getJsonData();
}

var closeNav = function() {
    $('#mapGL .search').removeClass('active');
    $('#mapGL .nav li').removeClass('active');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var getJsonData = function( map_reset ) {
    var city = $('#mapGL .city.current').attr('href');
    var arrTypePay = [];
    var filters = [];
    var myLocation = 0;
    loading_data++;

    $('#mapGL .changed .select').each( function(i){
        arrTypePay[i] = $(this).attr('rel');
    });

    $('#mapGL .filter input:checked').each( function(i){
        filters[i] = $(this).attr('id');
    });

    if( $('#mapGL #filter_nearest:checked').length && typeof(Human) != 'undefined' ) {
        myLocation = Human.geometry.getCoordinates().join();
    }

    $.post( city, { typePay: arrTypePay.join(), filters: filters.join(), location: myLocation, search_str: $('#mapGL .search input').val()  },
        function( data ) {
            if ( data != null ) {
                json_data = data;
                //console.log( json_data );
                loading_data--;
                if ( typeof(map_reset) != 'undefined' ) myMap.setCenter( json_data.city_coordi, 14);
                //обновляем только финишную загрузку
                if ( loading_data == 0 ) refreshPoints();
            }
        }, "json");
}

var refreshPoints = function() {
    if ( typeof(myClusterer) == 'undefined' ) return;

    // Удаляем все  метки из кластера
    myClusterer.removeAll();
    // Удаляем кластер с карты
    myMap.geoObjects.remove(myClusterer);

    //список точек для поиска
    var listSearch = '';

    $.each( json_data.address, function(i){
        var myPlacemark = createPlacemark( this.id );
        myClusterer.add( myPlacemark );
        //myMap.geoObjects.add( myPlacemark );

        if (  $('#mapGL .search input').val().length > 0 ) {
            listSearch += '<li>';
            listSearch += '<a rel="'+this.id+'" href="javascript: void(0);">'+this.pagetitle.replace(/<\/?[^>]+>/gi, '')+'</a>';
            listSearch += '<span>111</span>';
            listSearch += '</li>';
        }
    });

    myMap.geoObjects.add( myClusterer );

    $('#mapGL .loader').removeClass('loader');

    //это для поиска
    if (  $('#mapGL .search input').val().length > 0 ) {
        if ( listSearch == '' ) listSearch = "<li>Результаты отсутствуют</li>";
        $('#mapGL .search ul').html( listSearch );
        $('#mapGL .search').addClass('active');
    }
}

var loadContent = function( placemark ) {
    var city = $('#mapGL .city.current').attr('href').replace(".html", "/");

    $.post( city + placemark.properties.get('id'), {},
        function( data ) {
            if ( data != null ) {
                var info = '';

                $.each( data, function(i){
                    info += '<p class="point"><b>' + data[i].pagetitle + '</b>';
                    info += '<span>Режим работы: ' + data[i].timeWork + '</span>';
                    //info += '<span>Время зачисления: ' + data[i].timePay + '</span>';

                    if( data[i].commission == '0' ) info += '<span class="commission" style="color: green;">Без комиссии</span>';
                    else info += '<span class="commission"  style="color: red;">Комиссия: ' + data[i].commission + '</span>';

                    info += '</p>';
                });
                info += '<div class="report"><a href="javascript: void(0);">Точка оплаты не работает или данные не верны?</a></div>';

                placemark.properties.set({balloonContent: info});
            }
        }, "json");
}

var loadContentClusterer = function( cluster ) {
    $.each( cluster.properties.get('geoObjects'), function(i, placemark){
        loadContent( placemark );
    });
}

var createPlacemark = function( key ) {
    var pl_data = json_data.address[key];
    var placemark_img = ( pl_data.count > 1 )? "image/cluster-small.png" : json_data.typePay[pl_data.typePay].imageMarker;
    var placemark_count = ( pl_data.count > 1 )? pl_data.count : "";
    var placemark_size = ( pl_data.count > 1 )? [28, 28] : [32, 32];

    var placemark = new ymaps.Placemark( pl_data.coordinates.split(','), {
        id: pl_data.id,
        balloonContentHeader:   "<h3>"+pl_data.pagetitle+"</h3>",
        balloonContent:         "<img src='image/loading.gif'>",
        iconContent:            placemark_count
    }, {
        iconImageHref: placemark_img,
        iconImageSize: placemark_size,
        iconImageOffset: [-12, -26]
    });

    placemark.events.add('balloonopen', function(e){ loadContent(e.get('target')); });

    return placemark;
}

var getPayDescription = function( url, status ) {
    if ( !status ) {
        $('#mapGL .nav .sub .introtext').html('');
        $('#mapGL .nav .sub .introtext').removeClass('show');
        return false;
    }

    $.post( url, {},
        function( data ) {
            if ( data != null ) {
                $('#mapGL .nav .sub .introtext').html(data);
                $('#mapGL .nav .sub .introtext').addClass('show');
            }
        });
}

/////////////////////////////////////////// LOCATION ///////////////////////////////////////////////////////////////////
var setAuto = function() {
    myLocation( json_data.ip_addr );
}

var myLocation = function( ip_addr ) {
    var city = $('#mapGL .city.current').text();
    
    $.get("https://stat.eltc.ru/ogo/adres.php", { ip: ip_addr },
        function(data){
            var regexp = /<p>.{1,}<\/p>/i;
            var matches = data.responseText.match( regexp );

            if ( matches != null ) {
                var addr = $( matches[0] ).html();
                //console.log( city+' '+addr );

                ymaps.geocode(city+' '+addr, { results: 1 }).then(function(res){
                    var myLocationGeoObject = res.geoObjects.get(0);
                    setManually( myLocationGeoObject.geometry.getCoordinates() );
                    myMap.setCenter( myLocationGeoObject.geometry.getCoordinates() );
                })
            }else{
                alert( "Неудалось определить ваше местоположение. Попробуйте установить маркер вручную." );
                setManually();
            }
        });
}

var setManually = function( myCoord ) {
    if( typeof(Human) != 'undefined' ) myMap.geoObjects.remove( Human );

    var center = (typeof myCoord !== 'undefined')? myCoord : myMap.getCenter();

    window.Human = new ymaps.Placemark( center, {
        hintContent: 'Подвинь меня!'
    }, {
        iconImageHref: 'image/human.png',
        iconImageSize: [48,43],
        draggable: true
    });
    myMap.geoObjects.add( Human );
    searchRoute( Human.geometry.getCoordinates() );

    //при перемещении объекта необходимо обновить его координаты
    Human.events.add('dragend', function() {
        Human.options.set('iconImageHref', 'image/human.png');
        Human.options.set('iconImageSize', [48,43]);

        searchRoute( Human.geometry.getCoordinates() );
        $('#mapGL .filter input').attr('checked', false);
    });

    Human.events.add('drag', function(e) {
        var positionX = e.originalEvent.pixelOffset[0];

        if ( positionX < 0 ) Human.options.set('iconImageHref', 'image/human-left.png');
        else  Human.options.set('iconImageHref', 'image/human-right.png');
        Human.options.set('iconImageSize', [49,59]);
    });
}

var searchRoute = function( myCoord ) {
    var arrGeoObj = [];
    var arrGeoObjClosest = [];

    //собираем активные объекты на карте
    myMap.geoObjects.each( function(geoObject) {
        //console.log( geoObject );
        //исключаем лишние объекты на карте
        if ( geoObject.geometry == null && typeof(geoObject.routeOptions) == 'undefined' ) {
            geoObject.each( function(item) {
                var coord = item.geometry.getCoordinates();
                //теорема Пифагора
                var r = Math.sqrt( Math.pow( coord[0]-myCoord[0], 2 ) + Math.pow( coord[1]-myCoord[1], 2 ) );
                r = Math.ceil( r*10000 );
                arrGeoObj[r] = coord;
            });

        } else if( typeof(geoObject.routeOptions) != 'undefined' ){
            myMap.geoObjects.remove( geoObject );
        }
    });

    //выбираем 5 ближайших
    var j = 0;
    for( var i in arrGeoObj ) {
        arrGeoObjClosest[j] = arrGeoObj[i];
        j++;
        if( arrGeoObjClosest.length == 5 ) break;
    }

    ymaps.route( [ myCoord, arrGeoObjClosest[0] ] )
        .then(function (route) {
            //if ( typeof(shortestRoute) != 'undefined' ) myMap.geoObjects.remove( shortestRoute );
            var shortestRoute = route;

            shortestRoute.getPaths().options.set({
                balloonContenBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]')
            });

            var points = shortestRoute.getWayPoints();
            points.options.set('iconImageHref', '');
            points.options.set('iconImageSize', [0,0]);
            points.get(0).properties.set('iconContent', '');
            points.get(1).properties.set('iconContent', '');

            myMap.geoObjects.add(shortestRoute);

        }, function (error) {
            console.log("Возникла ошибка: " + error.message);
        });
}