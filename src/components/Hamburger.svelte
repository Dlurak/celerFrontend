<script lang="ts">
    export let isOpen = false;
    export let toggleMenu: () => void;
</script>

<button class:open={isOpen} on:click={toggleMenu}>
    <span />
    <span />
    <span />
</button>

<style>
    button {
        aspect-ratio: 1/1;

        height: 50%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: transparent;
        border: none;

        padding: 0;
        margin: 0;
    }

    span {
        width: 100%;
        background-color: var(--text-color);
        opacity: var(--secondary-opacity);
        margin: 0;
        padding: 0;
        height: 2px;
        position: relative;

        transition: all var(--animation);
    }

    span:nth-child(1) {
        top: 0;
    }
    span:nth-child(3) {
        bottom: 0;
    }

    button:focus {
        outline: none;
    }

    button:hover > span,
    button:focus > span {
        background-color: var(--text-color);
        opacity: 1;
    }

    button:hover > span:nth-child(1),
    button:focus > span:nth-child(1) {
        top: calc(25% - 1px);
    }
    button:hover > span:nth-child(3),
    button:focus > span:nth-child(3) {
        bottom: calc(25% - 1px);
    }

    button:hover  > span:nth-child(2),
    button:active > span:nth-child(2),
    button.open   > span:nth-child(2),
    button:focus  > span:nth-child(2) {
        width: 0;
    }

    button:active > span:nth-child(1),
    button.open   > span:nth-child(1) {
        top: calc(50% - 1px);
        transform: rotate(45deg);
    }

    button:active > span:nth-child(3),
    button.open   > span:nth-child(3) {
        bottom: calc(50% - 1px);
        transform: rotate(-45deg);
    }
</style>
