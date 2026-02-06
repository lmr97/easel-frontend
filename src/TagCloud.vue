<script lang="ts" setup>

import { type TagDisplaySettings } from './types';
const props = defineProps<{tagState: Map<string, TagDisplaySettings>}>()

</script>
<template>
<!-- hashtag characters are added via CSS, with a `before` pesudoelement. -->
<!-- the TransitionGroup component will compile to a div with id="tag-cloud" -->
<TransitionGroup name="tag-cloud" tag="div" id="tag-cloud">
    <div 
        v-for="[tagName, dispOpts] in tagState" 
        v-show="!dispOpts.selected"
        @click="dispOpts.selected = !dispOpts.selected" 
        :key="tagName"
        :class="`theme-tag theme-tag-color${dispOpts.colorNumber}`"
    >
        {{ tagName }}
    </div>
</TransitionGroup>
</template>
<style lang="css" scoped>

.tag-cloud-move, 
.tag-cloud-enter-active,
.tag-cloud-leave-active {
  transition: all 0.5s ease;
}

.tag-cloud-enter-from,
.tag-cloud-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.tag-cloud-leave-active {
  position: absolute;
}

#tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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
</style>