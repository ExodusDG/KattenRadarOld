/* COOKIE DATA  */
console.log(document.cookie)

var str = document.cookie;

var cookieArray = str.split(/[;] */).reduce(function(result, pairStr) {
    var arr = pairStr.split('=');
    if (arr.length === 2) { result[arr[0]] = arr[1]; }
    return result;
}, {});


console.log(cookieArray)

var chatMessageArray = [];

if (typeof cookieArray.steps != 'undefined') {
    var stepContainer = $('.search__steps_container');
    var scrollWidth = $('.search__steps_container > div').width();
    var calculatedTranslate = (cookieArray.steps - 1) * scrollWidth;
    stepContainer.attr('style', 'transform: translateX(-' + calculatedTranslate + 'px)')
    $('.search__chat > h1 > span').text(cookieArray.adress)
    $('#step-1 > .search__step_circle').addClass('step__green')
    $('#step-2 > .search__step_circle').addClass('step__active')

    $('.chat__left_start').attr('style', 'display: flex')
    $('#bot_msg_0').attr('style', 'display: flex')
    $('.chat__start_repeat').click(function() {
        $('#user_msg_1').attr('style', 'display:flex')
        $('#user_msg_1').addClass('user__msg_show');
        setTimeout(() => {
            $('.chat__left_input').attr('style', 'display:block');
            $('#bot_msg_1').attr('style', 'display:flex');
            $('#bot_msg_1').addClass('chat__msg_bot')
            $('.chat__left_start').attr('style', 'display:none')

        }, 500);
    })
    $('.chat__start_where').click(function() {
        chatHistoryBuild()
    })
}

function chatHistoryBuild() {
    $.each(cookieArray, function(key, value) {
        console.log(cookieArray)
        if (typeof cookieArray.catName != 'undefined') {
            $('.chat__left_start').attr('style', 'display: none')
            $('.cat__name_chat').attr('style', 'display: flex').addClass('user__msg_show')
            $('#user_msg_2').find('p').text(cookieArray.catName)
            $('.chat__catname').attr('style', 'opacity:1')
            $('.chat__see_cat').attr('style', 'opacity:1')
            $('.chat__catname > span').text(cookieArray.catName)
            $('.chat__see_cat span').text(cookieArray.catName)
            $('.chat__cat_desc > span').text(cookieArray.adress)
            $('.chat__last_loc > span').text(cookieArray.adress)
            $('.chat__cat_desc').html('<span>kattenradar </span>' + cookieArray.catDesc)

            if (typeof cookieArray.catImage != 'undefined') {
                $('#user_msg_3').attr('style', 'display: none').removeClass('user__msg_show')
                $('.cat__img_chat').attr('style', 'display: flex').addClass('user__msg_show');
                $('.chat__phone__cat').attr('src', cookieArray.catImage);
                $('.chat__phone__cat').attr('style', 'display: flex')


                $('.chat__phone__cat').attr('src', cookieArray.catImage)
                $('.chat__phone__cat').attr('display', 'block')

                if (typeof cookieArray.userEmail != 'undefined') {
                    $('.user_email_chat').attr('style', 'display: flex').addClass('user__msg_show');
                    $('#user_msg_6').find('p').text(cookieArray.userEmail);

                    if (typeof cookieArray.userNumber != 'undefined') {
                        $('.user_number_chat').attr('style', 'display: flex').addClass('user__msg_show');
                        $('#bot_msg_9').find('p > span').text(cookieArray.userNumber)
                        $('#bot_msg_10').addClass('user__msg_show')
                    } else {
                        $('.chat__left_buttons_email').attr('style', 'display: flex')
                    }
                } else {
                    $('.chat__left_input_email').attr('style', 'display: block')
                }
            }
        } else {

            $('#bot_msg_1').attr('style', 'display: flex');
            $('#bot_msg_1').addClass('chat__msg_bot');
            $('.chat__left_input').attr('style', 'display:flex');
            return false;
        }
    })
}


/* SEARCH */

$('#map__button_top').click(function() {
    if ($('.search__map_form').hasClass('form_in_top')) {
        $('.search__steps').attr('style', 'background-image: url(./img/step__line_2.svg)')
        $('#step-1').find('.search__step_circle').addClass('step__done')

        $('#step-2').removeClass('step_inactive')

        $('.search__steps_container').attr('style', 'transform: translateX(-1110px)')

        $('.chat__last_loc > span').text(catAdress)
        document.cookie = "steps=2";
        document.cookie = "adress=" + catAdress;

        $('#bot_msg_1').attr('style', 'display: flex');
        $('#bot_msg_1').addClass('chat__msg_bot');
        $('.chat__left_input').attr('style', 'display:flex');
    }
})

