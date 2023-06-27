<script lang="ts">
    import { onMount } from "svelte";
    import type { NavbarData } from "./types/NavbarData";
    import type { ContactData } from "./types/ContactData";
        

    let linkList: NavbarData[] = [];
    let contactList: ContactData[] = [];


    onMount(async () => {
        document.title = "Celer";

        const linkData = fetch('/data/nav.json')
            .then(data => data.json())
            .then(jsonData => {
                return jsonData.links;
            });

        const contactData = fetch('/data/contact.json')
            .then(data => data.json())
            .then(jsonData => {
                return jsonData;
            });

        linkList = await linkData;
        // check if await contactData is type ContactData
        contactList = await contactData;

    });
</script>

<footer>
    <div>
        <img src="/CelerLogo.svg" alt="Celer">
        <p>© 2021 Celer</p>
    </div>
    <div>
        <ul>
            {#each linkList as link}
                {#if link.showInNav}
                    <li><a href={link.path}>{link.title}</a></li>
                {/if}
            {/each}
        </ul>
    </div>
    <div>
        <ul>
            {#each contactList as contact}
                <li>
                    <a href={contact.url} title={contact.name}>
                        {#if contact.boxIcon !== ""}
                            <i class={`bx ${contact.boxIcon}`} />
                        {:else}
                            {contact.name}
                        {/if}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</footer>

<style>
    footer{
        background-color: hsla(0, 0%, 0%, 0.2);
    }
    footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }
    div > p {
        font-size: 1.5rem;
        font-weight: 600;
    }
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    img {
        width: 100px;
        aspect-ratio: 1/1;
    }

    ul {
        list-style-type: none;
        padding: 0;

        display: flex;
        flex-direction: row;
        gap: 20px;
    }
</style>