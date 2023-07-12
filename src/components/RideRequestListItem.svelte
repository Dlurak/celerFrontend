<script lang="ts">
    import { onMount } from "svelte";
    import { formatSeconds } from "../utils/formatTimeFromStamp";
    import { requestOwnData } from "../utils/requestOwnData";
    import type { groupsType } from "../types/groupsType";
    import AddressLabel from "./addressLabel.svelte";
    import RouteLength from "./routeLength.svelte";
    import { reverseArray } from "../utils/reverseArray";

    /**** Component Parameters ****/

    export let title: string;
    export let createdAt: number;
    export let description: string;
    export let cargoWeight: number;
    export let cargoVolume: number;
    export let startLocation: [number, number];
    export let destinationLocation: [number, number];
    export let specialities: string[];

    /**** Normal Variables ****/

    let time = Date.now();

    /**** Variables that will be fetched ****/

    let weigthGroup: groupsType;
    let volumeGroup: groupsType;

    let specialitiesIcons: {
        [key: string]: string;
    };

    /**** Functions ****/

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

    onMount(async () => {
        // update time every second
        const interval = setInterval(() => {
            time = Date.now();
        }, 1000);

        /**** Local fetches ****/

        weigthGroup = (await requestOwnData("groups")).weigthGroup;
        volumeGroup = (await requestOwnData("groups")).volumeGroup;
        specialitiesIcons = await requestOwnData("specialitiesIcons");

        // clear interval on unmount
        return () => {
            clearInterval(interval);
        };
    });
</script>

<div>
    <span class="titleRow">
        <h3>{title}</h3>

        {#key time}
            <p>{formatSeconds(Math.floor((Date.now() - createdAt) / 1000))}</p>
        {/key}
    </span>
    <p class="description">{description}</p>

    <hr />

    <span class="sizeIndicator">
        <span class="sizeRow">
            {#if volumeGroup !== undefined}
                <span class="icons">
                    {#each Array(getAmountOfIcons(cargoVolume, volumeGroup)) as _}
                        <i class="bx bxs-cube" />
                    {/each}
                </span>
            {/if}
            {cargoVolume} Liter
        </span>
        <span class="sizeRow">
            {#if weigthGroup !== undefined}
                <span class="icons">
                    {#each Array(getAmountOfIcons(cargoWeight, weigthGroup)) as _}
                        <i class="bx bx-dumbbell" />
                    {/each}
                </span>
            {/if}
            {cargoWeight} kg
        </span>
    </span>

    <hr />

    <span class="route">
        <span>
            <i class="bx bxs-map" />
            <AddressLabel lat={startLocation[0]} lng={startLocation[1]} />
        </span>
        <span>
            <i class="bx bx-trip" />
            <RouteLength startLocation={[startLocation[0], startLocation[1]]} destinationLocation={[destinationLocation[0], destinationLocation[1]]} />
        </span>
        <span>
            <i class="bx bxs-flag" />
            <AddressLabel lat={destinationLocation[0]} lng={destinationLocation[1]} />
        </span>
    </span>

    <hr />

    <span class="special">
        {#if specialitiesIcons !== undefined}
            {#each Object.keys(specialitiesIcons) as iconName}
                {#if specialities.includes(specialitiesIcons[iconName])}
                    <i class={`bx bxs-${iconName} no`} title={`Not ${specialitiesIcons[iconName]}`} />
                {:else}
                    <i class={`bx bxs-${iconName}`} title={`${specialitiesIcons[iconName]}`} />
                {/if}
            {/each}
        {/if}
    </span>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
    }

    .titleRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .titleRow > *:not(h3) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .description {
        /* max 3 lines */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sizeIndicator {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        gap: 0.5rem;
    }

    .sizeRow {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 0.75rem;
    }

    .icons {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 0.25rem;
    }

    .route {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        gap: 1rem;
    }

    .route > span {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 0.75rem;
    }

    .special {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    hr {
        margin: 1rem 0;

        border-width: 0.1rem;
        border-style: solid;
        border-color: var(--text-color);
        opacity: var(--secondary-opacity);
        border-radius: 100vmax;
    }

    .no {
        position: relative;
    }

    .no::after {
        --height: 4px;

        content: "";
        position: absolute;

        width: 114%;
        height: var(--height);

        top: calc(0px - calc(var(--height) / 2));
        left: 0;

        transform-origin: top left;
        transform: rotate(45deg);

        background-color: red;
        border-radius: 100vmax;
    }
</style>
