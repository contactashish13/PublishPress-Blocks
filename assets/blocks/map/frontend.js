window.addEventListener('load', function () {
    if (typeof google === "undefined") {
        return null;
    }

    var mapElm = document.querySelectorAll('.advgb-map-block .advgb-map-content');
    for (var i = 0; i < mapElm.length; i++) {
        elm = mapElm[i];
        var lat = parseFloat(elm.dataset.lat),
            lng = parseFloat(elm.dataset.lng),
            zoom = parseFloat(elm.dataset.zoom),
            defaultMarker = elm.dataset.default,
            icon = elm.dataset.icon,
            iconSize = parseInt(elm.dataset.isize) || 0,
            title = elm.dataset.title,
            desc = elm.dataset.desc,
            infoShown = elm.dataset.shown === 'true',
            info = '',
            mapStyle = decodeURIComponent(elm.dataset.style);

        if (!elm.dataset.info && (desc || title) ) {
            info = '<div class="advgbmap-wrapper">';
            if (title) info += '<h3 class="advgbmap-title">' + title + '</h3>';
            if (desc) info += '<p class="advgbmap-desc">'+ desc +'</p>';
            info += '</div>';
        } else if (elm.dataset.info) {
            info = decodeURIComponent(elm.dataset.info);
        }

        var location = {
            lat: lat,
            lng: lng
        };

        var map = new google.maps.Map(elm, {
            zoom: zoom,
            center: location,
            styles: mapStyle !== '' ? JSON.parse(mapStyle) : {},
            gestureHandling: 'cooperative'
        });
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: {
                url: icon || defaultMarker,
                scaledSize: new google.maps.Size(27, 43)
            }
        });

        if (info) {
            var infoWindow = new google.maps.InfoWindow({
                content: info
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });

            if (infoShown) {
                infoWindow.open(map, marker);
            }

        }

        if (icon && iconSize) {
            var realWidth = 0,
                realHeight = 0,
                img = new Image();

            img.src = icon;
            img.onload = function (ev) {
                realWidth = ev.target.width;
                realHeight = ev.target.height;
                iconSize = iconSize/100;

                marker.setIcon({
                    url: icon || defaultMarker,
                    scaledSize: new google.maps.Size(realWidth*iconSize, realHeight*iconSize)
                })
            };
        }
    }
});