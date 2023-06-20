<script lang="ts">
    import { onMount } from 'svelte';
    import './navbar.css'

    let isOpen = false;

    function handleEvents(event: Event) {
        const target = event.target as HTMLElement;
        
        if (target.classList.contains('hamburgerButton')) {
            target.classList.toggle('open');
            let menu = document.querySelector('nav>span:nth-child(2)') as HTMLElement;

            if (target.classList.contains('open')) {
                menu.classList.add('open');
            } else {
                menu.classList.remove('open');
            }
        }
    }
</script> 


<nav>
    <span>
        <a href="/"><img src="CelerLogo.svg" alt="The logo of Celer"></a>
    </span>

    <span class="">
        <a class="underlineLink" href="/">Home</a>
        <a class="underlineLink" href="/login">Account</a>
        <a class="underlineLink" href="/about">About</a>
        <a class="underlineLink" href="/contact">Contact</a>
    </span>
    <span>
        <button class="hamburgerButton" on:click={handleEvents}></button>
    </span>
</nav>