$('.search__step').hover(
    function() {
        $(this).find('.search__step_desc').addClass('search__step_desc_show')
    },
    function() {
        $('.search__step_desc_show').removeClass('search__step_desc_show')
    }
)

/* GOOGLE MAP */

// This example requires the Places library. Include the libraries=places + AIzaSyDFA6udGwPSgJt_QacZp9tatCTazR32t2U
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places">

var myLatlng;
var userEmail;
var catAdress;

function initMap() {
    const componentForm = [
        'location',
        'locality',
        'administrative_area_level_1',
        'country',
        'postal_code',
    ];

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: { lat: 37.4221, lng: -122.0841 },
        mapTypeControl: false,
        mapTypeId: "terrain",
        fullscreenControl: false,
        zoomControl: false,
        draggable: false,
        scrollwheel: false,
        streetViewControl: false
    });
    image = 'img/icons/marker.svg'
    const marker = new google.maps.Marker({ map: map, draggable: false, icon: image });
    const autocompleteInput = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
        fields: ["address_components", "geometry", "name"],
        types: ["address"],

    });

    var radiusOnMap;

    $('#location').keypress(function(e) {
        if (e.which == 13) {
            adressSelect()
            return false; //prevent duplicate submission
        }
    });

    function adressSelect() {
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        catAdress = place.name;
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert('No details available for input: \'' + place.name + '\'');
            return;
        }
        renderAddress(place);
        fillInAddress(place);

        var markersArray = [];
        markersArray.push(
            [
                place.name, {
                    center: place.geometry.location,
                    population: 2,
                }
            ]
        )
        const cityCircle = new google.maps.Circle({

        });
        if (radiusOnMap == true) {
            cityCircle.setMap(null);
            radiusOnMap = true;
        } else {
            const cityCircle = new google.maps.Circle({
                strokeColor: "#F8A35B",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#F8A35B",
                fillOpacity: 0.3,
                map,
                center: markersArray[0][1].center,
                radius: Math.sqrt(markersArray[0][1].population) * 100,
            });
            radiusOnMap = true;
            console.log(radiusOnMap)
        }

        mapInput()

        function mapInput() {
            $('#map').removeClass('map__blured');
            $('.search__map_button').attr('style', 'border-top-right-radius: 0px')
            $('.search__map_form').addClass('form_in_top')
            $('.search__map_button').text('Aanmelden')
            $('.search__map_button').attr('id', 'map__button_top')
        }
    }
    $('.search__map_button').click(function() {
        adressSelect()
    })

    function fillInAddress(place) { // optional parameter
        const addressNameFormat = {
            'street_number': 'short_name',
            'route': 'long_name',
            'locality': 'long_name',
            'administrative_area_level_1': 'short_name',
            'country': 'long_name',
            'postal_code': 'short_name',
        };
        const getAddressComp = function(type) {
            for (const component of place.address_components) {
                if (component.types[0] === type) {

                    return component[addressNameFormat[type]];
                }
            }
            return '';
        };
        document.getElementById('location').value = getAddressComp('street_number') + ' ' +
            getAddressComp('route');
        for (const component of componentForm) {
            // Location field is handled separately above as it has different logic.
            if (component !== 'location') {
                document.getElementById(component).value = getAddressComp(component);
            }
        }
    }

    function renderAddress(place) {
        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
    }
}

/* GOOGLE MAP END */

/* STEPS LOGIC */

/* STEPS SWITCHER */

$('.search__step').click(function() {
    var clickedStep = $(this).attr('id').replace('step-', '')
    var stepContainer = $('.search__steps_container');
    var scrollWidth = $('.search__steps_container > div').width();
    var calculatedTranslate = (clickedStep - 1) * scrollWidth;
    $('.search__chat > h1 > span').text(catAdress)

    if (clickedStep == '1') {
        stepContainer.attr('style', 'transform: translateX(-' + calculatedTranslate + 'px)')
    } else if (clickedStep == '2') {
        if (cookieArray.steps > 1)
            stepContainer.attr('style', 'transform: translateX(-' + calculatedTranslate + 'px)')
    } else if (clickedStep == '3') {
        if (cookieArray.steps > 2)
            stepContainer.attr('style', 'transform: translateX(-' + calculatedTranslate + 'px)')
    } else if (clickedStep == '4') {
        if (cookieArray.steps > 3)
            stepContainer.attr('style', 'transform: translateX(-' + calculatedTranslate + 'px)')
    }
})

/* STEPS 1 - 2  */
var catName;


$('#bot_msg_0').addClass('chat__msg_bot')


