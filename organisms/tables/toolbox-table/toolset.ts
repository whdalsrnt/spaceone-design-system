import { reactive, Ref, ref } from '@vue/composition-api';
import {
    DataTablePropsType,
    DataTableSelectState,
    DataTableState,
    DataTableSyncType,
    DataTableToolSet, LinkState,
} from '@/components/organisms/tables/data-table/toolset';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { BaseAutocompleteHandler } from '@/components/organisms/search/query-search-bar/autocompleteHandler';
import {
    HelperToolSet,
    initReactive, optionalType, StateToolSet, SyncStateToolSet,
} from '@/lib/toolset';
import { Computed } from '@/lib/type';
import {
    KeyHandler,
    QuerySearchToolSet,
    ValueHandlerMap,
} from '@/components/organisms/search/query-search/PQuerySearch.toolset';
import { ChangeTagCallBack } from '@/components/molecules/tags/toolset';
import { getAllPage } from '../../pagenations/toolset';

export interface ToolBoxTablePropsType extends DataTablePropsType{
    pagenationVisible?: boolean;
    pageSizeVisible?: boolean;
    shadow?: boolean;
    border?: boolean;
    settingVisible?: boolean;
    refreshVisible?: boolean;
    allPage?: number;
    pageNationValues?: number[];
    padding?: boolean;
    toolboxBackground?: boolean;
}
export interface ToolBoxTableSyncType extends DataTableSyncType {
    pageSize?: number;
    thisPage?: number;
}

export interface ToolBoxTableSetupProps extends ToolBoxTablePropsType, ToolBoxTableSyncType{
    pagenationVisible: boolean;
    pageSizeVisible: boolean;
    shadow: boolean;
    border: boolean;
    settingVisible: boolean;
    refreshVisible: boolean;
    allPage: number;
    pageNationValues: number[];
    padding: boolean;
    toolboxBackground: boolean;
    pageSize: number;
    thisPage: number;
}

@StateToolSet<ToolBoxTablePropsType>()
@SyncStateToolSet<ToolBoxTableSyncType>()
export class ToolboxTableState<
        initData=any,
        initSyncData=any,
        initState extends ToolBoxTablePropsType=ToolBoxTablePropsType,
        initSyncState extends ToolBoxTableSyncType=ToolBoxTableSyncType,
    > extends DataTableState<initData, initSyncData, initState, initSyncState> {
    static initState() {
        return {
            ...DataTableState.initState(),
            pagenationVisible: true,
            pageSizeVisible: true,
            shadow: true,
            border: true,
            allPage: 1,
            settingVisible: false,
            excelVisible: false,
            refreshVisible: true,
            pageNationValues: undefined,
            padding: true,
            toolboxBackground: true,
            sortable: true,
            dragable: true,
            rowClickMultiSelectMode: true,
            selectable: true,
        };
    }

    static initSyncState() {
        return {
            ...DataTableState.initSyncState(),
            pageSize: 15,
            thisPage: 1,
        };
    }

    constructor(initData: initData = {} as initData, initSyncData: initSyncData = {}as initSyncData, lazy = false) {
        super(initData, initSyncData, true);
        this.state = initReactive(lazy, ToolboxTableState.initState(), initData);
        this.syncState = initReactive(lazy, ToolboxTableState.initSyncState(), initSyncData);
    }
}

@HelperToolSet()
export class ToolboxTableToolSet<initData=any, initSyncData=any> extends ToolboxTableState<initData, initSyncData> implements DataTableToolSet<initData, initSyncData> {
     selectState: DataTableSelectState= {} as DataTableSelectState;

     linkState: LinkState= null as unknown as LinkState;

     noLink: Computed<boolean> = null as unknown as Computed<boolean>;

     setAllPage: (totalCount: number) => void = null as unknown as (totalCount: number) => void;

     static initToolSet(_this: any, ...args: any[]) {
         DataTableToolSet.initToolSet(_this);
         _this.setAllPage = (totalCount: number) => {
             _this.state.allPage = getAllPage(totalCount, (_this.syncState.pageSize));
         };
     }

     constructor(initData: initData = {} as initData, initSyncData: initSyncData = {} as initSyncData, lazy = false) {
         super(initData, initSyncData);
         if (!lazy) {
             ToolboxTableToolSet.initToolSet(this);
         }
     }
}


@HelperToolSet()
export class SearchTableToolSet<initData=any, initSyncData=any> extends ToolboxTableToolSet<initData, initSyncData> {
    searchText: Ref<string> = null as unknown as Ref<string>;

    static initToolSet(_this: any) {
        ToolboxTableToolSet.initToolSet(_this);
        _this.searchText = ref('');
    }

    constructor(initData: initData = {} as initData, initSyncData: initSyncData = {} as initSyncData, lazy = false) {
        super(initData, initSyncData, true);
        if (!lazy) {
            SearchTableToolSet.initToolSet(this);
        }
    }
}

@HelperToolSet()
export class QuerySearchTableToolSet<initData, initSyncData> extends ToolboxTableToolSet<initData, initSyncData> {
    querySearch: QuerySearchToolSet=null as unknown as QuerySearchToolSet;

    static initToolSet(_this: any,
        keyHandler: KeyHandler,
        valueHandlerMap: ValueHandlerMap,
        suggestKeys: string[],
        changeTagCallBack?: ChangeTagCallBack) {
        ToolboxTableToolSet.initToolSet(_this);
        _this.querySearch = new QuerySearchToolSet(keyHandler, valueHandlerMap, suggestKeys, undefined, undefined, changeTagCallBack);
    }

    constructor(
        keyHandler: KeyHandler,
        valueHandlerMap: ValueHandlerMap,
        suggestKeys: string[],
        initData: initData = {} as initData,
        initSyncData: initSyncData = {} as initSyncData,
        lazy = false,
        changeTagCallBack?: ChangeTagCallBack,
    ) {
        super(initData, initSyncData, true);
        if (!lazy) {
            QuerySearchTableToolSet.initToolSet(this, keyHandler, valueHandlerMap, suggestKeys, changeTagCallBack);
        }
    }
}
