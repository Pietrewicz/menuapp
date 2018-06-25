//ZMIENNE GLOBALNE
var map;
var placesService;

//var infoBubble = new InfoBubble({
//map: map,
//content: '',
//position: '',
//shadowStyle: 0,
//padding: 0,
//backgroundColor: 'rgb(57,57,57)',
//borderRadius: 10,
//arrowSize: 20,
//borderWidth: 1,
//minWidth: 300,
//minHeight: 100,
//borderColor: 'transparent',
//disableAutoPan: false,
//hideCloseButton: false,
//arrowPosition: 30,
//backgroundClassName: 'transparent',
//arrowStyle: 2,
//closeSrc: '../www/img/closeButton.png'
//});

var infowindow = new google.maps.InfoWindow({
  maxWidth: 300
});

//STYLE MAPY
var styles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e9e9e9"
            },
      {
        "lightness": 17
            }
        ]
    },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
            },
      {
        "lightness": 20
            }
        ]
    },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
            },
      {
        "lightness": 17
            }
        ]
    },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ffffff"
            },
      {
        "lightness": 29
            },
      {
        "weight": 0.2
            }
        ]
    },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
            },
      {
        "lightness": 18
            }
        ]
    },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
            },
      {
        "lightness": 16
            }
        ]
    },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
            },
      {
        "lightness": 21
            }
        ]
    },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dedede"
            },
      {
        "lightness": 21
            }
        ]
    },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "on"
            },
      {
        "color": "#ffffff"
            },
      {
        "lightness": 16
            }
        ]
    },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "saturation": 36
            },
      {
        "color": "#333333"
            },
      {
        "lightness": 40
            }
        ]
    },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
            }
        ]
    },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f2f2f2"
            },
      {
        "lightness": 19
            }
        ]
    },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#fefefe"
            },
      {
        "lightness": 20
            }
        ]
    },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#fefefe"
            },
      {
        "lightness": 17
            },
      {
        "weight": 1.2
            }
        ]
    }
];
//KONIEC STYLOW MAPY

