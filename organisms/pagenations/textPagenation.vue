<template>
    <nav class="text-pagenation">
        <p-icon-button class="text"
                       name="ic_arrow_left"
                       :disabled="thisPage === 1"
                       color="transparent inherit"
                       @click="update(thisPage-1)"
        />
        <div class="page-number">
            <div class="page-number-text">
                <span class="this-page">{{ thisPage }}</span> / <span>{{ allPage }}</span>
            </div>
        </div>

        <p-icon-button class="text"
                       name="ic_arrow_right"
                       :disabled="thisPage === allPage"
                       color="transparent inherit"
                       @click="update(thisPage+1)"
        />
    </nav>
</template>
<script>
import PIconButton from '@/components/molecules/buttons/IconButton.vue';

export default {
    name: 'PTextButton',
    components: { PIconButton },
    setup(props, { emit }) {
        return {
            update(page) {
                emit('update:thisPage', page);
                emit('pageChange', page);
            },
            iconHoverColor: 'transparent inherit',
        };
    },
    props: {
        thisPage: {
            type: Number,
            validator(value) {
                return value > 0;
            },
        },
        allPage: {
            type: Number,
            validator(value) {
                return value > 0;
            },
        },
    },
};
</script>

<style lang="postcss" scoped>
    .text-pagenation {
        @apply min-w-12;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap:nowrap;
        .text {
            color: inherit;
            &:hover {
                color: theme('colors.secondary1')
            }
        }
        @screen lg{
            @apply min-w-16;
        }
    }
    .page-number {
        @apply  min-h-8 min-w-12 items-center justify-center inline-flex cursor-default;
        .page-number-text {
            line-height: 1.2rem;
            font-size: 0.875rem;
            .this-page {
                font-weight: bold;
            }
        }
        @screen lg{
            @apply min-w-16;
        }

    }
    .icon-button {
        &:not(:disabled):not(.disabled):hover {
            border-color:transparent;
            @apply bg-transparent;
        }
    }

</style>
