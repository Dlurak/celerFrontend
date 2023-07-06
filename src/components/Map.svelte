<script lang="ts">
    import { onMount } from "svelte";
    import { Map } from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import { PUBLIC_MAPTILER_API_TOKEN } from "$env/static/public";

    let apiKey = PUBLIC_MAPTILER_API_TOKEN;

    let map: Map;
    let mapContainer: HTMLDivElement;

    onMount(() => {
        const initialState = {
            lng: 5,
            lat: 34,
            zoom: 2,
        };

        map = new Map({
            container: mapContainer,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });

        map.on("load", () => {
            map.addSource("rides", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [5, 34],
                            },
                        },
                    ],
                },
            });
            map.loadImage("/car-solid-240.png", (error, image) => {
                if (error) throw error;
                console.log(image);
                console.log(typeof image);
                map.addImage("car-highres", image as any);
            });

            map.addLayer({
                id: "points",
                type: "symbol",
                source: "rides",
                layout: {
                    "icon-image": "car-highres",
                    "icon-size": 0.2,
                },
            });
        });
    });
</script>

<div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a>
    <div class="map" bind:this={mapContainer} />
</div>

<style>
    .map-wrap {
        position: relative;
        width: 100%;
        height: 100%; /* calculate height of the screen minus the heading */
    }

    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .watermark {
        position: absolute;
        left: 10px;
        bottom: 10px;
        z-index: 1;
    }
</style>
