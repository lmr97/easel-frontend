<script lang="ts" setup>

const props = defineProps<{tagState: Map<string, [boolean, number]>}>()

// tag string does not include "#" character.
// It is added via CSS on render (see `theme-tag` 
// class under the `<style>` section below
function selectTag(tag: string, colorNumber: number) {
    props.tagState.set(tag, [true, colorNumber])
}

</script>
<template>
<!-- hashtag characters are added via CSS, with a `before` pesudoelement. -->
<!-- the TransitionGroup component will compile to a div with id="tag-cloud" -->
<TransitionGroup name="tag-cloud" tag="div" id="tag-cloud">
    <div 
        v-for="[tagName, [selected, colorNumber]] in tagState" 
        v-show="!selected"
        @click="selectTag(tagName, colorNumber)" 
        :key="tagName"
        :class="`theme-tag theme-tag-color${colorNumber}`"
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