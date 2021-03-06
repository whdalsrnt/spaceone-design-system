import {
    toRefs, reactive, ref, computed,
} from '@vue/composition-api';
import { action } from '@storybook/addon-actions';
import {
    text, number, select, object, boolean, color,
} from '@storybook/addon-knobs/vue';
import { getKnobProps } from '@sb/storybook-util';
import { selectableItemProps } from '@/components/molecules/selectable-item/SelectableItem.toolset';
import PSelectableItem from './SelectableItem.vue';

export default {
    title: 'molecules/SelectableItem',
    component: PSelectableItem,
    parameters: {
        info: {
            summary: '',
            components: { PSelectableItem },
        },
        knobs: { escapeHTML: false },
    },
};


const getState = (props, context) => {
    const state = reactive({});

    return state;
};


export const defaultCase = () => ({
    components: { PSelectableItem },
    props: getKnobProps(selectableItemProps, {
        iconUrl: 'https://assets-console-cloudone-dev.s3.ap-northeast-2.amazonaws.com/console-assets/icons/aws-ec2.svg',
        title: 'EC2 Collector',
    }, {}, {
        theme: select,
    }, {
        theme: ['default', 'card'],
    }),
    template: `
    <div style="width: 80vw;">
        <PSelectableItem v-bind="$props"></PSelectableItem>
    </div>`,
    setup(props, context) {
        const state = getState(props, context);

        return {
            ...toRefs(state),
        };
    },
});

export const extraSlot = () => ({
    components: { PSelectableItem },
    props: getKnobProps(selectableItemProps, {
        title: 'EC2 Collector',
    }),
    template: `
    <div style="width: 80vw; border: 1px solid gray;">
        <PSelectableItem v-bind="$props">
            <template #extra>
                This is Extra!!
            </template>
        </PSelectableItem>
    </div>`,
    setup(props, context) {
        const state = getState(props, context);

        return {
            ...toRefs(state),
        };
    },
});


export const cardTheme = () => ({
    components: { PSelectableItem },
    props: getKnobProps(selectableItemProps, {
        iconUrl: 'https://assets-console-cloudone-dev.s3.ap-northeast-2.amazonaws.com/console-assets/icons/aws-ec2.svg',
        title: 'EC2 Collector',
        color: '#222222',
        theme: 'card',
    }, {}, {
        theme: select,
        color,
    }, {
        theme: ['default', 'card'],
    }),
    template: `
    <div style="width: 80vw;">
        <PSelectableItem v-bind="$props"></PSelectableItem>
    </div>`,
    setup(props, context) {
        const state = getState(props, context);

        return {
            ...toRefs(state),
        };
    },
});
