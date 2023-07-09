<script lang="ts">
    import Toc from "../../../components/TOC.svelte";
    import { onMount } from "svelte";

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
    <h1>Our Techstack</h1>

    <Toc headings={headingsArray} />

    <section>
        <h2>Backend</h2>

        <section>
            <h3>Server</h3>

            On the Server we are using these technologies:
    
            <ul>
                <li><a href="https://nodejs.org/">
                    <i class="bx bxl-nodejs" />
                    Node.js
                </a></li>
                <li><a href="https://expressjs.com/">
                    <i class="bx bxs-server" />
                    Express.js
                </a></li>
                <li><a href="https://www.typescriptlang.org/">
                    <i class="bx bxl-typescript" />
                    TypeScript
                </a></li>
                <li><a href="https://www.npmjs.com/">
                    <i class="bx bxs-package" />
                    npm
                </a></li>
            </ul>
        </section>

        <section>
            <h3>Database</h3>

            For the Database we are using:
    
            <ul>
                <li><a href="https://www.mongodb.com/">
                    <i class="bx bxl-mongodb" />
                    MongoDB
                </a></li>
            </ul>
        </section>
    </section>

    <section>
        <h2>Frontend</h2>

        For the frontend we are using:

        <ul>
            <li><a href="https://kit.svelte.dev/">
                Svelte-Kit
            </a></li>
            <li><a href="https://www.typescriptlang.org/">
                <i class="bx bxl-typescript" />
                TypeScript
            </a></li>
            <li><a href="https://www.npmjs.com/">
                <i class="bx bxs-package" />
                npm
            </a></li>
            <!-- Box Icons and Maptiler-->
            <li><a href="https://boxicons.com/">
                <i class="bx bxs-cube" />
                Box Icons
            </a></li>
            <li><a href="https://www.maptiler.com/">
                <i class="bx bx-map" />
                Maptiler
            </a></li>
        </ul>
    </section>

    <section>
        <h2>Else</h2>
        <ul>
            <li><a href="https://www.github.com">
                <i class="bx bxl-github" />
                GitHub
            </a></li>
            <li><a href="https://git-scm.com/">
                <i class="bx bxl-git" />
                Git
            </a></li>
        </ul>
    </section>

    There are more awesome open source technologies we are using, but as we didn't really put time into them and we are just using them because they are part of other things we are using, we won't list them here. If you are interested in what we are using, you can always check out our <a href="/contact/methods">contact page</a> and look at our code.
</main>

<style>
    main {
        padding-inline: var(--main-padding);
        margin-bottom: var(--main-padding);

        font-size: 1rem;
    }
    a {
        color: var(--link-color);
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
