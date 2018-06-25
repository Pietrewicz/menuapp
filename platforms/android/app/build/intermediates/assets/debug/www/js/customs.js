//////////////////////////////////GŁÓWNY PRZEBIEG APLIKACJI

var loggedMenuID = 0;
var loggedLat = 0;
var loggedLng = 0;

function checkCoordinates() {

}

var startApp = $(document).ready(function () {
  //wymiary okna
  var windowWidth = $('body').css('width');
  windowWidth = windowWidth.replace('px', '');
  var windowHeight = $('body').css('height');
  console.log(windowHeight);
  //  windowHeight = windowHeight.replace('px', '');

  $('#bottom-nav').removeClass('hidden');

  //jezeli wymiary sie zmiennia to uaktualnj
  $(window).resize(function () {
    windowWidth = $('body').css('width');
    windowWidth = windowWidth.replace('px', '');

    //JAK KLAWIATURA SIE NA TEL POJAWIA
    var newHeight = $('body').css('height');
    newHeight = newHeight.replace('px', '');
    //    var roznica = windowHeight - newHeight;
    //    var styl = 'translateY(' + ((-1) * roznica) + 'px)';
    //    
    //    $('body').css('transform', styl);
    //
    //    if (newHeight < windowHeight) {
    //      $('#bottom-nav').addClass('hidden');
    //      $('body').css('height', windowHeight);
    //    } else {
    //      $('#bottom-nav').removeClass('hidden');
    //    }

  });

  var nav = $('div#bottom-nav');

  $(window).scroll(function () {
    console.log('scroll');
    var scrollTop = $window.scrollTop();
    nav.toggleClass('hidden', scrollTop > prev);
    prev = scrollTop;
  });

  //splashscreen
  setTimeout(function () {
    $('#splashScreen div.content img').addClass('loaded');
  }, 1000);
  setTimeout(function () {
    $('#splashScreen div.content p').addClass('loaded');
  }, 1300);

  navigator.geolocation.getCurrentPosition(init, function (error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
  });

  //wywolanie klikniecia mapy z menu
  setTimeout(function () {
    $('#bottom-nav .item:nth-of-type(1)').trigger('click');
  }, 200);

  //zmiana klas i przelaczanie widokow z dolnej nawigacji
  $('#bottom-nav div.item').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var ktoraStrona = $(this).attr('data-page');

    if (ktoraStrona == 'map-content') {
      $('div.page:not("#mapa")').removeClass('active');
      $('#mapa').addClass('active');

      $('#bottom-nav div.fab').addClass('refresh').html('<svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><g><g><g><g><g><path d="M26.6,21.7c-0.1,0-0.2,0-0.3-0.1l-2.7-2.4c-0.2-0.2-0.2-0.5,0-0.7c0.2-0.2,0.5-0.2,0.7,0l2.3,2.1l2.1-2.3c0.2-0.2,0.5-0.2,0.7,0c0.2,0.2,0.2,0.5,0,0.7l-2.4,2.7C26.8,21.6,26.7,21.7,26.6,21.7C26.6,21.7,26.6,21.7,26.6,21.7z"/></g><g><path  d="M11,22c-0.1,0-0.2,0-0.3-0.1c-0.2-0.2-0.2-0.5,0-0.7l2.4-2.7c0.1-0.1,0.2-0.2,0.3-0.2c0.1,0,0.3,0,0.4,0.1l2.7,2.4c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0l-2.3-2.1l-2.1,2.3C11.3,22,11.1,22,11,22z"/></g></g></g><g><g><g><path  d="M26.6,21.5C26.6,21.5,26.5,21.5,26.6,21.5c-0.3,0-0.5-0.3-0.5-0.6c0.2-1.6-0.2-3.3-1.1-4.6c-1-1.3-2.4-2.2-4.1-2.4c-1.6-0.2-3.3,0.2-4.6,1.1c-0.2,0.2-0.5,0.1-0.7-0.1c-0.2-0.2-0.1-0.5,0.1-0.7c1.5-1.1,3.4-1.6,5.3-1.3c1.9,0.3,3.6,1.3,4.7,2.8c1.1,1.5,1.6,3.4,1.3,5.3C27.1,21.3,26.8,21.5,26.6,21.5z"/></g><g><path  d="M20,27.2c-0.4,0-0.7,0-1.1-0.1c-1.9-0.3-3.6-1.3-4.7-2.8c-1.1-1.5-1.6-3.4-1.3-5.3c0-0.3,0.3-0.5,0.6-0.4c0.3,0,0.5,0.3,0.4,0.6c-0.2,1.6,0.2,3.3,1.1,4.6c1,1.3,2.4,2.2,4.1,2.4c1.6,0.2,3.3-0.2,4.6-1.1c0.2-0.2,0.5-0.1,0.7,0.1c0.2,0.2,0.1,0.5-0.1,0.7C23,26.7,21.5,27.2,20,27.2z"/></g></g></g></g></g></svg>');
      $('#bottom-nav div.fab').transition({
        scale: 1
      });

      //odwiezanie mapy
      $('#bottom-nav div.fab.refresh').click(function (event) {
        if ($(this).hasClass('active')) {
          event.preventDefault();
        } else {
          $(this).addClass('active');

          navigator.geolocation.getCurrentPosition(init, function () {
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
          });

          setTimeout(function () {
            $(this).removeClass('active');
          }, 1000);
        }
      });
    } else if (ktoraStrona == 'fav-content') {
      $('div.page:not("#ulubione")').removeClass('active');
      $('#ulubione').addClass('active');

      $('#bottom-nav div.fab').transition({
        scale: 0
      });

      wyswietlUlubione();
    } else if (ktoraStrona == 'creator-content') {
      $('div.page:not("#kreator")').removeClass('active');
      $('#kreator').addClass('active');

      $('#bottom-nav div.fab').transition({
        scale: 0
      });
    } else if (ktoraStrona == 'copyright-content') {
      $('div.page:not("#copyright")').removeClass('active');
      $('#copyright').addClass('active');

      $('#bottom-nav div.fab').transition({
        scale: 0
      });
    }

    $('#bottom-nav .item.active').removeClass('active');
    $(this).addClass('active');
  });

  function enterDashboard() {
    if (sessionStorage.getItem('registered') != '') {
      $('#dashboard').fadeIn();
      $('div.kreator-section:not(#dashboard)').fadeOut();
    }
  }

  //LOGOWANIE//////////////////////////
  $('#logowanie-form').submit(function (event) {
    event.preventDefault();

    $('button.zalogujButton').toggleClass('logging');

    var mail = $('#logowanie-form input[name="email"]').val();
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//login.php',
      type: 'post',
      data: $(this).serialize(),
      success: function (msg) {
        if (msg == 'Nieprawidłowy email lub hasło!') {
          $('#logowanie-form p.warning').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/> </svg>' + msg);
          $('#logowanie-form p.warning').transition({
            scale: 1
          }, 300);

          setTimeout(function () {
            $('#logowanie-form p.warning').transition({
              scale: 0
            }, 250);

            $('#logowanie-form p.warning').html('');
          }, 2000);

          $('button.zalogujButton').toggleClass('logging');
        } else {
          sessionStorage.setItem('logged', mail);
          $('#dashboard header p.logged_email').html(mail);

          var splitted = msg.split('~');
          loggedMenuID = splitted[2];

          sesja = ustawDaneSesji(mail, function (msg) {
            var splitted = msg.split('~');
            $('#dashboard header h2.truncate').html(splitted[0]);
            $('#dashboard header p.local_type').html(splitted[1]);
            sessionStorage.setItem('loggedLat', splitted[2]);
            sessionStorage.setItem('loggedLng', splitted[3]);

            pobierzKategorieKreator();

            setTimeout(function () {
              $('button.zalogujButton').toggleClass('logging');

              $('.logowanie-container').fadeOut();
              $('#dashboard').fadeIn();
            }, 2000);
          });
        }
      }
    });
  });

  function ustawDaneSesji(mail, callback) {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getMenu_kreator.php',
      type: 'POST',
      data: {
        email: mail
      },
      success: callback
    });

    return callback;
  }

  $('#logowanie-form input').click(function () {
    $(this).focus();
  });

  $('input').click(function () {
    $(this).focus();
  });

  $('#register-form > div > section.step1 > p').click(function () {
    $('#bottom-nav div.item.waves-effect:nth-of-type(1)').click();
  });

  //FUNKCJE DO WYSWETLANIA REJESTRACJI
  function registerGoStep(number) {
    if (number == 1) {
      $('#register-form').transition({
        x: 0
      }, 400);

      $('div.dalej').html('Dalej').removeClass('rejestrujButton');
    } else if (number == 2) {
      $('#register-form').transition({
        x: (-1) * windowWidth
      }, 400);

      $('div.dalej').html('Dalej').removeClass('rejestrujButton');
    } else {
      $('#register-form').transition({
        x: (-2) * windowWidth
      }, 400);

      setTimeout(function () {
        $('div.dalej').html('Rejestruj').addClass('rejestrujButton');
      }, 100);
    }

    $('#kreator > div.kreator-section.rejestracja-container > div.steps > span.active').removeClass('active');
    $('#kreator > div.kreator-section.rejestracja-container > div.steps > span:nth-of-type(' + number + ')').addClass('active');

    $('#kreator > div.kreator-section.rejestracja-container > div.steps > p').html('KROK' + number);
  }

  //REJESTRACJAAAA /////////////////
  $('#logowanie-form > p:nth-child(6) > a').click(function () {
    $('.logowanie-container').fadeOut();
    $('.rejestracja-container').fadeIn();

    //powrot do logowania
    $('#kreator > div.kreator-section.rejestracja-container > div.nav-gorne > svg').click(function () {
      $('.logowanie-container').fadeIn();
      $('.rejestracja-container').fadeOut();

      setTimeout(function () {
        //ustawienie rejestracji na poczatkowym stanie
        registerGoStep(1);
      }, 400);
    });
  });

  $('#kreator > div.kreator-section.rejestracja-container > div.nav-gorne > svg').click(function () {
    $('.logowanie-container').fadeIn();
    $('.rejestracja-container').fadeOut();

    setTimeout(function () {
      //ustawienie rejestracji na poczatkowym stanie
      setRegisterStart();
    }, 400);
  });

  //eventy swipe na REJESTRACJI
  $('#register-form > div > section.step1').swipe({
    swipeStatus: function (event, phase, direction, distance) {
      if (phase == 'move' || phase == "start") {
        var $target = event.target.nodeName;
        if ($target.toLowerCase() === 'input' || $target.toLowerCase() === 'p') {
          return false;
        } else {
          $('input').blur();
        }

        if (direction == 'left') {
          $('#register-form').transition({
            x: (-1) * distance
          }, 10);
        }
      }

      if (phase == 'end') {
        if (direction == 'left') {
          registerGoStep(2);
        }
      }

      if (phase == 'cancel') {
        $('#register-form').transition({
          x: 0
        }, 200);
      }
    },
    triggerOnTouchEnd: false,
    threshold: 160,
    excludedElements: "input, p"
  });

  $('#register-form > div > section.step2').swipe({
    swipeStatus: function (event, phase, direction, distance) {
      if (phase == 'move' || phase == "start") {
        var $target = event.target.nodeName;
        var $target2 = event.target;
        if ($target.toLowerCase() === 'input') {
          return false;
        } else {
          $('input').blur();
        }

        if (direction == 'left') {
          $('#register-form').transition({
            x: (-1) * windowWidth - distance
          }, 10);
        } else if (direction == 'right') {
          $('#register-form').transition({
            x: (-1) * windowWidth + distance
          }, 10);
        }
      }

      if (phase == 'end') {
        if (direction == 'left') {
          registerGoStep(3);
        } else if (direction == 'right') {
          registerGoStep(1);
        }
      }

      if (phase == 'cancel') {
        $('#register-form').transition({
          x: (-1) * windowWidth
        }, 300);
      }
    },
    triggerOnTouchEnd: false,
    threshold: 160,
    excludedElements: "input, select, textarea"
  });

  $('#register-form > div > section.step3').swipe({
    swipeStatus: function (event, phase, direction, distance) {
      if (phase == 'move') {
        if (direction == 'right') {
          $('#register-form').transition({
            x: (-2) * windowWidth + distance
          }, 10);
        }
        if (direction == 'up' || direction == 'down') {
          return false;
        }
      }

      if (phase == 'end') {
        if (direction == 'right') {
          registerGoStep(2);
        }
      }

      if (phase == 'cancel') {
        $('#register-form').transition({
          x: (-2) * windowWidth
        }, 300);
      }
    },
    triggerOnTouchEnd: false,
    threshold: 160
  });

  $('div.dalej').click(function () {
    if ($('#kreator > div.kreator-section.rejestracja-container > div.steps > span:nth-of-type(1)').hasClass('active')) {
      registerGoStep(2);

    } else if ($('#kreator > div.kreator-section.rejestracja-container > div.steps > span:nth-of-type(2)').hasClass('active')) {
      registerGoStep(3);
    }
  });

  $('#register-form > div > section.step1 > p:nth-child(6)').click(function () {
    $('#bottom-nav > div:nth-child(3) > div.item.item-map').trigger('click');

    //powiadom o koniecznosci wybrania lokalu
  });

  //WALIDACJA REJESTRACJI
  $('#kreator > div.kreator-section.rejestracja-container > div.buttonWrap > div.dalej.waves-effect.z-depth-2').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    if ($(this).hasClass('rejestrujButton')) {

      //SPRAWDZAM FORMULARZ REJESTRACJI
      if ($('#register-form > div > section.step1 > div > input[type="text"]').val() == '') {
        registerGoStep(1);

        $('#register-form > div > section.step1 > p.warning').html('<i class="fas fa-exclamation-circle"></i> Nie podano lokalu!');

        setTimeout(function () {
          $('#register-form > div > section.step1 > p.warning').html('');
        }, 2000);

      } else if (($('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val() == '') || ($('#register-form > div > section.step2 > div:nth-child(4) > input[type="password"]').val() == '')) {
        registerGoStep(2);

        $('#register-form > div > section.step2 > p.warning').html('<i class="fas fa-exclamation-circle"></i> Oba pola są wymagane!');
      } else {
        if ($('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val().indexOf('@') >= 0) {
          if ($('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val().length >= 6) {
            if ($('#register-form > div > section.step2 > div:nth-child(4) > input[type="password"]').val().length >= 5) {
              //REJESTRUJ !!! HURRA

              $('#kreator > div.kreator-section.rejestracja-container > div.buttonWrap > div.dalej.waves-effect.z-depth-2.rejestrujButton').fadeOut();
              $('#kreator > div.kreator-section.rejestracja-container > div.buttonWrap > div.preloader-wrapper.small.active').fadeIn();

              console.log('LOKAL: ' + $('#register-form > div > section.step1 > div > input[type="text"]').val());
              console.log('EMAIL: ' + $('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val());
              console.log('HASLO: ' + $('#register-form > div > section.step2 > div:nth-child(4) > input[type="password"]').val());
              console.log('TYP: ' + $('#register-form > div > section.step3 > div > div:nth-child(1) > div:nth-child(2) > div > label > input[type="radio"]:checked').val());

              $.ajax({
                url: 'http://mpietrewicz.nazwa.pl//app//register.php',
                type: 'post',
                data: {
                  lat: $('#register-form > div > section.step1 > input[name="lat"]').val(),
                  lng: $('#register-form > div > section.step1 > input[name="lng"]').val(),
                  email: $('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val(),
                  pwd: $('#register-form > div > section.step2 > div:nth-child(4) > input[type="password"]').val(),
                  type: $("#register-form input[name='type']:checked").val(),
                  vicinity: $('#register-form > div > section.step1 input[name="vicinity"]').val()
                },
                success: function (msg) {
                  var splitted = msg.split('_');
                  var email = splitted[1];

                  if (msg.indexOf('registered') >= 0) {
                    $('#kreator > div.kreator-section.rejestracja-container > div.buttonWrap > div.preloader-wrapper.small.active').fadeOut();

                    $('div.success').transition({
                      'x': 0
                    }, 500);

                    setTimeout(function () {
                      setRegisterStart();
                      $('div.rejestracja-container').fadeOut();
                      $('div.logowanie-container').fadeIn();
                    }, 500);


                    sessionStorage.setItem('registered', 'yes');

                    //                      setTimeout(function () {
                    //                        $('#kreator > div.kreator-section.rejestracja-container > div.nav-gorne > svg').trigger('click');
                    //                      }, 500);

                    $('#kreator div.success > div > button').click(function () {
                      $('div.success').transition({
                        'x': 10000
                      }, 400);
                    });

                  }
                }
              });




            } else {
              registerGoStep(2);

              $('#register-form > div > section.step2 > p.warning').html('<i class="fas fa-exclamation-circle"></i> Hasło musi mieć co najmniej 5 znaków');
            }

          } else {
            registerGoStep(2);
          }
        } else {
          registerGoStep(2);

          $('#register-form > div > section.step2 > p.warning').html('<i class="fas fa-exclamation-circle"></i> Podaj poprawny e-mail!');
        }
      }

    } else {
      //
    }

  });

  //FUNKCJA USTAWIAJACA REJESTRACJE NA POCZATKOWYM STANIE
  function setRegisterStart() {
    $('#kreator > div.kreator-section.rejestracja-container > div.buttonWrap > div.dalej.waves-effect.z-depth-2.rejestrujButton').fadeIn();
    registerGoStep(1);

    $('#register-form > div > section.step1 > input[name="lat"]').val('');
    $('#register-form > div > section.step1 > input[name="lng"]').val('');
    $('#register-form > div > section.step2 > div:nth-child(3) > input[type="text"]').val('');
    $('#register-form > div > section.step2 > div:nth-child(4) > input[type="password"]').val('');
    $('#register-form > div > section.step1 input[name="vicinity"]').val('');
    $('#register-form > div > section.step2 > p.warning').html('');
  }

  //WYLOGOWANIE
  $('#dashboard header div.wyloguj > svg').click(function () {
    sessionStorage.removeItem('logged');
    loggedMenuID = 0;
    sessionStorage.removeItem('loggedLat');
    sessionStorage.removeItem('loggedLng');

    $('#dashboard').fadeOut();
    $('div.logowanie-container').fadeIn();
  });


  //podstrony w dashboardzie////////////////////////////
  $('div.dashboard-item').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var pageID = $(this).data('page');
    $('#' + pageID).transition({
      x: 0
    }, 250);

    if ($(this).attr('id') == 'button_pokaz') {
      $('#bottom-nav > div:nth-child(3) > div.item.item-map').click();

      console.log('lat: ' + sessionStorage.getItem('loggedLat') + ', lng: ' + sessionStorage.getItem('loggedLng'));

      var wspolrzedne = new google.maps.LatLng(sessionStorage.getItem('loggedLat'), sessionStorage.getItem('loggedLng'));

      map.panTo(wspolrzedne);
      geocodeLatLng(geocoder, wspolrzedne, map, infowindow);
    }

    if (pageID == 'kreator-ustawienia') {
      $('#edytujUzytkownika > div > input[type="email"]').val(sessionStorage.getItem('logged'));
    }

    $('div.dashboard-main .nav-gorne svg').click(function () {
      $('#' + pageID).transition({
        x: '1000px'
      }, 200);
    });
  });

  function pobierzKategorieKreator() {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getCategories_kreator.php',
      type: 'post',
      data: {
        mail: sessionStorage.getItem('logged')
      },
      success: function (msg) {
        if (msg == '') {
          $('#kreator-zarzadzaj_menu ul.collection').html('<p class="brak"><svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> <g> <g> <g> <g> <path d="M24,28.5h-8c-1.4,0-2.5-1.1-2.5-2.5V14c0-1.4,1.1-2.5,2.5-2.5h3.6c0.4,0,0.8,0.2,1.1,0.4l5.4,5.4 c0.3,0.3,0.4,0.7,0.4,1.1V26C26.5,27.4,25.4,28.5,24,28.5z M16,12.5c-0.8,0-1.5,0.7-1.5,1.5v12c0,0.8,0.7,1.5,1.5,1.5h8 c0.8,0,1.5-0.7,1.5-1.5v-7.6c0-0.1-0.1-0.3-0.1-0.4l-5.4-5.4c-0.1-0.1-0.2-0.1-0.4-0.1H16z"/> </g> <g> <path d="M20.5,12v4c0,0.8,0.7,1.5,1.5,1.5h4v1h-4c-1.4,0-2.5-1.1-2.5-2.5v-4H20.5z"/> </g> </g> </g> </g> </svg> Brak kategorii</p>');
        } else {
          $('#kreator-zarzadzaj_menu ul.collection').html(msg);

          klikKategoriaKreator();



          $('#kreator-zarzadzaj_menu > div.container > ul > li a.secondary-content.delete-cat').click(function () {
            let catID = $(this).parent().children('input').val();

            $.confirm({
              theme: 'modern',
              icon: 'fas fa-trash',
              type: 'red',
              title: 'Usuń kategorię',
              backgroundDismiss: true,
              content: 'Czy na pewno chcesz usunąć kategorię?',
              buttons: {
                confirm: {
                  action: function () {
                    $.ajax({
                      url: 'http://mpietrewicz.nazwa.pl//app//deleteCategory.php',
                      type: 'post',
                      data: {
                        categoryID: catID
                      },
                      success: function (msg) {
                        if (msg == 'deleted') {
                          $.alert({
                            title: 'Sukces!',
                            content: 'Usunięto kategorię',
                            type: 'green',
                            typeAnimated: true,
                            theme: 'modern',
                            icon: 'fas fa-check',
                            backgroundDismiss: true
                          });
                          pobierzKategorieKreator();
                        } else {
                          $.alert({
                            title: 'Błąd!',
                            content: 'Coś poszło nie tak...',
                            type: 'red',
                            typeAnimated: true,
                            theme: 'modern',
                            icon: 'fas fa-exclamation',
                            backgroundDismiss: true
                          });
                        }
                      }
                    });
                  },
                  btnClass: 'btn-green',
                  text: 'Usuń'
                },
                cancel: {
                  text: 'Anuluj'
                }
              }
            });
          });
        }
      }
    });
  }

  function klikKategoriaKreator() {
    $('#kreator-zarzadzaj_menu ul.collection li.collection-item').click(function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (event.target !== event.currentTarget) return;

      var catName = $(this).data('category');
      var catID = $(this).children('input').val();

      console.log('pobrane id kategorii po kliknieciu: ' + catID);

      pobierzListeDanKreator(catID);

      $('#kreator-kategoria').transition({
        x: 0
      }, 300);
      
      

      $('#kreator-kategoria p.kategoria').html(catName);

      $('#kreator-kategoria .nav-gorne svg').click(function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        $('#kreator-kategoria').transition({
          x: '1000px'
        }, 300);
      });

      $('#addDish').click(klikDodajDanie(catID));

    });
  }

  $('#addCat').click(function () {
    $.confirm({
      theme: 'modern',
      backgroundDismiss: true,
      type: 'green',
      icon: 'fas fa-plus',
      typeAnimated: true,
      closeIcon: true,
      title: 'Dodaj kategorię',
      content: '' +
        '<form id="addCategoryForm">' +
        '<div class="form-group">' +
        '<label>Wpisz nazwę kategorii</label>' +
        '<input type="text" placeholder="Nazwa kategorii" class="name form-control" name="name" required />' +
        '</div>' +
        '<div class="row center-align" style="width:  100%;"><div class="col s4"><svg class="selected" id="Potrawy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg></div><div class="col s4"><svg id="Napoje" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/><path fill="none" d="M0 0h24v24H0z"/></svg></div>' +
        '<div class="col s4"><svg id="Desery" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 447.064 447.064" style="enable-background:new 0 0 447.064 447.064;height: 24px;" xml:space="preserve"><g><g><path d="M299.839,284.585c-17.696,5.991-36.172,9.023-55.055,9.023c-28.93,0-56.9-7.112-81.676-20.679c-19.631,17.168-44.902,26.808-71.149,26.808c-9.047,0-17.793-1.236-26.198-3.341l26.02,140.511h264.528l24.182-130.561c-5.454,0.927-11.022,1.52-16.737,1.52C340.059,307.866,317.73,299.672,299.839,284.585z M171.871,411.058c-0.39,0.057-0.788,0.081-1.179,0.081c-3.975,0-7.446-2.918-8.031-6.966l-10.177-70.393c-0.642-4.438,2.439-8.568,6.885-9.21c4.406-0.585,8.568,2.439,9.21,6.885l10.177,70.393C179.398,406.286,176.309,410.416,171.871,411.058z M238.777,403.376c0,4.487-3.642,8.129-8.129,8.129c-4.487,0-8.129-3.642-8.129-8.129v-71.125c0-4.487,3.642-8.129,8.129-8.129c4.487,0,8.129,3.642,8.129,8.129V403.376z M298.636,404.173c-0.585,4.048-4.064,6.966-8.031,6.966c-0.39,0-0.78-0.024-1.179-0.081c-4.438-0.642-7.527-4.763-6.885-9.21l10.177-70.393c0.65-4.446,4.796-7.478,9.21-6.885c4.438,0.642,7.527,4.763,6.885,9.21L298.636,404.173z"></path><path d="M53.527,274.986c1.479,0.683,2.975,1.341,4.495,1.951c1.463,0.577,2.943,1.114,4.43,1.626c9.267,3.146,19.167,4.926,29.499,4.926c27.353,0,51.852-12.014,68.695-30.97c23.752,15.582,52.738,24.841,84.131,24.841c20.955,0,40.822-4.162,58.81-11.518c15.168,15.851,36.489,25.776,60.16,25.776c6.877,0,13.526-0.927,19.923-2.495c1.455-0.358,2.918-0.683,4.341-1.114c1.504-0.455,2.959-1.024,4.422-1.561c31.856-11.705,54.632-42.22,54.632-78.14c0-37.196-24.386-68.67-58.03-79.384c-8.023-66.809-69.516-118.767-144.25-118.767c-63.907,0-118.051,38.034-137.462,90.796c-5.007-0.845-10.12-1.382-15.371-1.382C41.163,99.571,0,140.742,0,191.521C0,228.571,21.955,260.419,53.527,274.986z"></path></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div></div>' +
        '</form>',

      buttons: {
        confirm: {
          text: 'Dodaj',
          btnClass: 'btn-green',
          action: function () {
            var name = this.$content.find('.name').val();
            if (!name) {
              $.alert('Wpisz poprawną nazwę');
              return false;
            } else {
              $.ajax({
                url: 'http://mpietrewicz.nazwa.pl//app//addCategory.php',
                type: 'post',
                data: {
                  name: this.$content.find('input[name="name"]').val(),
                  menuID: loggedMenuID,
                  type: $('#addCategoryForm > div.row.center-align > div.col.s4 svg.selected').attr('id')
                },
                success: function (msg) {
                  if (msg == 'Dodano kategorię') {
                    $.alert({
                      title: 'Sukces!',
                      content: 'Dodano kategorię',
                      type: 'green',
                      typeAnimated: true,
                      theme: 'modern',
                      icon: 'fas fa-check',
                      backgroundDismiss: true
                    });
                    pobierzKategorieKreator();
                  } else {
                    $.alert({
                      title: 'Błąd!',
                      content: msg,
                      type: 'red',
                      typeAnimated: true,
                      theme: 'modern',
                      icon: 'fas fa-exclamation',
                      backgroundDismiss: true
                    });
                  }
                }
              });
            }
          }
        },
        cancel: {
          text: 'Anuluj',
          btnClass: 'btn-default'
        }
      },
      onContentReady: function () {
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
          e.preventDefault();
          jc.$$formSubmit.trigger('click');
        });

        $('#addCategoryForm > div.row.center-align > div.col.s4 svg').click(function () {
          $('#addCategoryForm > div.row.center-align > div.col.s4 svg.selected').removeClass('selected');
          $(this).addClass('selected');
        });
      }
    });
  });

  function klikDodajDanie(catID) {
    return function () {
      helpClick(catID);
    }
  }

  function helpClick(catID) {

    $('#kreator-dodaj_danie').transition({
      x: 0
    }, 300);

    console.log('po kliknieciu dodaj danie, kategoria id:' + catID);

    $('#uploadImageForm > input[name="catID"]').val(catID);
    let terazID = $('#uploadImageForm > input[name="catID"]').val();

    console.log('update do inputa, wartosc z inputa: ' + terazID);

    $('#kreator-dodaj_danie div.nav-gorne svg').click(function () {
      $('#kreator-dodaj_danie').transition({
        x: '1000px'
      }, 250);

      $('#uploadImageForm > input[name="catID"]').val('');
    });
  }

  //zobacz menu swojego lokalu
  $('#watchMenu').click(function (event) {
    event.preventDefault();
    $('div#lokal-menu').transition({
      x: 0
    });

    var nazwa_lokalu = $(this).parent().find('h2').text();
    console.log(nazwa_lokalu);

    $('#bottom-nav > div:nth-child(3) > div.item.item-map').trigger('click', [true]);

    $('#lokal-menu > div.nav-gorne > svg').click(function () {
      $('#lokal-menu').transition({
        x: '1000px'
      }, 200);
    });

    var fav = sprawdzCzyUlubione(nazwa_lokalu);
    if (fav == 'faved') {
      $('#dodajDoUlubionych').addClass('added');
    } else {
      $('#dodajDoUlubionych').removeClass('added');
    }

    klikUlubioneMenu(nazwa_lokalu);

    wyswietlMenuKategorie(sessionStorage.getItem('loggedLat'), sessionStorage.getItem('loggedLng'));
  });


  $('#uploadImageForm').submit(function (event) {
    event.preventDefault();

    var formData = new FormData($(this)[0]);
    var catID = $('#uploadImageForm > input[name="catID"]').val();

    //robimy dodanie dania
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//addDish.php',
      type: 'POST',
      data: formData,
      async: false,
      success: function (msg) {
        if (msg == 'Dodano danie') {
          $('#kreator-dodaj_danie div.nav-gorne svg').click();
          $('#uploadImageForm')[0].reset();

          pobierzListeDanKreator(catID);
          pobierzKategorieKreator();
        }
      },
      cache: false,
      contentType: false,
      processData: false
    });
  });

  function skladniki_alergeny() {
    $('#kreator-kategoria > ul > li a.secondary-content.allergens').click(function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      let dishID = $(this).parent().prev().find('input').val();
      console.log(dishID);

      $('#alergeny').transition({
        x: 0
      });

      wyswietlAlergeny(dishID);

      $('#alergeny div.nav-gorne svg').click(function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        $('#alergeny').transition({
          x: '1000px'
        });
      });

      aktualizujAlergeny();
    });

    $('#kreator-kategoria > ul > li a.secondary-content.ingredients').click(function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      let dishID = $(this).parent().prev().find('input').val();

      wyswietlSkladniki(dishID);

      $('#skladniki > form > input[type="text"]:nth-child(1)').val(dishID);
      console.log('id dania: ' + dishID);
      console.log('przypisane id dania do inputa: ' + $('#skladniki > ul > input[type="text"]').val());

      $('#skladniki').transition({
        x: 0
      });

      $('#skladniki div.nav-gorne svg').click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        $('#skladniki').transition({
          x: '1000px'
        });
      });

      $('#dodajSkladnikForm > div.submit').click(dodajSkladnik($('#dodajSkladnikForm > input[type="text"]:nth-child(2)').val()));
    });

    $('#kreator-kategoria > ul > li div.collapsible-body a.secondary-content.delete').click(function () {
      let dishID = $(this).parent().prev().find('input').val();
      let catID = $('#kreator-kategoria > ul > input[type="text"]').val();

      $.confirm({
        theme: 'modern',
        icon: 'fas fa-trash',
        type: 'red',
        title: 'Usuń danie',
        backgroundDismiss: true,
        content: 'Czy na pewno chcesz usunąć danie?',
        buttons: {
          confirm: {
            action: function () {
              $.ajax({
                url: 'http://mpietrewicz.nazwa.pl//app//deleteDish.php',
                type: 'POST',
                data: {
                  dishID: dishID
                },
                success: function (msg) {
                  if (msg == 'deletedupdated') {
                    $.alert({
                      title: 'Sukces!',
                      content: 'Usunięto danie!',
                      type: 'green',
                      typeAnimated: true,
                      theme: 'modern',
                      icon: 'fas fa-check',
                      backgroundDismiss: true
                    });

                    pobierzListeDanKreator(catID);
                    pobierzKategorieKreator();
                  } else {
                    $.alert({
                      title: 'Błąd!',
                      content: 'Coś poszło nie tak...',
                      type: 'red',
                      typeAnimated: true,
                      theme: 'modern',
                      icon: 'fas fa-exclamation',
                      backgroundDismiss: true
                    });
                  }
                }
              });
            },
            btnClass: 'btn-green',
            text: 'Usuń'
          },
          cancel: {
            text: 'Anuluj'
          }
        }
      });
    });
  }

  function pobierzListeDanKreator(category_id) {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getDishes_kreator.php',
      type: 'POST',
      data: {
        catID: category_id
      },
      success: function (msg) {
        if (msg == '') {
          $('#kreator-kategoria ul.collapsible').html('Brak dań w tej kategorii');
        } else {
          $('#kreator-kategoria ul.collapsible').html(msg);

          skladniki_alergeny();
          $('#kreator-kategoria ul.collapsible').collapsible();
        }
      }
    });
  }

  function wyswietlSkladniki(dishID) {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getIngredients.php',
      type: 'post',
      data: {
        dishID: dishID
      },
      success: function (msg) {
        if (msg == '') {
          $('#skladniki ul.collection.ingredients').html('Brak składników');
        } else {
          $('#skladniki ul.collection.ingredients').html(msg);

          $('#skladniki > ul > li > a').click(function (event) {
            event.preventDefault();
            event.stopPropagation();

            let nazwa = $(this).parent().children('p').text();
            console.log('nazwa skladnika: ' + nazwa);

            usunSkladnik(nazwa, dishID);
          });
        }
      }
    });
  }


  function dodajSkladnik(dishID) {
    return function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      dodajSkladnikHelp(dishID);
    }
  }

  function dodajSkladnikHelp(dishID) {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//addIngredient.php',
      type: 'post',
      data: $('#dodajSkladnikForm').serialize(),
      success: function (msg) {
        if (msg == 'Dodano składnik') {
          wyswietlSkladniki($('#dodajSkladnikForm > input[name="dishID"]').val());
          $('#dodajSkladnikForm > input[name="name"]').val('');
        } else {
          alert(msg);
        }
      }
    });
  }

  function usunSkladnik(name, dishID) {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//deleteIngredient.php',
      type: 'post',
      data: {
        name: name,
        dishID: dishID
      },
      success: function (msg) {
        if (msg == 'deleted') {
          wyswietlSkladniki(dishID);
        } else {
          $.alert({
            title: 'Błąd!',
            content: 'Coś poszło nie tak...',
            type: 'red',
            typeAnimated: true,
            theme: 'modern',
            icon: 'fas fa-exclamation',
            backgroundDismiss: true
          });
        }
      }
    });
  }

  function wyswietlAlergeny(dishID) {
    console.log('id dania w ajaxie getallergensoptions: ' + dishID);
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getAllergensOptions.php',
      type: 'post',
      data: {
        dishID: dishID
      },
      success: function (msg) {
        $('#alergenyForm').html(msg);
        
        $('#alergenyForm > p > label').click(function (event) {
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.preventDefault();
           
          console.log('clicked');
          var $parent = $(this).parent();
          console.log($parent.attr('class'));
          
          if ($parent.hasClass('checked')) {
            $parent.removeClass('checked').addClass('default');
          } else {
            $parent.removeClass('default').addClass('checked');
          }
        });
      }
    });
  }

  function aktualizujAlergeny(dishID) {
    $('#alergeny #updateAllergens').click(function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      $.ajax({
        url: 'http://mpietrewicz.nazwa.pl//app//updateAllergens.php',
        type: 'POST',
        data: $('#alergenyForm').serialize(),
        success: function (msg) {
          $.alert({
            title: 'Sukces!',
            content: 'Zaktualizowano!',
            type: 'green',
            typeAnimated: true,
            theme: 'modern',
            icon: 'fas fa-check',
            backgroundDismiss: true
          });
        }
      });
    });
  }

  function usunKategorie(catID) {
    return function () {
      usunKategorieHelp(catID);
    }
  }

  function usunKategorieHelp(catID) {

  }

  $('#edytujUzytkownika').submit(function (event) {
    event.preventDefault();

    var newPwd = $('#edytujUzytkownika input[type="password"]').val();
    console.log(newPwd);

    if (newPwd == '') {
      $.alert({
        title: 'Błąd!',
        content: 'Wprowadź hasło',
        type: 'red',
        typeAnimated: true,
        theme: 'modern',
        icon: 'fas fa-exclamation',
        backgroundDismiss: true
      });
    } else {
      $.ajax({
        url: 'http://mpietrewicz.nazwa.pl//app//updateUser.php',
        type: 'POST',
        data: {
          pwd: newPwd,
          mail: sessionStorage.getItem('logged')
        },
        success: function (msg) {
          $.alert({
            title: 'Sukces!',
            content: 'Zmieniono hasło!',
            type: 'green',
            typeAnimated: true,
            theme: 'modern',
            icon: 'fas fa-check',
            backgroundDismiss: true
          });

          $('#edytujUzytkownika input[type="password"]').val('');
        }
      });
    }
  });

  $('#usunMenu').click(function (event) {
    $.confirm({
      theme: 'modern',
      icon: 'fas fa-trash',
      type: 'red',
      title: 'Usuń menu',
      backgroundDismiss: true,
      content: 'Czy na pewno chcesz usunąć swoje menu? Stracisz wszystkie dane bez możliwości ich odzyskania!',
      buttons: {
        confirm: {
          action: function () {
            $.ajax({
              url: 'http://mpietrewicz.nazwa.pl//app//deleteMenu.php',
              type: 'POST',
              data: {
                mail: sessionStorage.getItem('logged')
              },
              success: function (msg) {
                $.alert({
                  title: 'Sukces!',
                  content: 'Twoje menu zostało usunięte!',
                  type: 'green',
                  typeAnimated: true,
                  theme: 'modern',
                  icon: 'fas fa-check',
                  backgroundDismiss: true
                });

                $('#dashboard header div.wyloguj > svg').click();
                $('#kreator-ustawienia > div.nav-gorne > svg').click();
              }
            });
          },
          btnClass: 'btn-green',
          text: 'Usuń'
        },
        cancel: {
          text: 'Anuluj'
        }
      }
    });
  });
});

//////////UPLOAD DISH IMAGE
function uploadImg(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var img = e.target.result;
      var setCSS = 'url(' + img + ')';

      $('#uploadImageForm > div > label').css('background', setCSS);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

/////////////////////////////KONIEC GŁÓWNEGO PRZEBIEGU APLIKACJI

document.addEventListener("deviceready", startApp, false);

setTimeout(function(){
  navigator.geolocation.getCurrentPosition(init, function (error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
  });
}, 300000);
