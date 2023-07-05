<script lang="ts">
    import { onMount } from "svelte";
    import Map from "../../components/Map.svelte";

    type groupsType = {
        [key: string]: {
            min: number;
            max: number;
        };
    };

    const weigthGroups: groupsType = {
        // TODO: export this a to a json file
        "extremely-light": {
            min: 0,
            max: 2,
        },
        light: {
            min: 2,
            max: 5,
        },
        moderate: {
            min: 5,
            max: 10,
        },
        heavy: {
            min: 10,
            max: 20,
        },
        "extremely-heavy": {
            min: 20,
            max: 1000,
        },
    };
    const volumeGroups: groupsType = {
        "extremely-small": {
            min: 0,
            max: 2,
        },
        small: {
            min: 2,
            max: 5,
        },
        moderate: {
            min: 5,
            max: 15,
        },
        large: {
            min: 15,
            max: 30,
        },
        "extremely-large": {
            min: 30,
            max: 1000,
        },
    };

    const specialitiesIcons: { [key: string]: string } = {
        wine: "fragile",
        hot: "flamable",
        bomb: "explosive",
        dog: "living",
    };

    const getAmountOfIcons = (weigth: number, groups: groupsType) => {
        let amount = 0;
        for (const group of Object.keys(groups)) {
            amount++;
            const groupObj = groups[group];
            if (weigth >= groupObj.min && weigth < groupObj.max) {
                break;
            }
        }
        return amount;
    };

    /**
     * Get the address of a location using nominatim
     * @param lat latitude
     * @param long longitude
     * @returns the address of the location or null if there was an error
     */
    const getAddress = async (lat: number, long: number): Promise<string | void> => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`;
        const response = await fetch(url);
        const data = (await response.json()) as { [key: string]: any };

        // check if data has a error
        if (data.hasOwnProperty("error")) {
            return new Promise((resolve) => resolve());
        }

        return new Promise((resolve) => resolve(data.display_name));
    };

    /**
     * Get the length of a route using the osrm api
     * @param startLocation the start location of the route first element is latitude second is longitude
     * @param destinationLocation the destination location of the route first element is latitude second is longitude
     * @returns the length of the route in km
     */
    const getRouteLength = async (startLocation: [number, number], destinationLocation: [number, number]): Promise<number> => {
        const url = `http://router.project-osrm.org/route/v1/driving/${startLocation[0]},${startLocation[1]};${destinationLocation[0]},${destinationLocation[1]}?overview=false&geometries=geojson`;
        const response = await fetch(url);
        const data = (await response.json()).routes[0].distance;

        console.log(data / 1000);
        return new Promise((resolve) => resolve(data / 1000));
    };

    let requests: any[] = [];

    onMount(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        const configResponse = await fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();

        const url = config.apiUrl + "/rideRequest";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
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
                    <h3>{req.title}</h3>
                    <p>{req.cargoDescription}</p>

                    <span class="sizeIndicator">
                        <span class="smallToBig">
                            {#each Array.from({ length: getAmountOfIcons(req.cargoWeight, weigthGroups) }, (_, i) => i++) as number}
                                <i class="bx bx-dumbbell" />
                            {/each}
                            <p>{JSON.stringify(req.cargoWeight)} KG</p>
                        </span>

                        <span class="smallToBig">
                            {#each Array.from({ length: getAmountOfIcons(req.cargoWeight, volumeGroups) }, (_, i) => i++) as number}
                                <i class="bx bxs-cube" />
                            {/each}
                            <p>{JSON.stringify(req.cargoVolume)} Liter</p>
                        </span>
                    </span>

                    <span class="route">
                        <span>
                            <i class="bx bxs-map" />
                            {#await getAddress(req.startLocation[0], req.startLocation[1])}
                                <p>...</p>
                            {:then data}
                                {#if data}
                                    <p>{data}</p>
                                {:else}
                                    <p>No address</p>
                                {/if}
                            {/await}
                        </span>
                        <span>
                            <i class="bx bx-trip" />
                            {#await getRouteLength(req.startLocation, req.destinationLocation)}
                                <p>...</p>
                            {:then data}
                                <p>{data} KM</p>
                            {/await}
                        </span>
                        <span>
                            <i class="bx bxs-map" />
                            {#await getAddress(req.destinationLocation[0], req.destinationLocation[1])}
                                <p>...</p>
                            {:then data}
                                {#if data}
                                    <p>{data} KM</p>
                                {:else}
                                    <p>No address</p>
                                {/if}
                            {/await}
                        </span>
                    </span>

                    <span class="special">
                        {#each Object.keys(specialitiesIcons) as iconName}
                            <i class={`bx bxs-${iconName}`} class:no={!req.cargoSpecialCharacteristics.includes(specialitiesIcons[iconName])} />
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
        align-items: flex-start;
    }
    .route > span {
        width: 33%;
        gap: 0.5rem;

        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
    .route > span > p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        margin-block: 0;
    }

    .route,
    .special {
        gap: 1rem;
        width: 100%;
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
    .smallToBig > p {
        margin-block: 0;
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
