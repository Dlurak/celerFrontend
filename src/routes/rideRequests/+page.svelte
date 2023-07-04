<script>
    import Map from "../../components/Map.svelte";
</script>

<main>
    <ul>
        <li>
            This will get dynamically populated with the ride requests in the near future
        </li>
    </ul>
    <div>
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
    main > div {
        flex: 3;
    }
    main > ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        flex: 1;
    }

    @media only screen and (max-width: 600px) {
        main {
            flex-direction: column-reverse;
            height: max-content;
        }
        main > div {
            flex: 1;
            aspect-ratio: 1/1.25;
        }
        main > ul {
            flex: 1;
            height: fit-content;
        }
    }
</style>
