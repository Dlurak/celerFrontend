<script lang="ts">
    import { onMount } from "svelte";

    export let type: "password" | "text";
    export let onInput: (e: Event) => void = () => {};
    export let newPassword: boolean = false;
    // export let newPassword = false;
    export let value = "";

    let name = type==="password" ? "password" : "username";
    let showPassword = false;
    let autocomplete = type==='password' ? (newPassword ? 'new' : 'current') + '-password' : 'username';
    let passwordIconSolidString = "bx"

    let inputField: HTMLInputElement;
    
    const handleShowPassword = () => {
        showPassword = !showPassword;
        inputField.type = showPassword ? "text" : "password";
    }

    onMount(() => {
        inputField.type = type;
    });
</script>

<span>
    <input name={name} placeholder=" " bind:this={inputField} bind:value={value} autocomplete={autocomplete} on:input={onInput} aria-labelledby="span > label">
    <label for={name}>{name}</label>
    {#if type==='password'}
        <button
            title={`${showPassword ? 'Hide':'Show'} Password`}
            on:click={handleShowPassword}
            class="showPasswordButton"
            on:focus={() => passwordIconSolidString = "bxs"}
            on:blur={() => passwordIconSolidString = "bx"}
        >
            <i class={`bx ${passwordIconSolidString}-${showPassword?'hide':'show'}`}></i>
        </button>
    {/if}
</span>

<style>
    span {
        position: relative;
        width: 100%;

        margin-top: 30px;

        display: flex;
    }
    span::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;

        background-color: var(--text-color);
        opacity: var(--secondary-opacity);

        transition: all var(--animation);
    }
    span:focus-within::after,
    span > input:not(:placeholder-shown) + label::after {
        width: 100%;
    }

    input {
        display: inline-block;
        width: 100%;

        background-color: transparent;
        outline: none;
        border: none;

        padding-left: 2px;
        padding-right: 2px;
        padding-top: 5px;
        padding-bottom: 5px;

        font-size: 1.2rem;
        color: var(--text-color);

        z-index: 1;
    }

    label {
        text-transform: capitalize;
        position: absolute;

        top: 0;
        left: 0;

        font-size: 1.2rem;

        transition: all var(--animation);

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    span:focus-within > label,
    span > input:not(:placeholder-shown) + label {
        transform: translateY(-100%);
        font-size: 0.8rem;
    }

    span > input:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s;
        -webkit-text-fill-color: var(--text-color);
    }

    .showPasswordButton {
        background-color: transparent;
        border: none;
        outline: none;
        height: 100%;
        aspect-ratio: 1/1;
        font-size: 100%;
        color: var(--text-color);
    }
    .showPasswordButton:focus {
        outline: none;
    }
</style>