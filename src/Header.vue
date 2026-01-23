<script setup lang="ts">

import { ref } from 'vue';
const hamburgerTapped = ref(false);

</script>
<template>
    <header>
        <a id="logo-box" href="/">
            <img id="site-logo" alt="site logo of an empty easel" src="/assets/icons/easel-cream.svg">
            <p id="logo-text" class="fancy-header">ease<span id="color-l">l</span></p>
        </a>
        <nav id="desktop-nav">
            <a href="/why-easel">Why Easel?</a>
            <a href="/features">Features</a>
            <a href="/another">Another Tab</a>
            <a href="/one-last">One Last Tab</a>
        </nav>
        <div class="header-buttons">
            <a href="/login">
                <button class="login">Log in</button>
            </a>
            <img @click="hamburgerTapped = !hamburgerTapped" id="hamburger" alt="nav icon" src="/assets/icons/hamburger-menu-svgrepo-com.svg">
        </div>
    </header>
    <ul class="mobile-nav" :class="{ expand: hamburgerTapped }">
        <li><a href="/why-easel">Why Easel?</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/another">Another Tab</a></li>
        <li><a href="/one-last">One Last Tab</a></li>
    </ul>
</template>
<style lang="css" scoped>
header {
    background-color: var(--header-background);
    color: var(--header-text-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 2%;
    padding-right: 2%;
    height: 5em;
    border-bottom: 1px solid var(--body-text-color);
}

header a {
    color: var(--header-text-color);
    text-decoration: none;
}

#logo-box {
    display: flex;
    gap: 10%;
    color: inherit;
    align-items: center;
    flex-direction: row;
}

#logo-text {
    color: inherit;
    font-family: "Aladin", system-ui;
    font-size: xx-large;
}

#color-l {
    color: var(--tag-color1);
    font: inherit;
}

#site-logo {
    height: 50px;
}

#desktop-nav {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.mobile-nav {
    display: block;
    overflow: auto;
    list-style: none;
    text-align: right;
    padding: 0;
    background-color: var(--header-background);
    height: 0;
    transition-property: height padding;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
}

.expand {
    padding: 10px;
    height: 150px;
}

.mobile-nav li {
    margin: 7px;
}

.mobile-nav a {
    color: var(--header-text-color);
    font-size: larger;
    text-decoration: none;
    transition-property: color;
    transition-duration: 0.25s;
}

.mobile-nav a:hover {
    color: var(--button-text-color);
}

.header-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
}

#hamburger {
    height: 40px;
}
</style>