//////////////////////////////////GŁÓWNY PRZEBIEG APLIKACJI

$(document).ready(function () {
  //wymiary okna
  var windowWidth = $('body').css('width');
  windowWidth = windowWidth.replace('px', '');
  var windowHeight = $('body').css('height');
  windowHeight = windowHeight.replace('px', '');

  //jezeli wymiary sie zmiennia to uaktualnj
  $(window).resize(function () {
    windowWidth = $('body').css('width');
    windowWidth = windowWidth.replace('px', '');

    //JAK KLAWIATURA SIE NA TEL POJAWIA
    //    var newHeight = $('body').css('height');
    //    newHeight = newHeight.replace('px', '');
    //    var roznica = windowHeight - newHeight;
    //    var styl = 'translateY(' + ((-1) * roznica) + 'px)';
    //    
    //    $('body').css('transform', styl);

    $('body').css('height', windowHeight + 'px');
    $('body').css('overflow-y', 'scroll');
  });

  //odwiezanie mapy
  $('div.map-content div.refresh').click(function (event) {
    if ($(this).hasClass('animating')) {
      event.preventDefault();
    } else {
      $(this).addClass('animating');

      navigator.geolocation.getCurrentPosition(init, function () {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      });

      setTimeout(function () {
        $(this).removeClass('animating');
      }, 1000);
    }
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
  $('#bottom-nav > div.item').click(function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    var ktoraStrona = $(this).attr('data-page');

    if (ktoraStrona == 'map-content') {
      $('div.page:not("#mapa")').removeClass('active');
      $('#mapa').addClass('active');
    } else if (ktoraStrona == 'fav-content') {
      $('div.page:not("#ulubione")').removeClass('active');
      $('#ulubione').addClass('active');
    } else if (ktoraStrona == 'creator-content') {
      $('div.page:not("#kreator")').removeClass('active');
      $('#kreator').addClass('active');
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

    var mail = $('#logowanie-form input[name="email"]').val();
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//login.php',
      type: 'post',
      data: $(this).serialize(),
      success: function (msg) {
        if (msg == 'Nieprawidłowy email lub hasło!') {
          $('#logowanie-form p.warning').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/> </svg>' + msg);

          setTimeout(function () {
            $('#logowanie-form p.warning').html('');
          }, 2000);
        } else {
          sessionStorage.setItem('logged', mail);
          $('#dashboard > header p.logged_email').html(mail);

          $.ajax({
            url: 'http://mpietrewicz.nazwa.pl//app//getMenu_kreator.php',
            data: {
              email: mail
            },
            type: 'post',
            success: function (msg) {
              var splitted = msg.split('~');
              $('#dashboard header h2.truncate').html(splitted[0]);
              $('#dashboard header p.local_type').html(splitted[1]);
            }
          });

          $('.logowanie-container').fadeOut();
          $('#dashboard').fadeIn();
        }
      }
    });
  });

  $('#logowanie-form input').click(function () {
    $(this).focus();
  });

  $('input').click(function () {
    $(this).focus();

    $(this).parent().addClass('active');
  });

  $('input').focusout(function () {
    $(this).parent().removeClass('active');
  });

  $('#register-form > div > section.step1 > p').click(function () {
    $('#bottom-nav > div.item.waves-effect:nth-of-type(1)').click();
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

  //eventy swipe na REJESTRACJI
  $('#register-form > div > section.step1').swipe({
    swipeStatus: function (event, phase, direction, distance) {
      if (phase == 'move' || phase == "start") {
        var $target = event.target.nodeName;
        if ($target.toLowerCase() === 'input') {
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
    threshold: 200
  });

  $('#register-form > div > section.step2').swipe({
    swipeStatus: function (event, phase, direction, distance) {
      if (phase == 'move' || phase == "start") {
        var $target = event.target.nodeName;
        var $target2 = event.target;
        var karuzela = $('.register-carousel');
        if ($target.toLowerCase() === 'input' || event.target == karuzela[0]) {
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
    threshold: 200
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
    threshold: 200
  });

  $('div.dalej').click(function () {
    if ($('#kreator > div.kreator-section.rejestracja-container > div.steps > span:nth-of-type(1)').hasClass('active')) {
      registerGoStep(2);

    } else if ($('#kreator > div.kreator-section.rejestracja-container > div.steps > span:nth-of-type(2)').hasClass('active')) {
      registerGoStep(3);
    }
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

              setTimeout(function () {
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
              }, 1000);



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
    $('#dashboard').fadeOut();
    $('div.logowanie-container').fadeIn();
  });



  //podstrony w dashboardzie////////////////////////////
  $('div.dashboard-item').click(function () {
    var pageID = $(this).data('page');
    $('#' + pageID).transition({
      x: 0
    }, 400);

    $('.nav-gorne svg').click(function () {
      $('#' + pageID).transition({
        x: '1000px'
      }, 400);
    });

    //WYSWIETLENIE MENU w kreatorze ////////////////////////
    if (pageID == 'kreator-zarzadzaj_menu') {
      wyswietlKategorieKreator();
    }
  });

  function wyswietlKategorieKreator() {
    $.ajax({
      url: 'http://mpietrewicz.nazwa.pl//app//getCategories_kreator.php',
      type: 'post',
      data: {
        mail: sessionStorage.getItem('logged')
      },
      success: function (msg) {
        $('#kreator-zarzadzaj_menu ul.collection').html('<li class="collection-header"><h4>Kategorie</h4></li>' + msg);
      }
    });
  }

});
/////////////////////////////KONIEC GŁÓWNEGO PRZEBIEGU APLIKACJI
