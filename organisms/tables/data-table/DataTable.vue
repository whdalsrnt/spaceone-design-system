<template>
    <p-table
        ref="table"
        :table-style-type="tableStyleType"
        :thead-style-type="theadStyleType"
        :responsive-style="responsiveStyle"
        :table-style="tableStyle"
        :tbody-style="tbodyStyle"
        :thead-style="theadStyle"
        :tfoot-style="tfootStyle"
        :striped="striped"
        :bordered="bordered"
        :hover="hover"
        :small="small"
        :background="background"
        :top-border="topBorder"
        :responsive="responsive"
        :tbody-on-select-start="!isDragging"
    >
        <template #caption>
            <slot name="caption" />
        </template>
        <template #head>
            <slot
                name="head"
                :fields="fieldsData"
            >
                <p-tr>
                    <p-th v-if="selectable" class="all-select">
                        <PCheckBox v-if="multiSelect"
                                   v-model="allState"
                                   @change="selectAllToggle"
                        />
                    </p-th>
                    <p-th
                        v-for="(field, index) in fieldsData"
                        :key="index"
                        :style="field.style ||{}"
                        :class="{'fix-width': colCopy}"
                        @click="theadClick(field, index, $event)"
                        @mouseenter="thHoverIndex=index"
                        @mouseleave="thHoverIndex=null"
                    >
                        <slot :name="`th-${field.name}`" :index="index" :field="field"
                              :sortable="sortable"
                        >
                            <span class="th-contents">
                                <span>
                                    {{ field.label ? field.label : field.name }}
                                    <p-copy-button v-if="colCopy"
                                                   class="ml-2"
                                                   @copy="clickColCopy(index)"
                                    />
                                </span>

                                <template v-if="sortable&&field.sortable">
                                    <p-i
                                        v-if="sortable&&(field.sortKey|| field.name)===sortBy"
                                        :name="sortIcon"
                                        class="sort-icon"
                                    />
                                    <p-i
                                        v-else
                                        name="ic_table_sort"
                                        class="sort-icon"
                                    />
                                </template>
                            </span>
                        </slot>
                    </p-th>
                </p-tr>
            </slot>
        </template>
        <template #body>
            <slot v-if="loading" name="loading">
                <p-tr v-for="s in skeletons" :key="s">
                    <p-td v-if="selectable" class="!pr-0  min-w-4 w-4">
                        <p-skeleton width="1rem" height="1rem" />
                    </p-td>
                    <p-td v-for="(field, index) in fieldsData" :key="index">
                        <slot :name="'skeleton-'+field.name" :index="index" :field="field">
                            <p-skeleton />
                        </slot>
                    </p-td>
                </p-tr>
            </slot>
            <slot v-else-if="showNoData" name="no-data" :fields="fieldsData">
                <p-tr key="noData" class="no-data-row">
                    <p-td class="no-data" :colspan="selectable? fieldsData.length +1 :fieldsData.length">
                        {{ $t('ORGANISMS.NO_DATA') }}
                    </p-td>
                </p-tr>
            </slot>
            <slot v-else name="body" :items="items">
                <slot v-for="(item, index) in items" name="row" :fields="fieldsName"
                      :item="item" :index="index"
                >
                    <slot :name="'row-'+index"
                          :item="item"
                          :index="index"
                          :fields="fieldsName"
                    >
                        <p-tr :key="index" :data-index="index"
                              :class="{'tr-selected': isSelected(index)} "
                              v-bind="(item&& item.hasOwnProperty('vbind') )? item.vbind : null"
                              @click.left="rowLeftClick( item, index, $event )"
                              @click.right="rowRightClick( item, index, $event )"
                              @click.middle="rowMiddleClick( item, index, $event )"
                              @mouseover="rowMouseOver(item,index, $event)"
                              @mouseout="rowMouseOut(item,index, $event)"
                        >
                            <p-td v-if="selectable"
                                  class="select-checkbox"
                                  @click.stop.prevent="selectClick"
                                  @mouseenter="hoverIndex=index"
                                  @mouseleave="hoverIndex=null"
                            >
                                <PCheckBox v-if="multiSelect"
                                           v-model="proxySelectIndex"
                                           :value="index"
                                           :hovered="hoverIndex===index"
                                />
                                <p-radio v-else
                                         v-model="proxySelectIndex[0]"
                                         :value="index"
                                         :hovered="hoverIndex===index"
                                />
                            </p-td>
                            <template v-for="field in fieldsName">
                                <slot
                                    :name="'col-'+field"
                                    :item="item"
                                    :value=" item? item[field] :''"
                                    :index="index"
                                    :field="field"
                                >
                                    <p-td onselectstart="return true">
                                        <slot
                                            :name="'col-'+field+'-format'"
                                            :item="item"
                                            :value="getValueFunc(item,field)"
                                            :index="index"
                                            :field="field"
                                        >
                                            {{ getValueFunc(item,field) }}
                                        </slot>
                                    </p-td>
                                </slot>
                            </template>
                        </p-tr>
                    </slot>
                </slot>
            </slot>
        </template>
        <template #foot>
            <slot name="foot" />
        </template>
    </p-table>