$('.chat__cat_send').click(function() {
    catName = $('#cat_name').val()
    document.cookie = "catName=" + catName;
    setTimeout(() => {
        catNameSend()
    }, 0);
})

function catNameSend() {
    catName = $('#cat_name').val()
    document.cookie = "catName=" + catName;

    $('.chat__left_input').attr('style', 'display:none')

    $('#user_msg_2').find('p').text(catName)
    $('#user_msg_2').attr('style', 'display: flex')
    $('#user_msg_2').addClass('user__msg_show');
    $('.chat__catname > span').text(catName);
    $('.chat__catname').css('opacity', '1')

    $('.chat__see_cat > span').text(catName);
    $('.chat__see_cat').css('opacity', '1')

    setTimeout(() => {
        $('#bot_msg_2').attr('style', 'display: flex')
        $('#bot_msg_2').addClass('chat__msg_bot')
        $('#user_msg_3').attr('style', 'display: flex')
        $('#user_msg_3').addClass('user__msg_show');
    }, 500);
}

$('#cat_name').keypress(function(e) {
    if (e.which == 13) {
        catNameSend()
        return false; //prevent duplicate submission
    }
});

$('.chat_file_upload').click(function() {
    $('#user_msg_3').attr('style', 'display: none')
    $('#user_msg_4').attr('style', 'display: flex')
    var catImage = $('#user_msg_4').find('img').attr('src');
    $('.chat__phone__cat').attr('src', catImage);
    $('.chat__phone__cat').css('display', 'block')


    $('#user_msg_4').addClass('user__msg_show');
    setTimeout(() => {
        $('#bot_msg_3').attr('style', 'display: flex')
        $('#bot_msg_3').addClass('chat__msg_bot')
        $('.chat__left_buttons').attr('style', 'display: flex')

        document.cookie = "catImage=" + catImage;

    }, 500);
})
$('#img__upload').click(function() {
    $('#bot_msg_2').attr('style', 'display: none')
    $('#bot_msg_2').removeClass('chat__msg_bot')
    $('#user_msg_3').attr('style', 'display: none')
    $('#user_msg_3').removeClass('user__msg_show');

    $('#bot_msg_1').attr('style', 'display: flex')
    $('.chat__left_input').attr('style', 'display:flex')
})

$('.chat__left_b_done').click(function() {
    $('#user_msg_5_1').attr('display', 'flex')
    $('#user_msg_5_1').addClass('user__msg_show');
    $('.chat__left_buttons').attr('style', 'display:none')
    $('.chat__input_big').attr('style', 'display:flex')
    $('#cat_desc').val(`opgesloten in schuren of bij  gebou-wen. Erg mens vriendelijke kat makkelijk. Opgesloten in schuren of bij gebouwen. Erg mens vriendelijke kat makkelijk. Mogelijk opgesloten in schuren of bij  gebou-wen. Erg mens vriendelijke kat makkelijk. Opgesloten in schuren of bij gebouwen. Erg mens vriendelijke kat makkelijk`)

})

$('#desc__back').click(function() {
    $('.chat__input_big').attr('style', 'display: none');

    $('#bot_msg_3').attr('style', 'display: flex');
    $('.chat__left_buttons').attr('style', 'display: flex');
})

$('.chat__cat_send_1').click(function() {
    catDesc = $('#cat_desc').val();
    document.cookie = "catDesc=" + catDesc;
    $('.chat__cat_desc').html('<span>kattenradar </span>' + catDesc)
    $('#user_msg_5_1').attr('style', 'display: flex')
    $('#user_msg_5_1').addClass('user__msg_show');
    $('#user_msg_5_1').find('p').text(catDesc)
    $('.chat__input_big').attr('style', 'display:none')

    setTimeout(() => {
        $('#bot_msg_4').attr('style', 'display: flex')
        $('#bot_msg_4').addClass('chat__msg_bot')
        $('.chat__left_input_email').attr('style', 'display: block')
    }, 500);
})


$('#email__back').click(function() {

    $('#bot_msg_4').attr('style', 'display: none')
    $('#bot_msg_4').removeClass('chat__msg_bot')
    $('.chat__left_input_email').attr('style', 'display: none')

    $('#user_msg_5_1').attr('style', 'display: none')
    $('#user_msg_5_2').attr('style', 'display: none')
    $('#bot_msg_3').attr('style', 'display: none')
    $('#user_msg_4').attr('style', 'display: none')

    $('#user_msg_3').attr('style', 'display: flex')
    $('#user_msg_3').addClass('user__msg_show')
})

$('.email__cat_send').click(function() {
    emailSend()
})

