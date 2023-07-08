<script lang="ts">
    import { getAddress } from "../utils/getAddress";
    import Loader from "./loader.svelte";

    export let lng: number;
    export let lat: number;
</script>

{#await getAddress(lat, lng)}
    <Loader />
{:then address}
    <p>{address}</p>
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
