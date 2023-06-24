<script lang="ts">
    import { onMount } from "svelte";
    import Navbar from "../../components/Navbar.svelte";
    import LoginInput from "../../components/loginInput.svelte";
    import SubmitButton from "../../components/submitButton.svelte";

    let isButtonDisabled = true;
    let passwordValue = "";
    let usernameValue = "";
    let buttonHint = "Please fill in all fields";

    let responseTextUser = '';

    $: isButtonDisabled = !(passwordValue && usernameValue); // disable button if any of the fields are empty
    $: buttonHint = isButtonDisabled ? "Please fill in all fields" : "Login"; // change button hint depending on whether the button is disabled or not

    async function login() {
        const configResponse = await fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();

        const url = config.apiUrl + "/login";
        const body = {
            username: usernameValue,
            password: passwordValue,
        };

        console.log(body);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body)
        });

        const responseJson = await response.json();

        switch (response.status) {
            case 200:
                responseTextUser = `Welcome back ${responseJson.username}! You will be redirected shortly.`;
                document.cookie = `sessionCookie=${responseJson.sessionID}; expires=${responseJson.expires}; path=/;`;
                
                await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds before redirecting

                window.location.href = `/user/${responseJson.username}`;
                break;
            case 401:
                responseTextUser = 'Incorrect password or username ヽ(ಠ_ಠ)ノ';
                break;
            default:
                responseTextUser = 'Something went wrong (╯°□°）╯彡┻━┻';
                break;
        }
    }

    onMount(() => {
        document.title = "Celer - Login";
    });
</script>

<Navbar />
<main>
    <div id="login">
        <h3>Login now</h3>
        <p>{responseTextUser}</p>


        <LoginInput type="text" bind:value={usernameValue}/>
        <LoginInput type="password" bind:value={passwordValue}/>

        <SubmitButton disabled={isButtonDisabled} title={buttonHint} onClick={login}>
            Login
        </SubmitButton>


        <p>
            Don't have an account? <a href="/register">Register</a>
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
    #login {
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: hsla(0, 0%, 0%, 0.2);

        border-radius: 10px;

        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
    #login > h3 {
        margin-top: 0;
    }

    #login > button {
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
    #login > button:not(:disabled):hover,
    #login > button:not(:disabled):focus {
        cursor: pointer;
        transform: scale(1.05);
        box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.6);
        outline: none;
    }
    #login > button:not(:disabled):active {
        cursor: grabbing;
        transform: scale(1);
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.8);
    }

    #login > button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    a {
        color: var(--link-color);
    }
    p {
        margin-top: 20px;
        color: var(--text-color);
    }

    p:empty {
        display: none;
    }

</style>
