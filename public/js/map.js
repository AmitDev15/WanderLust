mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: latLang.locationCoordinates.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "#e61e4d" })
  .setLngLat(latLang.locationCoordinates.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${latLang.location}, ${latLang.country}</h4><p>Exact location provided after booking.</p>`
    )
  )
  .addTo(map);