function emailSend() {
    userEmail = $('#email').val();
    document.cookie = "userEmail=" + userEmail;
    $('#user_msg_6').find('p').text(userEmail);
    $('#user_msg_6').attr('style', 'display: flex');
    $('#user_msg_6').addClass('user__msg_show');
    $('.chat__left_input_email').attr('style', 'display: none')

    setTimeout(() => {
        $('#bot_msg_5').attr('style', 'display: flex');
        $('#bot_msg_5').addClass('chat__msg_bot')
        $('#bot_msg_5').find('p > span').text(userEmail)
        $('.chat__left_buttons_email').attr('style', 'display: flex')
    }, 500);
}

$('#email').keypress(function(e) {
    if (e.which == 13) {
        emailSend()
        return false; //prevent duplicate submission
    }
});

$('.chat__left_e_error').click(function() {
    $('.chat__left_buttons_email').attr('style', 'display: none')
    $('#bot_msg_4').attr('style', 'display: flex')
    $('#bot_msg_4').addClass('chat__msg_bot')
    $('.chat__left_input_email').attr('style', 'display: block')
})


$('.chat__left_e_done').click(function() {
    $('.chat__left_buttons_email').attr('style', 'display: none')
    $('#user_msg_7').attr('style', 'display: flex')
    $('#user_msg_7').addClass('user__msg_show');

    setTimeout(() => {

        $('#bot_msg_7').find('p > span').text(catName)
        $('#bot_msg_7').attr('style', 'display: flex')
        $('#bot_msg_7').addClass('chat__msg_bot')

        $('.chat__left_buttons_notif').attr('style', 'display: flex')
    }, 500);
})

$('.chat__left_n_error').click(function() {
    //
})

$('#mob__back').click(function() {
    $('#user_msg_9').attr('style', 'display: none')
    $('#bot_msg_8').attr('style', 'display: none')
    $('#user_msg_8').attr('style', 'display: none')
    $('#bot_msg_7').attr('style', 'display: none')
    $('#user_msg_7').attr('style', 'display: none')
    $('#bot_msg_5').attr('style', 'display: none')
    $('#user_msg_6').attr('style', 'display: none')
    $('.chat__left_input_email').attr('style', 'display: flex')
})

$('.chat__left_n_done').click(function() {
    $('#user_msg_8').attr('style', 'display: flex')
    $('#user_msg_8').addClass('user__msg_show');

    setTimeout(() => {
        $('.chat__left_buttons_notif').attr('style', 'display: none')
        $('#bot_msg_8').attr('style', 'display: flex')
        $('#bot_msg_8').addClass('chat__msg_bot')
        $('#user_msg_9').attr('style', 'display: flex')
        $('#user_msg_9').addClass('user__msg_show');
    }, 500);
})

var userNumber;

$('#number__send').click(function() {
    phoneSend()
})

function phoneSend() {
    userNumber = $('#phone').val();
    document.cookie = "userNumber=" + userNumber;
    document.cookie = "getUpdate=" + true;
    setTimeout(() => {
        $('#bot_msg_9').find('p > span').text(userNumber)
        $('#bot_msg_9').attr('style', 'display: flex');
        $('#bot_msg_9').addClass('chat__msg_bot')

        $('.chat__left_buttons_phone').attr('style', 'display: flex');

    }, 500);
}

$('#phone').keypress(function(e) {
    if (e.which == 13) {
        phoneSend()
        return false; //prevent duplicate submission
    }
});

$('.chat__left_p_done').click(function() {
    $('#user_msg_10').attr('style', 'display: flex')
    $('#user_msg_10').addClass('user__msg_show');
    $('.chat__left_buttons_phone').attr('style', 'display: none');

    setTimeout(() => {

        $('#bot_msg_10').attr('style', 'display: flex')
            //    $('#bot_msg_10').find('p > span').text(CatAdress);
        $('#bot_msg_10').addClass('chat__msg_bot')

        $('.chat__left_final').attr('style', 'display: flex');

    }, 500);
})

$('.chat__left_b_error').click(function() {
    $('#user_msg_5_2').attr('style', 'display: flex')
    $('#user_msg_5_2').addClass('user__msg_show');

    $('.chat__left_buttons').attr('style', 'display: none')

    setTimeout(() => {
        $('#bot_msg_4').attr('style', 'display: flex')
        $('#bot_msg_4').addClass('chat__msg_bot')
        $('.chat__left_input_email').attr('style', 'display: block')

        document.cookie = "steps=2";
    }, 500);
})

$('.chat__left_n_error').click(function() {
    $('.chat__left_buttons_notif').attr('style', 'display:none')

    $('#bot_msg_10').attr('style', 'display: flex')
    $('#bot_msg_10').addClass('chat__msg_bot')

    $('.chat__left_final').attr('style', 'display: flex');

    document.cookie = "steps=2";
})