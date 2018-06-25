var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//var favorites = [];
var likes = JSON.parse(localStorage.getItem('likes')) || [];

localStorage.setItem('favorites', JSON.stringify(favorites));
localStorage.setItem('likes', JSON.stringify(likes));

//klikniecie serduszka z widoku menu
function klikUlubioneMenu(nazwa_lokalu) {
  $('#lokal-menu .nav-gorne svg#dodajDoUlubionych').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log('clicked dodajdoulubionych');
    var $self = $(this);
    var nazwa_lokalu = $('#categoriesContent > header > h2').text();
    var id_lokalu = $('#categoriesContent > header > input[type="text"]:nth-child(1)').val();
    var lat = $('#categoriesContent > header > input[type="text"]:nth-child(2)').val();
    var lng = $('#categoriesContent > header > input[type="text"]:nth-child(3)').val();

    if ($self.hasClass('added')) {
      //usun z ulubionych
      $self.removeClass('added');

      var favs = JSON.parse(localStorage.getItem('favorites'));
      for (let i = 0; i < favs.length; i++) {
        var tmp = favs[i];
        if (tmp.nazwa == nazwa_lokalu) {
          favs.splice(i, 1);
        }
      }

      localStorage.setItem('favorites', JSON.stringify(favs));

      wyswietlUlubione();

    } else {
      $self.addClass('added');
      //usun do ulubionych

      var favs = JSON.parse(localStorage.getItem('favorites'));
      var nowyLokal = {
        id: id_lokalu,
        nazwa: nazwa_lokalu,
        lat: lat,
        lng: lng
      };
      favs.push(nowyLokal);

      localStorage.setItem('favorites', JSON.stringify(favs));

      wyswietlUlubione();
    }
  });
}

function wyswietlUlubione() {
  console.log('wyswietlam ulubione');
  var lista = '';

  var favs = JSON.parse(localStorage.getItem('favorites'));
  for (let i = 0; i < favs.length; i++) {
    var tmp = favs[i];
    lista += '<li>' +
      '<div class="collapsible-header">' + '<input hidden type="text" name="localID" value="' + tmp.id + '" /><input hidden type="text" name="lat" value="' + tmp.lat + '" /><input hidden type="text" name="lng" value="' + tmp.lng + '" />' +
      '<p class="truncate">' + tmp.nazwa + '</p>' +
      '<i class="fas fa-chevron-down"></i> <i class="far fa-heart right"></i></div>' +
      '<div class="collapsible-body">' +
      '<a class="favs-button" href="#"><i class="fas fa-eye"></i> Zobacz menu</a>' +
      '<a class="favs-button" href="#"><i class="fas fa-map-marker-alt"></i> Pokaż na mapie</a>' +
      '</div>' +
      '</li>';
  }

  if (lista == '') {
    $('#ulubione > div > ul').html('<li><div class="collapsible-header">Brak ulubionych</div></li>');
  } else {
    $('#ulubione > div > ul').html(lista);
    $('#ulubione > div > ul').collapsible();
  }


  $('#ulubione > div > ul > li > div.collapsible-header > i.far.fa-heart.right').click(function (event) {
    event.stopPropagation();

    var nazwa_lokalu = $(this).parent().find('p').text();
    var lokal_id = $(this).parent().find('input[name="localID"]').val();

    var favs = JSON.parse(localStorage.getItem('favorites'));
    for (let i = 0; i < favs.length; i++) {
      var tmp = favs[i];
      if (tmp.nazwa == nazwa_lokalu && tmp.id == lokal_id) {
        favs.splice(i, 1);
      }
    }

    localStorage.setItem('favorites', JSON.stringify(favs));

    wyswietlUlubione();
  });

  $('#ulubione > div > ul > li > div.collapsible-body > a:nth-child(1)').click(function () {
    var lat = $(this).parent().prev().find('input[name="lat"]').val();
    var lng = $(this).parent().prev().find('input[name="lng"]').val();
    var nazwa_lokalu = $(this).parent().prev().find('p').text();
    $('#bottom-nav > div:nth-child(3) > div.item.item-map').click();
    $('#lokal-menu').transition({
      x: 0
    });

    wyswietlMenuKategorie(lat, lng);

    var fav = sprawdzCzyUlubione(nazwa_lokalu);
    if (fav == 'faved') {
      $('#dodajDoUlubionych').addClass('added');
    } else {
      $('#dodajDoUlubionych').removeClass('added');
    }
    klikUlubioneMenu(nazwa_lokalu);

    $('#lokal-menu > div.nav-gorne > svg').click(function () {
      $('#lokal-menu').transition({
        x: '1000px'
      });
    });
  });

  $('#ulubione > div > ul > li > div.collapsible-body > a:nth-child(2)').click(function () {
    var lat = $(this).parent().prev().find('input[name="lat"]').val();
    var lng = $(this).parent().prev().find('input[name="lng"]').val();
    var nazwa_lokalu = $(this).parent().prev().find('p').text();

    console.log('lat: ' + lat + ", lng: " + lng + ", nazwa: " + nazwa_lokalu);

    $('#bottom-nav > div:nth-child(3) > div.item.item-map').click();
     var wspolrzedne = new google.maps.LatLng(lat, lng);
    map.panTo(wspolrzedne);
    geocodeLatLng(geocoder, wspolrzedne, map, infowindow);
  });
}

