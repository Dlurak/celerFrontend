<script lang="ts">
    import { onMount } from "svelte";
    import Hamburger from "./Hamburger.svelte";
    import type { NavbarData } from "../types/NavbarData";

    let isMenuOpen = false;

    let linkList: HTMLUListElement;

    $: {
        if (linkList) {
            const listItems = Array.from(linkList.children).filter((child): boolean => child.tagName === "LI") as HTMLElement[];

            listItems.forEach((item, index) => {
                // get prefers reduced motion
                const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                item.style.transitionDelay = `${index * (prefersReducedMotion ? 0 : 0.1)}s`;
                (item.children[0] as HTMLAnchorElement).tabIndex = isMenuOpen ? 0 : -1;
            });
        }
    }

    const toggleMenu = () => (isMenuOpen = !isMenuOpen);
    let links: NavbarData[] = [];

    onMount(async () => {
        document.title = "Celer";

        const data = await fetch("/data/nav.json");
        const jsonData = await data.json();
        links = jsonData.links;
    });
</script>

<nav class:open={isMenuOpen}>
    <ul>
        <li>
            <a href="/">
                <picture title="Celer">
                    <source srcset="/CelerLogoLightmode.svg" media="(prefers-color-scheme: light)" />
                    <source srcset="/CelerLogoDarkmode.svg" media="(prefers-color-scheme: dark)" />
                    <img src="/CelerLogoLightmode.svg" alt="Celer" title="Celer" />
                </picture>
            </a>
        </li>
    </ul>

    <ul bind:this={linkList}>
        {#each links as link}
            {#if link.showInNav}
                <li>
                    <a href={link.path}>{link.title}</a>
                </li>
            {/if}
        {/each}
    </ul>

    <ul>
        <li>
            <Hamburger isOpen={isMenuOpen} {toggleMenu} />
        </li>
    </ul>
</nav>

<style>
    :global(html) {
        --navbar-height: 60px;
    }

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;

        padding: 0;
        margin: 0;

        background-color: var(--navbar-background-color);

        padding-left: 20px;
        padding-right: 20px;
    }
    ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        gap: 30px;

        list-style: none;

        margin: 0;
        padding: 0;
    }

    nav,
    ul,
    li,
    a,
    img {
        margin-top: 0;
        margin-bottom: 0;

        height: var(--navbar-height);
    }

    li,
    a,
    img {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    a {
        text-decoration: none;

        color: var(--text-color);
    }

    a:focus {
        outline: none;
    }

    /* the hover animation  */

    ul:nth-child(2) > li > a {
        position: relative;
        opacity: var(--secondary-opacity);

        transition: var(--animation);
    }

    ul:nth-child(2) > li > a::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: var(--text-color);

        transition: var(--animation);
    }

    ul:nth-child(2) > li > a:hover::after,
    ul:nth-child(2) > li > a:focus::after {
        width: 100%;
    }

    a:not(:has(> img)):hover,
    a:not(:has(> img)):focus {
        color: var(--text-color);
        opacity: 1;
    }

    nav ul:nth-child(3) {
        display: none;
    }

    @media only screen and (max-width: 800px) {
        nav ul:nth-child(3) {
            display: inline-block;
        }
        nav ul:nth-child(2) {
            position: absolute;

            top: var(--navbar-height);
            left: 0;
            right: 0;
            height: fit-content;

            display: flex;
            flex-direction: column;
            gap: 0;

            padding: 0;
            margin: 0;
            border: 0;
            box-sizing: border-box;

            z-index: -1;
        }
        nav > ul:nth-child(2) > li {
            width: 100%;
            background-color: var(--navbar-background-color);

            outline: none;
            border: none;

            margin: 0;
            --pading-bottom-top: 10px;
            padding-top: var(--pading-bottom-top);
            padding-bottom: var(--pading-bottom-top);

            transition: transform var(--animation);
        }
        nav:not(.open) ul:nth-child(2) > li {
            transform: translateX(-100%);
        }

        nav.open > ul:nth-child(2) {
            z-index: 9999;
        }

        nav.open > ul:nth-child(2) > li {
            transform: translateX(0);
        }
        nav.open ul:nth-child(2) > li:last-of-type {
            padding-bottom: 0;
        }
        nav.open ul:nth-child(2) > li > a {
            width: 100%;
            position: relative;
        }
        nav.open ul:nth-child(2) > li:not(:last-of-type) > a::before {
            content: "";
            width: 75%;
            height: 1px;
            position: absolute;
            bottom: -1px;
            background-color: hsla(0, 0%, 35%, 0.2);
        }
    }
</style>
