<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    export let lngStart: number = 0;
    export let latStart: number = 0;

    export let lngDest: number = 0;
    export let latDest: number = 0;

    export let mapId: string = "map";

    let map: L.Map;

    onMount(() => {
        // basic leaflet setup
        if (browser) {
            let L = window.L;

            type MapStart = {
                lat: number;
                lng: number;
                zoom: number;
            };

            const mapStart: MapStart = JSON.parse(localStorage.getItem("mapStart") || "{}");

            map = L.map(mapId);

            const markers: {
                [key: string]: L.Marker;
            } = {
                start: L.marker([latStart, lngStart], {
                    draggable: true,
                    icon: L.icon({
                        iconUrl: "/assets/icons/marker_blue.png",
                        iconAnchor: [13, 21],
                    }),
                    title: "Start",
                }),
                dest: L.marker([latDest, lngDest], {
                    draggable: true,
                    icon: L.icon({
                        iconUrl: "/assets/icons/marker_red.png",
                        iconAnchor: [13, 21],
                    }),
                    title: "Destination",
                }),
            };

            Object.entries(markers).forEach(([key, marker]) => {
                marker.addTo(map);
                marker.on("dragend", (e) => {
                    const latlng = e.target.getLatLng();
                    if (key === "start") {
                        latStart = latlng.lat;
                        lngStart = latlng.lng;
                    } else if (key === "dest") {
                        latDest = latlng.lat;
                        lngDest = latlng.lng;
                    }
                });
            });

            if (Object.keys(mapStart).length > 0) {
                map.setView([mapStart.lat, mapStart.lng], mapStart.zoom);
            } else {
                map.locate({ setView: true, maxZoom: 16 });
            }

            const cartoLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            });

            const darkmodeLayer = L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
                maxZoom: 20,
                attribution:
                    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            });

            L.control
                .layers({
                    Carto: cartoLayer,
                    Darkmode: darkmodeLayer,
                })
                .addTo(map);

            darkmodeLayer.addTo(map);

            map.on("moveend", () => {
                localStorage.setItem(
                    "mapStart",
                    JSON.stringify({
                        lat: map.getCenter().lat,
                        lng: map.getCenter().lng,
                        zoom: map.getZoom(),
                    })
                );
            });

            const darkModePref = window.matchMedia("(prefers-color-scheme: dark)");
            darkModePref.addEventListener("change", (e) => {
                if (e.matches) {
                    cartoLayer.remove();
                    darkmodeLayer.addTo(map);
                } else {
                    darkmodeLayer.remove();
                    cartoLayer.addTo(map);
                }
            });
        }
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
</svelte:head>

<div id={mapId} />

<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
/>

<style>
    div {
        height: 100%;
        width: 100%;

        background-color: transparent;
    }
</style>
