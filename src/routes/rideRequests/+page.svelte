<script lang="ts">
    import { onMount } from "svelte";
    import type { geoJSONrideRequests } from "../../types/geoJSON";
    import Map from "../../components/Map.svelte";
    import RideRequestListItem from "./RideRequestListItem.svelte";
    import { requestOwnData } from "../../utils/requestOwnData";
    import { page } from "$app/stores";

    let pageURL = $page.url.searchParams.get("page");
    let limitURL = $page.url.searchParams.get("limit");

    let pageURLisValid = pageURL ? !isNaN(parseInt(pageURL)) : false;
    let limitURLisValid = limitURL ? !isNaN(parseInt(limitURL)) : false;

    let currentPage = pageURLisValid ? parseInt(pageURL as string) : 1;
    let limit = limitURLisValid ? parseInt(limitURL as string) : 10;
    let pageCount: number;
    let pageInputValue = 1;

    let requests: any[] = [];

    let requestsGeoJSON: geoJSONrideRequests;

    let rideRequestsResponse: Promise<any>;

    let token: string;

    let config: Promise<any>;

    const handelPageChangeClick = async (newCount: number) => {
        currentPage = newCount;
        pageInputValue = newCount;
        rideRequestsResponse = requestPage(await config, token);
        addURLParams({
            page: currentPage,
            limit: limit,
        });
        requests = (await rideRequestsResponse).data;
        pageCount = (await rideRequestsResponse).pageCount;
        requestsGeoJSON = createGeoJSON();
    };

    function addURLParams(params: { [key: string]: string | number | boolean | null }) {
        const newUrl = new URL(window.location.href);

        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newUrl.searchParams.set(key, "");
            } else {
                newUrl.searchParams.set(key, value.toString());
            }
        }

        window.history.replaceState({}, "", newUrl.toString());
    }

    async function requestPage(config: any, token: string) {
        const url = config.apiUrl + `/rideRequest?page=${currentPage}&pageSize=${limit}`;

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

        addURLParams({
            page: currentPage,
            limit: limit,
        });

        token = localStorage.getItem("token") as string;
        if (!token) {
            window.location.href = "/login";
        }

        config = requestOwnData("config");

        rideRequestsResponse = requestPage(await config, token);

        requests = (await rideRequestsResponse).data;
        pageCount = (await rideRequestsResponse).pageCount;

        requestsGeoJSON = createGeoJSON();
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
                            <RideRequestListItem
                                title={req.title}
                                createdAt={req.createdAt}
                                description={req.cargoDescription}
                                cargoWeight={req.cargoWeight}
                                cargoVolume={req.cargoVolume}
                                startLocation={req.startLocation}
                                destinationLocation={req.destinationLocation}
                                specialities={req.cargoSpecialCharacteristics}
                            />
                        </li>
                    {/each}
                </ul>
                <div id="pageNumberButtonsContainer">
                    <span class="rangeContainer">
                        <input
                            type="number"
                            bind:value={pageInputValue}
                            inputmode="numeric"
                            on:input={() => {
                                if (pageInputValue <= 0 || pageInputValue > pageCount || [NaN, null].includes(pageInputValue)) {
                                    return;
                                }
                                currentPage = pageInputValue;
                                handelPageChangeClick(currentPage);
                            }}
                            on:blur={() => {
                                handelPageChangeClick(currentPage);
                            }}
                        />
                        <div class="range">
                            <input
                                type="range"
                                min="1"
                                max={pageCount}
                                bind:value={currentPage}
                                on:input={() => {
                                    pageInputValue = currentPage;
                                    handelPageChangeClick(currentPage);
                                }}
                            />
                        </div>
                        <p>of {pageCount}</p>
                    </span>
                    <span class="buttonContainer">
                        <button
                            title="Previous page"
                            on:click={() => {
                                handelPageChangeClick(currentPage - 1);
                            }}
                            class="bx bx-chevron-left"
                            disabled={currentPage <= 1}
                        />
                        <button
                            title="Nextpage"
                            on:click={() => {
                                handelPageChangeClick(currentPage + 1);
                            }}
                            class="bx bx-chevron-right"
                            disabled={currentPage >= pageCount}
                        />
                        <button
                            title="First page"
                            on:click={() => {
                                handelPageChangeClick(1);
                            }}
                            class="bx bx-chevrons-left"
                            disabled={currentPage <= 1}
                        />
                        <button
                            title="Last page"
                            on:click={() => {
                                handelPageChangeClick(pageCount);
                            }}
                            class="bx bx-chevrons-right"
                            disabled={currentPage >= pageCount}
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
        display: flex;
        flex-direction: column;
        gap: 1rem;

        align-items: stretch;

        border-radius: 15px;
    }

    #pageNumberButtonsContainer > .buttonContainer {
        display: grid;
        grid-template-columns: 1fr 1fr;

        gap: 0.1rem;
    }

    #pageNumberButtonsContainer > .buttonContainer > button {
        background-color: var(--background-color-transparent);
        color: var(--text-color);

        font-size: 1.5rem;

        padding: 1rem;

        border-radius: 5px;
        border-color: transparent;
        border-style: solid;

        cursor: pointer;
    }

    #pageNumberButtonsContainer > .buttonContainer > button:nth-child(1) {
        border-top-left-radius: 10px;
    }
    #pageNumberButtonsContainer > .buttonContainer > button:nth-child(2) {
        border-top-right-radius: 10px;
    }
    #pageNumberButtonsContainer > .buttonContainer > button:nth-child(3) {
        border-bottom-left-radius: 10px;
    }
    #pageNumberButtonsContainer > .buttonContainer > button:nth-child(4) {
        border-bottom-right-radius: 10px;
    }

    #pageNumberButtonsContainer > .buttonContainer > button:hover:not(:disabled),
    #pageNumberButtonsContainer > .buttonContainer > button:active,
    #pageNumberButtonsContainer > .buttonContainer > button:focus {
        background-color: hsla(0, 0%, 0%, 0.4);
    }

    #pageNumberButtonsContainer > .buttonContainer > button:focus-visible {
        outline: 1px solid var(--text-color);
    }

    #pageNumberButtonsContainer > .buttonContainer > button:focus:not(:focus-visible) {
        outline: none;
    }

    #pageNumberButtonsContainer > .buttonContainer > button:disabled {
        cursor: not-allowed;

        opacity: 0.5;
    }

    #pageNumberButtonsContainer > .rangeContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    #pageNumberButtonsContainer > .rangeContainer > input[type="number"] {
        width: 3rem;
        text-align: center;

        border-radius: 5px;
        border-color: transparent;
        border-style: solid;

        font-size: inherit;
        font-family: inherit;

        background-color: transparent;

        -moz-appearance: textfield;
        appearance: textfield;

        color: var(--text-color);
    }

    #pageNumberButtonsContainer > .rangeContainer > input[type="number"]::-webkit-inner-spin-button,
    #pageNumberButtonsContainer > .rangeContainer > input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    #pageNumberButtonsContainer > .rangeContainer > .range {
        width: 100%;
        height: 1rem;

        margin: 0;
        padding: 0;

        border-radius: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    #pageNumberButtonsContainer > .rangeContainer > .range:has(:focus-visible) {
        outline: 1px solid var(--text-color);
    }

    #pageNumberButtonsContainer > .rangeContainer > .range > input[type="range"] {
        -webkit-appearance: none;
        appearance: none;

        width: 100%;
        height: 25%;

        background: var(--text-color);

        opacity: var(--secondary-opacity);

        border-radius: 100vmax;

        outline: none;

        transition: all var(--animation);
    }

    #pageNumberButtonsContainer > .rangeContainer > .range > input[type="range"]:is(:hover, :focus, :active) {
        opacity: 1;
    }

    #pageNumberButtonsContainer > .rangeContainer > .range > input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;

        width: 1rem;
        aspect-ratio: 1;

        background-color: var(--accent-color);

        border-radius: 100vmax;
        border-top-left-radius: 0;
        border-color: transparent;
        border-style: solid;

        outline: none;

        cursor: pointer;
    }
    #pageNumberButtonsContainer > .rangeContainer > .range > input[type="range"]::-moz-range-thumb {
        width: 1rem;
        aspect-ratio: 1;

        background-color: var(--accent-color);

        border-radius: 100vmax;
        border-top-left-radius: 0;
        border-color: transparent;
        border-style: solid;

        outline: none;

        cursor: pointer;
    }

    #pageNumberButtonsContainer > .rangeContainer > .range > input[type="range"]::-webkit-slider-thumb:is(:hover, :focus, :active) {
        background-color: var(--accent-color-interaction);
    }

    #pageNumberButtonsContainer > .rangeContainer > p {
        width: 3rem;
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

        border-radius: 5px;
    }

    li:first-of-type {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    li:last-of-type {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
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
