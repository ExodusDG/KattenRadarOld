/* SEARCH */

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
var CatAdress;
var userEmail;

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

    $('.search__map_button').click(function() {
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        CatAdress = place.name;
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
        }
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


/* STEPS 1 - 2  */

var catName;

$('.search__map_button').click(function() {

    setTimeout(() => {

        $('.search__steps').attr('style', 'background-image: url(./img/step__line_2.svg)')
        $('#step-1').find('.search__step_circle').addClass('step__done')

        $('#step-2').removeClass('step_inactive')

        $('.search__steps_container').attr('style', 'transform: translateX(-1110px)')

    }, 1000);
})

$('.chat__start_repeat').click(function() {
    $('.search__steps_container').attr('style', 'transform: translateX(0px)')
})

$('.chat__start_where').click(function() {
    $('#user_msg_1').attr('style', 'display:flex')

    setTimeout(() => {
        $('.chat__left_input').attr('style', 'display:block');
        $('#bot_msg_1').attr('style', 'display:flex');
        $('.chat__left_start').attr('style', 'display:none')
    }, 500);
})

$('.chat__cat_send').click(function() {
    catName = $('#cat_name').val()

    setTimeout(() => {
        $('.chat__left_input').attr('style', 'display:none')

        $('#user_msg_2').find('p').text(catName)
        $('#user_msg_2').attr('style', 'display: flex')

        setTimeout(() => {
            $('#bot_msg_2').attr('style', 'display: flex')
            $('#user_msg_3').attr('style', 'display: flex')
        }, 500);
    }, 0);
})

$('.chat_file_upload').click(function() {
    $('#user_msg_3').attr('style', 'display: none')
    $('#user_msg_4').attr('style', 'display: flex')
    setTimeout(() => {
        $('#bot_msg_3').attr('style', 'display: flex')
        $('.chat__left_buttons').attr('style', 'display: flex')
    }, 500);
})

$('.chat__left_b_done').click(function() {
    $('#user_msg_5_1').attr('display', 'flex')
    $('.chat__left_buttons').attr('style', 'display:none')
    $('.chat__input_big').attr('style', 'display:flex')
    $('#cat_desc').val(`opgesloten in schuren of bij  gebou-wen. Erg mens vriendelijke kat makkelijk. Opgesloten in schuren of bij gebouwen. Erg mens vriendelijke kat makkelijk. Mogelijk opgesloten in schuren of bij  gebou-wen. Erg mens vriendelijke kat makkelijk. Opgesloten in schuren of bij gebouwen. Erg mens vriendelijke kat makkelijk`)

})

$('.chat__cat_send_1').click(function() {
    $('#user_msg_5_1').attr('style', 'display: flex')
    catDesc = $('#cat_desc').val();
    $('.chat__input_big').attr('style', 'display:none')

    setTimeout(() => {
        $('#bot_msg_4').attr('style', 'display: flex')
        $('.chat__left_input_email').attr('style', 'display: block')
    }, 500);
})


$('.email__cat_send').click(function() {
    userEmail = $('#email').val();
    $('#user_msg_6').find('p').text(userEmail);
    $('#user_msg_6').attr('style', 'display: flex');
    $('.chat__left_input_email').attr('style', 'display: none')

    setTimeout(() => {
        $('#bot_msg_5').attr('style', 'display: flex');
        $('#bot_msg_5').find('p > span').text(userEmail)
        $('.chat__left_buttons_email').attr('style', 'display: flex')
    }, 500);
})

$('.chat__left_e_error').click(function() {
    $('.chat__left_buttons_email').attr('style', 'display: none')
    $('#bot_msg_4').attr('style', 'display: flex')
    $('.chat__left_input_email').attr('style', 'display: block')
})


$('.chat__left_e_done').click(function() {
    $('.chat__left_buttons_email').attr('style', 'display: none')
    $('#user_msg_7').attr('style', 'display: flex')

    setTimeout(() => {

        $('#bot_msg_7').find('p > span').text(catName)
        $('#bot_msg_7').attr('style', 'display: flex')

        $('.chat__left_buttons_notif').attr('style', 'display: flex')
    }, 500);
})

$('.chat__left_n_error').click(function() {
    //
})


$('.chat__left_n_done').click(function() {
    $('#user_msg_8').attr('style', 'display: flex')

    setTimeout(() => {
        $('.chat__left_buttons_notif').attr('style', 'display: none')
        $('#bot_msg_8').attr('style', 'display: flex')
        $('#user_msg_9').attr('style', 'display: flex')
    }, 500);
})

var userNumber;

$('#number__send').click(function() {
    userNumber = $('#phone').val();

    setTimeout(() => {
        $('#bot_msg_9').find('p > span').text(userNumber)
        $('#bot_msg_9').attr('style', 'display: flex');

        $('.chat__left_buttons_phone').attr('style', 'display: flex');

    }, 500);
})


$('.chat__left_p_done').click(function() {
    $('#user_msg_10').attr('style', 'display: flex')
    $('.chat__left_buttons_phone').attr('style', 'display: none');

    setTimeout(() => {

        $('#bot_msg_10').attr('style', 'display: flex')
        $('#bot_msg_10').find('p > span').text(CatAdress);

        $('.chat__left_final').attr('style', 'display: flex');

    }, 500);
})

$('.chat__left_b_error').click(function() {
    $('#user_msg_5_2').attr('style', 'display: flex')

    $('.chat__left_buttons').attr('style', 'display: none')

    setTimeout(() => {
        $('#bot_msg_4').attr('style', 'display: flex')
        $('.chat__left_input_email').attr('style', 'display: block')
    }, 500);
})

$('.chat__left_n_error').click(function() {
    $('.chat__left_buttons_notif').attr('style', 'display:none')

    $('#bot_msg_10').attr('style', 'display: flex')
    $('#bot_msg_10').find('p > span').text(CatAdress);

    $('.chat__left_final').attr('style', 'display: flex');
})