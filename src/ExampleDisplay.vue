<script lang="ts" setup>
import { ref, computed, useTemplateRef, type ShallowRef } from 'vue'
import { type QueryExample } from './Home.vue'

const props       = defineProps<{ exampleSet: QueryExample[] }>()
const currIdx     = ref<number>(0)
const currExample = computed<QueryExample>(() => props.exampleSet[currIdx.value] as QueryExample) 
const nextExample = computed<QueryExample>(() => props.exampleSet[wrappedIdxIncrement()] as QueryExample)
const showThis = ref(true)

function formatExampleSearch(tags: string[], searchString: string) {
    const tagFmt = "#" + tags.join(" #")
    return tagFmt + " " + searchString
}

// does not update the currIdx value, it just 
// returns the new wrapped increment of it
function wrappedIdxIncrement() {
    const nextIndex = (currIdx.value + 1) % props.exampleSet.length
    return nextIndex
}

window.setInterval(() => currIdx.value = wrappedIdxIncrement(), 2000)
</script>
<template>
<!-- I'm gonna ensure there will be constant number of examples for simplicity.
Currently this number is 4. -->
<Transition>
    <div v-if="currIdx == 0" 
    ref = "example0"
    :style="{backgroundImage: `url(${props.exampleSet[0]?.imagePath})`}"
    class="example-display">
        <div class="example-caption">
            <p class="example-search">
                {{ 
                    formatExampleSearch(
                        props.exampleSet[0]?.searchTags   as string[], 
                        props.exampleSet[0]?.searchString as string
                    ) 
                }}
            </p>
            <p class="example-artist">by: {{ props.exampleSet[0]?.artist }}</p>
        </div>
    </div>
    <div v-else-if="currIdx == 1" 
    :style="{backgroundImage: `url(${props.exampleSet[1]?.imagePath})`}"
    class="example-display">
        <div class="example-caption">
            <p class="example-search">
                {{ 
                    formatExampleSearch(
                        props.exampleSet[1]?.searchTags   as string[], 
                        props.exampleSet[1]?.searchString as string
                    ) 
                }}
            </p>
            <p class="example-artist">by: {{ props.exampleSet[1]?.artist }}</p>
        </div>
    </div>
    <div v-else-if="currIdx == 2" 
    :style="{backgroundImage: `url(${props.exampleSet[2]?.imagePath})`}"
    class="example-display">
        <div class="example-caption">
            <p class="example-search">
                {{ 
                    formatExampleSearch(
                        props.exampleSet[2]?.searchTags   as string[], 
                        props.exampleSet[2]?.searchString as string
                    ) 
                }}
            </p>
            <p class="example-artist">by: {{ props.exampleSet[0]?.artist }}</p>
        </div>
    </div>
    <div v-else-if="currIdx == 3" 
    :style="{backgroundImage: `url(${props.exampleSet[3]?.imagePath})`}"
    class="example-display">
        <div class="example-caption">
            <p class="example-search">
                {{ 
                    formatExampleSearch(
                        props.exampleSet[3]?.searchTags   as string[], 
                        props.exampleSet[3]?.searchString as string
                    ) 
                }}
            </p>
            <p class="example-artist">by: {{ props.exampleSet[3]?.artist }}</p>
        </div>
    </div>
</Transition>
<!-- <button style="text-align: left;" @click="currIdx = wrappedIdxIncrement()">
    some bullshit goin on <br>
    {<br>
        currIdx: {{ currIdx }},<br>
        nextIdx: {{ wrappedIdxIncrement() }},<br>
        currExample: {{ JSON.stringify(currExample) }},<br>
        nextExample: {{ JSON.stringify(nextExample) }}<br>
    }
</button> -->
<!-- <button @click="showThis = !showThis">debuggin out</button> -->
</template>
<style lang="css" scoped>
.v-enter-active, .v-leave-active {
    transition: opacity 2s ease;
}
.v-enter-active {
    position: absolute;
    top: 5em;   /* height of header */
}
.v-enter-from, .v-leave-to {
    opacity: 0;
}

.example-display {
    display: flex;
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

.example-search {
    font-style: italic;
}

.example-search, .example-artist {
    height: fit-content;
    width: 100%;
}
</style>