<script>
    import { onMount } from "svelte";

    onMount(() => {
        document.title = "CELER";
    });
</script>

<div id="container">
    <h1>Welcome to CELER</h1>
</div>

<style>
    #container {
        display: flex;
        justify-content: center;
        align-items: center;

        min-height: calc(100vh - var(--navbar-height));
        padding: 70px;
        box-sizing: border-box;

        max-width: 100%;
    }
    h1 {
        font-size: 3rem;
    }
</style>