<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        document.title = "Celer";
    });
</script>

<Navbar />

<slot />

<Footer />
