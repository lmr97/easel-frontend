<script setup lang="ts"></script>
<template>
<footer>
    <div class="footer-links">
        <a href="https://www.instagram.com/easel">
            <img class="footer-icon" src="/assets/icons/instagram-rainbow.png">
        </a>
        <a href="https://bsky.app/easel">
            <img class="footer-icon" src="/assets/icons/Bluesky_Logo.png">
        </a>
        <a href="https://github.com/lmr97/easel">
            <img class="footer-icon" src="/assets/icons/github-octocat.png">
        </a>
    </div>
    <p class="copyright">&copy;2026 S/M Enterprises</p>
</footer>
</template>
<style scoped>
    footer {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        text-align: center;
        color: var(--footer-text-color);
        background-color: var(--footer-background);
        padding: 20px;
    }

    footer a {
        height: 30px;
    }

    .footer-icon {
        height: 100%;
        filter: brightness(0);
        transition-property: filter;
        transition-duration: 0.5s;
    }

    .footer-icon:hover {
        filter: brightness(1);
    }

    .footer-links {
        display: flex;
        justify-content: center;
        gap: 10%;
    }
</style>