<template>
    <div>
        <slot name="container" :height="containerHeight" />

        <div class="dragger-container">
            <div class="line left"
                 :class="{'colored': line}"
                 :style="lineStyle"
            />

            <span class="dragger"
                  :style="draggerStyle"
                  @mousedown="onMousedown"
            >
                <slot name="dragger">
                    <p-i color="transparent inherit"
                         width="1.5rem"
                         height="1.5rem"
                         name="btn_height-modifier"
                    />
                </slot>
            </span>
        </div>
    </div>
</template>

<script>
import PI from '@/components/atoms/icons/PI.vue';

export default {
    name: 'HorizontalLayout',
    components: { PI },
    props: {
        line: {
            type: Boolean,
            default: false,
        },
        draggerSize: {
            type: String,
            default: '1.5rem',
        },
        draggerWidth: {
            type: Number,
            default: 30,
        },
        height: {
            type: Number,
            default: 400,
        },
        minHeight: {
            type: Number,
            default: 200,
        },
        maxHeight: {
            type: Number,
            default: 1000,
        },
    },
    data() {
        return {
            lineStyle: {
                width: `calc(50% - ${this.width}px)`,
            },
            draggerStyle: {
                'font-size': this.draggerSize,
                width: `${this.draggerWidth}px`,
            },
            containerHeight: this.height,
            dragging: false,
            pageY: null,
        };
    },
    methods: {
        onMousedown() {
            this.dragging = true;
            self.document.addEventListener('mousemove', this.onMousemove);
            self.document.addEventListener('mouseup', this.onMouseup);
        },
        onMousemove(e) {
            if (this.dragging) {
                if (this.pageY === null) {
                    this.pageY = e.pageY;
                    return;
                }

                const newHeight = this.containerHeight - (this.pageY - e.pageY);
                if (newHeight < this.minHeight || newHeight > this.maxHeight) {
                    return;
                }
                this.containerHeight = newHeight;
                this.pageY = e.pageY;
            }
        },
        onMouseup() {
            if (this.dragging) {
                this.dragging = false;
                this.pageY = null;
                self.document.removeEventListener('mousemove', this.onMousemove);
                self.document.removeEventListener('mouseup', this.onMouseup);
            }
        },
    },
};
</script>

<style lang="postcss" scoped>
    .dragger-container {
        @apply relative mt-4 pb-7;
        .line {
            @apply absolute inline-block border-b;
            border-color: transparent;
            &.colored {
                @apply border-gray;
            }
            &.left {
                @apply left-0;
            }
        }
        .dragger {
            @apply absolute inline-block text-gray-300 top-0 text-2xl items-center;
            left: 50%;
            transform: translate(-50%, -50%);
            &:hover, &:active{
                @apply text-gray-900;
                cursor: row-resize;
            }
        }
    }
</style>
