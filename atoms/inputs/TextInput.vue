<script>
import { getBindClass } from '@/components/utils/functional';

export default {
    name: 'PTextInput',
    functional: true,
    model: {
        prop: 'value',
        event: 'onInput',
    },
    props: {
        value: {
            type: [String, Number],
            default: undefined,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'text',
            validator: value => ['text', 'number', 'password'].includes(value),
        },
        block: {
            type: Boolean,
            default: false,
        },
    },
    render(h, { data, props, listeners }) {
        return h('input', {
            ...data,
            class: {
                ...getBindClass(data.class),
                'p-text-input': true,
                block: props.block,
            },
            attrs: {
                ...data.attrs,
                disabled: props.disabled,
                type: props.type,
            },
            domProps: {
                value: props.value,
            },
            on: {
                ...listeners,
                input: (event) => {
                    // do not change order
                    if (listeners.onInput) listeners.onInput(event.target.value);
                    if (listeners.input) listeners.input(event.target.value);
                },
            },
        });
    },
};
</script>

<style lang="postcss">

@define-mixin setInput {
    &.p-text-input {
        @apply border bg-white text-gray-900;
        min-height: 2rem;
        height: 2rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 2px;
        font-size: .875rem;
        line-height: 2rem;
        appearance: none;
        &:hover{
            @apply border-secondary;
        }
        &:focus {
            @apply border-secondary;
        }
        &:disabled {
            @apply border-gray-200 bg-gray-100;
        }
        &.is-invalid {
            @apply border-alert;
        }
        &::placeholder{
            @apply text-gray-300;
        }
    }
}

input {
    @mixin setInput;
}
</style>
