<script lang="ts">
    import { onMount } from "svelte";
    import Map from "../../components/Map.svelte";
    import { getRouteLength } from "../../utils/getRouteLength";
    import type { groupsType } from "../../types/groupsType";
    import AddressLabel from "../../components/addressLabel.svelte";
    import type { geoJSONrideRequests } from "../../types/geoJSON";

    let weigthGroups: groupsType;
    let volumeGroups: groupsType;

    let specialitiesIcons: { [key: string]: string };

    const getAmountOfIcons = (value: number, groups: groupsType) => {
        let amount = 0;
        for (const group of Object.keys(groups)) {
            amount++;
            const groupObj = groups[group];
            if (value >= groupObj.min && value < groupObj.max) {
                break;
            }
        }
        return amount;
    };

    let requests: any[] = [];

    let requestsGeoJSON: geoJSONrideRequests;

    onMount(async () => {
        document.title = "Celer - Ride Requests";

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }

        const config = fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => {
            return res.json();
        });

        const url = (await config).apiUrl + "/rideRequest";

        const rideRequestsResponse = fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => {
            switch (res.status) {
                case 401:
                case 403:
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    break;
            }
            return res.json();
        });

        const specialitiesIconsPromise = fetch("/data/specialitiesIcons.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => {
            return res.json();
        });

        const groups = fetch("/data/groups.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => {
            return res.json();
        });

        specialitiesIcons = await specialitiesIconsPromise;
        weigthGroups = (await groups).weigthGroup;
        volumeGroups = (await groups).volumeGroup;
        requests = await rideRequestsResponse; // TODO: add error handling // TODO: add use promise.all

        requestsGeoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [0, 0]
                    },
                    properties: {
                        id: 0,
                        volume: 1,
                        weight: 1
                    }
                }
            ]
        };
        
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

                    <hr />

                    <span class="sizeIndicator">
                        <span class="smallToBig">
                            {#each Array.from({ length: getAmountOfIcons(req.cargoWeight, weigthGroups) }, (_, i) => i++) as i}
                                <i class="bx bx-dumbbell" />
                            {/each}
                            <p>{JSON.stringify(req.cargoWeight)} KG</p>
                        </span>

                        <span class="smallToBig">
                            {#each Array.from({ length: getAmountOfIcons(req.cargoWeight, volumeGroups) }, (_, i) => i++) as i}
                                <i class="bx bxs-cube" />
                            {/each}
                            <p>{JSON.stringify(req.cargoVolume)} Liters</p>
                        </span>
                    </span>

                    <hr />

                    <span class="route">
                        <span>
                            <i class="bx bxs-map" />
                            <AddressLabel lat={req.startLocation[1]} lng={req.startLocation[0]} />
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
                            <AddressLabel lat={req.startLocation[1]} lng={req.startLocation[0]} />
                        </span>
                    </span>

                    <hr />

                    <span class="special">
                        {#each Object.keys(specialitiesIcons) as iconName}
                            <!-- TODO: Make this safe with #await -->

                            {#if req.cargoSpecialCharacteristics.includes(specialitiesIcons[iconName])}
                                <i class={`bx bxs-${iconName}`} title={specialitiesIcons[iconName]} />
                            {:else}
                                <i class={`bx bxs-${iconName} no`} title={`Not ${specialitiesIcons[iconName]}`} />
                            {/if}
                        {/each}
                    </span>
                </li>
            {/each}
        </ul>
    {/if}

    <div id="mapContainer">
        <Map data={requestsGeoJSON}/>
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

    hr {
        margin: 0.5rem 0;
        width: 100%;
        border: 1px solid var(--text-color);
        opacity: var(--secondary-opacity);
        border-radius: 100vmax;
    }

    .route {
        display: flex;
        flex-direction: column;

        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
    .route > span {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: flex-start;

        width: 100%;
        gap: 0.5rem;

        margin-block: 0;
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

    @media only screen and (max-width: 800px) {
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
