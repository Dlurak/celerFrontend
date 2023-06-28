<script lang="ts">
    import { onMount } from "svelte";
    import type { ContactData } from "../../../components/types/ContactData";

    let contactList: ContactData[] = [];

    onMount(async () => {
        document.title = "Celer - Contact Methods";

        const contact = fetch('/data/contact.json')
            .then(data => data.json())
            .then(jsonData => {
                return jsonData;
            });

        contactList = await contact;
    });

    $: console.log(contactList);
</script>

<ul>
    {#each contactList as contact}
        <li>
            <a href={contact.url} title={contact.name}>
                <span>
                    {#if contact.boxIcon !== ""}
                        <i class={`bx ${contact.boxIcon}`} />
                    {:else}
                        {contact.name}
                    {/if}
                    {contact.name}
                </span>
            </a>
        </li>
    {/each}
</ul>

<style>
    ul {
        min-height: calc(100vh - var(--navbar-height));
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        padding-inline: 2rem;
        
    }
    li {
        list-style: none;
    }
    a {
        color: var(--text-color);
        text-decoration: none;
        font-size: 2rem;

        display: inline-block;

        transition: all var(--animation);
    }
    a > span:has(i) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    a > span > i {
        font-size: 6rem;
    }
    a > span {
        position: relative;
    }
    a > span::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        display: inline-block;
        width: 0;
        height: 2px;
        background-color: var(--text-color);
        transition: all var(--animation);
    }
    a:hover > span::after {
        width: 100%;
    }
    a:hover,
    a:focus {
        scale: 1.1;
        transform: translateY(-1rem);
        text-shadow: 0 1rem 3rem var(--text-color);
        outline: none;
    }
</style>