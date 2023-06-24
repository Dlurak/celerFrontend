<script lang="ts">
    import { onMount } from "svelte";
    import Navbar from "../../components/Navbar.svelte";
    import LoginInput from "../../components/loginInput.svelte";
    import SubmitButton from "../../components/submitButton.svelte";

    const passwordStrengthColors = ['red', 'orangered', 'yellow', 'yellowgreen', 'green', 'lime']
    const validations = [
        (password: string) => password.length >= 12, // longer than 12 characters
        (password: string) => /[a-z]/.test(password), // lowercase
        (password: string) => /[A-Z]/.test(password), // uppercase
        (password: string) => /[0-9]/.test(password), // number
        (password: string) => /[^a-zA-Z0-9]/.test(password) // special character
    ];


    let buttonDisabled = true;
    let buttonHint = "";

    let usernameValue = "";
    let passwordValue = "";
    let passwordRepeatValue = "";

    let passwordStrengthDiv:HTMLDivElement;

    $: buttonDisabled = !(usernameValue && passwordValue && passwordRepeatValue && passwordValue === passwordRepeatValue)

    $: {
        if (!(usernameValue && passwordValue && passwordRepeatValue)) {
            buttonHint = "Please fill in all fields";
        } else if (passwordValue !== passwordRepeatValue) {
            buttonHint = "Passwords don't match";
        } else {
            buttonHint = "Register";
        }
    }

    $: {
        if (passwordStrengthDiv) {
            colorBoxes();
        }
    }

    function colorBoxes() {
        let fullfilled = Array.from(passwordStrengthDiv.childNodes).filter((element) => (element as HTMLElement).classList.contains("fullfilled"));
        fullfilled.forEach((indicator, index) => {
            let colorLeft = passwordStrengthColors[index];
            let colorRight = passwordStrengthColors[index + 1];

            let gradient = `linear-gradient(to right, ${colorLeft}, ${colorRight})`;

            (indicator as HTMLElement).style.background = gradient;
        });
    }

    function handlePasswordInput(e: Event) {
        const password = (e.target as HTMLInputElement).value;
        const strengthNumber = validations.reduce((count, validation) => count = validation(password) ? count + 1 : count, 0);

        passwordStrengthDiv.childNodes.forEach((indicator, index) => {
            if (index < strengthNumber) {
                (indicator as HTMLElement).classList.add("fullfilled");
            } else {
                (indicator as HTMLElement).classList.remove("fullfilled");
                (indicator as HTMLElement).style.removeProperty("background");
            }
        });

        colorBoxes();
    }


    onMount(() => {
        document.title = "Celer - Register";
    })
</script>

<Navbar />
<main>
    <div id="register">
        <h3>Register now</h3>

        <LoginInput type="text" bind:value={usernameValue} />
        <LoginInput type="password" newPassword={true} bind:value={passwordValue} onInput={handlePasswordInput}/>
        <LoginInput type="password" newPassword={true} bind:value={passwordRepeatValue} />

        <div id="passwordStrength" bind:this={passwordStrengthDiv}>
            <!-- length, lowercase, uppercase, number, special character -->
            {#each Array.from({ length: 5}, (_, i) => i++) as number}
                <span />
            {/each}
        </div>

        <SubmitButton title={buttonHint} disabled={buttonDisabled} onClick={() => {}}>
            Register
        </SubmitButton>

        <p>
            Already have an account? <a href="/login">Login</a>
        </p>
    </div>
</main>

<style>
    main {
        color: var(--text-color);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: calc(100vh - var(--navbar-height));
    }
    #register {
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: hsla(0, 0%, 0%, 0.2);

        border-radius: 10px;

        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
    #register > h3 {
        margin-top: 0;
    }

    a {
        color: var(--link-color);
    }
    p {
        margin-top: 20px;
    }

    #passwordStrength {
        display: flex;
        justify-content: space-between;
        width: 100%;

        margin-top: 20px;
    }
    #passwordStrength > span {
        display: inline-block;
        width: 15%;
        height: 30px;
        background-color: hsla(0, 0%, 0%, 0.2);
    }
</style>
