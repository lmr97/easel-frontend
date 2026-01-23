<script setup lang="ts">
import PageHeader from './Header.vue'
import PageFooter from './Footer.vue'
import ExampleDisplay from './ExampleDisplay.vue'

type TagResponse = {
    accessed: Date,
    tags: Array<string>
}

import { onMounted, ref } from 'vue'

const TOTAL_COLORS = 5
// const selectedTags   = ref<Array<string>>([])
// const unselectedTags = ref<Array<string>>()
const selectedTags   = ref<Map<string, number>>(new Map<string, number>())
const unselectedTags = ref<Map<string, number>>(new Map<string, number>())


async function fetchTags() {
    const response = await fetch("/tags.json");
    if (!response.ok) {
        console.error(`HTTP error in fetching tags: ${response.status}`)
    }
    else {
        const tagData = await response.json() as TagResponse

        // I'm using a map of key-value pairs here, where the key is the tag, 
        // and the value is the color number to retain a persistent color 
        // state across tag selection and deselection. The color number is 
        // appended to the string "theme-tag-color" in order to set the 
        // background and text color. Definitely open to a more intuitive, 
        // Vue-idiomatic way of doing this. 
        var tagColorMap = new Map<string, number>()
        tagData.tags.map((t, i) => tagColorMap.set(t, i % TOTAL_COLORS))
        unselectedTags.value = tagColorMap
    }
    
}

// tag string does not include "#" character.
// It is added via CSS on render (see `theme-tag` 
// class under the `<style>` section below
// function selectTag(tag: string, tagIndex: number) {
//     selectedTags.value.push(tag)
//     unselectedTags.value?.splice(tagIndex, 1)
// }

// tag string does not include "#" character.
// It is added via CSS on render (see `theme-tag` 
// class under the `<style>` section below
function selectTag(tag: string, colorNumber: number) {
    selectedTags.value?.set(tag, colorNumber)
    unselectedTags.value?.delete(tag)
}

function deselectTag(tag: string, colorNumber: number) {
    // prepend new data to `Map` (which is ordered, as of ES6)
    const prependedTag   = new Map<string, number>([[tag, colorNumber]])
    unselectedTags.value = new Map<string, number>([...prependedTag, ...unselectedTags.value])

    selectedTags.value?.delete(tag)
}

// function deselectTag(tag: string, tagIndex: number) {
//     selectedTags.value?.splice(tagIndex, 1)
//     unselectedTags.value?.unshift(tag)   // prepend to array
// }

onMounted(fetchTags)
</script>
<template>
    <PageHeader />
    <body>
        <ExampleDisplay />
        <h1 id="main-heading">Find your next great commission!</h1>
        <form name="search">
            <div id="search-block">
                <div class="rainbow-border-mat">
                    <input name="searchText" id="search-box" placeholder="#mech #dragon bionicle" type="search">
                </div>
                <input type="submit" id="artist-search-button" value="Find artists">
            </div>
            <div id="tag-bin">
                <!-- hashtags are added via CSS, with a `before` pesudoelement. -->
                <div class="tag-bin-label">
                    <h2>Add some tags here:</h2>
                    <h3>or type them above, with a #</h3>
                </div>
                <TransitionGroup name="tag-group", tags="div">
                    <div 
                        v-for="[tagName, colorNumber] in selectedTags"
                        @click="deselectTag(tagName, colorNumber)" 
                        :key="tagName"
                        :class="`theme-tag theme-tag-color${colorNumber}`"
                    >
                        {{ tagName }}
                    </div>
                </TransitionGroup>
            </div>
            <!-- hashtag characters are added via CSS, with a `before` pesudoelement. -->
            <div id="tag-cloud">
                <TransitionGroup name="tag-group", tags="div">
                <div 
                    v-for="[tagName, colorNumber] in unselectedTags"
                    @click="selectTag(tagName, colorNumber)" 
                    :key="tagName"
                    :class="`theme-tag theme-tag-color${colorNumber}`"
                >
                    {{ tagName }}
                </div>
                </TransitionGroup>
            </div>
        </form>
    </body>     
    <PageFooter />
