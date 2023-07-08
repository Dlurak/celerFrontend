<script lang="ts">
    import { getRouteLength } from "../utils/getRouteLength";
    import Loader from "./loader.svelte";

    export let startLocation: [number, number];
    export let destinationLocation: [number, number];
</script>

{#await getRouteLength(startLocation, [destinationLocation[1], destinationLocation[0]])}
    <Loader />
{:then data}
    {#if data}
        <p>{data} km</p>
    {:else}
        <p>no route found</p>
    {/if}
{:catch error}
    <p>Something went wrong</p>
{/await}

<style>
    p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        margin-block: 0;
    }
</style>
