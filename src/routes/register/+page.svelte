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
    const validationExplainations = [
        'must contain at least 12 characters',
        'must contain at least one lowercase character',
        'must contain at least one uppercase character',
        'must contain at least one number',
        'must contain at least one special character'
    ]


    let buttonDisabled = true;
    let buttonHint = "";

    let usernameValue = "";
    let passwordValue = "";
    let passwordRepeatValue = "";

    let isListOpen = false;

    let message = "";

    let passwordStrengthSpan:HTMLSpanElement;
    let strengthList:HTMLUListElement;


    $: buttonDisabled = !(usernameValue &&
        passwordValue &&
        passwordRepeatValue &&
        passwordValue === passwordRepeatValue &&
        validations.reduce((count, validation) => count = validation(passwordValue) ? count + 1 : count, 0) >= 5
    );

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
        if (passwordStrengthSpan) {
            colorBoxes();
        }
    }

    function colorBoxes() {
        let fullfilled = Array.from(passwordStrengthSpan.childNodes).filter((element) => (element as HTMLElement).classList.contains("fullfilled"));
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

        passwordStrengthSpan.childNodes.forEach((indicator, index) => {
            if (index < strengthNumber) {
                (indicator as HTMLElement).classList.add("fullfilled");
            } else {
                (indicator as HTMLElement).classList.remove("fullfilled");
                (indicator as HTMLElement).style.removeProperty("background");
            }
        });

        colorBoxes();
    }

    async function register() {
        const configResponse = await fetch("config.json", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        const config = await configResponse.json();

        const url = config.apiUrl + "/register";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue,
                passwordRepeat: passwordRepeatValue
            })
        });

        const responseJson = await response.json();

        switch (responseJson.error) {
            case undefined:
                message = "Successfully registered! You can now login.";
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
                break;
            case 'User already exists':
                message = "User already exists. Choose a different username.";
                break;
            default:
                message = "An unknown error occured.";
                break;
        }
    }

    onMount(() => {
        document.title = "Celer - Register";
    })
</script>

<Navbar />
<main>
    <div id="register">
        <div>
            <h3>Register now</h3>

            <LoginInput type="text" bind:value={usernameValue} />
            <LoginInput type="password" newPassword={true} bind:value={passwordValue} onInput={handlePasswordInput}/>
            <LoginInput type="password" newPassword={true} bind:value={passwordRepeatValue} />

            <div id="passwordStrength">
                <!-- length, lowercase, uppercase, number, special character -->
                <span bind:this={passwordStrengthSpan}>
                    {#each Array.from({ length: 5}, (_, i) => i++) as number}
                        <span />
                    {/each}
                </span>
                <button class="v-shape" class:open={isListOpen} on:click={() => {isListOpen = !isListOpen}} title={isListOpen ? 'Collapse details' : 'Show details'}/>
            </div>

            <p>
                {message}
            </p>

            <SubmitButton title={buttonHint} disabled={buttonDisabled} onClick={register}>
                Register
            </SubmitButton>

            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>

        <div>
            <ul id="strengthList" bind:this={strengthList} class:open={isListOpen}>
                {#each validations as validation, index}
                    <li>{validation(passwordValue) ? '✔️':'❌'} {validationExplainations[index]}</li>
                {/each}
            </ul>
        </div>
    </div>
</main>

<style>
    main {
        color: var(--text-color);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        min-height: calc(100vh - var(--navbar-height));
    }
    #register {
        padding: 30px;
        display: flex;
        flex-direction: row;

        background-color: hsla(0, 0%, 0%, 0.2);

        border-radius: 10px;

        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }

    #register > div:nth-child(1) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        height: 100%;
    }

    #register > div:nth-child(1) > h3 {
        margin-top: 0;
    }

    a {
        color: var(--link-color);
    }
    p {
        margin-top: 20px;
    }

    p:empty {
        display: none;
    }

    #passwordStrength {
        display: flex;
        justify-content: space-between;
        width: 100%;

        margin-top: 20px;
    }
    #passwordStrength > span:nth-child(1) {
        display: flex;
        justify-content: space-around;
        align-items: center;

        width: 90%;
        height: 30px;
    }
    #passwordStrength > span > span {
        display: inline-block;
        width: 17.5%;
        height: 30px;
        background-color: hsla(0, 0%, 0%, 0.2);
    }

    .v-shape {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50%;
        aspect-ratio: 1/1;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
    
        margin: auto;

        background-color: var(--text-color);
        opacity: var(--secondary-opacity);

        outline: none;
        border: none;

        transition: all var(--animation);
        cursor: pointer;
    }
    .v-shape:hover {
        opacity: 1;
    }
    .v-shape.open {
        clip-path: polygon(100% 0, 0 50%, 100% 100%);
    }

    #strengthList {
        list-style-type: none;

        padding: 10px 20px;

        display: none;
    }
    #strengthList.open {
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }
    
    @media only screen and (max-width: 800px) {
        #register {
            flex-direction: column;
            margin: 30px;
        }
        #register > div {
            width: 100%;
        }

        .v-shape {
            clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .v-shape.open {
            clip-path: polygon(50% 0, 0 100%, 100% 100%);
        }
    }
</style>
