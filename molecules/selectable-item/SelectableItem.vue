<template>
    <div class="item-container" :class="{
        active: active,
        [theme]: true,
    }" v-on="$listeners"
    >
        <slot name="bar" :color="color">
            <div v-if="color" class="bar" :style="{color}" />
        </slot>
        <div class="contents">
            <slot name="side">
                <p-lazy-img :img-url="iconUrl"
                            :error-icon="defaultIcon"
                            width="2rem" height="2rem"
                            class="flex-shrink-0 mr-2"
                />
            </slot>
            <div class="flex-grow overflow-hidden">
                <slot name="contents" :color="color">
                    <slot name="title">
                        <p class="title">
                            {{ title }}
                        </p>
                    </slot>
                    <slot name="contents-bottom" />
                </slot>
            </div>
            <slot name="extra" :color="color" />
        </div>
    </div>
</template>

<script lang="ts">
import { selectableItemProps, SelectableItemPropsType } from '@/components/molecules/selectable-item/SelectableItem.toolset';
import PLazyImg from '@/components/organisms/lazy-img/PLazyImg.vue';

export default {
    name: 'SelectableItem',
    components: {
        PLazyImg,
    },
    props: selectableItemProps,
    setup(props: SelectableItemPropsType) {
        return {
        };
    },
};
</script>

<style lang="postcss" scoped>
@define-mixin item-theme $border-color, $hover-bg-color, $active-color, $active-bg-color {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    border-color: $border-color;
    background-color: theme('colors.white');
    cursor: pointer;
    border-width: 1px;
    min-height: 3rem;
    height: 100%;
    .bar {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 2px 0 0 2px;
        width: 4px;
        height: 100%;
        background-color: currentColor;
    }
    .contents {
        @apply flex items-center w-full content-between p-2 overflow-hidden;
    }
    &:hover {
        background-color: $hover-bg-color;
    }
    &.active {
        background-color: $active-bg-color;
        color: $active-color;
        border-color: $active-color;
        &:hover {
            background-color: $hover-bg-color;
        }
    }

    .title {
        @apply text-sm;
        color: inherit;
    }
}
.item-container {
    &.default {
        @mixin item-theme transparent, theme('colors.gray.100'), theme('colors.secondary'), theme('colors.blue.200');
    }
    &.card {
        @mixin item-theme theme('colors.gray.200'), theme('colors.blue.200'), theme('colors.secondary'), theme('colors.blue.200');
        border-radius: 2px;
        .contents {
            padding: 0.5rem 1rem;
        }
    }
}

</style>
