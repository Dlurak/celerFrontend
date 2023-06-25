<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';


    // use cute kana emojis for the error page
    const messages:{ [key: number]: string } = {
        404: `Oops! This page doesn't exist. (¬_¬")`,
        403: "You don't have permission to access this page.",
        500: "Something went internally wrong. It's not your fault."
    }
    const status:number = $page.status;
    const errorMessage: string = $page.error?.message ?? '';
    const message = messages[status] || `${status}: ${errorMessage}`;

    let previousPage = '';


    onMount(() => {
        document.title = `Celer - ${status}`;
        if (document.referrer) {
            previousPage = document.referrer;
        }
    })
</script>

<div id="container">
    <div>
        <h1>
            {message}
        </h1>
        <ul>
            <li>
                <a href="/">Go back to the home page</a>
            </li>
            {#if previousPage}
                <li>
                    <a href="{previousPage}">go back to the previous page</a>.
                </li>
            {/if}
        </ul>
    </div>
</div>

<style>
    * {
        color: var(--text-color);
    }

    #container {
        min-height: calc(100vh - var(--navbar-height));

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        padding: 70px;
        box-sizing: border-box;
    }
    ul {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: inherit;
        list-style-type: none;
        padding-left: 0;
    }
    ul > li {
        margin: 0 1rem;
        text-transform: capitalize;
    }
    h1 {
        font-size: 3rem;
        text-transform: capitalize;
    }

    a {
        color: var(--link-color);
    }
</style>