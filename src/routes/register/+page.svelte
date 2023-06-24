<script>
    import { onMount } from "svelte";
    import Navbar from "../../components/Navbar.svelte";
    import LoginInput from "../../components/loginInput.svelte";
    import SubmitButton from "../../components/submitButton.svelte";

    let buttonDisabled = true;

    let usernameValue = "";
    let passwordValue = "";
    let passwordRepeatValue = "";

    let buttonHint = "";

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

    onMount(() => {
        document.title = "Celer - Register";
        })
</script>

<Navbar />
<main>
    <div id="register">
        <h3>Register now</h3>

        <LoginInput type="text" bind:value={usernameValue} />
        <LoginInput type="password" newPassword={true} bind:value={passwordValue}/>
        <LoginInput type="password" newPassword={true} bind:value={passwordRepeatValue} />

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
</style>