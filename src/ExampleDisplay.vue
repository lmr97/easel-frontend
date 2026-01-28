<script lang="ts" setup>
import { ref, computed } from 'vue'
import { type QueryExample } from './Home.vue'

const props       = defineProps<{ exampleSet: QueryExample[], currIdx: number}>()
const currExample = computed<QueryExample>(
    () => props.exampleSet[props.currIdx] as QueryExample
)

function formatExampleSearch(tags: string[], searchString: string) {
    const tagFmt = "#" + tags.join(" #")
    return tagFmt + " " + searchString
}


</script>
<template>
<!-- transitions by changing the `key` prop passed to the div in the Transition -->
<div class="static-wrap">
    <Transition>
        <div
        :style="{backgroundImage: `url(${currExample.imagePath})`}"
        :key="currIdx"
        class="example-display">
            <div class="example-caption">
                <p class="example-search">
                    {{ 
                        formatExampleSearch(
                            currExample.searchTags   as string[], 
                            currExample.searchString as string
                        ) 
                    }}
                </p>
                <p class="example-artist">by: {{ currExample.artist }}</p>
            </div>
        </div>
    </Transition>
</div>
</template>
<style lang="css" scoped>
.v-enter-active, .v-leave-active {
    position: absolute;
    transition: opacity 2s ease;
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

/* needed to keep the wrong content from overlapping */
.static-wrap {
    height: 15em;
}
</style>