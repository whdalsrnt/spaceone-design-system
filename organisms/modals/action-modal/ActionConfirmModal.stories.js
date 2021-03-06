import { select, text } from '@storybook/addon-knobs/vue';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import PButton from '@/components/atoms/buttons/Button.vue';
import { sizeMapping } from '@/components/molecules/modals/toolset';
import PTableCheckModel from './ActionConfirmModal.vue';

export default {
    title: 'organisms/modals/action-confirm-modal',
    component: PTableCheckModel,
    parameters: {
        info: {
            summary: '',
            components: { PTableCheckModel },
        },
        centered: { disable: true },
    },
};

const data = {
    fields: ['name', 'phone', 'email'],
    sortable: true,
    sortBy: null,
    sortDesc: true,
    visible: false,
    items: [
        { name: 'stark', phone: '000-0000-0000', email: 'stark@marvel.com' },
    ],
};

const actions = {
    shown: action('shown'),
    hidden: action('hidden'),
    cancel: action('cancel'),
    close: action('close'),
    confirm: action('confirm'),

};


const pmProps = [
    { name: 'scrollable' },
    { name: 'centered' },
    { name: 'backdrop' },
    { name: 'fade' },
    { name: 'keyboard' },
];


export const actionModalWithTable = () => ({
    components: { PTableCheckModel, PButton },
    template: `<div>
                    <p-button styleType="primary" @click="click">Launch a modal</p-button>
                <PTableCheckModel
                    ref="modal"
                    :size="size"
                    :scrollable="true"
                    :headerTitle="headerTitle"
                    :subTitle="subTitle"
                    :fields="fields"
                    :items="items"
                    :visible.sync="visible"
                    :themeColor="themeColor"
                    @cancel="cancel"
                    @close="close"
                    @confirm="confirm"
                    >
                </PTableCheckModel>
            </div>`,
    data() {
        return {
            ...data,
        };
    },
    props: {
        themeColor: {
            default: select('color', ['primary', 'alert', 'safe']),
        },
        size: {
            default: select('size', ['', ...Object.keys(sizeMapping)]),
        },
        okDisabled: {
            default: boolean('ok disabled', false),
        },
        headerTitle: {
            default: text('header', 'this is header'),
        },
        subTitle: {
            default: text('sub', 'this is sub Title'),
        },
        scrollable: {
            default: boolean('scrollable', false),
        },
    },
    computed: {
        ConfirmButtonBind() {
            return {
                styleType: 'primary',
                disabled: this.okDisabled,
            };
        },
    },
    methods: {
        click() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        ...actions,
    },
});

export const actionModalWithTableAndInput = () => ({
    components: { PTableCheckModel, PButton },
    template: `<div>
                    <p-button styleType="primary" @click="click">Launch a modal</p-button>
                <PTableCheckModel
                    ref="modal"
                    :size="size"
                    :scrollable="true"
                    :headerTitle="headerTitle"
                    :subTitle="subTitle"
                    :fields="fields"
                    :items="items"
                    :visible.sync="visible"
                    :themeColor="themeColor"
                    :doubleConfirm="doubleConfirm"
                    :doubleConfirmOrigin="doubleConfirmOrigin"
                    :doubleConfirmTitle="doubleConfirmTitle"
                    :doubleConfirmPlaceHolder="doubleConfirmPlaceHolder"
                    @cancel="cancel"
                    @close="close"
                    @confirm="confirm"
                    >
                </PTableCheckModel>
            </div>`,
    data() {
        return {
            ...data,
        };
    },
    props: {
        themeColor: {
            default: select('color', ['primary', 'alert', 'safe']),
        },
        size: {
            default: select('size', [null, ...Object.keys(sizeMapping)]),
        },
        okDisabled: {
            default: boolean('ok disabled', false),
        },
        headerTitle: {
            default: text('header', 'this is header'),
        },
        subTitle: {
            default: text('sub', 'this is sub Title'),
        },
        scrollable: {
            default: boolean('scrollable', false),
        },
        doubleConfirm: {
            default: boolean('doubleConfirm', true),
        },
        doubleConfirmOrigin: {
            default: text('Original Value', 'Please Original value Here'),
        },
        doubleConfirmTitle: {
            default: text('Input Title', 'This is Input title'),
        },
        doubleConfirmPlaceHolder: {
            default: text('Input Placeholder', 'Please, place input you want to do next action'),
        },

    },
    computed: {
        ConfirmButtonBind() {
            return {
                styleType: 'primary',
                disabled: this.okDisabled,
            };
        },
    },
    methods: {
        click() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        ...actions,
    },
});
