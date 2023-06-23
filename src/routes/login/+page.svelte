<script>
    import Navbar from "../../components/Navbar.svelte";

    let isButtonDisabled = true;
    let passwordValue = '';
    let usernameValue = '';
    let buttonHint = 'Please fill in all fields';

    $: isButtonDisabled = !(passwordValue && usernameValue); // disable button if any of the fields are empty
    $: buttonHint = isButtonDisabled ? 'Please fill in all fields' : 'Login'; // change button hint depending on whether the button is disabled or not
</script>


<Navbar />
<main>
    <div id="login">
        <h3>Login now</h3>      
    
        <span>
            <input type="text" id="username" name="username" placeholder=" " bind:value={usernameValue}/>
            <label for="username">Username</label>
        </span>

        <span>
            <input type="password" id="password" name="password" placeholder=" " bind:value={passwordValue}/>
            <label for="password">Password</label>
        </span>
    
        <button disabled={isButtonDisabled} title={buttonHint}>Login</button>

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
    #login > span {
        position: relative;
        width: 100%;

        margin-top: 30px;
    }

    #login > span::after {
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
    #login > span > input::placeholder {
        display: none;
    }
    #login > span:focus-within::after,
    #login > span > input:not(:placeholder-shown) + label::after {
        width: 100%;
    }

    #login > span > input {
        width: 100%;
        background-color: transparent;
        border: none;
        color: var(--text-color);

        padding-left: 2px;
        padding-right: 2px;
        padding-top: 5px;
        padding-bottom: 5px;

        font-size: 1.2rem;
    }
    #login > span > input:focus {
        outline: none;
    }
    #login > span > label {
        position: absolute;
        top: 0;
        left: 0;

        color: var(--text-color);
        opacity: var(--secondary-opacity);

        font-size: 1.2rem;

        transition: all var(--animation);

        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }
    #login > span:focus-within > label,
    #login > span > input:not(:placeholder-shown) + label {
        font-size: 15px;
        top: -20px;
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
</style>