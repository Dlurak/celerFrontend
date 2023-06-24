<script lang="ts">
    export let disabled:boolean;
    export let title:string;
    export let onClick:()=>void;
</script>

<button disabled={disabled} title={title} on:click={onClick}>
    <slot></slot>
</button>

<style>
    button {
        width: 100%;
        background-color: var(--submit-button-background-color);
        color: var(--text-color);

        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;

        border-radius: 10px;
        border: none;

        margin-top: 20px;

        font-weight: 600;

        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

        transition: all var(--animation);
    }
    button:not(:disabled):hover,
    button:not(:disabled):focus {
        cursor: pointer;
        transform: scale(1.05);
        box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.6);
        outline: none;
    }
    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
    button:not(:disabled):active {
        cursor: grabbing;
        transform: scale(1);
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.8);
    }
</style>