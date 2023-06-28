<script lang="ts">
    export let headings: HTMLHeadingElement[] = [];
</script>

<ul>
    {#each headings as heading}
        <li>
            <a href={`#${heading.parentElement?.id}`}>{heading.textContent}</a>
        </li>
    {/each}
</ul>

<style>
    a {
        color: var(--link-color);
    }
</style>