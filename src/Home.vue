<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import PageHeader from './Header.vue'
import PageFooter from './Footer.vue'
import ExampleDisplay from './ExampleDisplay.vue'
import TagBin from './TagBin.vue'
import TagCloud from './TagCloud.vue'

type TagResponse = {
    accessed: Date,
    tags: Array<string>
}

export type QueryExample = {
    imagePath: string, 
    searchTags: string[],
    searchString: string,
    artist: string
};

const TOTAL_COLORS   = 5
const tagState       = ref<Map<string, [boolean, number]>>(new Map())
const examples       = ref<Array<QueryExample>>([])
const xmplFetchDone  = ref<boolean>(false)


async function fetchTags() {
    const response = await fetch("/tags.json");
    if (!response.ok) {
        console.error(`HTTP error in fetching tags: ${response.status}`)
    }
    else {
        const tagData = await response.json() as TagResponse

        // I'm using a map of key-value pairs here, where the key is the tag, 
        // and the value is an array of a selection boolean and the color number, and to retain a persistent color 
        // state across tag selection and deselection. The color number is 
        // appended to the string "theme-tag-color" in order to set the 
        // background and text color. Definitely open to a more intuitive, 
        // Vue-idiomatic way of doing this. 
        var tagColorMap = new Map<string, [boolean, number]>()
        tagData.tags.map((t, i) => tagColorMap.set(t, [false, i % TOTAL_COLORS]))
        tagState.value = tagColorMap
    }
}

async function fetchExamples() {
    const response = await fetch("/search-examples.json");
    if (!response.ok) {
        console.error(`HTTP error in fetching examples: ${response.status}`)
    }
    else {
        examples.value = await response.json() as QueryExample[]
        xmplFetchDone.value = true
    }
}

onBeforeMount(fetchExamples)
onMounted(fetchTags)

</script>
<template>
    <PageHeader />
    <body>
        <ExampleDisplay v-if="xmplFetchDone" :exampleSet="examples" />
        <h1 id="main-heading">Find your next great commission!</h1>
        <form name="search">
            <div id="search-block">
                <div class="rainbow-border-mat">
                    <input name="searchText" id="search-box" placeholder="#mech #dragon bionicle" type="search">
                </div>
                <input type="submit" id="artist-search-button" value="Find artists">
            </div>
            <TagBin   :tag-state="tagState" />
            <TagCloud :tag-state="tagState" />
        </form>
    </body>     
    <PageFooter />
</template>
<style lang="css">

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

h1 {
    text-align: center;
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


input {
    border: none;
    /* needs to be rainbow-border-mat radius - padding size */
    border-radius: 4px;
    width: 100%;
    height: 100%;
    font-size: larger;
    padding-left: 10px;
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