</template>

<script lang="ts">
import DragSelect from 'dragselect';
import {
    toRefs, computed, reactive, watch, onMounted, Ref, defineComponent, ref,
} from '@vue/composition-api';
import _ from 'lodash';
import PTable from '@/components/molecules/tables/Table.vue';
import PTr from '@/components/atoms/table/Tr.vue';
import PTd from '@/components/atoms/table/Td.vue';
import PTh from '@/components/atoms/table/Th.vue';
import PI from '@/components/atoms/icons/PI.vue';
import PLottie from '@/components/molecules/lottie/PLottie.vue';
import { copyAnyData, selectToCopyToClipboard } from '@/lib/util';
import { makeProxy, windowEventMount } from '@/lib/compostion-util';
// eslint-disable-next-line import/named
import PSkeleton from '@/components/atoms/skeletons/Skeleton.vue';
import { dataTableProps, DataTableSetupProps } from './toolset';

const PCheckBox = () => import('@/components/molecules/forms/checkbox/CheckBox.vue');
const PRadio = () => import('@/components/molecules/forms/radio/Radio.vue');
const PCopyButton = () => import('@/components/molecules/buttons/CopyButton.vue');


const loadingHandler = (props) => {
    onMounted(() => {
        if (props.useCursorLoading && props.loading) {
            document.body.style.cursor = 'progress';
        }
    });
    watch(() => props.loading, (value) => {
        if (props.useCursorLoading) {
            if (value) {
                document.body.style.cursor = 'progress';
            } else {
                document.body.style.cursor = 'default';
            }
        }
    });
};


