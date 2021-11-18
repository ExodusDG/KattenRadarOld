/* SEARCH */

$('.search__step_info').hover(
    function() {
        $(this).parents('.search__step').find('.search__step_desc').addClass('search__step_desc_show')
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

function initMap() {
    const componentForm = [
        'location',
        'locality',
        'administrative_area_level_1',
        'country',
        'postal_code',
    ];

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: { lat: 37.4221, lng: -122.0841 },
        mapTypeControl: false,
        mapTypeId: "terrain",
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true
    });
    image = 'img/icons/marker.svg'
    const marker = new google.maps.Marker({ map: map, draggable: false, icon: image });
    const autocompleteInput = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
        fields: ["address_components", "geometry", "name"],
        types: ["address"],

    });

    $('.search__map_button').click(function() {
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert('No details available for input: \'' + place.name + '\'');
            return;
        }
        renderAddress(place);
        fillInAddress(place);


        const citymap = {
            marker: {
                center: place.geometry.location,
                population: 2,
            }
        };
        console.log(place.geometry.location)

        for (const city in citymap) {
            // Add the circle for this city to the map.
            const cityCircle = new google.maps.Circle({
                strokeColor: "#F8A35B",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#F8A35B",
                fillOpacity: 0.3,
                map,
                center: citymap[city].center,
                radius: Math.sqrt(citymap[city].population) * 100,
            });
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