//FUNKCJA INICJUJACA MAPE
var init = function init(position) {
  //AKTUALNE WSPOLRZEDNE
  var actual = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  var actualMarker;
  var placeMarker;

  //  STWORZENIE MAPY W DIV#MAP
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: actual,
    disableDefaultUI: true,
    styles: styles,
    gestureHandling: "greedy"
  });

  //ustawienie markera na aktualnej pozycji
  actualMarker = new google.maps.Marker({
    map: map,
    position: actual,
    icon: '../www/img/person.png'
  });

  $('div.map-content div.refresh').removeClass('animating');

  google.maps.event.addListener(actualMarker, 'click', function () {
    infowindow.setContent('Tu jesteś!');
    infowindow.open(map, actualMarker);
  });

  //sprawdzenie czy istnieje menu dla miejsca gdzie sie znajdujemy obecnie
  aktualneMenu = findMenu(actualMarker.position, function (msg) {
    if (msg == 'nie ma menu') {
      //      alert('Tu gdzie jestes nie ma menu!');
    } else {
      //      alert('Tu gdzie jestes znaleziono menu!');
    }
  });

  //  funkcje searchboxa
  $('#searchBox').focusin(function () {
    $('#usuntext').addClass('visible');

    $(document).click(function (e) {
      var $search = $("#searchBox");
      if (!$search.is(e.target) && $search.has(e.target).length === 0) {
        $('#searchBox').focusout();

        if ($search.val() != '') {
          $('#usuntext').addClass('visible');
        } else {
          $('#usuntext').removeClass('visible');
        }
      }
    });
  });

  //  $('#searchBox').focusout(function () {
  //    if ($(this).val() == '') {
  //      $('#usuntext').removeClass('visible');
  //    }
  //  });

  $('#searchBox').change(function () {
    if ($(this).val() == '') {
      $('#usuntext').removeClass('visible');
    } else {
      $('#usuntext').addClass('visible');
    }
  });

  $('#usuntext').click(function (Event) {
    $('#searchBox').val('');
    $('#searchBox').trigger('focus');
  });

  //UTWORZENIE OBIEKTU DO SZUKANIA POBLISKICH LOKALI
  placesService = new google.maps.places.PlacesService(map);

  //SZUKANIE NAJBLIZSZYCH RESTAURACJI
  restaurants = placesService.nearbySearch({
    location: actual,
    radius: 1000,
    type: ['restaurant']
  }, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        //utworzenie markerow dla kazdego znalezionego miejsca
        placeMarker = createMarker(results[i].geometry.location, '../www/img/place.png');
        clickMarker(placeMarker, results[i]);
      }
    }
  }


  //SEARCHBOX I JEGO FUNKCJE//////////////////
  //ustawienia searchBoxa
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));
  var input = document.getElementById('searchTextField');
  var options = {
    bounds: defaultBounds,
    types: ['establishment']
  };

  var searchBox = document.getElementById('searchBox');
  var autocomplete = new google.maps.places.Autocomplete(searchBox, options);
  autocomplete.bindTo('bounds', map);

  //marker dla szukanego miejsca
  var searchMarker = new google.maps.Marker({
    map: map,
    icon: '../www/img/finded_place.png'
  });

  //event na zmiane zalezionego miejsca
  autocomplete.addListener('place_changed', function () {
    google.maps.event.clearListeners(map, 'zoom_changed');
    var place = autocomplete.getPlace();
    infowindow.close();
    searchMarker.setVisible(false);
    if (place.types.indexOf('food') >= 0 || place.types.indexOf('bar') >= 0) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(16);
      }

      searchMarker.setPosition(place.geometry.location);
      searchMarker.setVisible(true);

      clickMarker(searchMarker, place);

      google.maps.event.trigger(searchMarker, 'click');
      $('button.addMenu').click(function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        viewRegisterForm(place.vicinity);
      });
    } else {
      Materialize.toast('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/> </svg> To nie jest restauracja!', 2000);
    }
  });
  
  google.maps.event.addListener(map, 'click', function(){
    $('#searchBox').focusout();
  });

  //KONIEC SEARCHBOXA///////////////////
}
//KONIEC FUNKCJI INICJACJI MAPY

//FUNKCJA TWORZACA MARKER
function createMarker(place, icon) {
  //UTWORZENIE MARKERA
  var marker = new google.maps.Marker({
    map: map,
    position: place,
    icon: icon
  });

  return marker;
}

//FUNKCJA USTAWIAJACA ZDARZENIE KLIKNIECIA MARKERA
function clickMarker(marker, place) {
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.close();
    //przesuniecie srodka mapy na klikniety marker
    map.panTo(marker.position);

    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//findMenu.php',
      type: 'POST',
      data: {
        lat: marker.position.lat().toFixed(6),
        lng: marker.position.lng().toFixed(6)
      },
      success: function (msg) {
        var splitted = msg.split('.');

        if (splitted[0] == 'nie ma menu') {
          content = '<p class="placeName">' + place.name + '</p>' +
            '<p class="placeAddr">' + place.vicinity + '</p><p class="placeType">Ten lokal nie ma przypisanego menu</p><a class="waves-effect waves-light addMenu">Dodaj menu</a>';
        } else {
          content = '<p class="placeName">' + place.name + '</p>' +
            '<p class="placeAddr">' + place.vicinity + '</p><p class="placeType">' + splitted[1] + '</p><a class="waves-effect waves-light viewMenu">Zobacz menu</a>';
        }

        infowindow.setContent(content);
        infowindow.open(map, marker);


      }
    });

    google.maps.event.addListener(infowindow, 'domready', function () {
      $('a.viewMenu').click(function () {
        $('div.map-content').hide();
        $('div#lokal-menu').addClass('active');
      });

      $('a.addMenu').click(function () {
        $('.logowanie-container').fadeOut();
        $('.rejestracja-container').fadeIn();

        $('#bottom-nav > div.item.waves-effect:nth-of-type(3)').trigger('click');

        $('#register-form > div > section.step1 input[name="vicinity"]').val(place.name);
        $('#register-form > div > section.step1 > input[name="lat"]').val(place.geometry.location.lat().toFixed(6));
        $('#register-form > div > section.step1 > input[name="lng"]').val(place.geometry.location.lng().toFixed(6));
        
        console.log('lat: ' + place.geometry.location.lat().toFixed(6) + ', lng:' + place.geometry.location.lng().toFixed(6) );
      });

      google.maps.event.addListener(map, 'zoom_changed', function () {
        map.panTo(marker.position);
      });
    });

    google.maps.event.addListener(infowindow, 'closeclick', function () {
      google.maps.event.clearListeners(map, 'zoom_changed');
    });
  });
}