export default defineComponent({
    name: 'PDataTable',
    components: {
        PSkeleton,
        PTable,
        PTd,
        PTh,
        PTr,
        PI,
        PCheckBox,
        PCopyButton,
        PLottie,
        PRadio,
    },
    props: dataTableProps,
    setup(props: DataTableSetupProps, context) {
        const state = reactive({
            table: null,
            allState: false,
            hoverIndex: null,
            dragSelect: null,
            thHoverIndex: null,
        });
        const proxySelectIndex = makeProxy('selectIndex', props, context.emit);
        const fieldsData: Ref<any> = computed(() => {
            const data = _.flatMap(props.fields, (value: string|object) => {
                if (typeof value === 'string') { return { name: value, label: value, sortable: true }; }
                return { sortable: true, ...value };
            });
            return data;
        });

        const fieldsName = computed(() => _.flatMap(fieldsData.value, field => field.name));
        const sortIcon = computed(() => (props.sortDesc ? 'ic_table_sort_fromZ' : 'ic_table_sort_fromA'));
        // @ts-ignore
        const selectArea = computed(() => state.table.$el);
        const dragSelectAbles = computed(() => selectArea.value.children[0].children[1].children);
        const showNoData = computed(() => {
            // eslint-disable-next-line no-prototype-builtins
            if (!props.items || !props.items.hasOwnProperty('length') || props.items.length === 0) {
                if (props.loading) {
                    return false;
                }
                return true;
            }
            return false;
        });
        const isDragging = ref(false);
        const skeletons = computed(() => _.range(props.skeletonRows));
        const dragSelectItems = (items) => {
            const select = [];
            if (items.length > 1) {
                items.forEach((item: any) => {
                    // @ts-ignore
                    select.push(Number(item.attributes['data-index'].value));
                });
                proxySelectIndex.value = select;
            }
            isDragging.value = false;
        };

        const dragStart = () => {
            isDragging.value = true;
        };

        const makeTableText = (el) => {
            let result = '';
            const startIdx = props.selectable ? 1 : 0;
            const tds = el.children;
            // eslint-disable-next-line no-plusplus
            for (let idx = startIdx; idx < el.childElementCount; idx++) {
                result += `${tds[idx].innerText}\t`;
            }
            return `${result}\n`;
        };
        const copy = (event) => {
        /**
         * TODO: single select copy
         */
            const hasSelectData = () => {
                const selection = document.getSelection();
                if (selection && selection.type === 'Range') {
                    return true;
                }
                return false;
            };
            if (!hasSelectData()) {
                if (!props.multiSelect) return;

                if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey) && (props.selectIndex as Array<any>).length > 0) {
                    let result = '';
                    if (typeof props.selectIndex === 'object') {
                        props.selectIndex.forEach((td) => {
                            result += makeTableText(dragSelectAbles.value[td]);
                        });
                    }
                    selectToCopyToClipboard(result);
                }
            }
        };
        const isSelected = index => (props.multiSelect ? proxySelectIndex.value.indexOf(index) !== -1 : proxySelectIndex.value[0] === index);
        const checkboxToggle = (index) => {
            const newSelected = [...proxySelectIndex.value];
            if (isSelected(index)) {
                const idx = newSelected.indexOf(index);
                newSelected.splice(idx, 1);
                state.allState = false;
            } else {
                newSelected.push(index);
            }
            proxySelectIndex.value = newSelected;
        };
        const rowLeftClick = (item, index, event) => {
            context.emit('rowLeftClick', item, index, event);
            if (!props.selectable) return;
            if (props.multiSelect) {
                if (props.rowClickMultiSelectMode) {
                    checkboxToggle(index);
                    return;
                }
                if (event.shiftKey) {
                    if (!props.dragable) {
                        checkboxToggle(index);
                    }
                    return;
                }
            }
            proxySelectIndex.value = [index];
        };
        const rowRightClick = (item, index, event) => {
            context.emit('rowRightClick', item, index, event);
        };
        const rowMiddleClick = (item, index, event) => {
            context.emit('rowMiddleClick', item, index, event);
        };
        const rowMouseOver = (item, index, event) => {
            context.emit('rowMouseOver', item, index, event);
        };
        const rowMouseOut = (item, index, event) => {
            context.emit('rowMouseOut', item, index, event);
        };
        const theadClick = (field, index, event) => {
            if (props.sortable && field.sortable) {
                const sortBy = field.sortKey || field.name;
                if (props.sortBy !== sortBy) {
                    context.emit('update:sortBy', sortBy);
                    if (!props.sortDesc) {
                        context.emit('update:sortDesc', true);
                    }
                } else {
                    if (!props.sortDesc) {
                        context.emit('update:sortBy', '');
                    }
                    context.emit('update:sortDesc', !props.sortDesc);
                }
                context.emit('changeSort');
            }
            context.emit('theadClick', field, index, event);
        };

        const selectClick = (event) => {
            event.target.children[0].click();
        };
        const selectAllToggle = () => {
            if (state.allState) {
                proxySelectIndex.value = Array.from(new Array(props.items.length).keys());
            } else {
                proxySelectIndex.value = [];
            }
        };
        const getSelectItem = (sortable) => {
            const selectedIndex = sortable ? proxySelectIndex.value : proxySelectIndex.value.sort((a, b) => a - b);
            const selectItem = [];
            // @ts-ignore
            selectedIndex.forEach((index) => {
                // @ts-ignore
                selectItem.push(props.items[index]);
            });
            return selectItem;
        };
        const clickColCopy = (idx) => {
            let result = '';
            const arr = Array.from(dragSelectAbles.value as any[]);
            arr.forEach((el) => {
                // @ts-ignore
                const children = Array.from(el.children);
                children.forEach((td, colIdx) => {
                    if (colIdx === idx) {
                        // @ts-ignore
                        result += `${td.innerText}\t`;
                    }
                });
            });
            copyAnyData(result);
        };

        let dragSelect = null;
        onMounted(() => {
            if (props.selectable && props.dragable) {
                // @ts-ignore
                dragSelect = new DragSelect({
                    selectables: dragSelectAbles.value as any[],
                    area: selectArea.value as HTMLElement|SVGElement|Document,
                    callback: dragSelectItems,
                    onDragStart: dragStart,
                });
            }
        });
        if (props.selectable) {
            windowEventMount('keydown', copy);
        }

        watch(() => props.items, () => {
            if (props.selectable && props.dragable && props.items) {
                context.root.$nextTick((() => {
                    // @ts-ignore
                    dragSelect.setSelectables(dragSelectAbles.value);
                    // @ts-ignore
                    dragSelect.clearSelection();
                }));
            }
        });

        watch(() => props.selectIndex, () => {
            if (props.items && props.items.length && props.items.length === (props.selectIndex as any[]).length) {
                state.allState = true;
            } else {
                state.allState = false;
            }
        });

        loadingHandler(props);


        const getValueFunc = computed(() => {
            if (_.every(fieldsName.value, field => !field.includes('.'))) {
                return (item, field) => item[field] || '';
            }
            return (item, field) => _.get(item, field, '');
        });

        return {
            ...toRefs(state),
            proxySelectIndex,
            fieldsData,
            fieldsName,
            sortIcon,
            showNoData,
            isSelected,
            rowLeftClick,
            rowRightClick,
            rowMiddleClick,
            rowMouseOver,
            rowMouseOut,
            theadClick,
            selectClick,
            selectAllToggle,
            getSelectItem,
            clickColCopy,
            getValueFunc,
            isDragging,
            skeletons,
        };
    },

});
</script>

