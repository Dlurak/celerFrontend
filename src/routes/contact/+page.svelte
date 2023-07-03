<script lang="ts">
    import { onMount } from "svelte";
    import Toc from "../../components/TOC.svelte";

    let headings: NodeListOf<HTMLHeadingElement>;
    let headingsArray: HTMLHeadingElement[] = [];

    onMount(() => {
        headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((heading) => {
            const id = (heading.textContent as string)
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^a-z0-9-]/g, "");
            (heading.parentElement as HTMLElement).id = id;
        });
        headingsArray = Array.from(headings);
    });
</script>

<main>
    <h1>Contact Us</h1>
    <p>
        As for right now, the only way to contact us is via our <a href="/contact/methods">GitHub</a>.
    </p>

    <Toc headings={headingsArray} />

    <section>
        <h2>Issues with our product</h2>
        <p>
            If you have any issues with our product, please create a new issue on the right repository, it is very helpful for us when you give it to the right of the two. <a
                href="#finding-the-right-repository">Here</a
            >
            you can find a guide on how to choose the right repository. <br />
            Once you have chosen the right repository, you can create a new issue by clicking on the "Issues" tab and then clicking on the green "New issue" button. <br />
            Please make sure to give us as much information as possible, so we can help you as fast and as good as possible.
        </p>
    </section>
    <hr />
    <section>
        <h2>Contribute</h2>
        <p>We are open for any contributions, just create a pull request on one of the repositories.</p>
    </section>
    <hr />
    <section>
        <h2>Other</h2>
        <p>For anything else, you should also create a new issue, as this is the only way to contact us right now.</p>
    </section>
    <hr />
    <section>
        <h2>Help</h2>
        <section>
            <h3>Help with GitHub</h3>
            <section>
                <h4>GitHub account</h4>
                <p>
                    When you want to communicate with us, you need a GitHub account, if you do not already have one, <a href="https://www.github.com/join">you can create one</a>. <br />
                </p>
            </section>
            <section>
                <h4>Finding the right repository</h4>
                <p>
                    When your problem has anything to do with the website itself, the problem is the best placed in the <a href="https://www.github.com/Dlurak/celerFrontend">celerFrontend</a>
                    repository. <br />
                    When your problem has anything to do with the backend, e.g. you can't login, so everything that runs on the server, the problem is best placed in the
                    <a href="https://www.github.com/Dlurak/celerBackend">celerBackend</a> repository.
                </p>
            </section>
        </section>
    </section>
</main>

<style>
    @media only screen and (max-width: 800px) {
        :root {
            --main-padding: 2rem;
        }
    }
    @media screen and (min-width: 800px) {
        :root {
            --main-padding: 4rem;
        }
    }
    @media print {
        :root {
            --main-padding: 4rem;
        }
    }

    main {
        padding-inline: var(--main-padding);
    }
    a {
        color: var(--link-color);
    }
</style>
