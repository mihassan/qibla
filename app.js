"use strict";

const kaaba = L.latLng(21.4225, 39.8262);
let center = kaaba.clone();

const map = L.map('map').setView(center, 18);
const qibla = L.geodesic([], { steps: 6 }).addTo(map);
const marker = L.marker(kaaba, { draggable: true }).addTo(map);

L.esri.basemapLayer('Imagery').addTo(map);

const search = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  style: 'bar',
  showMarker: false,
  showPopup: false,
  autoClose: true,
});
map.addControl(search);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => reposition(
      L.latLng(
        position.coords.latitude,
        position.coords.longitude
      )
    )
  );
}

map.on('click', e => reposition(e.latlng));
map.on('geosearch/showlocation', e => reposition(L.latLng(e.location.y, e.location.x)));
marker.on('dragend', e => reposition(marker.getLatLng()));

function reposition(position) {
  center = position;
  marker.setLatLng(center)
  map.panTo(center);
  qibla.setLatLngs([kaaba, center]);
}
