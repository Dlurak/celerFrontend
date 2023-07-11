<script lang="ts">
    import { onMount } from "svelte";
    import type { groupsType } from "../../types/groupsType";
    import AddressLabel from "../../components/addressLabel.svelte";
    import type { geoJSONrideRequests } from "../../types/geoJSON";
    import { formatSeconds } from "../../utils/formatTimeFromStamp";
    import RouteLength from "../../components/routeLength.svelte";
    import Map from "../../components/Map.svelte";

    let weigthGroups: groupsType;
    let volumeGroups: groupsType;

    let specialitiesIcons: { [key: string]: string };

    let time = new Date();

    let page = 1;
    let limit = 2;
    let pageCount: number;

    let requests: any[] = [];

    let requestsGeoJSON: geoJSONrideRequests;

    let rideRequestsResponse: Promise<any>;

    let token: string;

    let config: Promise<any>;

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

    const handelPageChangeClick = async (newCount: number) => {
        page = newCount;
        rideRequestsResponse = requestPage(await config, token);
        requests = (await rideRequestsResponse).data;
        pageCount = (await rideRequestsResponse).pageCount;
        requestsGeoJSON = createGeoJSON();
    };

    async function requestPage(config: any, token: string) {
        const url = config.apiUrl + `/rideRequest?page=${page}&pageSize=${limit}`;

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

        return rideRequestsResponse;
    }

    function createGeoJSON() {
        const requestsGeoJSONBuild: geoJSONrideRequests = {
            type: "FeatureCollection",
            features: [],
        };

        for (const request of requests) {
            requestsGeoJSONBuild.features.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: request.startLocation.reverse(),
                },
                properties: {
                    id: request._id,
                    volume: request.cargoVolume,
                    weight: request.cargoWeight,
                },
            });
        }

        return requestsGeoJSONBuild;
    }

    onMount(async () => {
        document.title = "Celer - Ride Requests";

        token = localStorage.getItem("token") as string;
        if (!token) {
            window.location.href = "/login";
        }

        config = fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => {
            return res.json();
        });

        rideRequestsResponse = requestPage(await config, token);

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
        requests = (await rideRequestsResponse).data; // TODO: add error handling // TODO: add use promise.all
        pageCount = (await rideRequestsResponse).pageCount;

        requestsGeoJSON = createGeoJSON();

        setInterval(() => {
            time = new Date();
        }, 1000);
    });
</script>

