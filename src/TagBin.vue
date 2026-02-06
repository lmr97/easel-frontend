<script setup lang="ts">

import { type TagDisplaySettings } from './types'
const props = defineProps<{tagState: Map<string, TagDisplaySettings>}>()

</script>
<template>
<div class="relative-wrapper">
    <div id="tag-bin">
        <!-- hashtags are added via CSS, with a `before` pesudoelement. -->
        <div class="tag-bin-label">
            <h2>Add some tags here:</h2>
            <h3>or type them above, with a #</h3>
        </div>
        <TransitionGroup name="tag-bin">
            <div 
                v-for="[tagName, dispOpts] in tagState"
                v-show="dispOpts.selected"
                @click="dispOpts.selected = !dispOpts.selected" 
                :key="tagName"
                :class="`theme-tag theme-tag-color${dispOpts.colorNumber}`"
            >
                {{ tagName }}
            </div>
        </TransitionGroup>
    </div>
</div>
</template>
<style lang="css" scoped>
/* apply transition to moving elements */
.tag-bin-move, 
.tag-bin-enter-active,
.tag-bin-leave-active {
    transition: all 0.5s ease;
}
.tag-bin-enter-from,
.tag-bin-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.tag-bin-leave-active {
  position: absolute;
}

/* necessary to keep the tags going into the bin from
flying across the screen. see: https://github.com/vuejs/vue/issues/11654
especially this comment: https://github.com/vuejs/vue/issues/11654#issuecomment-2393483064 */
.relative-wrapper {
    position: relative;
}

#tag-bin {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 5%;
    padding: 2%;
    border: 1px solid grey;
    border-radius: 15px;
}
</style>