//ZMIENNE GLOBALNE
var map;
var placesService;
var geocoder = new google.maps.Geocoder;

var infowindow = new google.maps.InfoWindow({
  minWidth: 300,
  maxWidth: 360,
  minHeight: 60
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

  console.log('lat: ' + actual.lat + ', lng: ' + actual.lng);

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
    icon: '../www/img/person.png',
    animation: google.maps.Animation.BOUNCE
  });

  $('#bottom-nav div.fab.refresh').removeClass('active');

  google.maps.event.addListener(actualMarker, 'click', function () {
    infowindow.setContent('Tu jesteś!');
    infowindow.open(map, actualMarker);
  });

  //sprawdzenie czy istnieje menu dla miejsca gdzie sie znajdujemy obecnie
  aktualneMenu = findActualMenu(actualMarker.position, function (msg) {
    console.log('lat: ' + actualMarker.position.lat().toFixed(6));
    console.log('lng: ' + actualMarker.position.lng().toFixed(6));

    if (msg.indexOf('nie ma menu') >= 0) {
      //      alert('Tu gdzie jestes nie ma menu!');
      console.log(msg);
    } else {
      var splitted = msg.split('~');

      var lat = splitted[0];
      var lng = splitted[1];
      
      console.log(lat + ', ' + lng);

      $.confirm({
        theme: 'modern',
        icon: 'fas fa-map-marker-alt',
        type: 'green',
        title: 'Wykryto menu',
        backgroundDismiss: true,
        content: 'Wykryto menu w miejscu, w którym się znajdujesz! Wyświetl je teraz!',
        buttons: {
          confirm: {
            action: function () {
              $('#lokal-menu').transition({
                x: 0
              });

              wyswietlMenuKategorie(lat, lng);
              var fav = sprawdzCzyUlubione(splitted[3]);
              
              if(fav == 'added'){
                $('#dodajDoUlubionych').addClass('added');
              } else {
                $('#dodajDoUlubionych').removeClass('added');
              }

              klikUlubioneMenu(splitted[3]);
              klikKategoria();
              klikDanie();
              klikLikeDanie();
              
              $('#lokal-menu .nav-gorne svg').click(function () {
                $('#lokal-menu').transition({
                  x: '1000px'
                });
              });
            },
            btnClass: 'btn-green',
            text: 'Zobacz'
          },
          cancel: {
            text: 'Anuluj'
          }
        }
      });
    }
  });

  //  funkcje searchboxa
  $('#searchBox').focusin(function () {
    $('#usuntext').addClass('visible');

    infowindow.close();

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
    } else {
      Materialize.toast('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/> </svg> To nie jest restauracja!', 2000);
    }
  });

  google.maps.event.addListener(map, 'mousedown', function () {
    $('#searchBox').blur();
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
    icon: icon,
    animation: google.maps.Animation.DROP
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
        lng: marker.position.lng().toFixed(6),
        name: place.name
      },
      success: function (msg) {
        var splitted = msg.split('~');

        if (splitted[0] == 'nie ma menu') {
          content = '<p class="placeName">' + place.name + '</p>' +
            '<p class="placeAddr">' + place.vicinity + '</p><p class="placeType">Ten lokal nie ma przypisanego menu</p><a class="waves-effect waves-light addMenu">Dodaj menu</a>';
        } else {
          content = '<p class="placeName">' + splitted[2] + '</p>' +
            '<p class="placeAddr">' + place.vicinity + '</p><p class="placeType">' + splitted[1] + '</p><a class="waves-effect waves-light viewMenu">Zobacz menu</a>';
        }

        infowindow.setContent(content);
        infowindow.open(map, marker);
      }
    });

    google.maps.event.addListener(infowindow, 'domready', function () {
      $('a.viewMenu').click(function () {
        let lat = marker.position.lat().toFixed(6);
        let lng = marker.position.lng().toFixed(6);

        console.log('klikniecie zobacz menu, lat: ' + lat + ', lng: ' + lng);

        //        $('div.map-content').hide();
        $('div#lokal-menu').transition({
          x: 0
        });

        var ulubione = sprawdzCzyUlubione(place.name);
        if (ulubione == 'faved') {
          $('#dodajDoUlubionych').addClass('added');
        } else {
          $('#dodajDoUlubionych').removeClass('added');
        }

        wyswietlMenuKategorie(lat, lng);

        $('#lokal-menu > div.nav-gorne > svg').click(function (event) {
          event.stopPropagation();
          event.stopImmediatePropagation();

          $('div#lokal-menu').transition({
            x: '1000px'
          });
        });
      });

      $('a.addMenu').click(function () {
        $('.logowanie-container').fadeOut();
        $('.rejestracja-container').fadeIn();

        $('#bottom-nav > div:nth-child(2) > div.item.item-creator').trigger('click');

        $('#register-form > div > section.step1 input[name="vicinity"]').val(place.name);
        $('#register-form > div > section.step1 > input[name="lat"]').val(place.geometry.location.lat().toFixed(6));
        $('#register-form > div > section.step1 > input[name="lng"]').val(place.geometry.location.lng().toFixed(6));

        console.log('lat: ' + place.geometry.location.lat().toFixed(6) + ', lng:' + place.geometry.location.lng().toFixed(6));
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

function wyswietlMenuKategorie(lat, lng) {
  console.log('wyswietlMenuKategorie, lat: ' + lat + ', lng: ' + lng);
  $.ajax({
    url: 'http://mpietrewicz.nazwa.pl//app//getCategories_view.php',
    type: 'post',
    data: {
      lat: lat,
      lng: lng
    },
    success: function (msg) {
      $('#lokal-menu #categoriesContent').html(msg);

      klikUlubioneMenu($('#categoriesContent > header > h2').text());

      klikKategoria();
      $('div#najlepsze_view').click(function () {
        var menuid = $(this).prev().find('input[name="localID"]').val();
        console.log(menuid);

        wyswietlNajlepsze(menuid);

        $('#najlepsze').transition({
          x: 0
        });

        $('#najlepsze .nav-gorne svg').click(function () {
          $('#najlepsze').transition({
            x: '1000px'
          });
        });
      });
    }
  });
}

function wyswietlNajlepsze(menuID) {
  $.ajax({
    url: 'http://mpietrewicz.nazwa.pl//app//getBest_kreator.php',
    type: 'POST',
    data: {
      localID: menuID
    },
    success: function (msg) {
      $('#najlepsze > div.container.najlepsze').html(msg);
    }
  });
}

function klikKategoria() {
  $('#categoriesContent > ul.collection > li').click(function (event) {
    event.stopPropagation();

    var catName = $(this).find('p').text();

    $('#catNameView').html(catName);
    $('#kategoria_menu').transition({
      x: 0
    });

    $('#lokal-menu').css('overflow', 'hidden');

    $('#kategoria_menu .nav-gorne svg').click(function () {
      $('#kategoria_menu').transition({
        x: '1000px'
      });

      $('#lokal-menu').css('overflow', 'scroll');
    });


    //dane do wyswietlenia dan
    var catID = $(this).find('input').val();
    console.log('catID:' + catID);
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getDishes_view.php',
      type: 'POST',
      data: {
        catID: catID
      },
      success: function (msg) {
        if (msg == '') {
          $('#kategoria_menu > div.container > ul.collection.dishesList').html('Brak dań');
        } else {
          $('#kategoria_menu > div.container > ul.collection.dishesList').html(msg);

          klikDanie();
        }
      }
    });
  });
}

function klikDanie() {
  $('#kategoria_menu > div.container > ul.dishesList > div.dish-cont').click(function (event) {
    event.stopPropagation();

    var self = $(this);
    var dishID = $(this).find('input').val();
    console.log('dish id:' + dishID);

    $('#danie').transition({
      x: 0
    });

    $('#danie .nav-gorne svg').click(function (even) {
      $('#danie').transition({
        x: '1000px'
      });
    });

    //ajax
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getDish.php',
      type: 'POST',
      data: {
        dishID: dishID
      },
      success: function (msg) {
        $('#danie > div.container').html(msg);

        var helpID = self.find('input').val();
        var like = sprawdzCzyLiked(helpID);
        console.log('like ? : ' + like);
        if (like == 'liked') {
          $('#danie > div.container > div.dishLikes').addClass('liked');
        } else {
          $('#danie > div.container > div.dishLikes').removeClass('liked');
        }

        klikLikeDanie();
      }
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

function findActualMenu(position, odpowiedz) {
  var lat = position.lat().toFixed(6);
  var lng = position.lng().toFixed(6);

  $.ajax({
    url: 'http://mpietrewicz.nazwa.pl//app//findActualMenu.php',
    type: 'POST',
    data: {
      lat: lat,
      lng: lng
    },
    success: odpowiedz
  });

  return odpowiedz;
}

//////////GEOCODER

function geocodeLatLng(geocoder, coords, map, infowindow, name) {
  geocoder.geocode({
    'location': coords
  }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(16);
        var marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: '../www/img/finded_place.png'
        });

        clickMarker(marker, results[0].place_id);

        //        infowindow.setContent(content);
        //        setTimeout(function(){
        //          infowindow.open(map, marker);
        //        }, 400);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

//////////////////////////////KONIEC FUNKCJI INIT
