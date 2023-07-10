<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type L from "leaflet";
    import type { geoJSONrideRequests } from "../types/geoJSON";

    // @ts-ignore
    let map: L.Map;

    export let data: geoJSONrideRequests;

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

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

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

            L.geoJSON(data).addTo(map);
        }
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
    }
</style>
