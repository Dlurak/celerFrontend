<script lang="ts">
    import { onMount } from "svelte";
    import Map from "../../components/Map.svelte";
    import { json } from "@sveltejs/kit";

    let requests: any[] = [];

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
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        switch (response.status) {
            case 401:
            case 403:
                localStorage.removeItem("token");
                window.location.href = "/login";
                break;
        }

        requests = await response.json();
    });

    // $: console.log(requests);
</script>

<main>
    {#if requests.length === 0}
        <div id="notFound">
            <p>There are no ride requests as for now</p>
        </div>
    {:else}
        <ul>
            {#each requests as req}
                <li>
                    <h3>{req.thing}</h3>
                    <p>{req.cargoDescription}</p>
                    
                    <span class="sizeIndicator">
                        <span class="smallToBig">
                            {#each Array.from({ length: 5}, (_, i) => i++) as number}
                                <i class="bx bx-dumbbell" />
                            {/each}
                        </span>
                        <span class="smallToBig">
                            {#each Array.from({ length: 5}, (_, i) => i++) as number}
                                <i class="bx bxs-cube" />
                            {/each}
                        </span>
                    </span>

                    <span class="route">
                        <span>
                            <i class="bx bxs-map" />
                            <p>Start adress</p>
                        </span>
                        <span>
                            <i class="bx bx-trip" />
                            <p>9,8 Km</p>
                        </span>
                        <span>
                            <i class="bx bxs-map" />
                            <p>End adress</p>
                        </span>
                    </span>

                    <span class="special">
                        {#each ['wine', 'hot', 'bomb', 'dog'] as name}
                            <i class={`bx bxs-${name} no`} />
                        {/each}
                    </span>
                </li>
            {/each}
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

    main > ul {
        overflow-y: scroll;
    }

    main > ul > li {
        padding: 1rem;
        background-color: hsla(0, 0%, 0%, 0.2);

        border-radius: 15px;
        display: flex;
        flex-direction: column;

        height: fit-content;
        margin: 1rem;
    }

    .route,
    .route > span {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
    }

    .route,
    .special {
        gap: 1rem;
    }

    .special {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-evenly;
    }

    li > span,
    li > p {
        font-size: 1rem;
        margin: 0;
    }

    .sizeIndicator {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        margin-block: 1rem;
    }

    .smallToBig {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        gap: 0.5rem;
    }


    .no {
        position: relative;
    }

    .no::after {
        content: "";
        width: 114%;
        height: 4px;
        border-radius: 100vmax;
        rotate: 45deg;
        transform-origin: top left;
        background-color: red;
        position: absolute;
        left: 0;
        top: 0;
    }


    #notFound {
        display: flex;
        justify-content: center;
    }
    #notFound > p {
        display: inline;
        margin-inline: 0;
        margin-block: 2rem;
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
