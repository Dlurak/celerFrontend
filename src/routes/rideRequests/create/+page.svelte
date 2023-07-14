<script>
    import { browser } from "$app/environment";
    import AddressLabel from "../../../components/addressLabel.svelte";
    import AddressSelectorMap from "../../../components/addressSelectorMap.svelte";
    import RouteLength from "../../../components/routeLength.svelte";
    import SubmitButton from "../../../components/submitButton.svelte";

    let latStart = 0;
    let lngStart = 0;

    let latDest = 0;
    let lngDest = 0;
</script>

<div class="formContainer">
    <form>
        <div class="textDataContainer">
            <div>
                <input type="text" title="Title" placeholder="TV" />

                <input type="text" title="Description" placeholder="It is a big LG TV" />
            </div>

            <div>
                <div>
                    <span>
                        <label for="weight">Weight:</label>
                        <input type="number" title="Weight" placeholder="1" name="weight" />
                        kg
                    </span>
                    <span>
                        <label for="volume">Volumne:</label>
                        <input type="number" title="Volume" placeholder="1" />
                        Liter
                    </span>
                </div>

                <span class="special">
                    <input type="checkbox" />
                    <input type="checkbox" />
                    <input type="checkbox" />
                    <input type="checkbox" />
                    <input type="checkbox" />
                </span>
            </div>
        </div>

        <div class="locationPickerContainer">
            <span>
                <span>
                    <i class="bx bxs-map" />
                    {#if browser}
                        <AddressLabel lat={latStart} lng={lngStart} />
                    {/if}
                </span>
                <span>
                    <i class="bx bx-trip" />
                    {#if browser}
                        <RouteLength startLocation={[latStart, lngStart]} destinationLocation={[latDest, lngDest]} />
                    {/if}
                </span>

                <span>
                    <i class="bx bxs-flag" />
                    {#if browser}
                        <AddressLabel lat={latDest} lng={lngDest} />
                    {/if}
                </span>
            </span>
            <div class="mapContainer">
                <AddressSelectorMap bind:latStart bind:lngDest bind:latDest bind:lngStart mapId="startMap" />
            </div>
        </div>

        <span class="submitContainer">
            <SubmitButton disabled={true} onClick={() => {}} title="Here">Submit</SubmitButton>
        </span>
    </form>
</div>

<style>
    .formContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        min-height: 100vh;
    }

    .locationPickerContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        width: clamp(300px, 100%, 500px);
    }

    .locationPickerContainer > span {
        display: flex;
        flex-direction: column;
    }

    .locationPickerContainer > span > span {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 0.5rem;
        max-width: clamp(300px, 100%, 500px);
    }

    .mapContainer {
        width: 100%;
        aspect-ratio: 1;
    }

    form {
        display: flex;
        flex-wrap: wrap;

        gap: 1rem;

        background-color: var(--background-color-transparent);
        border-radius: 15px;

        padding: clamp(1rem, 5vw, 3rem);
        margin: 1rem;
    }

    form > * {
        flex: 1;
    }

    .textDataContainer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .textDataContainer > div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .textDataContainer > div > div {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .textDataContainer > div > div > span {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    .special {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .submitContainer {
        flex-basis: 100%;
    }
</style>