<main>
    <aside>
        {#if requests.length === 0}
            <div id="notFound">
                <p>There are no ride requests as for now</p>
            </div>
        {:else}
            <div id="sidePanell">
                <ul>
                    {#each requests as req}
                        <li>
                            <span class="firstRow">
                                <h3>{req.title}</h3>
                                {#key time}
                                    <p>{formatSeconds(Math.floor((Date.now() - req.createdAt) / 1000))} ago</p>
                                {/key}
                            </span>
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
                                    <RouteLength startLocation={[req.startLocation[1], req.startLocation[0]]} destinationLocation={[req.destinationLocation[1], req.destinationLocation[0]]} />
                                </span>
                                <span>
                                    <i class="bx bxs-map" />
                                    <AddressLabel lat={req.destinationLocation[0]} lng={req.destinationLocation[1]} />
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
                <div id="pageNumberButtonsContainer">
                    <span>
                        <button
                            title="Previous page"
                            on:click={() => {
                                handelPageChangeClick(page - 1);
                            }}
                            class="bx bx-chevron-left"
                            disabled={page <= 1}
                        />
                        <button
                            title="Nextpage"
                            on:click={() => {
                                handelPageChangeClick(page + 1);
                            }}
                            class="bx bx-chevron-right"
                            disabled={page >= pageCount}
                        />
                        <button
                            title="First page"
                            on:click={() => {
                                handelPageChangeClick(1);
                            }}
                            class="bx bx-chevrons-left"
                            disabled={page <= 1}
                        />
                        <button
                            title="Last page"
                            on:click={() => {
                                handelPageChangeClick(pageCount);
                            }}
                            class="bx bx-chevrons-right"
                            disabled={page >= pageCount}
                        />
                    </span>
                </div>
            </div>
        {/if}
    </aside>

    <div id="mapContainer">
        <Map data={requestsGeoJSON} />
    </div>
</main>

<style>
    #notFound {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    #sidePanell {
        display: flex;
        flex-direction: column;

        gap: 1rem;
    }

    #pageNumberButtonsContainer {
        border-radius: 15px;
    }

    #pageNumberButtonsContainer > span {
        display: grid;
        grid-template-columns: 1fr 1fr;

        gap: 0.1rem;
    }

    #pageNumberButtonsContainer > span > button {
        background-color: var(--background-color-transparent);
        color: var(--text-color);

        font-size: 1.5rem;

        padding: 1rem;

        border-radius: 5px;
        border-color: transparent;
        border-style: solid;
    }

    #pageNumberButtonsContainer > span > button:nth-child(1) {
        border-top-left-radius: 10px;
    }
    #pageNumberButtonsContainer > span > button:nth-child(2) {
        border-top-right-radius: 10px;
    }
    #pageNumberButtonsContainer > span > button:nth-child(3) {
        border-bottom-left-radius: 10px;
    }
    #pageNumberButtonsContainer > span > button:nth-child(4) {
        border-bottom-right-radius: 10px;
    }

    #pageNumberButtonsContainer > span > button:hover:not(:disabled),
    #pageNumberButtonsContainer > span > button:active,
    #pageNumberButtonsContainer > span > button:focus {
        background-color: hsla(0, 0%, 0%, 0.4);
    }

    #pageNumberButtonsContainer > span > button:focus {
        outline: 1px solid var(--text-color);
    }

    #pageNumberButtonsContainer > span > button:disabled {
        cursor: not-allowed;

        opacity: 0.5;
    }

    #pageNumberButtonsContainer,
    ul {
        padding: 1rem;
        margin: 0.5rem;

        background-color: var(--background-color-transparent);
    }

    ul {
        list-style-type: none;

        border-radius: 20px;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    li {
        background-color: var(--background-color-transparent);

        padding: 1.5rem;
        border-radius: 5px;

        display: flex;
        flex-direction: column;
    }

    li:first-of-type {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    li:last-of-type {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }

    li > .firstRow {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;

        gap: 1rem;
    }

    li > .sizeIndicator {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        margin-block: 1rem;
    }

    li > .sizeIndicator > .smallToBig {
        display: flex;
        gap: 0.5rem;
    }

    li > .sizeIndicator > .smallToBig > p {
        margin-block: 0;
    }

    li > .route {
        display: flex;
        flex-direction: column;

        gap: 0.5rem;

        margin-block: 0.5rem;
    }

    li > .route > span {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 0.5rem;
        align-items: flex-start;
    }

    li > .special {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-evenly;
        gap: 1rem;

        margin-top: 0.5rem;
    }

    li > hr {
        margin: 0.5rem 0;
        width: 100%;
        border: 1px solid var(--text-color);
        opacity: var(--secondary-opacity);
        border-radius: 100vmax;
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

    /* LAYOUT */
    @media only screen and (min-width: 1000px) {
        main {
            height: 100vh;

            display: grid;
            grid-template-columns: 1fr 3fr;
        }

        #mapContainer {
            display: inline-block;
            height: 100%;
        }

        aside {
            height: 100%;

            overflow-y: scroll;
        }
    }

    @media only screen and (max-width: 1400px) {
        main {
            grid-template-columns: 2fr 3fr;
        }
    }

    @media only screen and (max-width: 1000px) {
        main {
            display: flex;
            flex-direction: column-reverse;
        }
        #mapContainer {
            height: 50vh;
        }

        ul {
            display: grid;

            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
    }
</style>
