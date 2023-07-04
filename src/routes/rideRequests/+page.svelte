<script lang="ts">
    import { onMount } from "svelte";
    import Map from "../../components/Map.svelte";

    let requests: Object[] = [];

    onMount(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        const configResponse = await fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        const config = await configResponse.json();

        const url = config.apiUrl + "/rideRequest";

        const response = await fetch(url, {
            method: "GET",
            // authorize with the jwt token stored in the local storage
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        requests = await response.json();
    });
</script>

<main>
    {#if requests}
        <div id="notFound">
            <p>There are no ride requests as for now</p>
        </div>
    {:else}
        <ul>
            <li>
                This will get dynamically populated with the ride requests in the near future
            </li>
        </ul>
    {/if}
    <div id="mapContainer">
        <Map />
    </div>
</main>


<style>
    main {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100vh;
    }
    main > #mapContainer {
        flex: 3;
    }
    main > ul,
    #notFound {
        list-style-type: none;
        margin: 0;
        padding: 0;
        flex: 1;
    }

    main * {
        height: 100%;
    }

    #notFound {
        display: flex;
        justify-content: center;
    }
    #notFound > p {
        display: inline;
        margin: 0;
        padding: 0;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media only screen and (max-width: 600px) {
        main {
            flex-direction: column-reverse;
            height: max-content;
        }
        main > #mapContainer {
            flex: 1;
            aspect-ratio: 1/1.25;
        }
        main > ul,
        #notFound {
            flex: 1;
            height: fit-content;
        }
    }
</style>