<style lang="postcss" scoped>

    @define-mixin selected-row {
        background-color: theme('colors.blue.200') !important;
        td {
            @apply text-secondary ;
      }
    }

    .select-checkbox {
        @apply cursor-pointer min-w-4 w-4;
    }
    tbody {
        display: block;
        tr {
            &.tr-selected {
                @mixin selected-row;
            }
            td {
                vertical-align: middle;
            }
        }
    }
    thead {
        tr {
            th {
                white-space: nowrap;
                .th-contents {
                    @apply flex justify-between pl-4 py-1;
                }
                .sort-icon {
                    @apply text-gray-500 float-right my-px;
                    &:hover { cursor: pointer; }
                }
                &.fix-width {
                    @apply min-w-19;
                }
                &:last-child {
                    .th-contents {
                        @apply pr-2;
                    }
                }
                &.all-select {
                    @apply w-4 py-1 pl-4 max-w-15 min-w-15;
                }
            }
        }
    }
    .fade-enter {
        opacity: 0;
    }
    .fade-enter-active {
        transition: opacity 0s;
    }
    .no-data-row {
        /*&:hover {*/
        /*    background-color: initial !important;*/
        /*}*/
        .no-data {
            @apply text-primary2 border-0 text-center py-12 text-2xl;
            &:hover {
                @apply bg-white;
            }
            line-height: 120%;
        }
    }
</style>
