<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { browser } from "$app/environment";
    import type { geoJSONrideRequests } from "../types/geoJSON";

    let map: L.Map;

    export let data: geoJSONrideRequests;

    let layeroObj: { [key: string]: L.Layer } = {};

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

            map = L.map("map");

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

    afterUpdate(() => {
        let L = window.L;

        // check if layerObj has a geoJSON layer/key
        if (layeroObj.geoJSON) {
            layeroObj.geoJSON.remove();
        }

        const geoJSON = L.geoJSON(data);
        geoJSON.addTo(map);

        layeroObj.geoJSON = geoJSON;
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
</svelte:head>

<div id="map" />

<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
/>

<style>
    #map {
        height: 100%;
        width: 100%;

        background-color: transparent;
    }
</style>