</template>
<style lang="css" scoped>
.tag-group-move, /* apply transition to moving elements */
.tag-group-enter-active,
.tag-group-leave-active {
  transition: all 0.5s ease;
}

.tag-group-enter-from,
.tag-group-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.tag-group-leave-active {
  position: absolute;
}

/* using this "variable" to animate on smoothly */
@property --rotation {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0turn;
}

@keyframes rotate-rainbow {
    0% {
        --rotation: 0turn;
    }
    50% {
        --rotation: 0.5turn;
    }
    100% {
        --rotation: 1turn;
    }
}

@keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

@keyframes fade-in-text {
    from { color: #fff; }
    to   { color: var(--body-text-color); }
}

@keyframes fade-out {
    from { opacity: 1; }
    to   { opacity: 0; }
}


h1 {
    text-align: center;
}

.example-display {
    display: none;
    height: 15em;
    width: 100%;
    background-size: cover;
    background-position: top 30% center;
    background-repeat: no-repeat;
    justify-content: right;
    align-items: end;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
}

.fade-in {
    position: absolute;
    animation-name: fade-in;
}

.fade-out {
    position: absolute;
    animation-name: fade-out;
}


.example-caption {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 3%;
    background-image: linear-gradient(
        to bottom, 
        transparent, 
        var(--body-background)
    );
}

#example-search {
    font-style: italic;
}

.example-search, .example-artist {
    height: fit-content;
    width: 100%;
}

#search-block {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 7%;
}

#artist-search-button {
    width: 40%;
    font-size: larger;
    font-family: "Nunito Sans", sans-serif;
    font-weight: 400;
}

.rainbow-border-mat {
    background-image: linear-gradient(var(--rotation), 
        var(--tag-color0) 0%, 
        var(--tag-color1)  25%, 
        var(--tag-color2)  50%, 
        var(--tag-color3)  75%, 
        var(--tag-color4)  100%
    );
    padding: 0.5%;
    width: 80%;
    height: 50px;
    border-radius: 6px;
    animation-name: rotate-rainbow;
    animation-duration: 10s;
    animation-iteration-count: infinite;
}

#tag-bin {
    margin: 5%;
    padding: 2%;
    border: 1px solid grey;
    border-radius: 15px;
}

input {
    border: none;
    /* needs to be rainbow-border-mat radius - padding size */
    border-radius: 4px;
    width: 100%;
    height: 100%;
    font-size: larger;
    padding-left: 10px;
}
#tag-cloud, #tag-bin {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* animate fade-in to accoutn for load times */
#tag-cloud {
    margin: 7%;
    padding-bottom: 12vw;
    height: 40vw;
    overflow: scroll;
    mask-image: linear-gradient(
        to top, 
        transparent, 
        var(--body-background) 40%
    );
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
}

.gradient-bottom {
    position: absolute;
    height: 10vw;
    width: 100px;
    background-image: linear-gradient(
        to bottom, 
        transparent, 
        var(--body-background)
    );
}

#tag-bin {
    margin: 5%;
    padding: 2%;
    border: 1px solid grey;
    border-radius: 15px;
}

.theme-tag {
    color: var(--body-text-color);
    height: fit-content;
    font-family: "Geist Mono", monospace;
    font-weight: 400;
    border-style: solid;
    border-width: 1px;
    border-color: var(--body-text-color);
    border-radius: 20px;
    padding: 9px;
}

.theme-tag::before {
    content: "#";
}

/* purple */
.theme-tag-color0 {
    background-color: var(--tag-color0);
    color: var(--body-background);
}

/* blue */
.theme-tag-color1 {
    background-color: var(--tag-color1);
    color: var(--body-background);
}

/* green */
.theme-tag-color2 {
    background-color: var(--tag-color2);
}

/* orange/yellow */
.theme-tag-color3 {
    background-color: var(--tag-color3);
}

/* red */
.theme-tag-color4 {
    background-color: var(--tag-color4);
    color: var(--body-background);
}
</style>