//FUNKCJA SZUKAJACA MENU W BAZIE I ZWRACAJACA INFO Z SERWERA
function findMenu(position, odpowiedz) {
  var lat = position.lat().toFixed(6);
  var lng = position.lng().toFixed(6);

  $.ajax({
    url: 'http://mpietrewicz.nazwa.pl//app//findMenu.php',
    type: 'POST',
    data: {
      lat: lat,
      lng: lng
    },
    success: odpowiedz
  });

  return odpowiedz;
}

//  
//  //---------------------------------------------------------------------------------------
//  
//  
//  
//  
//  
//  
//    
//        
//        google.maps.event.addListener(infowindow, 'domready', function() { //dodanie zdarzenia do klikniecia buttonu wewnatrz infowindow
//          $('button.addMenu').click(function(){ //wyswietlanie formularza dodawania menu
//            var localContent = 'LOKAL: ' + place.name + ', ' + place.vicinity;
//            sessionStorage.setItem('local', localContent); //ustawienie nazwy wybranego lokalu do rejestracji
//            //ustawienie wspolrzednych dla wybranego lokalu
//            sessionStorage.setItem('lat', place.geometry.location.lat());
//            sessionStorage.setItem('lng', place.geometry.location.lng());
//            window.location = '../www/screens/register.html';
//          });
//
//          $('button.viewMenu').click(function(){ //wyswietlanie menu
//            
//          });
//        });
//    } else {
//      Materialize.toast('To nie jest lokal gastronomiczny!', 3000);
//    }
//    
//    if(!place.geometry){
//      Materialize.toast('Nie znaleziono szukanego miejsca', 4000, 'rounded');
//    }
//    
//  });
//}
//////////////////////////////KONIEC FUNKCJI INIT
//
///////////////////////////////FUNKCJA TWORZACA MARKER NA PODANEJ POZYCJI
//function createMarker(place, icon){
//  //UTWORZENIE MARKERA
//  var marker = new google.maps.Marker({
//    map: map,
//    position: place,
//    icon: icon
//  }); 
//  
//  return marker;
//}
//////////////////////////////KONIEC FUNKCJI TWORZACEJ MARKER NAPODANEJ POZYCJI
//
//////////////////////////////FUNKCJA USTAWIAJACA CONTENT INFOWINDOWA Z PODANEGO MARKERA
//function setInfowindowContent(marker, content){
//  //KLIKNIECIE MARKERA I USTAWIENIE CONTENTU INFOWINDOW
//  google.maps.event.addListener(marker, 'click', function(){
//    map.panTo(placeLoc);
//    
//    infowindow.setContent(content);
//    infowindow.open(map, this);
//  });
//}
/////////////////////////////KONIEC USTAWIANIA CONTENTU INFOWINDOW
//
/////////////////////////////FUNKCJA SZUKANIA MENU W BAZIE
//function findMenu(lat, lng){
//  var splitted;
//  
//  $.ajax({ 
//    url: 'http://mpietrewicz.nazwa.pl//app//findMenu.php',
//    type: 'POST',
//    data: {lat: lat, lng: lng},
//    success: function(msg){ 
//      splitted = msg.split('.');
//    }
//  });
//  
//  //ZWROCENIE TABLICY Z ODPOWIEDZIA SERWERA
//  return splitted;
//}
/////////////////////////////
//
//if(sessionStorage.getItem('registerFromLogin') === 'yes'){
//  Materialize.toast('Najpierw wybierz lokal');
//  sessionStorage.removeItem('registerFromLogin');
//}
//
//
//
//function createMarkerr(place){
//  //sprawdzenie czy istnieje menu w bazie dla tego miejsca i ustawienie ikonki
//  $.ajax({
//    url: 'http://mpietrewicz.nazwa.pl//app//findMenu.php',
//    type: 'POST',
//    data: {lat: lat, lng: lng},
//    success: function(msg){ 
//      splitted = msg.split('.');
//      var icon;
//
//      if(splitted[0] != ''){ //ustawianie ikonki miejsca zaleznie od typu restauracji
//        icon = '../www/img/' + splitted[0] + '.png';
//      } else {
//        icon = '../www/img/other.png';
//      }
//
//      marker.setIcon(icon);
//      content += splitted[1]; //dodanie wiadomosci zwroconej do kontentu okienka infowindow - buttton
//      
//      if(splitted[1] != 'other'){
//        $('div.infowindow').html('<p class="placeName">' + place.name + '</p><br /><p class="placeAddr">' + place.vicinity + '</p><br /><p class="placeType">' + splitted[1] + '</p>' + splitted[2] + '<div class="close-button"><div class="close"></div></div>');
//      } else {
//        $('div.infowindow').html('<p class="placeName">' + place.name + '</p><br /><p class="placeAddr">' + place.vicinity + '</p><br />' + splitted[2] + '<div class="close-button"><div class="close"></div></div>');
//      }
//    }
//  }); 
//  
//  google.maps.event.addListener(marker, 'click', function() {
//  
//    //sprawdzenie czy istnieje menu w bazie dla tego miejsca i ustawienie ikonki
//  $.ajax({
//    url: 'http://mpietrewicz.nazwa.pl//app//findMenu.php',
//    type: 'POST',
//    data: {lat: lat, lng: lng},
//    success: function(msg){ 
//      splitted = msg.split('.');
//      var icon;
//
//      if(splitted[0] != ''){ //ustawianie ikonki miejsca zaleznie od typu restauracji
//        icon = '../www/img/' + splitted[0] + '.png';
//      } else {
//        icon = '../www/img/other.png';
//      }
//
//      marker.setIcon(icon);
//      content += splitted[1]; //dodanie wiadomosci zwroconej do kontentu okienka infowindow - buttton
//      
//      if(splitted[1] != 'other'){
//        $('div.infowindow').html('<p class="placeName">' + place.name + '</p><br /><p class="placeAddr">' + place.vicinity + '</p><br /><p class="placeType">' + splitted[1] + '</p>' + splitted[2] + '<div class="close-button"><div class="close"></div></div>');
//      } else {
//        $('div.infowindow').html('<p class="placeName">' + place.name + '</p><br /><p class="placeAddr">' + place.vicinity + '</p><br />' + splitted[2] + '<div class="close-button"><div class="close"></div></div>');
//      }
//    }
//  }); 
//    
//    $('div.infowindow').fadeIn();
//    $('div.close-button').click(function(){
//      $('div.infowindow').fadeOut();
//    });
//    
////    google.maps.event.addListener(infowindow, 'domready', function() { //dodanie zdarzenia do klikniecia buttonu wewnatrz infowindow
//////      var okno = $('p.placeName').parent().parent().parent().parent().css('border', '2px solid red').css('border-radius', '50px');
//////      $('p.placeName').parent().parent().parent().css('border', '2px solid red').css('border-radius', '50px');
////      
////      $('button.addMenu').click(function(){ //wyswietlanie formularza dodawania menu
////        var localContent = 'LOKAL: ' + place.name + ', ' + place.vicinity;
////        sessionStorage.setItem('local', localContent); //ustawienie nazwy wybranego lokalu do rejestracji
////        //ustawienie wspolrzednych dla wybranego lokalu
////        sessionStorage.setItem('lat', lat);
////        sessionStorage.setItem('lng', lng);
////        window.location = '../www/screens/register.html';
////      });
////
////      $('button.viewMenu').click(function(){ //wyswietlanie menu
////
////      });
////    });
////  //end of domready infowindow
////  }); 
//});
//}