function sprawdzCzyUlubione(nazwa_lokalu) {
  var favs = JSON.parse(localStorage.getItem('favorites'));

  for (let i = 0; i < favs.length; i++) {
    var tmp = favs[i];
    if (tmp.nazwa == nazwa_lokalu) {
      return 'faved';
    }
  }
}


//klikniecie serduszka z podstrony 'ulubione'

function klikLikeDanie() {
  $('#danie > div.container > div.dishLikes').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var self = $(this);
    var dishID = $(this).find('input').val();

    if (self.hasClass('liked')) {
      //usun z liked
      self.removeClass('liked');

      var likes = JSON.parse(localStorage.getItem('likes'));
      for (let i = 0; i < likes.length; i++) {
        var tmp = likes[i];
        if (tmp.id == dishID) {
          likes.splice(i, 1);
        }
      }

      localStorage.setItem('likes', JSON.stringify(likes));
      console.log(JSON.parse(localStorage.getItem('likes')));

      $.ajax({
        url: 'http://mpietrewicz.nazwa.pl//app//deleteLike.php',
        type: 'POST',
        data: {
          dishID: dishID
        },
        success: function (msg) {
          console.log(msg);

          updateLikes(dishID);
        }
      });
    } else {
      //dodaj do likes
      self.addClass('liked');

      var likes = JSON.parse(localStorage.getItem('likes'));
      var likedDish = {
        id: dishID
      };
      likes.push(likedDish);

      localStorage.setItem('likes', JSON.stringify(likes));
      console.log(JSON.parse(localStorage.getItem('likes')));

      $.ajax({
        url: 'http://mpietrewicz.nazwa.pl//app//addLike.php',
        type: 'POST',
        data: {
          dishID: dishID
        },
        success: function (msg) {
          console.log(msg);

          updateLikes(dishID);
        }
      });
    }
  });
}

function sprawdzCzyLiked(id_dania) {
  var likes = JSON.parse(localStorage.getItem('likes'));

  for (let i = 0; i < likes.length; i++) {
    var tmp = likes[i];
    if (tmp.id == id_dania) {
      return 'liked';
    }
  }
}

function updateLikes(ID) {
  $.ajax({
    url: 'http://mpietrewicz.nazwa.pl//app//getLikes.php',
    type: 'POST',
    data: {
      dishID: ID
    },
    success: function (msg) {
      $('#danie > div.container > div.dishLikes p').html(msg);
    }
  });
}
