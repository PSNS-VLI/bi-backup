<template>
  <div class="info-block">
    <div class="header bg-image">
      <div class="header-item title">
        <span class="iconfont icon-arrow-left" @click="handlerToCreateSet"></span>
        <span v-show="!isEdit" class="sql-title" @click="inputFocus">{{ sqlName }}</span>
        <el-input v-if="isEdit" v-model="sqlName" @blur="inputBlur" />
      </div>
      <div class="sql-options">
        <span class="iconfont icon-QuestionCircle"></span>
        <GxActions :actions="sqlSaveAction"></GxActions>
        <div class="start">
          <span class="iconfont icon-analysis">开始分析</span>
        </div>
      </div>
    </div>
    <GxDialog
      v-if="show"
      title="是否离开网站"
      attach="确定"
      @clickConfirm="clickConfirmBack"
      @clickCancel="clickCancelBack"
    >
      你所做的更改可能未保存。
    </GxDialog>
    <div class="body bg-image">
      <!--    左侧抽屉-->
      <!-- 关闭后 -->
      <div
        v-if="!drawer"
        style="
          width: 20px;
          margin: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <i class="iconfont icon-duiji1" @click="handlerDrawerIsShow"></i>
        <p>数据表</p>
      </div>
      <div class="drawer" v-show="drawer">
        <!--  -->
        <div style="display: flex; justify-content: space-between">
          <span>数据表</span>
          <i class="iconfont icon-duiji1" @click="handlerDrawerIsShow"></i>
        </div>
        <div class="drawer-title">
          <span class="title">选择数据源</span>
          <el-select v-model="dataSoueceSelect.id" @change="handlerSourceChange">
            <el-option
              v-for="item in dataSourceOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
        </div>
        <div class="sql" v-show="isSqlSource">
          <!-- <div
            class="sql-options"
            draggable="true"
            @mousedown="() => handlerMouseDown(item)"
            @dragstart="() => handlerDragStart(item)"
            @dragend="handlerDragEnd"
          >
            <span class="iconfont icon-biaoge" @dblclick="handlerSqlEditor"></span>
            <span @dblclick="handlerSqlEditor">SQL代码创建表</span>
          </div> -->
          <div
            class="sql-options"
            draggable="true"
            @mousedown="() => handlerMouseDown()"
            @dragstart="() => handlerDragStart()"
            @dragend="handlerDragEnd"
          >
            <span class="iconfont icon-biaoge" @dblclick="handlerSqlEditor"></span>
            <span @dblclick="handlerSqlEditor">SQL代码创建表</span>
          </div>
        </div>
        <div class="drawer-tab">
          <GxTabs
            arrangeMode="row"
            v-model:initial="initial"
            :tabsData="showTabsData"
            itemHeight="38px"
            item-width="56px"
            @changeClick="handlerTabChange"
          >
            <template #Header>
              <div class="drawer-tab__title">
                <el-tooltip :content="content">
                  <span
                    class="iconfont"
                    :class="{ ' icon-upload': initial === 0 }"
                    @click="handlerUpLoadFile"
                  ></span>
                </el-tooltip>
              </div>
            </template>
          </GxTabs>
          <!--        tab栏搜索框-->
          <div class="drawer-tab-search">
            <el-input v-model="dataSourceKey" :prefix-icon="Search" placeholder="搜索数据表/文件">
              <template #suffix>
                <span class="iconfont icon-refresh-right" @click="handleSuffixIconClick"></span>
              </template>
            </el-input>
          </div>
          <div class="file-list" v-show="initial === 0">
            <ul class="file-lists" v-if="fieldsList.length > 0">
              <li
                v-for="(item, index) in fieldsList"
                :key="item"
                draggable="true"
                @mousedown="() => handlerMouseDown(item)"
                @dragstart="() => handlerDragStart(item)"
                @dragend="handlerDragEnd"
              >
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  placement="right-end"
                  hide-after="0"
                  offset="60"
                >
                  <div
                    class="li-name"
                    :class="{ 'icon-highlight': item.name === query.name }"
                    @dblclick="handleDbClickNode(index, item)"
                  >
                    <span class="iconfont icon-biaoge"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </el-tooltip>
                <div class="li-option">
                  <span class="iconfont icon-copy-document" @click="onHandlerCopy(item)"></span>
                  <el-popover
                    placement="right"
                    :width="400"
                    trigger="click"
                    @before-enter="handlerPopover(item)"
                  >
                    <template #reference>
                      <i class="iconfont icon-QuestionCircle"></i>
                    </template>
                    <div>{{ item.name }}</div>
                    <div>{{ item.description || '无相关描述' }}</div>
                    <div>{{ item.databaseName }}</div>

                    <el-table height="268px" :data="popoverData" :show-header="false">
                      <el-table-column
                        v-for="columnItem in popoverColumn"
                        :key="columnItem.prop"
                        :label="columnItem.name"
                        :prop="columnItem.prop"
                      >
                      </el-table-column>
                    </el-table>
                  </el-popover>
                </div>
              </li>
            </ul>
            <template v-else>
              <span class="hint">暂无数据</span>
            </template>
          </div>
          <div class="file-list" v-show="initial === 1">
            <ul class="file-lists" v-if="fieldsList.length > 0">
              <li
                v-for="(item, index) in fieldsList"
                :key="item"
                draggable="true"
                @mousedown="handlerMouseDown(item)"
                @dragstart="handlerDragStart(item)"
                @dragend="handlerDragEnd"
              >
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  placement="right-end"
                  hide-after="0"
                  offset="60"
                >
                  <div
                    class="li-name"
                    :class="{ 'icon-highlight': item.name === query.name }"
                    @dblclick="handleDbClickNode(index, item)"
                  >
                    <span class="iconfont icon-biaoge"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </el-tooltip>
                <div class="li-option">
                  <span
                    class="iconfont icon-copy-document"
                    @click.prevent.stop="onHandlerCopy(item)"
                  ></span>
                  <el-popover
                    placement="right"
                    :width="400"
                    trigger="click"
                    @before-enter="handlerPopover(item)"
                  >
                    <template #reference>
                      <i class="iconfont icon-QuestionCircle"></i>
                    </template>
                    <div>{{ item.name }}</div>
                    <div>{{ item.description || '无相关描述' }}</div>
                    <div>{{ item.databaseName }}</div>

                    <el-table height="268px" :data="popoverData" :show-header="false">
                      <el-table-column
                        v-for="columnItem in popoverColumn"
                        :key="columnItem.prop"
                        :label="columnItem.name"
                        :prop="columnItem.prop"
                      >
                      </el-table-column>
                    </el-table>
                  </el-popover>
                </div>
              </li>
            </ul>
            <template v-else>
              <span class="hint">暂无数据</span>
            </template>
          </div>
        </div>
      </div>
      <!--    右侧内容-->
      <div class="drag-table" :class="{ 'open-left-drawer': drawer, 'close-left-drawer': !drawer }">
        <div class="drag" v-if="dragItems.length > 0">
          <drag-card
            :data="dragItems"
            @handlerDrop="handlerDrop"
            @dragover.prevent
            @handlerFieldSelect="handlerFieldSelect"
            @handleFieldDelete="handleFieldDelete"
            @handleSqlEdit="handleSqlEdit"
            @handlerRelationOpen="handlerRelationOpen"
            @clickOpenFieldSelect="handlerFieldSelect"
          >
          </drag-card>
        </div>

        <div
          v-else
          class="drag"
          @dragover.prevent
          @drop="() => handlerDrop(currentDragItem.name)"
        ></div>
        <!-- 删除拖拽表弹框 -->
        <el-dialog v-model="showDragDelete" width="500" align-center>
          <template #header>
            <span>确定要删除“{{ cardData.name }}”吗？</span>
          </template>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showDragDelete = false">取消</el-button>
              <el-button type="primary" @click="deleteDragData(cardData)"> 确定 </el-button>
            </div>
          </template>
        </el-dialog>
        <el-drawer
          v-if="drawerDrag.flag"
          v-model="drawerDrag.flag"
          direction="rtl"
          modal-class="modalClass"
          :close-on-click-modal="false"
          :show-close="false"
          @close="handleDrawerClose"
        >
          <template #header>
            <div :class="!isRelate ? 'fileds__title' : ''">
              <span v-show="isRelate">{{ title }}</span>
              <span class="title" v-show="!isRelate">{{ drawerDrag.showItem }}</span>
              <div class="origin" v-show="!isRelate">数据源：{{ dragSelfName }}</div>

              <!--                  sql数据源展示编辑-->
              <!--                  sql数据源展示编辑-->
              <div id="options" v-show="!isRelate">
                <span
                  class="iconfont icon-edit-outline"
                  @click="handlerEditorClick"
                  v-if="currentDragItem.type === 'SQL'"
                  >编辑代码</span
                >
                <span class="iconfont icon-delete" @click="handlerDeleClick">删除</span>
              </div>
            </div>
          </template>
          <div class="relate">
            <!--                关联关系-->
            <div class="is-relate" v-if="isRelate">
              <!--            数据源表-->
              <div class="relate-table">
                <div
                  class="relate-table__left"
                  v-for="(item, index) in showRelationItems"
                  :key="index"
                >
                  <span class="title">{{ item.name || item.SQLTitle }}</span>
                  <div class="filter">
                    <span>
                      字段选择
                      {{
                        '(' +
                        (item.fields.filter((item) => item.checked === 0).length +
                          '/' +
                          item.fields.length || '0/0') +
                        ')'
                      }}
                    </span>
                    <el-input
                      v-model="item.searchKey"
                      clearable
                      :prefix-icon="Search"
                      placeholder="请输入"
                      @input="(val) => relateKeyChange(val, item, index)"
                    ></el-input>
                  </div>
                  <div class="table">
                    <el-table
                      :scrollbar-always-on="true"
                      :data="item.data || item.fields"
                      @select="onSelectionRelate"
                      @selection-change="onSelectionRelateChange"
                      @select-all="(selection) => onSelectRelateAll(selection, item)"
                      :ref="(el) => setRefMap(el, item)"
                    >
                      <el-table-column
                        v-for="columnItem in relateTableColumns"
                        :key="columnItem.prop"
                        :type="columnItem.type"
                        :label="columnItem.label"
                        :prop="columnItem.prop"
                        :selectable="selectable"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <!--            数据关联-->
              <div class="relate-fields">
                <div class="filter">
                  <span class="header-left">数据关联</span>
                  <div class="header-right">
                    <el-select v-model="relateActionsData.unionToParent.unionType">
                      <el-option
                        v-for="(union, index) in unionMap"
                        :key="index"
                        :label="union.label"
                        :value="union.value"
                      ></el-option>
                    </el-select>
                    <!-- <GxActions :actions="addRelateActions"></GxActions> -->
                    <el-button @click="addRelateActions">
                      <template #default>
                        <i class="iconfont icon-plus"></i>
                        <span class="add-fields">添加关联字段</span>
                      </template>
                    </el-button>
                  </div>
                </div>
                <div class="table">
                  <el-table :data="linkTableData">
                    <el-table-column
                      v-for="(columnItem, index) in linkTableColumns"
                      :key="columnItem.prop"
                      :label="columnItem.label"
                      :prop="columnItem.prop"
                    >
                      <template #default="scope">
                        <el-select
                          v-if="
                            columnItem.prop === 'currentField' || columnItem.prop === 'parentField'
                          "
                          v-model="scope.row[columnItem.prop]"
                          placeholder="请选择字段类型"
                        >
                          <template #prefix>
                            <i :class="['iconfont', `${ICONMAP[scope.row[columnItem.prop]]}`]"></i>
                          </template>
                          <el-option
                            v-for="option in columnItem.options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          >
                            <template #default>
                              <div>
                                <i :class="['iconfont', `${ICONMAP[option.type]}`]"></i>
                                <span>{{ option.label }}</span>
                              </div>
                            </template>
                          </el-option>
                        </el-select>
                        <div v-if="columnItem.prop === 'option'">
                          <i class="iconfont icon-delete" @click="handlerLinkDele(index)"></i>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!--               表字段-->
            <div class="detail-fileds" v-else>
              <div class="content-search">
                <span>字段选择{{ selectionFileds }}</span>
                <el-input
                  v-model="inputList"
                  clearable
                  :prefix-icon="Search"
                  placeholder="请输入关键字搜索"
                  style="width: 240px"
                ></el-input>
              </div>
              <div class="content-table">
                <el-table
                  :data="filedsTableData"
                  @select="onSelect"
                  @selection-change="onSelectionChange"
                  @select-all="selectAll"
                  ref="tableSelf"
                >
                  <el-table-column type="selection" :selectable="selectable"> </el-table-column>
                  <el-table-column
                    v-for="columnItem in filedsTableColumns"
                    :key="columnItem.id"
                    :label="columnItem.label"
                    :prop="columnItem.prop"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!--            取消、确定按钮关闭抽屉-->
            <div class="close">
              <GxActions
                :actions="relateActions"
                :attach="{ relateActionsData: relateActionsData, selectedItem: selectedItem }"
              ></GxActions>
            </div>
          </div>
        </el-drawer>
        <div class="table">
          <div class="table-tab">
            <GxTabs arrangeMode="row" v-model:initial="dragTableInitial" :tabsData="tabsTableData">
              <template #Header>
                <div class="table-tab__title">
                  <el-input
                    v-model="previewKey"
                    clearable
                    placeholder="请输入字段名称或物理字段"
                    @change="previewColumnChange"
                  >
                    <template #prefix>
                      <i class="iconfont icon-search"></i>
                    </template>
                  </el-input>
                  <!-- ------操作按钮 -->
                  <GxActions
                    :actions="tableTabActions"
                    :attach="{
                      dragItems: dragItems,
                      currentDataSource: currentDataSource,
                      allFields: treeData,
                      filterConditions: tabList,
                      attach: relationAttach,
                      queryId: queryId
                    }"
                  ></GxActions>
                </div>
              </template>
            </GxTabs>
          </div>
          <!--        数据预览-->
          <div class="preview" v-show="dragTableInitial === 0">
            <div class="preview-tree">
              <GxTree
                :data="treeData"
                :actions="actions"
                :isClick="isClick"
                :draggable="true"
                :editFolderName="editFolderName"
                @handler-add-folder="handlerAddFolder"
                @handler-drop-item="handlerDropItem"
                @node-drop="handleDrop"
                ref="treeSelf"
              ></GxTree>
              <gx-dialog
                v-if="addFolderShow"
                attach="确定"
                @clickConfirm="clickTreeConfirm"
                @clickCancel="clickTreeCancel"
                edit
              >
                <template #title>{{ showTitle }}文件夹</template>
                <GxForm v-model="formDataDialog" :form="formDialog" ref="formFilterSelf" />
              </gx-dialog>
            </div>
            <div class="preview-table">
              <template v-if="!previewError">
                <el-table
                  :data="previewTableDatas"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  :header-cell-style="headerCellStyle"
                  :header-row-style="headerRowStyle"
                >
                  <el-table-column
                    v-for="columnItem in columnTreeData"
                    :key="columnItem.name"
                    :label="columnItem.name"
                  >
                    <template v-for="(subColumnItem, index) in columnItem.children" :key="index">
                      <el-table-column
                        v-if="
                          subColumnItem.checked === 0 &&
                          subColumnItem.datasetTableFieldType === 'FIELD'
                        "
                        :label="subColumnItem.name"
                        :prop="subColumnItem.name"
                      >
                        <template #header>
                          <el-tooltip
                            :show-arrow="false"
                            effect="light"
                            :content="subColumnItem.name"
                          >
                            <span class="text">{{ subColumnItem.name }}</span>
                          </el-tooltip>
                          <div class="action">
                            <i
                              :class="`iconfont ${
                                subColumnItemIcon?.name === subColumnItem.name
                                  ? subColumnItemIcon.icon
                                  : subColumnItem.icon
                              }`"
                              :style="getIconForColor(subColumnItem)"
                            ></i>
                            <!-- 下拉 -->
                            <div>
                              <GxDropdownMenu
                                ref="dropdownMenuSelf"
                                :menus="getDropdownItems(subColumnItem)"
                              >
                                <i class="iconfont icon-setting"></i>
                                <template #title="{ label, isActive, value, icon, format }">
                                  <div
                                    class="tree-node__menu"
                                    :class="{
                                      'tree-node__menu--active': isActive === getDropdownItems.type
                                    }"
                                    @click="
                                      () => {
                                        handlerDropItem(subColumnItem, value, columnItem, format)
                                      }
                                    "
                                  >
                                    <i :class="['iconfont', icon]"></i>
                                    {{ label }}
                                  </div>
                                </template>
                              </GxDropdownMenu>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-else>
                <span>{{ previewError }}</span>
              </template>
            </div>
          </div>
          <!-- 编辑字段--------------修改文件夹 -->
          <GxDialog
            class="edit-dialog"
            v-show="editItem"
            :title="treeOptionDialogTitle"
            :disabled="isEditItem"
            @clickConfirm="editorPreviewItem"
            @clickCancel="cancleEditorItem"
          >
            <GxForm ref="formEditorSelf" :form="editorForm" v-model="editorFormData" />
          </GxDialog>
          <!-- 删除弹框 -->
          <el-dialog v-model="showDelete" width="500" align-center>
            <template #header>
              <span
                >确定要删除“{{ showDeleteData.data.name }}”{{
                  showDeleteData.data.datasetTableFieldType === 'FIELD' ? '字段' : '文件夹'
                }}吗？</span
              >
            </template>
            <div
              v-if="
                showDeleteData.data.datasetTableFieldType === 'FIELD' &&
                showDeleteData.data.extraField === 0
              "
            >
              <span>删除后，可点击画布中对应的数据表重新添加。</span>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="showDelete = false">取消</el-button>
                <el-button type="primary" @click="deleteRowData"> 确定 </el-button>
              </div>
            </template>
          </el-dialog>
          <!-- 引用提示弹框 -->
          <el-dialog v-model="showCite" width="500" align-center>
            <template #header>
              <span>{{ showCiteData.hintTitle }}</span>
            </template>
            <div>
              <span>{{ showCiteData.name }}</span
              ><br />
              <span>{{ showCiteData.hintField }}</span>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button type="primary" @click="showCite = false"> 知道了 </el-button>
              </div>
            </template>
          </el-dialog>
          <!--        批量配置-->
          <div class="batch" v-show="dragTableInitial === 1">
            <div class="batch-table">
              <expand-table
                :tableData="columnTreeData"
                @handler-bath-options="handlerBatchOptions"
                @handlerExpandCopy="handlerExpandCopy"
                @inputNameChange="inputNameChange"
                @selectDefault="selectDefault"
                @inputDescChange="inputDescChange"
                @expandRowChange="expandRowChange"
                @handlerExpandDelete="handlerExpandDelete"
              ></expand-table>
            </div>
          </div>
        </div>
      </div>

      <!--    文件上传抽屉-->
      <el-drawer
        v-if="fileDrawer"
        v-model="fileDrawer"
        direction="btt"
        :with-header="false"
        modal-class="upload-dataset-drawer"
        size="90%"
      >
        <File
          :isAside="false"
          :isShowUpload="true"
          :buttonHint="buttonHint"
          @handler-cancle="handlerCancle"
          @handler-confirm="handlerConfirm"
        ></File>
      </el-drawer>
      <!-- </div> -->
      <!--    sql编辑器抽屉-->
      <el-drawer
        v-model="sqlDrawer"
        v-if="sqlDrawer"
        :show-close="false"
        :close-on-click-modal="false"
        :with-header="false"
        direction="btt"
        modal-class="sql-modalclass"
        size="90%"
      >
        <Sql-create
          :sqlDrawer="sqlDrawer"
          @update:sql-drawer="updateSqlDrawer"
          :sqlList="fieldsList"
          :sqlSource="currentDataSource"
          :dragItems="dragItems"
          @handlerAddItems="handlerAddItems"
          :sqlDetail="sqlDetail"
          @drawerSqlClose="drawerSqlClose"
        ></Sql-create>
      </el-drawer>

      <GxDialog
        v-if="showItems"
        :title="itemTitleLog"
        :disabled="isDisabled"
        @clickConfirm="updateShowItems"
        @clickCancel="clickCancel"
      >
        <!--      新建计算字段-->
        <AddField
          v-if="props.contentType === 'fieldItem'"
          :content-type="contentType"
          :data="treeData"
          v-model:detailData="contentTypeData"
          ref="addFieldSelf"
        ></AddField>
        <!--      新建分组维度-->
        <group-dimension
          v-if="props.contentType === 'dimensionItem'"
          :content-type="contentType"
          :data="treeData"
          :attach="{
            dragItems: dragItems,
            allFields: treeData,
            filterConditions: tabList,
            attach: relationAttach,
            currentDataSource: currentDataSource
          }"
          :detailData="contentTypeData"
          ref="groupDimensionSelf"
        ></group-dimension>
        <!--      过滤条件设置-->
        <filter-term
          v-if="props.contentType === 'filterItem'"
          :content-type="contentType"
          :options="treeData"
          :filterParams="{
            datasourceType: dragItems,
            dragItems: dragItems,
            allFields: treeData,
            filterConditions: tabList
          }"
          ref="filterTermSelf"
        ></filter-term>
      </GxDialog>
    </div>
  </div>
</template>
<script setup>
import File from '@/views/DataStructure/DataSource/blocks/File.vue'
import DragCard from '../blocks/DragCard.vue'
import SqlCreate from '../blocks/SqlCreate.vue'
import ExpandTable from '../blocks/ExpandTable.vue'
import GroupDimension from '../blocks/GroupDimension.vue'
import FilterTerm from '../blocks/FilterTerm.vue'
import AddField from '../blocks/AddField.vue'
import GxTree from '../blocks/GxTree'
import { ICONMAP, flattenTreeData } from '../useInfoBlock'
import { GxActions, GxDialog, GxForm, GxTabs, GxDropdownMenu } from '@gxhs/ui'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import {
  editorForm,
  handlerEventMap,
  findNodeByNameOrId,
  setIconsInTree,
  getDropdownItems,
  getIconForColor,
  getAllUniqueNames,
  updateTreeData,
  handlerCopy,
  findParent,
  removeNode
} from '../useInfoBlock'
import useInfoBlock from '../useInfoBlock'
import { ref, computed, watch, nextTick, reactive, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { weekAndDate } = useInfoBlock()

const props = defineProps({
  tableTabActions: {
    type: Array
  },
  showItems: {
    type: Boolean
  },
  itemTitle: {
    type: String
  },
  contentType: {
    type: String
  },
  sqlName: {
    type: String
  },
  data: {
    //详情数据
    type: Array
  },
  filterParams: {
    type: Object
  },
  previewTableDatas: {
    type: Array
  }
})

const filterParamsDetail = ref({})
watch(
  () => props.filterParams,
  (n, _) => {
    filterParamsDetail.value = n
  },
  { deep: true }
)

const router = useRouter()
const { datasourceApi, datasetApi } = api
const query = useRoute().query
const queryId = query.id ? Number(query.id) : ''
const show = ref(false) //返回弹出框
const handlerToCreateSet = () => {
  //弹框
  show.value = true
}
const clickConfirmBack = () => {
  show.value = false
  router.push({ name: 'DataSetList' })
}
const clickCancelBack = () => {
  // if (props.contentType === 'fieldItem') {}
  //原数据赋值
  show.value = false
}
const isEdit = ref(false)
const inputFocus = () => {
  isEdit.value = true
}
const inputBlur = () => {
  isEdit.value = false
  emit('inputBlur')
}

const stringAndNumConditions = (item) => {
  // 条件、枚举
  if (item.fieldsForm.filterType === 'ENUM_VALUE') {
    if (item.type === 'NUMBER' || item.type === 'INTEGER') {
      const conditionType = item.fieldsForm.conditionType
      if (conditionType === 'SINGLE_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.matchingType,
            conditionValue: item.fieldsForm.conditionValue
          }
        ]
      } else if (conditionType === 'OR_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.conditionValueOr.fir.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueOr.fir.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueOr.fir.conditionValue
          },
          {
            matchingType: item.fieldsForm.conditionValueOr.sec.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueOr.sec.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueOr.sec.conditionValue
          }
        ]
      } else if (conditionType === 'AND_CONDITION') {
        return [
          {
            matchingType: item.fieldsForm.conditionValueAnd.fir.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueAnd.fir.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueAnd.fir.conditionValue
          },
          {
            matchingType: item.fieldsForm.conditionValueAnd.sec.matchingType,
            conditionValue:
              item.fieldsForm.conditionValueAnd.sec.conditionValue === undefined
                ? ''
                : item.fieldsForm.conditionValueAnd.sec.conditionValue
          }
        ]
      }
    } else {
      if (item.fieldsForm.conditionType === 'OR_CONDITION') {
        return item.fieldsForm.emuneCondition.map((emuneItem) => ({
          matchingType: 'EQ',
          conditionValue: emuneItem
        }))
      } else {
        return [
          {
            matchingType: item.fieldsForm.matchingType,
            conditionValue: item.fieldsForm.conditionValue || item.fieldsForm.emuneCondition
          }
        ]
      }
    }
  } else {
    const conditionType = item.fieldsForm.conditionType
    if (conditionType === 'SINGLE_CONDITION') {
      return [
        {
          matchingType: item.fieldsForm.matchingType,
          conditionValue: item.fieldsForm.conditionValue
        }
      ]
    } else if (conditionType === 'OR_CONDITION') {
      return [
        {
          matchingType: item.fieldsForm.conditionValueOr.fir.matchingType,
          conditionValue:
            item.fieldsForm.conditionValueOr.fir.conditionValue === undefined
              ? ''
              : item.fieldsForm.conditionValueOr.fir.conditionValue
        },
        {
          matchingType: item.fieldsForm.conditionValueOr.sec.matchingType,
          conditionValue:
            item.fieldsForm.conditionValueOr.sec.conditionValue === undefined
              ? ''
              : item.fieldsForm.conditionValueOr.sec.conditionValue
        }
      ]
    } else if (conditionType === 'AND_CONDITION') {
      return [
        {
          matchingType: item.fieldsForm.conditionValueAnd.fir.matchingType,
          conditionValue:
            item.fieldsForm.conditionValueAnd.fir.conditionValue === undefined
              ? ''
              : item.fieldsForm.conditionValueAnd.fir.conditionValue
        },
        {
          matchingType: item.fieldsForm.conditionValueAnd.sec.matchingType,
          conditionValue:
            item.fieldsForm.conditionValueAnd.sec.conditionValue === undefined
              ? ''
              : item.fieldsForm.conditionValueAnd.sec.conditionValue
        }
      ]
    }
  }
}

//计算字段--转化数据
const persentMap = {
  1: '%0',
  2: '%00'
}
const selfDataConvert = (addFieldItem) => {
  if (addFieldItem.definiteSelf === 'num') {
    return addFieldItem.definiteSelfNum
  } else {
    return persentMap[addFieldItem.definiteSelfNum]
  }
}
const saveId = ref(null)
const sqlSaveAction = [
  {
    label: '保存',
    handler: async () => {
      const resultfilterConditionsData = cloneDeep(tabList.value)
      const convertConditionValue = (item, subtype) => {
        if (item.fieldsForm.conditionTimeType === 'BETWEEN') {
          item.fieldsForm.conditionTimeTypeBetween = {
            start: weekAndDate(item.fieldsForm.conditionTimeTypeBetween.start, subtype),
            end: weekAndDate(item.fieldsForm.conditionTimeTypeBetween.end, subtype)
          }
        } else {
          item.fieldsForm.conditionValue = weekAndDate(item.fieldsForm.conditionValue, subtype)
        }
      }
      resultfilterConditionsData.map((item) => {
        switch (item.granularity) {
          case 'year-week':
            convertConditionValue(item, 'week')
            break
          case 'year-quarter':
            convertConditionValue(item, 'quarter')
            break
          case 'year-month-day':
            return item
          case 'datetime':
            convertConditionValue(item, 'datetime')
            break
          case 'hour-minute':
            convertConditionValue(item, 'minute')
            break
          case 'hour-minute-second':
            convertConditionValue(item, 'second')
            break
          default:
            break
        }
      })
      if (!dragItems.value.length) {
        ElMessage.warning('至少添加一张表')
        return
      }
      const convertTreeStructure = (dragItems) => {
        const convertNode = (node) => {
          const { datasourceId, id, name, originName, type, unionToParent, tableSql } = node

          const currentDst = {
            name,
            originName: originName,
            datasourceId: datasourceId || id,
            type,
            tableSql
          }

          let childrenDst = []
          if (node.children && node.children.length > 0) {
            childrenDst = node.children.map(convertNode)
          }

          let unionFields = []
          if (unionToParent) {
            unionFields = unionToParent.unionFields.map((field) => ({
              parentField:
                typeof field.parentField === 'string'
                  ? {
                      name: field.parentField,
                      datasetTableOriginName:
                        field.parentDatasetTableOriginName ||
                        unionToParent.unionFields[0].parentDatasetTableOriginName
                    }
                  : field.parentField,
              currentField:
                typeof field.currentField === 'string'
                  ? {
                      name: field.currentField,
                      datasetTableOriginName:
                        field.currentDatasetTableOriginName ||
                        unionToParent.unionFields[0].currentDatasetTableOriginName
                    }
                  : field.currentField
            }))
          }

          const result = {
            currentDst,
            childrenDst,
            unionToParent: {
              unionType: unionToParent?.unionToParent
                ? unionToParent.unionToParent.unionType
                : unionToParent?.unionType || 'LEFT',
              unionFields
            }
          }
          return result
        }

        const treeUnion = dragItems.map(convertNode)
        return treeUnion
      }
      const convertedTreeUnion = convertTreeStructure(dragItems.value)

      const allFields = treeData.value
      let mergedAllFields = allFields.reduce((accumulator, currentItem) => {
        const childrenArray =
          currentItem.children.filter(
            (child) =>
              !(
                (child.extraField === 1 || child.extraField === 2 || child.extraField === 3) &&
                child.checked === 1
              )
          ) || []

        let regex = /\(([^)]*)\)/
        // 为每个子节点创建一个新对象，添加到 accumulator
        const newItems = childrenArray
          .filter((fields) => fields.move !== 1)
          .map((node) => ({
            name: node.name,
            originName: node.originName || null,
            type: node.type || null,
            originType: node.originType || null,
            datasourceId: dragItems.value[0].datasourceId || dragItems.value[0].id,
            datasetId: query.type ? '' : queryId ? queryId : null,
            datasetTableName: node.datasetTableName || null,
            datasetTableOriginName: node.datasetTableOriginName || node.datasetTableName || null,
            description: node.description || '',
            fieldAliasName: node.fieldAliasName || null,
            dataType: node.dataType || null,
            extraField: node.extraField || 0,
            checked: node.datasetTableFieldType === 'FOLDER' ? 0 : node.checked,
            datasetTableFieldType: node.datasetTableFieldType, //是字段还是文件
            expression: node.expression || null,
            dataFormat:
              node.extraField === 1
                ? node.dataFormat === 'manual'
                  ? node.definiteFormat
                  : node.dataFormat === 'self'
                    ? selfDataConvert(node)
                    : node.dataFormat || null
                : node.dataFormat || null,
            granularities: node.type === 'DATE' ? node.granularities : null,
            granularity: node.granularity || undefined,
            convertValue: node.convertValue || null,
            aggregation: node.aggregation || '',
            sortType: node?.sortType,
            // 如果有子节点，递归处理
            children: node.children
              ? node.children
                  .filter((fields) => fields.move !== 1)
                  .map((grandchild) => ({
                    name: grandchild.name,
                    originName: grandchild.originName,
                    type: grandchild.type,
                    originType: grandchild.originType,
                    datasourceId: dragItems.value[0].datasourceId,
                    datasetId: query.type ? '' : queryId ? queryId : null,
                    datasetTableName: grandchild.datasetTableName || node.datasetTableName,
                    datasetTableOriginName:
                      grandchild.datasetTableOriginName ||
                      node.datasetTableOriginName ||
                      node.datasetTableName,
                    description: grandchild.description || '',
                    fieldAliasName: grandchild.fieldAliasName,
                    dataType: grandchild.dataType,
                    extraField: grandchild.extraField,
                    checked: node.checked || node.children?.length > 0 ? grandchild.checked : 1,
                    datasetTableFieldType: grandchild.datasetTableFieldType, //是字段还是文件
                    expression: grandchild.expression,
                    dataFormat: grandchild.dataFormat,
                    granularities:
                      node.type === 'DATE' && node.granularities ? grandchild.granularities : null,
                    granularity: node.granularities ? grandchild.granularity : undefined,
                    convertValue: grandchild.convertValue,
                    aggregation: grandchild.aggregation,
                    sortType: grandchild?.sortType,
                    children: null
                  }))
              : null
          }))

        accumulator.push(...newItems) // 新创建的数组添加到 accumulator 中
        return accumulator
      }, [])
      //数据集过滤条件

      const convertTabFilterList = resultfilterConditionsData.map((item) => {
        return {
          datasetTableName: item.datasetTableName || item.fieldsForm.datasetTableName,
          datasetTableOriginName:
            item.datasetTableOriginName || item.fieldsForm.datasetTableOriginName,
          datasetTableFieldName: item.name || item.fieldsForm.datasetTableFieldName,
          datasetTableFieldOriginName:
            item.originName || item.fieldsForm.datasetTableFieldOriginName,
          filterType: item.fieldsForm?.filterType || item.filterType,
          conditionType:
            item.type === 'DATE'
              ? item.fieldsForm.filterType === 'CONDITION'
                ? item.fieldsForm?.conditionTimeType || item.fieldsForm.conditionType
                : item.fieldsForm.conditionType
              : item.fieldsForm.conditionType,
          conditions:
            item.type === 'DATE'
              ? item.fieldsForm.conditionTimeType === 'BETWEEN'
                ? [
                    {
                      matchingType: 'GT_EQ',
                      conditionValue: item.fieldsForm.conditionTimeTypeBetween.start
                    },
                    {
                      matchingType: 'LT_EQ',
                      conditionValue: item.fieldsForm.conditionTimeTypeBetween.end
                    }
                  ]
                : [
                    {
                      matchingType:
                        item.fieldsForm.filterType === 'CONDITION'
                          ? item.fieldsForm.conditionTimeType === 'BEGIN_WITH'
                            ? 'GT_EQ'
                            : 'LT_EQ'
                          : item.fieldsForm.matchingType,
                      conditionValue:
                        item.fieldsForm.conditionValue === undefined
                          ? ''
                          : item.fieldsForm.conditionValue
                    }
                  ]
              : item.fieldsForm.conditions || stringAndNumConditions(item)
        }
      })

      const result = await datasetApi.save.send({
        id: query.type ? saveId.value || '' : queryId || saveId.value || '', //数据源创建queryId为数据源id
        name: sqlName.value,
        pid: query.type === 'FOLDER' ? query.id : pId.value || '-1',
        datasourceType:
          dragItems.value[0].type === 'SQL'
            ? currentDataSource.value.type
            : dragItems.value[0].type,
        treeUnion: convertedTreeUnion,
        allFields: mergedAllFields,
        filterConditions: convertTabFilterList
      })
      if (result.code === 407) {
        ElMessage.warning(result.msg)
      } else {
        saveId.value = result
        ElMessage.success('数据集保存成功')
      }
    }
  }
]

const emit = defineEmits(['update:showItems', 'update:sqlName', 'update:contentType'])
const sqlName = computed({
  get: () => props.sqlName,
  set: (val) => emit('update:sqlName', val)
})
const showItems = computed({
  get: () => props.showItems,
  set: (val) => emit('update:showItems', val)
})
// 左侧展示
const drawer = ref(queryId ? false : true)
const handlerDrawerIsShow = () => {
  drawer.value = !drawer.value
}
const fieldsList = ref([]) //左侧列表数据

//选择数据源默认
const dataSoueceSelect = ref({
  id: 'EXPLOR_SPACE',
  label: '探索空间',
  type: 'EXPLOR_SPACE'
})
const dataSourceOptions = ref([
  {
    id: 'EXPLOR_SPACE',
    name: '探索空间',
    type: 'EXPLOR_SPACE'
  }
])
const curSelectItem = ref(null)
const dragSelfName = computed(() => {
  return curSelectItem.value ? curSelectItem.value.label : dataSoueceSelect.value.label
})

//---树节点处理
const sourceList = ref([])
const pId = ref(null)
const loadData = async (treeUnion, allFields, filterConditions, id, name, pid) => {
  pId.value = pid
  sourceList.value = await datasourceApi.getDatasourceList.send() //所有数据源
  if (!treeUnion) {
    dataSourceOptions.value = dataSourceOptions.value
      .concat(sourceList.value.filter((item) => item.type === 'MYSQL' || item.type === 'DM'))
      .map((op) => ({
        id: op.id,
        label: op.name,
        type: op.type
      }))
  }

  if (queryId && treeUnion) {
    //数据集修改
    const { childrenDst, currentDst, unionToParent } = treeUnion[0]
    const { datasourceId, name, type, tableSql } = currentDst
    if (query.datasourceName !== '探索空间') {
      dataSoueceSelect.value = {
        id: datasourceId,
        name: name,
        type: type
      }
    }
    //过滤回显

    //个数展示
    props.tableTabActions.map((item) => {
      if (item.isAmount) return Object.assign(item, { amount: filterConditions.length })
      return item
    })
    // 打开弹窗
    filterConditions.forEach((item, index) => {
      tabList.value[index] = {}
      Object.assign(tabList.value[index], { fieldsForm: item })
    })
    //--------------------

    //数据预览
    allFields.forEach((item) => {
      if (item.datasetTableFieldType === 'FIELD' && item.dataType === 'DIMENSION') {
        treeData.value[0].children.push(
          Object.assign(item, { datasourceId: currentDst.datasourceId })
        )
      } else if (item.datasetTableFieldType === 'FIELD' && item.dataType === 'MEASURE') {
        treeData.value[1].children.push(
          Object.assign(item, { datasourceId: currentDst.datasourceId })
        )
      } else if (item.datasetTableFieldType === 'FOLDER') {
        let isNode
        if (item.children?.length) {
          isNode = item.children.every((child) => {
            return child.dataType === 'DIMENSION'
          })
        }
        if (isNode) treeData.value[0].children.push(item)
        else treeData.value[1].children.push(item)
      }
      setIconsInTree(treeData.value)
    })
    //树节点
    const nodeName = []
    const collectName = (node) => {
      if (node && node.currentDst && node.currentDst.name) {
        nodeName.push(node.currentDst.name)
      }
      if (node && node.childrenDst) {
        for (const child of node.childrenDst) {
          collectName(child) // 递归遍历子节点
        }
      }
    }
    collectName(treeUnion[0])

    //树结构转换函数
    //实现1、allfields中的每一项，根据datasetTableName给对应表添加fields属性值
    const revertTreeStructure = (treeUnion) => {
      const revertNode = (node) => {
        const { currentDst, childrenDst, unionToParent } = node
        const { name, originName, datasourceId, type, tableSql } = currentDst

        const children = childrenDst.map(revertNode)

        const revertedNode = {
          id: datasourceId,
          name,
          originName,
          type,
          unionToParent,
          tableSql,
          children: children.length > 0 ? children : []
        }

        return revertedNode
      }

      const revertedDragItems = treeUnion.map(revertNode)
      return revertedDragItems
    }
    // 转换
    dragItems.value = revertTreeStructure(treeUnion)
    dragItems.value[0].pId = '-1' //根节点添加pId=-1不展示line-before
    //-------------------
    const allFieldsCopy = JSON.parse(JSON.stringify(allFields))
    const assignFieldsToTree = (treeNode, allFields) => {
      treeNode.fields = treeNode.fields || []

      allFields.forEach((field) => {
        if (field.datasetTableFieldType === 'FOLDER' && field.children?.length) {
          if (field.name === treeNode.name) {
            treeNode.fields.push(...field.children)
          }
        } else {
          if (field.datasetTableName === treeNode.name && field.extraField === 0) {
            treeNode.fields.push(field)
          }
        }
      })
      if (treeNode.children) {
        treeNode.children.forEach((childNode) => {
          assignFieldsToTree(childNode, allFields)
        })
      }
    }

    assignFieldsToTree(dragItems.value[0], allFieldsCopy)
    //查找预览树中extraField =1、2、3的节点，过滤数据，将reference:1
    //计算字段-------------
    const allFieldsNode = flattenTreeData(treeData.value).filter((item) => item.extraField === 1)
    const allDimensionNode = flattenTreeData(treeData.value).filter(
      (item) => item.extraField === 2 || item.extraField === 3
    )
    if (allFieldsNode.length > 0) {
      let allReferenceTable = []
      let allReferenceField = []
      allFieldsNode.forEach((item) => {
        const calculateMethod = JSON.parse(item.expression).calculateMethod
        allReferenceTable.push(item.datasetTableName)
        allReferenceField.push(getLastPartAfterDot(calculateMethod))
      })
      const referenceTable = new Set(allReferenceTable)
      const referenceField = new Set(allReferenceField)

      let referenceNodes = [] // 用于存储所有找到的节点
      referenceField.forEach((item) => {
        findNodesByName(treeData.value, item, referenceNodes)
      })
      if (referenceNodes?.length) {
        referenceNodes.forEach((node) => {
          Object.assign(node, { addFieldReference: 1 }) //被引用reference:1
        })
        referenceTable.forEach((item) => {
          const targetNode = findNodeByNameOrId(dragItems.value, item)
          targetNode.fields.forEach((item) => {
            referenceNodes.forEach((element) => {
              if (item.originName === element.originName) {
                Object.assign(item, { ...element })
              }
            })
          })
        })
      }
    } else if (allDimensionNode.length > 0) {
      let allReferenceTable = []
      let allReferenceField = []
      allDimensionNode.forEach((item) => {
        allReferenceTable.push(item.datasetTableName)
        allReferenceField.push(item.name)
      })
      const referenceTable = new Set(allReferenceTable)
      const referenceField = new Set(allReferenceField)
      let referenceNodes = []
      referenceField.forEach((item) => {
        findNodesByName(treeData.value, item, referenceNodes)
      })
      if (referenceNodes?.length) {
        referenceNodes.forEach((node) => {
          Object.assign(node, { dimensionReference: 1 }) //被引用reference:1
        })
        referenceTable.forEach((item) => {
          const targetNode = findNodeByNameOrId(dragItems.value, item)
          targetNode.fields.forEach((item) => {
            referenceNodes.forEach((element) => {
              if (item.originName === element.originName) {
                Object.assign(item, { ...element })
              }
            })
          })
        })
      }
    }
    //---------------
    //----过滤---------
    let allFilterNode = []
    filterConditions.forEach((filterItem) => {
      // 枚举--单条件--string
      if (
        filterItem.filterType === 'ENUM_VALUE' &&
        filterItem.conditionType === 'SINGLE_CONDITION'
      ) {
        //通过字段id找到对应节点
        const fieldNode = flattenTreeData(treeData.value).filter(
          (item) => item.id === filterItem.datasetTableFieldId
        )
        allFilterNode = allFilterNode.concat(fieldNode)
      }
    })
    let referenceFilterDrag = []
    if (allFilterNode?.length) {
      allFilterNode.forEach((element) => {
        referenceFilterDrag = referenceFilterDrag.concat(element.datasetTableName)
        // element.filter
        Object.assign(element, { filterReference: 1 })
      })
    }
    //拖拽树
    referenceFilterDrag.forEach((element) => {
      const targetNode = findNodeByNameOrId(dragItems.value, element)
      targetNode.fields.forEach((item) => {
        allFilterNode.forEach((element) => {
          if (item.originName === element.originName) {
            Object.assign(item, { ...element })
          }
        })
      })
    })
    //---------
  } else if (queryId && query.type && query.name) {
    //数据源入口
    if (query.type === 'DM' || query.type === 'MYSQL') {
      dataSoueceSelect.value = dataSourceOptions.value.filter((item) => item.id === queryId)[0]
    }
    //拖拽树

    //数据预览
    const result = await datasetApi.getTableFields.send({
      tableName: query.name, //表名
      datasourceId: queryId,
      datasetId: ''
    })
    if (result) {
      updateTreeData(result.fields, null, treeData.value)
    }
  }
}
loadData()
const dataSourceKey = ref('')
const apiListMap = {
  EXPLOR_SPACE: {
    API: 'getDataSourceApiPage',
    FILE: 'getDataSourceFilePage'
  },
  MYSQL: 'getDataSourceDbPage',
  DM: 'getDataSourceDbPage'
}
const handleSuffixIconClick = async () => {
  dataSourceKey.value = ''
  let result = null
  if (dataSoueceSelect.value.type === 'FILE' || dataSoueceSelect.value.type === 'API') {
    result = await datasourceApi[apiListMap.EXPLOR_SPACE[dataSoueceSelect.value.type]].send({
      keywords: '',
      currentPage: 1,
      pageSize: 100
    })
  } else {
    result = await datasourceApi[apiListMap[dataSoueceSelect.value.type]].send({
      id: dataSoueceSelect.value.id,
      keywords: '',
      currentPage: 1,
      pageSize: 100
    })
  }
  if (result) {
    fieldsList.value = result.list
  }
}

const isSqlSource = ref(true)
const initial = ref(0)
const tabsData = [
  {
    label: '上传文件',
    value: 'FILE'
  },
  // {
  //   label: 'API数据',
  //   value: 'API'
  // },
  {
    label: '数据表',
    value: 'MYSQL'
  }
]

let content = '该数据源不支持上传文件'
const showTabsData = computed(() => {
  if (isSqlSource.value) {
    content = '该数据源不支持上传文件'
    return tabsData.slice(-1) // 返回最后一个对象
  } else {
    content = '上传文件'
    return tabsData.slice(0, -1) // 去掉最后一个对象
  }
})
const currentDataSource = ref({})
watch(
  () => ({
    newValue: dataSoueceSelect.value,
    newInput: dataSourceKey.value
  }),
  async (newValues) => {
    const { newValue, newInput } = newValues
    //监听到数据源切换，从sourceList中查找对应项变换tab栏和表列表
    let newTypeItem = []
    if (sourceList.value) {
      newTypeItem = sourceList.value.find((item) => item.id === newValue.id)
    }

    if (!newTypeItem) {
      //探索空间   不会切换datasourceselect，立即监听后为undefined
      //切换后，第一次监听
      if (queryId && query.type && query.name) {
        //数据源入口时
        if (query.type === 'FILE' || query.type === 'API') {
          initial.value = query.type === 'FILE' ? 0 : 1
        }
      } else if (query.datasourceName) {
        //数据集修改
        isSqlSource.value = false
        const resultApiOrFile = await datasourceApi[
          apiListMap.EXPLOR_SPACE[showTabsData.value[initial.value].value]
        ].send({
          keywords: newInput || '',
          currentPage: 1,
          pageSize: 100
        })
        fieldsList.value = resultApiOrFile.list.map((item) =>
          Object.assign(item, { type: showTabsData.value[initial.value].value })
        )
      } else if (queryId && query.type) {
        //文件夹创建数据集
      }

      if (
        // newValue.type === 'EXPLOR_SPACE' &&
        query.type !== 'DM' &&
        query.type !== 'MYSQL' &&
        !query.datasourceName
      ) {
        isSqlSource.value = false
        const resultApiOrFile = await datasourceApi[
          apiListMap.EXPLOR_SPACE[showTabsData.value[initial.value].value]
        ].send({
          keywords: newInput || '',
          currentPage: 1,
          pageSize: 100
        })
        fieldsList.value = resultApiOrFile.list.map((item) =>
          Object.assign(item, { type: showTabsData.value[initial.value].value })
        )
        //数据源入口
        if (queryId && query.type && query.name) {
          const fieldsResult = await datasetApi.getTableFields.send({
            tableName: query.name, // 表名
            datasourceId: queryId, // 数据源ID
            datasetId: ''
          })
          // 数据源表作为根节点，携带数据
          dragItems.value.push(
            Object.assign(fieldsResult, {
              id: queryId,
              pId: '-1',
              name: query.name,
              children: []
            })
          )
        }
      }
    } else {
      const curSelect = dataSourceOptions.value.find((item) => item.id === newValue.id)
      curSelectItem.value = Object.assign({}, dataSoueceSelect.value, {
        label: curSelect?.label || '探索空间',
        type: curSelect?.type || 'EXPLOR_SPACE',
        id: curSelect?.id || 'EXPLOR_SPACE'
      })
      currentDataSource.value = curSelect ? newTypeItem : curSelectItem.value
      //非探索空间 会切换选择数据源
      if (
        curSelectItem.value.type === 'EXPLOR_SPACE' &&
        query.type !== 'DM' &&
        query.type !== 'MYSQL'
      ) {
        isSqlSource.value = false
        const resultApiOrFile = await datasourceApi[
          apiListMap.EXPLOR_SPACE[showTabsData.value[initial.value].value]
        ].send({
          keywords: newInput || '',
          currentPage: 1,
          pageSize: 100
        })

        fieldsList.value = resultApiOrFile.list.map((item) =>
          Object.assign(item, { type: showTabsData.value[initial.value].value })
        )
      } else {
        isSqlSource.value = true
        if (newTypeItem.type !== 'SQL') {
          // initial.value = 0
          //非自定义SQL
          const resultApiOrFile = await datasourceApi[apiListMap[newTypeItem.type]].send({
            id: newTypeItem.id,
            keywords: newInput || '',
            currentPage: 1,
            pageSize: 100
          })

          fieldsList.value = resultApiOrFile.list

          if (query.type && query.type !== 'FOLDER') {
            //数据源入口
            //表对应字段
            const fieldsResult = await datasetApi.getTableFields.send({
              tableName: query.name, // 表名
              datasourceId: queryId, // 数据源ID
              datasetId: ''
            })
            // Object.assign(currentDragItem.value, { ...fieldsResult })

            dragItems.value.push({ ...fieldsResult, pId: '-1', children: [] })
          }
        }
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  () => props.data, //数据集详情
  (n, _) => {
    const { allFields, filterConditions, id, name, pid, treeUnion } = n
    loadData(treeUnion, allFields, filterConditions, id, name, pid) //拖拽树
  }
)

//双击表相关操作
const sqlDrawer = ref(false) //sql创建表

const title = ref('编辑关联关系')
const handlerSqlEditor = () => {
  //双击展示抽屉
  if (!dragItems.value.length > 0 || !dragItems.value[0].children.length > 0) {
    sqlDrawer.value = true
  }
}
const targetName = ref('')
const handlerAddItems = (sqlData, checkedSql) => {
  sqlDetail.value = null
  //checkedSql和当前选中的数据源比较，不同需要切换
  if (checkedSql.id !== dataSoueceSelect.value.id) {
    Object.assign(dataSoueceSelect.value, checkedSql)
  }

  //根据sqlDetail.name判断编辑还是新建
  // 新建：需要关联表
  // 编辑：在拖拽树中找到该节点，更新数据(最后要将sqlDetail清空)

  if (sqlDetail.value) {
    const targetNode = findNodeByNameOrId(dragItems.value, sqlDetail.value.name)
    Object.assign(targetNode, { name: sqlData.SQLTitle }, sqlData)
  } else {
    sqlData.fields.map((item) => {
      return Object.assign(item, {
        datasetTableName: sqlData.SQLTitle,
        datasetTableOriginName: sqlData.SQLTitle
      })
    })
    if (dragItems.value.length > 0) {
      currentDragItem.value = {
        datasourceId: sqlData.id,
        description: '',
        tableSql: sqlData.tableSql,
        id: sqlData.id,
        name: sqlData.SQLTitle,
        type: 'SQL',
        originName: '',
        fields: sqlData.fields,
        children: []
      }

      isRelate.value = true
      title.value = '编辑关联关系'
      drawerDrag.flag = true
      //拖拽树添加节点并保证name唯一
      const collectNodeNames = (tree, names = new Set()) => {
        if (!tree || !Array.isArray(tree)) {
          return names
        }
        for (const node of tree) {
          names.add(node.name)
          collectNodeNames(node.children, names)
        }
        return names
      }

      const generateUniqueName = (existingNames, baseName) => {
        let index = 1
        let uniqueName = baseName
        while (existingNames.has(uniqueName)) {
          uniqueName = `${baseName}${index++}`
        }
        return uniqueName
      }
      if (dragItems.value[0].children.length === 0) {
        targetName.value = dragItems.value[0].name
      }
      const targetNode = findNodeByNameOrId(dragItems.value, targetName.value) //目标节点
      const addNode = (tree, newNode) => {
        const existingNames = collectNodeNames(tree) // 收集整棵树中所有节点名
        const uniqueName = generateUniqueName(existingNames, newNode.name) // 生成唯一节点名

        targetNode.children.push({
          ...currentDragItem.value,
          ...sqlData,
          name: uniqueName,
          children: []
        })
        Object.assign(currentDragItem.value, { name: uniqueName })
      }
      addNode(dragItems.value, currentDragItem.value)
      //---------------
      //关联关系抽屉
      let conItem = findParent(dragItems.value, currentDragItem.value.name, null)
      conItem.forEach(async (item, index) => {
        item.searchKey = ''
        if (item?.fields) {
          item.fields.forEach((field) => {
            if (!field.description) field.description = '-'
          })
        }
        linkTableColumns.value[index].options = item.fields.map((ele) => ({
          label: ele.name,
          value: ele.name,
          type: ele.type
        }))
        //给每个表格的relateActionsData.unionToParent中添加parent-datasetTableOriginName和children-datasetTableOriginName
        nextTick(() => {
          item.fields.forEach((row) => {
            subItemRef.value[item.name].toggleRowSelection(row, row.checked === 0 ? true : false)
          })
        })
      })
      linkTableData.value.map((dataItem) => {
        ;(dataItem.parentDatasetTableOriginName = conItem[0].name),
          (dataItem.currentDatasetTableOriginName = conItem[1].name)
      })
      showRelationItems.value = conItem
      //遍历2个表格
      //--------------
    } else {
      dragItems.value.push({
        pId: dragItems.value[0]?.children?.length > 0 ? null : '-1',
        id: sqlData.id,
        name: sqlData.SQLTitle,
        type: 'SQL',
        originName: '',
        fields: sqlData.fields,
        tableSql: sqlData.tableSql,
        children: []
      })
      currentDragItem.value = {
        datasourceId: sqlData.id,
        description: '',
        tableSql: sqlData.tableSql,
        id: sqlData.id,
        name: sqlData.SQLTitle,
        type: 'SQL',
        originName: '',
        fields: sqlData.fields,
        children: []
      }
      updateTreeData(sqlData.fields, sqlData.SQLTitle, treeData.value)
    }
  }
}
const drawerSqlClose = () => {
  sqlDetail.value = null //关闭后修改
}
const updateSqlDrawer = (val) => {
  //更新抽屉的展示
  sqlDrawer.value = val
}

// 编辑sql数据源表
const handlerEditorClick = () => {
  sqlDrawer.value = true
  //编辑器赋值sql
}
// 删除sql数据源表
const handlerDeleClick = () => {
  drawerFileds.value = false
}

const dragItems = ref([]) //容器中放置的表
const currentDragItem = ref(null) //当前拖拽的表
const handlerMouseDown = (item) => {
  //列表选择
  if (item) {
    currentDragItem.value = { ...item }
    if (item.type === 'API' && dragItems.value.length > 0 && dragItems.value[0].type === 'API') {
      if (dragItems.value.length > 0) {
        ElMessage.warning('API类型只能拖拽一张表！')
        return false
      }
    }
  } else {
    currentDragItem.value = {
      datasourceId: null,
      description: '',
      name: '',
      originName: '',
      tableSql: '',
      type: 'SQL'
    }
  }
}
const handlerDragStart = (item) => {
  //列表移动
  if (item?.type !== 'API') {
    if (item && item.name === dragItems.value[0]?.name) {
      ElMessage.warning('该表已存在！')
      return false
    }
    if (dragItems.value.length > 0 && dragItems.value[0].type === 'API') {
      return false
    }
  } else {
    if (dragItems.value.length > 0) {
      return false
    }
  }
  if (dragItems.value.length > 0) {
    //下侧虚拟框----------左侧栏选中后，每个节点的children中push一个唯一标识（结束时去除）
    const addVirtualChildToEveryNode = (tree) => {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (Array.isArray(node.children)) {
          node.children.push({ type: 'virtual', name: node.name })
        }
        // 如果当前节点还有子节点，递归处理子节点
        if (node.children?.length > 0 && Array.isArray(node.children)) {
          addVirtualChildToEveryNode(node.children)
        }
      }
    }
    addVirtualChildToEveryNode(dragItems.value)

    //右侧虚拟框--------每个节点的叶子节点中push一个唯一标识（结束时去除）
    const pushVirtualChildToLeafNodes = (tree) => {
      if (!tree || !Array.isArray(tree)) {
        return // 如果树为空或不是数组，则直接返回
      }

      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        // 如果当前节点是叶子节点（即没有子节点），则向其children数组中添加虚拟子节点
        if (!node.children || node.children.length === 0) {
          node.children = node.children || [] // 确保children数组存在
          node.children.push({ type: 'virtual', name: node.name }) // 添加虚拟子节点
        } else {
          // 如果当前节点不是叶子节点，则递归处理其子节点
          pushVirtualChildToLeafNodes(node.children)
        }
      }
    }
    pushVirtualChildToLeafNodes(dragItems.value)
  }
}
const handlerDragEnd = () => {
  const removeVirtualChildrenFromLeafNodes = (tree) => {
    if (!tree || !Array.isArray(tree)) {
      return
    }
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (!node.children || node.children.length === 0) {
        continue
      }
      // 移除当前节点children中的虚拟子节点
      node.children = node.children.filter((child) => child.type !== 'virtual')
      removeVirtualChildrenFromLeafNodes(node.children)
    }
  }
  removeVirtualChildrenFromLeafNodes(dragItems.value)
}
const handlerDrop = async (data) => {
  if (currentDragItem.value.type === 'SQL') {
    targetName.value = data
    sqlDrawer.value = true
  } else {
    const result = await datasetApi.getTableFields.send({
      tableName: currentDragItem.value.name, //表名
      datasourceId: currentDragItem.value?.id || currentDragItem.value.datasourceId,
      datasetId: queryId || ''
    })
    Object.assign(currentDragItem.value, { ...result })
    //push给name === 树中data 对应节点的children
    if (dragItems.value.length > 0) {
      isRelate.value = true
      title.value = '编辑关联关系'
      drawerDrag.flag = true
      //拖拽树添加节点并保证name唯一
      const collectNodeNames = (tree, names = new Set()) => {
        if (!tree || !Array.isArray(tree)) {
          return names
        }
        for (const node of tree) {
          names.add(node.name)
          collectNodeNames(node.children, names)
        }
        return names
      }

      const generateUniqueName = (existingNames, baseName) => {
        let index = 1
        let uniqueName = baseName
        while (existingNames.has(uniqueName)) {
          uniqueName = `${baseName}${index++}`
        }
        return uniqueName
      }
      const targetNode = findNodeByNameOrId(dragItems.value, data) //目标节点
      const addNode = (tree, newNode) => {
        const existingNames = collectNodeNames(tree) // 收集整棵树中所有节点名
        const uniqueName = generateUniqueName(existingNames, newNode.name) // 生成唯一节点名

        targetNode.children.push({
          ...result,
          name: uniqueName,
          children: []
        })
        Object.assign(currentDragItem.value, { name: uniqueName })
      }
      addNode(dragItems.value, currentDragItem.value)
      //---------------
      //关联关系抽屉
      let conItem = findParent(dragItems.value, currentDragItem.value.name, null)
      conItem.forEach(async (item, index) => {
        item.searchKey = ''
        linkTableColumns.value[index].options = item.fields.map((ele) => ({
          label: ele.name,
          value: ele.originName,
          type: ele.type
        }))
        //给每个表格的relateActionsData.unionToParent中添加parent-datasetTableOriginName和children-datasetTableOriginName
        nextTick(() => {
          item.fields.forEach((row) => {
            subItemRef.value[item.name].toggleRowSelection(row, row.checked === 0 ? true : false)
          })
        })
      })
      linkTableData.value.map((dataItem) => {
        ;(dataItem.parentDatasetTableOriginName = conItem[0].name),
          (dataItem.currentDatasetTableOriginName = conItem[1].name)
      })
      showRelationItems.value = conItem //遍历2个表格
      //--------------
      fields = JSON.parse(JSON.stringify(conItem)) //关联关系弹窗---搜索框数据源
    } else {
      dragItems.value.push({ ...result, pId: '-1', children: [] })
      updateTreeData(result.fields, data, treeData.value)
      previewTableDatas.value = []
    }
  }
}
//拖拽表的操作
const drawerDrag = reactive({
  flag: false,
  showItem: ''
})
const handlerFieldSelect = (data) => {
  const cardData = data.data?.data || data.data
  isRelate.value = false
  drawerDrag.flag = true
  drawerDrag.showItem = cardData.name
  filedsTableData.value = cardData.fields
  //默认全部勾选
  nextTick(() => {
    if (filedsTableData.value) {
      filedsTableData.value.forEach((row) => {
        if (row.checked === 0) {
          //checked 为 0 进行勾选
          tableSelf.value.toggleRowSelection(row, true)
        } else {
          //checked 为 1 不勾选
          tableSelf.value.toggleRowSelection(row, false)
        }
      })
    }
  })

  //字段选择---点击确定后根据当前操作表更新拖拽表中字段
  currentDragItem.value = {
    name: cardData.name,
    originName: cardData.name
  }
}
const selectable = (row) => {
  if (row.addFieldReference === 1 || row.dimensionReference === 1 || row.filterReference === 1) {
    return false
  } else {
    return true
  }
}
//删除节点
const showDragDelete = ref(false) //拖拽表删除弹出框

const removeNodeFromDragItems = (name, dragItems) => {
  for (let i = 0; i < dragItems.length; i++) {
    const currentNode = dragItems[i]
    if (currentNode.name === name) {
      dragItems.splice(i, 1)
      return true // 找到了并删除节点
    } else if (currentNode.children?.length) {
      const removed = removeNodeFromDragItems(name, currentNode.children)
      if (removed) {
        return true
      }
    }
  }
  return false // 没有匹配节点
}
const removeNodeByNameFromTreeData = (name, treeData) => {
  for (let i = 0; i < treeData.length; i++) {
    const currentNode = treeData[i]
    if (dragItems.value.length === 0) {
      treeData[0].children = []
      treeData[1].children = []
    } else {
      currentNode.children.forEach((item) => {
        if (item.originName === name && item.datasetTableFieldType === 'FOLDER') {
          // item.children = [] ,更改为checked=1，再次添加时创建文件夹用
          item.children.forEach((child) => {
            child.checked = 1
          })
        }
      })
    }
  }
  return false
}

function findNode(tree, result = []) {
  tree.forEach((node) => {
    if (!node || !Array.isArray(node.children)) {
      return null
    }

    if (node.extraFields === '1') {
      result.push(node)
    }
    // 递归检查子节点
    // 如果节点有子节点，递归遍历它们
    if (Array.isArray(node.children)) {
      for (let child of node.children) {
        findNode(child, result) // 递归调用
      }
    }

    return null
  })
}
const cardData = ref(null)
const handleFieldDelete = (data) => {
  cardData.value = data.data
  showDragDelete.value = true
}
const deleteDragData = (card) => {
  //判断是否被引用，存在引用字段提示不删除
  const targetNode = findNodeByNameOrId(dragItems.value, card.name)
  let isExitReferenceField = false
  let referenceFields = []
  //过滤字段
  let allFilters = []
  if (tabList.value?.length) {
    tabList.value.forEach((tabItem) => {
      allFilters = allFilters.concat(
        tabItem.originName ?? tabItem.fieldsForm.datasetTableFieldOriginName
      )
    })
  }
  targetNode.fields.forEach((fieldItem) => {
    if (fieldItem.addFieldReference === 1 || fieldItem.dimensionReference === 1) {
      isExitReferenceField = true

      referenceFields = referenceFields.concat(fieldItem.name)
      return
    }
    if (allFilters?.length) {
      allFilters.forEach((filterItem) => {
        if (filterItem === fieldItem.originName) {
          isExitReferenceField = true
          referenceFields = referenceFields.concat(allFilters)
          return
        }
      })
    }
  })

  if (!isExitReferenceField || dragItems.value[0].children.length === 0) {
    removeNodeFromDragItems(cardData.value.name, dragItems.value)
    removeNodeByNameFromTreeData(cardData.value.name, treeData.value)
    //删除后，过滤中的字段也要去掉
    tabList.value = []
    props.tableTabActions.map((item) => {
      if (item.isAmount) return Object.assign(item, { amount: 0 })
      return item
    })
    //表格置空
    previewTableDatas.value = []
  } else {
    showCite.value = true
    showCiteData.value = {
      hintTitle: '删除失败',
      name: '该表中存在字段被【' + referenceFields + '】依赖。',
      hintField: '请先删除依赖项，再操作。'
    }
  }
  showDragDelete.value = false
}

const sqlDetail = ref(null)
const handleSqlEdit = (data) => {
  sqlDrawer.value = true
  //编辑器、sql名字赋值
  sqlDetail.value = data.data
}
//打开编辑关联关系
const handlerRelationOpen = (data) => {
  currentDragItem.value = data
  isRelate.value = true
  title.value = '编辑关联关系'
  drawerDrag.flag = true
  //找到drawer中应该展示的两张表
  const findCurrentAndParentItem = findParent(dragItems.value, currentDragItem.value.name, null)
  let conItem = JSON.parse(JSON.stringify(findCurrentAndParentItem))

  conItem.forEach((item, index) => {
    item.searchKey = ''
    //给每个表格的relateActionsData.unionToParent中添加parent-datasetTableOriginName和children-datasetTableOriginName
    nextTick(() => {
      item.fields.forEach((row) => {
        subItemRef.value[item.name].toggleRowSelection(row, row.checked === 0 ? true : false)
      })
      item.selectields = item.fields.length
      item.selectedields = item.fields.filter((field) => field.checked === 0).length
    })
    linkTableColumns.value[index].options = item.fields.map((ele) => ({
      label: ele.name,
      value: ele.originName,
      type: ele.type
    }))
  })
  relateActionsData.unionToParent.unionType = data.unionToParent.unionType

  //弹出框关联数据
  let linkTableDataItems = [] //链接字段数据

  if (data.unionToParent.unionFields) {
    data.unionToParent.unionFields.forEach((unionFields) => {
      if (unionFields.currentField.name && unionFields.parentField.name) {
        linkTableDataItems.push({
          parentField: unionFields.parentField.name,
          currentField: unionFields.currentField.name
        })
      } else {
        linkTableDataItems.push({
          parentField: unionFields.parentField,
          currentField: unionFields.currentField
        })
      }
    })
  }
  linkTableData.value = linkTableDataItems
  //---------------------
  showRelationItems.value = conItem //遍历2个表格
}

const showRelationItems = ref([]) //编辑关联关系的表

let isAddRelate = false
const handleDrawerClose = () => {
  if (!isAddRelate && dragItems.value.length > 1) {
    dragItems.value.pop()
  }
  //--------------
  if (isRelate.value) {
    linkTableData.value = [
      {
        parentField: '' || {},
        currentField: '' || {}
      }
    ]
  }
}

const drawerFileds = ref(false) //抽屉
const isRelate = ref(false) //抽屉内容
const handleDbClickNode = async (index) => {
  const result = await datasetApi.getTableFields.send({
    tableName: fieldsList.value[index].name, //表名
    datasourceId: fieldsList.value[index].id,
    datasetId: ''
  })
  Object.assign(currentDragItem.value, { ...result })
  if (result) {
    if (!dragItems.value.length > 0) {
      dragItems.value.push({ ...result, pId: '-1', children: [] })
      updateTreeData(result.fields, fieldsList.value[index].name, treeData.value)
    } else if (!dragItems.value[0].children.length > 0) {
      if (dragItems.value[0].name === fieldsList.value[index].name) {
        ElMessage.warning('根节点不可重复添加！')
        return
      }
      isRelate.value = true
      title.value = '编辑关联关系'
      drawerDrag.flag = true
      dragItems.value[0].children.push({ ...result, children: [] })
      let conItem = findParent(dragItems.value, currentDragItem.value.name, null)
      conItem.forEach(async (item, index) => {
        item.searchKey = ''
        linkTableColumns.value[index].options = item.fields.map((ele) => ({
          label: ele.name,
          value: ele.originName,
          type: ele.type
        }))
        //给每个表格的relateActionsData.unionToParent中添加parent-datasetTableOriginName和children-datasetTableOriginName
        nextTick(() => {
          item.fields.forEach((row) => {
            subItemRef.value[item.name].toggleRowSelection(row, row.checked === 0 ? true : false)
          })
        })
      })
      linkTableData.value.map((dataItem) => {
        ;(dataItem.parentDatasetTableOriginName = conItem[0].name),
          (dataItem.currentDatasetTableOriginName = conItem[1].name)
      })
      showRelationItems.value = conItem //遍历2个表格
    }
  }
}
const filedsTableColumns = ref([
  {
    prop: 'originName',
    label: '物理字段名'
  },
  {
    prop: 'description',
    label: '备注'
  }
])
const filedsTableData = ref([]) //字段选择表格 数据
const selectedFiledsNum = ref(null)
const selectedItem = ref([])
const tableSelf = ref(null) //字段选择表格
const updateTreeParams = ref(filedsTableData.value) //所勾选字段
const onSelect = (selection, row) => {
  //selection:选中行 row：当前行
  const isCheck = selection.includes(row)
  if (!isCheck) {
    row.checked = 1
  } else {
    row.checked = 0
  }
}

const onSelectionChange = (selection) => {
  // 选中的数据checked为0未选中为1 selection:所有选中字段
  const selections = selection.flatMap((item) => {
    const foundItems = filedsTableData.value.filter((field) => field.name === item.name)
    return foundItems.length > 0 ? foundItems : []
  })
  updateTreeParams.value = selections
  selectedFiledsNum.value = selections.length
  selectedItem.value = selection
}

const selectAll = (selection) => {
  if (selection.length > 0) {
    filedsTableData.value.forEach((element) => {
      element.checked = 0
    })
  } else {
    filedsTableData.value.forEach((element) => {
      element.checked = 1
    })
  }
}
const selectionFileds = computed(() => {
  //表信息
  const allFileds = filedsTableData.value?.length
  const selected = selectedFiledsNum.value ? selectedFiledsNum.value : 0
  return selected + '/' + allFileds
})

const subItemRef = ref([])
const setRefMap = (el, item) => {
  if (el) {
    subItemRef.value[`${item.name}`] = el
  }
}
const onSelectionRelate = (selection, row) => {
  const isCheck = selection.includes(row)
  if (!isCheck) {
    row.checked = 1
  } else {
    row.checked = 0
  }
}
const onSelectRelateAll = (selection, item) => {
  if (selection.length > 0) {
    selection.forEach((item) => (item.checked = 0))
  } else {
    subItemRef.value[`${item.name}`].data.forEach((tableChecked) => (tableChecked.checked = 1))
  }
}
const onSelectionRelateChange = (selection, row) => {
  //编辑关联关系表格   上
  relateActionsData.selectedFields = selection
}

const handlerTabChange = async (index, tabItem) => {
  dataSourceKey.value = '' //搜索框清空
  const resultApiOrFile = await datasourceApi[apiListMap.EXPLOR_SPACE[tabItem.value]].send({
    keywords: dataSourceKey.value || '',
    currentPage: 1,
    pageSize: 100
  })
  fieldsList.value = resultApiOrFile.list.map((item) =>
    Object.assign(item, { type: tabItem.value })
  )
}

const fileDrawer = ref(false)
const buttonHint = ref('选择待上传文件')
const handlerUpLoadFile = () => {
  if (content === '上传文件') {
    fileDrawer.value = true
  }
}
const handlerCancle = () => {
  fileDrawer.value = false
}
const handlerConfirm = async () => {
  fileDrawer.value = false
  //请求文件数据源列表
  const result = await datasourceApi.getDataSourceFilePage.send({
    keywords: '',
    currentPage: 1,
    pageSize: 100
  })
  if (result) {
    fieldsList.value = result.list
  }
  //点击确定，调用文件上传接口
}

const onHandlerCopy = async (item) => {
  await navigator.clipboard.writeText(item.name)
  ElMessage.success('成功复制文本到剪切板')
}

//表详情
const popoverData = ref([
  {
    name: '',
    description: ''
  }
])
const popoverColumn = [
  {
    prop: 'name',
    label: '物理字段名'
  },
  {
    prop: 'description',
    label: '描述'
  }
]
const handlerPopover = async (item) => {
  const result = await datasourceApi.getDatasourceDbTableFields.send({
    datasourceId: item.id,
    tableName: item.name
  })
  popoverData.value = result.fields.map((item) => ({
    name: item.name,
    description: item.description
  }))
}
//右侧内容区
const relateTableColumns = [
  {
    type: 'selection'
    // prop: 'name'
  },
  {
    prop: 'originName',
    label: '物理字段名'
  },
  {
    prop: 'description',
    label: '备注'
  }
]
const linkTableData = ref([
  {
    parentField: '',
    currentField: ''
  }
])
const linkTableColumns = ref([
  {
    prop: 'parentField',
    label: '数据源表1',
    options: []
  },
  {
    prop: 'currentField',
    label: '数据源表2',
    options: []
  },
  {
    prop: 'option',
    label: '操作'
  }
])
//表格中的操作列
const handlerLinkDele = (index) => {
  if (linkTableData.value.length > 1) {
    linkTableData.value.splice(index - 1, 1)
  } else {
    ElMessage.warning('至少关联一个字段')
  }
}

const addRelateActions = () => {
  linkTableData.value.push({
    parentField: '',
    currentField: ''
  })
}

const dragTableInitial = ref(0)
const tabsTableData = [
  {
    label: '数据预览',
    value: 'EXPLOR_SPACE'
  },
  {
    label: '批量配置',
    value: 'MYSQL_DATABASE'
  }
]

// 输入框搜索字段
const inputList = ref('') //单个表

//关联关系表搜素
let fields = []
const relateKeyChange = (val, item, index) => {
  if (val) {
    showRelationItems.value[index].fields = fields[index].fields.filter((item) =>
      item.originName.includes(val)
    )
  } else {
    showRelationItems.value[index].fields = fields[index].fields
  }
  nextTick(() => {
    showRelationItems.value[index].fields.forEach((row) => {
      subItemRef.value[item.name].toggleRowSelection(row, row.checked === 0 ? true : false)
    })
  })
}

watch(
  () => dragItems.value,
  (n, _) => {
    //拖拽树存在至少一个根节点，按钮可点击
    props.tableTabActions.map((item) => {
      item.disabled = n.length <= 0
    })
    //拖拽树存在至少一个根节点，数据源不可切换
    const rootType = dragItems.value[0]?.type
    if (rootType) {
      //根节点信息存在
      if (rootType === 'FILE' || rootType === 'API') {
        //queryId存在，不能切换数据源
        dataSourceOptions.value
          .filter((item) => item.type !== 'EXPLOR_SPACE')
          .map((item) => Object.assign(item, { disabled: true }))
      } else {
        //DM或者MYSQL
        dataSourceOptions.value
          .filter((item) => item.label !== curSelectItem.value.label)
          .map((item) => Object.assign(item, { disabled: true }))
      }
    } else {
      dataSourceOptions.value.map((item) => Object.assign(item, { disabled: false }))
    }
  },
  {
    deep: true
  }
)

const relateActionsData = reactive({
  selectedFields: [], //选择的字段
  unionToParent: {
    unionType: 'LEFT',
    unionFields: linkTableData.value || []
  }
})
const unionMap = [
  { value: 'LEFT', label: '左连接', icon: 'icon-Left-outer-join' },
  // { value: 'RIGHT', label: '全连接', icon: 'icon-union' },
  { value: 'INNER', label: '内连接', icon: 'icon-intersection' }
]
const relateActions = [
  {
    type: 'normal',
    transparent: true,
    label: '取消',
    handler: () => {
      if (isRelate.value) {
        //看drawer里的current在拖拽树中是否存在，如果存在直接关闭，不存在移除
        const findNode = (tree, targetNode) => {
          if (!tree) {
            return false // 树为空，节点不存在
          }

          if (tree.name === targetNode.name) {
            return true // 找到目标节点
          }

          if (tree.children && tree.children.length > 0) {
            // 递归搜索子节点
            for (const child of tree.children) {
              if (findNode(child, targetNode)) {
                return true // 子节点中找到目标节点
              }
            }
          }

          return false // 未找到目标节点
        }
        const isFindNode = findNode(dragItems.value[0], showRelationItems.value[1])

        if (isFindNode && showRelationItems.value[1].unionToParent) {
          drawerDrag.flag = false
        } else {
          removeNode(dragItems.value, currentDragItem.value.name)
        }
        //取消后关联的表格数据置空
        linkTableData.value = [
          {
            parentField: '',
            currentField: ''
          }
        ]
      }
      drawerDrag.flag = false //关
    }
  },
  {
    label: '确定',
    handler: async (btn, attach) => {
      if (!isRelate.value) {
        const filedsTableDataSelected = filedsTableData.value.filter((item) => item.checked === 0)
        if (filedsTableDataSelected.length === 0) {
          ElMessage.error('至少选择一个有效字段 ！')
          return
        }
        // 找到弹出框的表名在树中对应节点，根据字段表更改该节点下的checked，如果没有找到就更改treeData.value[1].children
        const updateTreeChecked = (tree, itemName, checkedValue, folderName) => {
          let folderFound = false // 用来标记是否找到了文件夹
          const findAndUpdateNode = (nodes) => {
            for (const node of nodes) {
              if (node.datasetTableFieldType === 'FOLDER' && node.originName === folderName) {
                // 找到了匹配的文件夹
                folderFound = true
                node.children.forEach((treeChild) => {
                  if (treeChild.originName === itemName) {
                    treeChild.checked = checkedValue
                  }
                  if (treeChild.children?.length > 0) {
                    findAndUpdateNode(treeChild.children)
                  }
                })
                return
              }
              if (node.children?.length > 0) {
                findAndUpdateNode(node.children)
              }
            }
          }
          // 开始从根节点查找
          findAndUpdateNode(tree)
          if (!folderFound) {
            // 如果没有找到匹配的文件夹，更新整个树的内容
            tree.forEach((rootNode) => {
              if (rootNode.datasetTableFieldType === 'FIELD') {
                if (rootNode.originName === itemName) {
                  rootNode.checked = checkedValue
                }
                if (rootNode.children?.length > 0) {
                  updateTreeChecked(rootNode.children, itemName, checkedValue, folderName)
                }
              }
            })
          }
        }

        filedsTableData.value.forEach((item) => {
          if (item.dataType === 'MEASURE') {
            updateTreeChecked(
              treeData.value[1].children,
              item.originName,
              item.checked,
              drawerDrag.showItem //表名
            )
          } else if (item.dataType === 'DIMENSION') {
            updateTreeChecked(
              treeData.value[0].children,
              item.originName,
              item.checked,
              drawerDrag.showItem
            )
          }
        })
        // Object.assign(currentDragItem.value, { fields: filedsTableData.value })
        //找到拖拽树中操作节点，复制fields
        const node = findNodeByNameOrId(dragItems.value, currentDragItem.value.originName)
        Object.assign(node, { fields: filedsTableData.value })
        // const treeNode = findNodeByNameOrId(treeData.value, currentDragItem.value.originName)
        // Object.assign(treeNode, { fields: filedsTableData.value })

        isAddRelate = false
        drawerDrag.flag = false //关
      } else {
        //校验至少关联一项
        const parentFields = linkTableData.value[0].parentField
        const currentFields = linkTableData.value[0].currentField
        if (!parentFields || !currentFields) {
          ElMessage.warning('关联字段不能为空')
          return
        }
        //编辑关联关系中字段的勾选----------更新树结构的数据预览
        Object.assign(currentDragItem.value, {
          unionToParent: attach.relateActionsData.unionToParent
        })
        //数据预览树：创建文件夹节点
        //更改为如果currentDragItem.value.name或originName在树中存在，找到并修改该节点字段下的checked
        // 不存在时才创建并添加文件夹节点
        //同步数据
        const parentAndCurrent = findParent(dragItems.value, currentDragItem.value.name, null)
        //拖拽树中同步抽屉数据
        parentAndCurrent.forEach((childItem, index) => {
          Object.assign(childItem, { fields: showRelationItems.value[index].fields })
        })
        updateTreeData(showRelationItems.value, currentDragItem.value.name, treeData.value, null)
        const union = linkTableData.value.map((unionItem) => {
          const newUnionItem = { ...unionItem }
          if (newUnionItem.parentField && newUnionItem.currentField) {
            newUnionItem.parentField = {
              datasetTableOriginName: parentAndCurrent[0].originName,
              name: unionItem.parentField
            }
            newUnionItem.currentField = {
              datasetTableOriginName: parentAndCurrent[1].originName,
              name: unionItem.currentField
            }
          }
          return newUnionItem
        })
        Object.assign(parentAndCurrent[1], {
          unionToParent: {
            unionFields: union,
            unionType: relateActionsData.unionToParent.unionType
          }
        })
        // Object.assign(parentAndCurrent[1], { unionToParent: { unionFields: linkTableData.value } })
        isAddRelate = true
        drawerDrag.flag = false //关
        linkTableData.value = [
          {
            parentField: '',
            currentField: ''
          }
        ]
      }
      if (previewKey.value) {
        forChecked(previewKey.value, treeData.value)
      }
    }
  }
]

const previewKey = ref('')
const forChecked = (val, treeData) => {
  //递归遍历treeData,存在则checked=1,不存在的节点checked=0
  treeData.forEach((node) => {
    if (node.name.includes(val) && node.name !== '维度' && node.name !== '度量') {
      Object.assign(node, { checked: 0 })
    } else if (!node.name.includes(val) && node.name !== '维度' && node.name !== '度量') {
      if (node.datasetTableFieldType === 'FOLDER') {
        forChecked(val, node.children)
      } else {
        Object.assign(node, { checked: 1 })
      }
    }
    if (node.children) {
      forChecked(val, node.children)
    }
  })
}
const previewColumnChange = (val) => {
  forChecked(val, treeData.value)
}

// 数据预览
//-------树
const treeData = ref([
  {
    id: 1,
    name: '维度',
    children: []
  },
  {
    id: 2,
    name: '度量',
    children: []
  }
])
setIconsInTree(treeData.value)

const editItem = ref(false) //编辑
const treeOptionDialogTitle = ref('编辑字段')
const editorFormData = ref({
  name: '',
  phyFields: '',
  dataFormat: 'auto',
  convertValue: '1',
  description: ''
})

const showDelete = ref(false) //删除，预览树中字段
const showDeleteData = ref(null)
const deleteRowData = () => {
  const { data, event } = showDeleteData.value
  //删除
  if (
    data?.addFieldReference === 1 ||
    data?.dimensionReference === 1 ||
    data?.filterReference === 1
  ) {
    ElMessage.error('字段被引用，请先删除依赖字段 ！')
  } else if (data.datasetTableFieldType === 'FOLDER') {
    if (data?.children) {
      ElMessage.warning('文件夹中存在对象，不能删除 !')
    } else {
      const findIndex = treeData.value[data.dataType === 'DIMENSION' ? 0 : 1].children.findIndex(
        (deleteItem) => deleteItem.name === data.name
      )
      if (findIndex !== -1) {
        treeData.value[data.dataType === 'DIMENSION' ? 0 : 1].children.splice(findIndex, 1)
      }
    }
  } else {
    const dragTargetNode = findNodeByNameOrId(dragItems.value, data.datasetTableName) //拖拽树
    if (dragTargetNode) {
      dragTargetNode.fields.forEach((item) => {
        if (item.originName === data.originName) {
          Object.assign(item, { checked: 1 })
        }
      })
    }
    handlerEventMap[event](treeData.value, data)
    //删除的字段，根据extraField=1\2\3将引用字段的node中reference=0，拖拽树中reference=0
    if (data.extraField === 1) {
      const referenceNode = getLastPartAfterDot(JSON.parse(data.expression).calculateMethod)
      const targetNode = findNodeByNameOrId(treeData.value, referenceNode)
      if (targetNode) {
        Object.assign(targetNode, { addFieldReference: 0 })
      }
      dragTargetNode.fields.forEach((item) => {
        if (item.originName === targetNode.originName) {
          Object.assign(item, { addFieldReference: 0, checked: targetNode.checked })
        }
      })
    } else if (data.extraField === 2 || data.extraField === 3) {
      const referenceNode = data.fields
      const targetNode = findNodeByNameOrId(treeData.value, referenceNode)
      Object.assign(targetNode, { dimensionReference: 0 })
      dragTargetNode.fields.forEach((item) => {
        if (item.originName === targetNode.originName) {
          Object.assign(item, { dimensionReference: 0, checked: targetNode.checked })
        }
      })
    }
  }
  showDelete.value = false
}

const showCite = ref(false) //引用
const showCiteData = ref({
  hintTitle: '转换类型失败',
  name: '', //操作字段名
  hintField: '' //引用字段名
})

//数据预览下拉框
const dropdownMenuSelf = ref(null)

//批量配置
const handlerBatchOptions = () => {
  console.log('批量配置')
}
const handlerExpandCopy = (row) => {
  handlerCopy(treeData.value, row, null, null, dragItems.value)
}
const handlerExpandDelete = (row, event) => {
  showDelete.value = true
  showDeleteData.value = {
    data: row,
    event: event
  }
}

const inputNameChange = (originInputName, val, row) => {
  //失去焦点后，先判断是否重名，不重名再更改
  //更改
  //通过originInputName找到树中对应节点，赋值
  const targetNode = findNodeByNameOrId(treeData.value, originInputName)
  Object.assign(targetNode, { ...row })
}
const selectDefault = (originName, val, row) => {
  const targetNode = findNodeByNameOrId(treeData.value, originName)
  Object.assign(targetNode, { ...row })
}
const inputDescChange = (originInputName, val, row) => {
  const targetNode = findNodeByNameOrId(treeData.value, originInputName)
  Object.assign(targetNode, { ...row })
}
const expandRowChange = async (row, val) => {
  const targetNode = findNodeByNameOrId(treeData.value, row.name)
  Object.assign(targetNode, { ...row }, { dataFormat: row.type?.[1], icon: ICONMAP[row.type[0]] })
  subColumnItemIcon.value = targetNode
  await props.tableTabActions[3].handler(null, {
    dragItems: dragItems.value,
    currentDataSource: currentDataSource.value,
    allFields: treeData.value,
    filterConditions: tabList.value,
    queryId: queryId
  })
}

const isEditItem = ref(true)
watch(
  //数据集名字编辑
  () => editorFormData.value?.name,
  (newValue) => {
    if (newValue) isEditItem.value = false
    else isEditItem.value = true
  }
)
let currentNodeName = null
const contentTypeData = ref(null) //树节点中操作项数据
const addFieldSelf = ref(null)
const groupDimensionSelf = ref(null)

//树------操作按钮
const itemTitleLog = ref('')
watch(
  () => props.itemTitle,
  (n) => {
    itemTitleLog.value = n
  },
  {
    immediate: true
  }
)
const optionOrigin = ref('')
const subColumnItemIcon = ref('')
const handlerDropItem = (data, event, parent, format) => {
  currentNodeName = data
  editItem.value =
    (event === 'edit' && data.extraField === 0 && data.datasetTableFieldType === 'FIELD') ||
    (event === 'edit' && data.extraField === 4)

  if (data.extraField === 1 && event === 'edit') {
    optionOrigin.value = data
    //新建计算字段
    showItems.value = true
    contentTypeData.value = data
    emit('update:contentType', 'fieldItem')
    nextTick(() => {
      isDisabled.value = addFieldSelf.value.disabled
    })
    itemTitleLog.value = '编辑计算字段'
  } else if ((data.extraField === 2 || data.extraField === 3) && event === 'edit') {
    optionOrigin.value = data
    //分组维度
    showItems.value = true
    contentTypeData.value = data
    emit('update:contentType', 'dimensionItem')
    nextTick(() => {
      //修改数据集，分组设置的数据通过expression转化得到
      // fieldsForm = groupDimensionSelf.value.fieldsForm
      isDisabled.value = groupDimensionSelf.value.disabled
    })
    itemTitleLog.value = '编辑分组维度'
  } else if (
    data.extraField === 0 ||
    data.extraField === 1 ||
    data.extraField === 2 ||
    data.extraField === 3 ||
    data.extraField === 4
  ) {
    if (editItem.value) {
      handlerEventMap[event](editorFormData.value, data, event)
      const targetNode = findNodeByNameOrId(treeData.value, data.name)
      subColumnItemIcon.value = targetNode
    } else {
      if (event === 'delete') {
        showDelete.value = true
        showDeleteData.value = {
          data: data,
          event: event
        }
      } else if (event === 'date' || event === 'docs' || event === 'num' || event === 'geography') {
        const targetNode = findNodeByNameOrId(treeData.value, data.name)
        subColumnItemIcon.value = targetNode
        if (
          targetNode.addFieldReference === 1 ||
          targetNode.dimensionReference === 1 ||
          targetNode.filterReference === 1
        ) {
          showCite.value = true
          showCiteData.value = {
            hintTitle: '转换类型失败',
            name: targetNode.name //操作字段名
            // hintField: '被' + {...} + '引用' //引用字段名
          }
        } else {
          handlerEventMap[event](treeData.value, data, format)
        }
      } else {
        if (data.datasetTableFieldType === 'FIELD') {
          handlerEventMap[event](treeData.value, data, event, parent, dragItems.value)
        }
      }
    }
  } else if (event === 'edit' && !data.extraField) {
    contentTypeData.value = data
    addFolderShow.value = true
    showTitle.value = '编辑'
    formDataDialog.value.folderList = data.name
  }
  if (event === 'delete' && !data.extraField) {
    //文件夹
    showDelete.value = true
    showDeleteData.value = {
      data: data,
      event: event
    }
  }
}

// //拖拽成功
const handleDrop = (draggingNode, dropNode, dropType, ev, filteredTreeData) => {
  treeData.value = filteredTreeData.value
}
watch(
  () => addFieldSelf.value?.fieldsForm,
  (n) => {
    if (n && n.name === '') {
      isDisabled.value = true
    } else {
      isDisabled.value = false
    }
  },
  {
    deep: true
  }
)

const treeSelf = ref(null)
const isClick = ref(false) //联级面板展示
const actions = [
  {
    prefix: 'setting',
    handler: () => {
      isClick.value = !isClick.value
    }
  }
]
const formEditorSelf = ref(null)
const editorPreviewItem = async () => {
  const isValid = await formEditorSelf.value.submit()
  if (!isValid.valid) {
    editItem.value = true
    return
  }

  const specificationName = editorFormData.value.name
  const uniqueNames = getAllUniqueNames(treeData.value, currentNodeName)

  const isDuplicate =
    specificationName === currentNodeName.name ? false : uniqueNames.has(specificationName) // 是否有重复的名称

  // 树当前节点
  const selectedNode = findNodeByNameOrId(treeData.value, currentNodeName.name)

  if (selectedNode) {
    if (specificationName) {
      if (isDuplicate) {
        ElMessage.warning('字段名称和其他对象存在重名，请检查！')
        editItem.value = true
        return
      } else {
        Object.assign(selectedNode, editorFormData.value)
      }
    }
  }
  //表格当前节点
  const tableNode = findNodeByNameOrId(columnTreeData.value, currentNodeName.name)
  if (tableNode) {
    if (specificationName) {
      if (isDuplicate) {
        ElMessage.warning('字段名称和其他对象存在重名，请检查！')
        editItem.value = true
        return
      } else {
        Object.assign(tableNode, editorFormData.value)
      }
    }
  }
  //细粒度日期类型只更改，不刷新
  if (!editorFormData.value.granularity) {
    props.tableTabActions[3].handler(null, {
      dragItems: dragItems.value,
      currentDataSource: currentDataSource.value,
      allFields: treeData.value,
      filterConditions: tabList.value,
      queryId: queryId
    })
  }
  editItem.value = false
}
const cancleEditorItem = () => {
  editItem.value = false
}

const addFolderShow = ref(false)
const nodeId = ref(null)
const formFilterSelf = ref(null)
const showTitle = ref('新建')
const formDialog = ref([
  {
    label: '文件夹名称',
    key: 'folderList',
    minlength: 0,
    maxlength: 80,
    'show-word-limit': true,
    rules: [
      {
        validator: (_, val, callback) => {
          if (!val.trim()) {
            callback(new Error('文件夹名称不能为空 ！'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  }
])
const formDataDialog = ref({
  folderList: contentTypeData.value?.name || ''
})

const clickTreeConfirm = async () => {
  //更改为：校验通过后检查树节点是否存在该节点，不存在push、存在更新
  const isValid = await formFilterSelf.value.submit()
  if (isValid.valid) {
    //校验重名
    let allFolders = []
    treeData.value.forEach((tree) => {
      if (tree.children) {
        for (const child of tree.children) {
          if (child.datasetTableFieldType === 'FOLDER') {
            allFolders = allFolders.concat(child.name)
          }
        }
      }
    })
    const hasDuplicateName =
      contentTypeData.value?.name === formDataDialog.value.folderList
        ? false
        : allFolders.some((fieldName) => fieldName === formDataDialog.value.folderList)
    if (hasDuplicateName) {
      ElMessage.error('字段名称和其他对象存在重名，请检查！')
      addFolderShow.value = true
      return
    } else {
      // 给树结构添加节点
      if (contentTypeData.value) {
        //找到树中对应节点修改
        const editNode = findNodeByNameOrId(treeData.value, contentTypeData.value.name)
        if (editNode) {
          Object.assign(editNode, {
            name: formDataDialog.value.folderList
          })
        }
      } else {
        for (let i = 0; i < treeData.value.length; i++) {
          const node = treeData.value[i]
          if (node.id === nodeId.value.id) {
            node.children.push({
              id: null,
              dataType: nodeId.value.name === '维度' ? 'DIMENSION' : 'MEASURE',
              checked: 0,
              name: formDataDialog.value.folderList,
              originName: formDataDialog.value.folderList,
              icon: 'icon-folder-opened',
              datasetTableFieldType: 'FOLDER',
              children: null
            })
          }
        }
      }
      addFolderShow.value = false
    }
  }

  //完成后表单清空
  formDataDialog.value.folderList = ''
  contentTypeData.value = ''
}
const clickTreeCancel = () => {
  addFolderShow.value = false
  //取消后后表单清空
  formDataDialog.value.folderList = ''
  contentTypeData.value = ''
}
//添加文件夹
const handlerAddFolder = (data) => {
  nodeId.value = data
  addFolderShow.value = true
  showTitle.value = '新建'
}

const headerCellStyle = ({ row, rowIndex, columnIndex }) => {
  //表头颜色
  if (row[columnIndex]?.children?.length) {
    if (columnIndex === 0) {
      return {
        background: '#2468F2',
        color: '#fff'
      }
    } else if (columnIndex === 1)
      return {
        background: '#67C23A',
        color: '#fff'
      }
  }
  if (rowIndex === 1) {
    return {
      background: '#FFFFFF',
      color: '#303133'
    }
  }
}

const headerRowStyle = () => {
  return {
    width: '100%',
    overflow: 'auto'
  }
}

const cellMouseEnter = (row, column, cell) => {
  const selrange = document.getElementsByClassName(column.id)
  cell.style.backgroundColor = '#ecf5ff'
  for (var i = 0; i < selrange.length; i++) {
    selrange[i].style.backgroundColor = '#ecf5ff'
  }
}
const cellMouseLeave = (row, column, cell) => {
  const selrange = document.getElementsByClassName(column.id)
  cell.style.backgroundColor = ''
  for (var i = 0; i < selrange.length; i++) {
    selrange[i].style.backgroundColor = ''
  }
}

const tabList = ref([])
// const filterConditions = ref([])
//弹窗确定取消事件

const getLastPartAfterDot = (expressName) => {
  const lastIndex = expressName.lastIndexOf('(')
  if (lastIndex !== -1) {
    return expressName.slice(lastIndex + 1, -1)
  }
  return expressName // 如果没有找到 .，则返回整个字符串
}

function findNodesByName(nodes, name, result) {
  nodes.forEach((node) => {
    if (node.name === name) {
      result.push(node)
    }
    if (node.children) {
      findNodesByName(node.children, name, result)
    }
  })
}
const updateShowItems = async () => {
  if (props.contentType === 'fieldItem') {
    // 新建计算字段
    const addField = addFieldSelf.value.fieldsForm
    const code = addFieldSelf.value.code
    const allFields = contentTypeData.value
      ? flattenTreeData(treeData.value)
          .filter((item) => item.checked === 0)
          .filter((ele) => ele.name !== optionOrigin.value.name)
      : flattenTreeData(treeData.value).filter((item) => item.checked === 0)
    const hasDuplicateName = allFields.some((fieldName) => fieldName.name === addField.name)
    if (hasDuplicateName) {
      ElMessage.error('字段名称和其他对象存在重名，请检查！')
      showItems.value = true
      return
    } else if (!code) {
      ElMessage.error('请输入字段表达式！')
      showItems.value = true
      return
    }

    let editNode = {}
    //如果updateConentType.value存在需要从预览树中找到节点后修改内容
    if (contentTypeData.value) {
      if (contentTypeData.value.dataType === 'MEASURE') {
        treeData.value[1].children.forEach((node) => {
          if (node.name === contentTypeData.value.name) {
            editNode = node
          }
        })
      } else {
        treeData.value[0].children.forEach((node) => {
          if (node.name === contentTypeData.value.name) {
            editNode = node
          }
        })
      }
      Object.assign(
        editNode,
        { ...contentTypeData.value },
        addFieldSelf.value.fieldsForm,
        {
          expression: JSON.stringify({ calculateMethod: addFieldSelf.value.code })
        },
        { originName: '计算字段' }
      )
      //如果更改了dataType
      if (contentTypeData.value.dataType !== editNode.dataType) {
        const targetNode = findNodeByNameOrId(treeData.value, contentTypeData.value.name)
        if (!targetNode) return
        if (targetNode.dataType === 'MEASURE') {
          if (contentTypeData.value.dataType === 'MEASURE') {
            return
          } else {
            treeData.value[0].children.splice(treeData.value[0].children.indexOf(targetNode), 1)
            treeData.value[1].children.push(editNode)
          }
        } else {
          if (contentTypeData.value.dataType === 'DIMENSION') {
            return
          } else {
            treeData.value[1].children.splice(treeData.value[1].children.indexOf(targetNode), 1)
            treeData.value[0].children.push(editNode)
          }
        }
      }
      subColumnItemIcon.value = editNode //表头icon
    }
    //调用刷新预览接口
    //修改节点需要传递修改的树结构数据
    let copyTreeData = cloneDeep(treeData.value)
    const result = await props.tableTabActions[3].handler(null, {
      dragItems: dragItems.value,
      currentDataSource: currentDataSource.value,
      allFields: copyTreeData,
      filterConditions: tabList.value,
      queryId: queryId,
      addFieldItem: contentTypeData.value
        ? null
        : Object.assign(addField, {
            expression: JSON.stringify({ calculateMethod: addFieldSelf.value.code })
          }),
      definiteSelfCheck: addField.definiteSelfCheck,
      addFieldEditName: contentTypeData.value?.name
    })
    if (result && result?.code !== 407) {
      //添加计算字段到预览树中
      if (!contentTypeData.value) {
        updateTreeData(addField, null, treeData.value, 'allFields')
      }
      showItems.value = false

      //更新预览树后，要将对应引用节点加上标志
      const fieldsForm = findNodeByNameOrId(treeData.value, addFieldSelf.value.fieldsForm.name)
      const calculateMethod = JSON.parse(fieldsForm.expression).calculateMethod
      const referenceTable = fieldsForm.datasetTableName
      const referenceField = getLastPartAfterDot(calculateMethod)
      let referenceNodes = [] // 用于存储所有找到的节点
      findNodesByName(treeData.value, referenceField, referenceNodes)
      if (referenceNodes?.length) {
        Object.assign(referenceNodes[0], { addFieldReference: 1 }) //被引用reference:1
        // 将该节点的reference同步给拖拽表
        const targetNode = findNodeByNameOrId(dragItems.value, referenceTable)

        targetNode.fields.forEach((item) => {
          if (item.originName === referenceNodes[0].originName) {
            Object.assign(item, { ...referenceNodes[0] })
          }
        })
      }
      //如果更换引用字段，之前的字段中reference:0
      //--------
      if (contentTypeData.value) {
        const editReferenceTable = optionOrigin.value.datasetTableName //改前表名
        const editReferenceField = getLastPartAfterDot(
          JSON.parse(optionOrigin.value.expression).calculateMethod
        ) //改前字段名
        const isChange =
          (editReferenceField && editReferenceField !== referenceField) ||
          (editReferenceTable && editReferenceTable !== referenceTable)
        // isChange为true说明更改引用字段，引用字段reference:1
        let editReferenceNodes = [] // 用于存储所有找到的节点
        findNodesByName(treeData.value, editReferenceField, editReferenceNodes)
        if (editReferenceNodes?.length) {
          Object.assign(editReferenceNodes[0], { addFieldReference: 1 }) //被引用reference:1
          //拖拽树中reference:0
          const targetTableNode = findNodeByNameOrId(dragItems.value, referenceTable)
          targetTableNode.fields.forEach((item) => {
            if (item.originName === editReferenceNodes[0].originName) {
              Object.assign(item, { addFieldReference: 1 })
            }
          })
        }
        if (isChange) {
          // 如果表名和字段都一致，引用1
          const same =
            editReferenceField === referenceField && editReferenceTable === referenceTable
          // 之前的节点要去掉引用
          let editReferenceNodes = [] // 更改引用字段前的节点
          findNodesByName(treeData.value, editReferenceField, editReferenceNodes)
          if (editReferenceNodes?.length) {
            Object.assign(editReferenceNodes[0], { addFieldReference: same ? 1 : 0 }) //更改引用reference:0
            const targetTableNode = findNodeByNameOrId(dragItems.value, referenceTable)
            targetTableNode.fields.forEach((item) => {
              if (item.originName === editReferenceNodes[0].originName) {
                Object.assign(item, { addFieldReference: same ? 1 : 0 })
              }
            })
          }
        }
      }
      //--------
    } else {
      ElMessage.warning(result?.msg)
      showItems.value = true
    }
    setIconsInTree(treeData.value)
    contentTypeData.value = null
  } else if (props.contentType === 'dimensionItem') {
    //重名校验
    const groupDimension = groupDimensionSelf.value.fieldsForm
    const allFieldsEdit = contentTypeData.value
      ? flattenTreeData(treeData.value)
          .filter((item) => item.checked === 0)
          .filter((ele) => ele.name !== optionOrigin.value.name)
      : flattenTreeData(treeData.value).filter((item) => item.checked === 0)
    const hasDuplicateName = allFieldsEdit.some(
      (fieldName) => fieldName.name === groupDimension.name
    )
    if (hasDuplicateName) {
      ElMessage.error('字段名称和其他对象存在重名，请检查！')
      showItems.value = true
      return
    }

    //分组维度
    const { allFieldsItem, groups, name, fields, description, defaultDimension } =
      groupDimensionSelf.value.fieldsForm

    //字段为空判断
    let isEmpty = true
    if (allFieldsItem.type === 'STRING') {
      groups.forEach((group) => {
        if (!(group.groupName && group.values)) {
          isEmpty = false
          return
        }
      })
    } else if (allFieldsItem.type === 'DATE') {
      groups.forEach((group) => {
        if (!(group.time.leftValue && group.time.rightValue)) {
          isEmpty = false
          return
        }
      })
    } else if (allFieldsItem.type === 'NUMBER') {
      groups.forEach((group) => {
        if (
          !(
            (group.num.leftValue === 0 ? true : group.num.leftValue) &&
            (group.num.rightValue === 0 ? true : group.num.rightValue) &&
            group.num.leftMatchType &&
            group.num.rightMatchType
          )
        ) {
          isEmpty = false
          return
        }
      })
    }
    if (isEmpty) {
      showItems.value = false

      let expression = null
      if (allFieldsItem.type === 'STRING') {
        expression = groups.reduce(
          (acc, cur) => {
            acc.enumItems.push({
              groupName: cur.groupName,
              values: cur.values
            })
            return acc
          },
          {
            column: allFieldsItem.originName,
            enumItems: []
          }
        )
        expression.enumItems.push({
          groupName: defaultDimension,
          values: []
        })
      } else if (allFieldsItem.type === 'DATE') {
        const deepFields = JSON.parse(JSON.stringify(groups))

        const convertConditionValue = (item, subtype) => {
          item.time = {
            leftValue: weekAndDate(item.time.leftValue, subtype),
            rightValue: weekAndDate(item.time.rightValue, subtype)
          }
        }
        deepFields.map((item) => {
          switch (allFieldsItem.granularity) {
            case 'year-week':
              convertConditionValue(item, 'week')
              break
            case 'year-quarter':
              convertConditionValue(item, 'quarter')
              break
            case 'year-month-day':
              item.time = {
                leftValue: item.time.leftValue[0],
                rightValue: item.time.rightValue[0]
              }
              break
            case 'datetime':
              convertConditionValue(item, 'datetime')
              break
            case 'hour-minute':
              convertConditionValue(item, 'minute')
              break
            case 'hour-minute-second':
              convertConditionValue(item, 'second')
              break
            default:
              break
          }
        })

        expression = deepFields.reduce(
          (acc, cur) => {
            acc.rangeItems.push({
              groupName: cur.groupName,
              ...cur.time,
              leftMatchType: 'GT_EQ',
              rightMatchType: 'LT_EQ'
            })
            return acc
          },
          {
            column: allFieldsItem.originName,
            rangeItems: []
          }
        )
        expression.rangeItems.push({
          groupName: defaultDimension,
          leftValue: '',
          rightValue: '',
          leftMatchType: '',
          rightMatchType: ''
        })
      } else if (allFieldsItem.type === 'NUMBER') {
        expression = groups.reduce(
          (acc, cur) => {
            acc.rangeItems.push({
              ...cur.num,
              groupName: cur.groupName
            })
            return acc
          },
          {
            column: allFieldsItem.originName,
            // column: fields,
            rangeItems: []
          }
        )
        expression.rangeItems.push({
          groupName: defaultDimension,
          leftValue: '',
          rightValue: '',
          leftMatchType: '',
          rightMatchType: ''
        })
      }
      const allFields = {
        name: name,
        originName: allFieldsItem.originName,
        type: allFieldsItem.type || '',
        originType: allFieldsItem.originType,
        datasourceId: '',
        datasetId: allFieldsItem.datasetId,
        datasetTableName: allFieldsItem.datasetTableName || null,
        datasetTableOriginName: allFieldsItem.datasetTableOriginName || null,
        description: description || '',
        fieldAliasName: allFieldsItem.fieldAliasName,
        // dataType: allFieldsItem.dataType,
        dataType: 'DIMENSION',
        extraField: allFieldsItem.type === 'STRING' ? 3 : 2,
        checked: allFieldsItem.checked,
        datasetTableFieldType: allFieldsItem.datasetTableFieldType, //是字段还是文件
        expression: JSON.stringify(expression),
        dataFormat: allFieldsItem.dataFormat,
        granularities: allFieldsItem.granularities, //时间类型必填
        granularity: allFieldsItem.granularity, //时间类型必填
        convertValue: allFieldsItem.convertValue,
        aggregation: allFieldsItem.aggregation,
        children: allFieldsItem.children || null
      }

      let editNode = {}
      if (contentTypeData.value) {
        treeData.value[0].children.forEach((node) => {
          if (node.name === contentTypeData.value.name) {
            editNode = node
          }
        })
        Object.assign(editNode, groupDimensionSelf.value.fieldsForm, { ...allFields })
      } else {
        Object.assign(allFields, groupDimensionSelf.value.fieldsForm)
        updateTreeData(allFields, null, treeData.value, 'demision') //数据预览
      }
      const result = await props.tableTabActions[3].handler(null, {
        dragItems: dragItems.value,
        currentDataSource: currentDataSource.value,
        allFields: treeData.value,
        filterConditions: tabList.value,
        queryId: queryId
      })
      if (result.code === 407) {
        previewError.value = result.msg
        ElMessage.warning(result.msg)
        return
      }

      //更新预览树后，要将对应引用节点加上标志
      // const groupDimension = groupDimensionSelf.value.fieldsForm
      const referenceField = groupDimension.allFieldsItem.name
      const referenceTable = groupDimension.allFieldsItem.datasetTableName

      let referenceNodes = []
      findNodesByName(treeData.value, referenceField, referenceNodes)
      if (referenceNodes?.length) {
        Object.assign(referenceNodes[0], { dimensionReference: 1 }) //被引用reference:1
        // 将该节点的reference同步给拖拽表
        const targetNode = findNodeByNameOrId(dragItems.value, referenceTable)
        targetNode.fields.forEach((item) => {
          if (item.originName === referenceNodes[0].originName) {
            Object.assign(item, { ...referenceNodes[0] })
          }
        })
      }
    } else {
      ElMessage.warning('字段或字段值不能为空 ！')
      showItems.value = true
    }
    contentTypeData.value = null
  } else {
    //加上表单校验，过滤值为空时不关闭
    if (filterTermSelf.value.tabList.length > 0) {
      filterTermSelf.value.tabList.forEach((tabItem) => {
        let valid = true

        if (tabItem.type === 'NUMBER' || tabItem.type === 'INTEGER') {
          //数值类型只有枚举条件
          if (tabItem.fieldsForm.conditionType === 'OR_CONDITION') {
            const firMatchingType = tabItem.fieldsForm.conditionValueOr.fir.matchingType
            const firConditionValue = tabItem.fieldsForm.conditionValueOr.fir.conditionValue
            const sceMatchingType = tabItem.fieldsForm.conditionValueOr.sec.matchingType
            const secConditionValue = tabItem.fieldsForm.conditionValueOr.sec.conditionValue
            valid =
              (firMatchingType === 'IS_EMPTY' || firMatchingType === 'NOT_IS_EMPTY'
                ? true
                : firConditionValue === 0
                  ? true
                  : firConditionValue) &&
              (sceMatchingType === 'IS_EMPTY' || sceMatchingType === 'NOIS_EMPTY'
                ? true
                : secConditionValue === 0
                  ? true
                  : secConditionValue)
          } else if (tabItem.fieldsForm.conditionType === 'AND_CONDITION') {
            valid =
              (tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'IS_EMPTY' ||
              tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'NOT_IS_EMPTY'
                ? true
                : tabItem.fieldsForm.conditionValueAnd.fir.conditionValue) &&
              (tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'IS_EMPTY' ||
              tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'NOT_IS_EMPTY'
                ? true
                : tabItem.fieldsForm.conditionValueAnd.sec.conditionValue)
          } else if (tabItem.fieldsForm.conditionType === 'SINGLE_CONDITION') {
            valid =
              tabItem.fieldsForm.matchingType === 'IS_EMPTY' ||
              tabItem.fieldsForm.matchingType === 'NOT_IS_EMPTY'
                ? true
                : tabItem.fieldsForm.conditionValue === 0
                  ? true
                  : tabItem.fieldsForm.conditionValue
          }
        } else {
          if (tabItem.fieldsForm.filterType === 'CONDITION') {
            if (tabItem.type === 'STRING') {
              if (tabItem.fieldsForm.conditionType === 'OR_CONDITION') {
                valid =
                  (tabItem.fieldsForm.conditionValueOr.fir.matchingType === 'EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueOr.fir.matchingType === 'NOT_EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueOr.fir.matchingType === 'IS_EMPTY' ||
                  tabItem.fieldsForm.conditionValueOr.fir.matchingType === 'NOT_IS_EMPTY'
                    ? true
                    : tabItem.fieldsForm.conditionValueOr.fir.conditionValue) &&
                  (tabItem.fieldsForm.conditionValueOr.sec.matchingType === 'EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueOr.sec.matchingType === 'NOT_EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueOr.sec.matchingType === 'IS_EMPTY' ||
                  tabItem.fieldsForm.conditionValueOr.sec.matchingType === 'NOT_IS_EMPTY'
                    ? true
                    : tabItem.fieldsForm.conditionValueOr.sec.conditionValue)
              } else if (tabItem.fieldsForm.conditionType === 'AND_CONDITION') {
                valid =
                  (tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'NOT_EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'IS_EMPTY' ||
                  tabItem.fieldsForm.conditionValueAnd.fir.matchingType === 'NOT_IS_EMPTY'
                    ? true
                    : tabItem.fieldsForm.conditionValueAnd.fir.conditionValue) &&
                  (tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'NOT_EMPTY_TEXT' ||
                  tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'IS_EMPTY' ||
                  tabItem.fieldsForm.conditionValueAnd.sec.matchingType === 'NOT_IS_EMPTY'
                    ? true
                    : tabItem.fieldsForm.conditionValueAnd.sec.conditionValue)
              } else if (tabItem.fieldsForm.conditionType === 'SINGLE_CONDITION') {
                valid =
                  tabItem.fieldsForm.matchingType === 'EMPTY_TEXT' ||
                  tabItem.fieldsForm.matchingType === 'NOT_EMPTY_TEXT' ||
                  tabItem.fieldsForm.matchingType === 'IS_EMPTY' ||
                  tabItem.fieldsForm.matchingType === 'NOT_IS_EMPTY'
                    ? true
                    : tabItem.fieldsForm.conditionValue
              }
            } else if (tabItem.type === 'DATE') {
              valid =
                (tabItem.fieldsForm.conditionTimeType === 'BEGIN_WITH' &&
                  tabItem.fieldsForm.conditionValue) ||
                (tabItem.fieldsForm.conditionTimeType === 'END_WITH' &&
                  tabItem.fieldsForm.conditionValue) ||
                (tabItem.fieldsForm.conditionTimeType === 'BETWEEN' &&
                  tabItem.fieldsForm.conditionTimeTypeBetween.start &&
                  tabItem.fieldsForm.conditionTimeTypeBetween.end)
            }
          } else {
            if (tabItem.type === 'STRING') {
              valid = tabItem.fieldsForm.emuneCondition
            } else if (tabItem.type === 'DATE') {
              valid = tabItem.fieldsForm.conditionValue
            }
          }
        }
        //添加tab没有选择值
        if (!(tabItem.datasetTableFieldName || tabItem.fieldsForm.datasetTableFieldName))
          valid = false

        if (!valid) {
          ElMessage.warning('请填入过滤条件')
          showItems.value = true
          return
        } else {
          props.tableTabActions.map((item) => {
            if (item.isAmount)
              return Object.assign(item, { amount: filterTermSelf.value.tabList.length })
            return item
          })
          showItems.value = false
        }
      })
    } else {
      props.tableTabActions.map((item) => {
        if (item.isAmount)
          return Object.assign(item, { amount: filterTermSelf.value.tabList.length })
        return item
      })
      showItems.value = false
    }

    //过滤操作后，要将对应引用节点加上标志
    const tabList = filterTermSelf.value.tabList
    let allReferenceTable = []
    let allReferenceField = []
    tabList.forEach((item) => {
      allReferenceTable.push(item.datasetTableName)
      allReferenceField.push(item.datasetTableFieldName)
    })
    const referenceTable = new Set(allReferenceTable)
    const referenceField = allReferenceField

    let referenceNodes = []
    referenceField.forEach((item) => {
      findNodesByName(treeData.value, item, referenceNodes)
    })
    if (referenceNodes?.length) {
      referenceNodes.forEach((node) => {
        Object.assign(node, { filterReference: 1 }) //被引用reference:1
      })
      // 将该节点的reference同步给拖拽表
      referenceTable.forEach((item) => {
        const targetNode = findNodeByNameOrId(dragItems.value, item)
        if (targetNode) {
          targetNode.fields.forEach((item) => {
            referenceNodes.forEach((element) => {
              if (item.originName === element.originName) {
                Object.assign(item, { ...element })
              }
            })
          })
        }
      })
    }
    const tabListDeepClone = filterTermSelf.value.tabListDeepClone
    //tabList是本次过滤条件，tabListDeepClone是上次过滤条件
    //tabList项设置了reference:1,找到tabListDeepClone中存在而tabList中不存在的项reference:0
    let difference = [] //用来去掉引用
    if (tabListDeepClone.length > 0) {
      if (tabList.length > 0 && tabList.length < tabListDeepClone.length) {
        tabList.forEach((tabItem) => {
          const diff = tabListDeepClone.filter((cloneItem) => tabItem.name !== cloneItem.name)
          difference = difference.concat(diff)
        })
      } else if (
        (tabList.length > 0 && tabList.length === tabListDeepClone.length) ||
        tabList.length <= 0
      ) {
        difference = difference.concat(tabListDeepClone)
      }
    }
    if (difference.length > 0) {
      let referenceTable = []
      //预览树
      let referenceNodes = []
      difference.forEach((item) => {
        referenceTable.push(item.datasetTableName)
        findNodesByName(treeData.value, item.name, referenceNodes)
      })
      if (referenceNodes?.length) {
        referenceNodes.forEach((node) => {
          Object.assign(node, { filterReference: 0 }) //被引用reference:1
        })
        // 将该节点的reference同步给拖拽表
        const referenceTableSet = new Set(referenceTable)
        referenceTableSet.forEach((item) => {
          const targetNode = findNodeByNameOrId(dragItems.value, item)
          if (targetNode) {
            targetNode.fields.forEach((item) => {
              referenceNodes.forEach((element) => {
                if (item.originName === element.originName) {
                  Object.assign(item, { ...element })
                }
              })
            })
          }
        })
      }
    }
  }
}
const clickCancel = () => {
  contentTypeData.value = null
  showItems.value = false
  if (props.contentType === 'filterItem') {
    tabList.value = filterTermSelf.value.tabListDeepClone
  } else if (props.contentType === 'dimension') {
    contentTypeData.value = groupDimensionSelf.value.detailDataDeepClone
  }
}

const filterTermSelf = ref(null)
const isDisabled = ref(true)
watch(
  () => ({
    addFieldSelf: addFieldSelf.value?.disabled,
    groupDimensionSelf: groupDimensionSelf.value?.disabled,
    filterTermSelf: filterTermSelf.value?.disabled
  }),
  (newValue) => {
    const { addFieldSelf, groupDimensionSelf } = newValue
    if (props.contentType === 'fieldItem') isDisabled.value = addFieldSelf
    else if (props.contentType === 'dimensionItem') isDisabled.value = groupDimensionSelf
    else if (props.contentType === 'filterItem') isDisabled.value = false
  }
)

const collectFolderChildren = (tree) => {
  return tree.reduce((flattened, node) => {
    if (node.datasetTableFieldType === 'FOLDER' && Array.isArray(node.children)) {
      return flattened
        .concat(collectFolderChildren(node.children))
        .filter((item) => item.checked === 0)
    } else {
      if (Array.isArray(node.children)) {
        node.children = collectFolderChildren(node.children)
      }
      return flattened.concat(node)
    }
  }, [])
}

const columnTreeData = ref(null)
watchEffect(() => {
  columnTreeData.value = collectFolderChildren(JSON.parse(JSON.stringify(treeData.value)))
})

const previewError = ref(null)
const previewTableDatas = ref(props.previewTableDatas || [])
watchEffect(() => {
  previewTableDatas.value = props.previewTableDatas
})

defineExpose({
  showItems
})
</script>
<style lang="scss" scoped>
:deep(.sql-modalclass) {
  .el-drawer__body {
    width: 100%;
    padding: size(16);
  }
}
:deep(.drag-content[none]) {
  pointer-events: none;
  .drag-content[none] *:not([allowdrop]) {
    pointer-events: none;
  }
  .drag-content[none] *[allowdrop] {
    pointer-events: auto;
  }
  .drag-content[none] .content {
    background: red;
  }
}
:deep(.gx-dialog-mask) {
  .gx-dialog__content {
    color: #333;
    display: flex;
    .dialog-content__alert {
      position: absolute;
      top: -100px;
    }
  }
}
.edit-dialog {
  :deep(.gx-dialog-mask) {
    .gx-dialog__content {
      color: #333;
      display: flex;
      .dialog-content__alert {
        position: absolute;
        top: -100px;
      }
      .el-select__selected-item.el-select__placeholder {
        color: #333;
      }
    }
  }
}
:deep(.upload-dataset-drawer) {
  .el-drawer__body {
    height: 100%;
    .advanced {
      height: calc(100% - 248px);
      .table-list.table {
        height: calc(100% - 118px);
        max-width: 784px;
      }
    }
    .gx-actions {
      justify-content: flex-end;
    }
  }
}
.info-block {
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    height: size(80);
    padding: size(20) size(24) size(20) size(32);
    background-color: #222f48;
    &-item {
      flex: 1;
      display: flex;
      &.title {
        img {
          width: size(34);
          height: size(40);
          padding-right: size(16);
        }
        span {
          font-family: PangMenZhengDao3;
          font-size: size(40);
          color: #fff;
          text-shadow: 0 size(1) size(7) rgba(23, 98, 241, 0.91);
          justify-content: flex-start;
        }
        .sql-title {
          font-size: $title-text-color;
          width: size(250);
          height: size(40);
          line-height: size(40);
          color: #fff;
          justify-content: flex-start;
          align-items: center;
          flex: 1;
        }
        .iconfont {
          &:hover {
            cursor: pointer;
            color: $theme-text-color;
          }
        }
        .el-input {
          max-width: size(250);
          :deep(.el-input__wrapper) {
            background: black;
            box-shadow: none;
            .el-input__inner {
              color: white;
            }
          }
        }
      }
      &.user {
        justify-content: flex-end;
        align-items: center;
        .avatar {
          display: flex;
          align-items: center;
          img {
            padding-right: size(8);
            border-radius: 50%;
          }
          span {
            color: #fff;
            font-family: SourceHanSansCN Regular;
            font-size: size(14);
          }
        }
        .question {
          padding: 0 size(16);
        }
      }
    }
    .sql-options {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: size(16);
      .iconfont {
        color: #a8abb2;
      }
      .start span {
        color: #fff;
      }
    }
  }
  .body {
    position: absolute;
    width: 100%;
    height: calc(100% - size(80));
    display: flex;
    .modalClass {
      background: transparent;
    }
    .drawer {
      width: size(320);
      height: 100%;
      background: #f5f7fa;
      padding: size(16);
      &-title {
        min-height: size(65);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: size(16) 0;
        .title {
          @include plain-text;
          color: #909399;
        }
      }
      //sql创建表
      .sql {
        &-options {
          padding: size(4) 0;
          &:hover {
            background: rgba(51, 51, 51, 0.14);
          }
        }
        .iconfont {
          margin-right: size(8);
        }
        span:hover {
          cursor: pointer;
        }
      }
      &-tab {
        height: calc(100% - size(110));
        .gx-tabs {
          border-bottom: 1px solid #dcdfe6;
        }
        :deep(.gx-tabs__item) {
          padding: 0;
          .title__name {
            padding: 0;
          }
        }
        &__title {
          //上传文件图标
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-end;
          order: 1;
          .iconfont:hover {
            cursor: pointer;
            color: $theme-text-color;
          }
        }
        &-search {
          //搜索框
          :deep(.el-input__wrapper) {
            box-shadow: unset;
            background: transparent;
            border-radius: 0;
            border-bottom: 1px solid #dcdfe6;
          }
          .iconfont.icon-refresh-right {
            &:hover {
              cursor: pointer;
            }
          }
        }
        .file-list {
          display: flex;
          flex: 1;
          height: calc(100% - size(62));
          &::-webkit-scrollbar {
            display: none;
          }
          &s {
            flex: 1;
            padding-left: 0;
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            li {
              list-style: none;
              display: flex;
              min-width: size(288);
              justify-content: space-between;
              padding: size(6) 0;
              cursor: pointer;
              user-select: none;
              .li-name {
                flex: 1;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                span:first-child {
                  padding-right: size(8);
                }
                span:last-child {
                  display: inline;
                }
                &.icon-highlight {
                  color: $theme-complementary-color;
                }
              }
              .li-option {
                display: none;
                span:first-child {
                  padding-right: size(8);
                }
                span:hover {
                  color: $theme-text-color;
                  cursor: pointer;
                }
              }
              &:hover .li-option {
                display: block;
              }
              &:hover {
                background: rgba(51, 51, 51, 0.14);
                cursor: pointer;
              }
            }
          }
          .hint {
            width: 100%;
            text-align: center;
            padding-top: size(20);
            color: #777;
          }
        }
      }
    }
    .drag-table {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      &.open-left-drawer {
        max-width: calc(100% - size(320));
      }
      &.close-left-drawer {
        max-width: calc(100% - size(40));
      }
      .drag {
        height: 50%;
        background: #e6e8eb;
        padding: size(48) size(79);
        &-content {
          //width: 100%;
          height: 100%;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: auto;
          &.over {
            background: #fff;
            outline: 1px dotted #333;
          }
          &::-webkit-scrollbar {
            display: none;
          }

          .drag__tip {
            margin: 0 auto;
            position: relative;
            top: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #909399;
          }
          .drag__tip-plus {
            position: absolute;
            display: flex;
            flex: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .has-solid-block {
            position: absolute;
          }
          .has-dashed-item {
            position: absolute;
            left: size(231);
          }
        }
        :deep(.el-overlay) {
          .rtl.open {
            min-width: size(496) !important;
            width: unset !important;
          }
        }

        :deep(.el-drawer__header) {
          margin-bottom: 0;
          .fileds__title {
            padding-bottom: 16px;
            border-bottom: 1px solid #dcdfe6;
            .title {
              @include plain-text;
              display: inline-flex;
            }
            .origin {
              padding: size(16) 0;
            }
          }
        }
      }
      .table {
        height: 50%;
        background: $dialog-color;
        border-radius: 0px 0px 4px 0px;
        border: 1px solid #dcdfe6;
        flex: 1;
        .table-tab {
          border-radius: 0px;
          border-bottom: 1px solid #dcdfe6;
          background: #f5f7fa;
        }
        .table-tab__title {
          order: 1;
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          margin-right: size(10);
          min-width: 0;
          .el-input {
            max-width: size(242);
            max-height: size(30);
            margin-right: size(16);
            min-width: 0;
          }
        }
        .preview {
          height: calc(100% - size(40));
          display: flex;
          &-tree {
            min-width: size(264);
            border-right: size(1) solid $input-border-color;
            overflow: auto;
            &::-webkit-scrollbar {
              //树结构滚动条
              display: none;
            }
            .el-tree {
              height: 100%;
            }
          }
          &-table {
            height: 100%;
            overflow: auto;
            flex: 1;
            .action {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .el-table {
              height: 100%;
              .el-table__body-wrapper {
                height: calc(100% - 126px);
                overflow: auto;
              }
            }
            .text {
              display: inline-block;
              width: 200px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .batch {
          height: calc(100% - size(80));
          &-table {
            height: 100%;
            :deep(.table-container) {
              height: 100%;
              overflow-x: unset;
              .el-table--fit {
                height: 100%;
                overflow: auto;
              }
            }
          }
        }
      }
      .relate {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: size(8);
        .is-relate {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: calc(100% - 30px);
          .relate-table {
            width: 100%;
            height: 50%;
            border-top: size(1) solid $input-border-color;
            border-bottom: size(1) solid $input-border-color;
            padding: size(16) 0;
            display: flex;
            gap: size(16);
            &__left {
              @include plain-text;
              min-width: 0;
              display: flex;
              flex-direction: column;
              flex: 1;
              gap: size(16);
              .title {
                display: block;
              }
              .filter {
                padding: size(16) 0;
                color: #606266;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-input {
                  width: size(178);
                  height: size(29);
                }
              }
              .table {
                // height: size(460);
                height: calc(100% - 118px);
                .el-table--fit {
                  height: 100%;
                }
              }
            }
          }
          .relate-fields {
            height: 50%;
            border-top: size(1) solid $input-border-color;
            border-bottom: size(1) solid $input-border-color;
            padding-top: size(16);
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: size(16);
            .filter {
              width: 100%;
              height: size(32);
              display: flex;
              justify-content: space-between;
              .header-left {
                width: 55%;
              }
              .header-right {
                width: 45%;
                display: flex;
                gap: size(16);
                justify-content: flex-end;
                .add-fields {
                  padding-left: size(4);
                }
              }
            }
            .table {
              .el-table--fit {
                height: 100%;
                .icon-delete {
                  &:hover {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
        .detail-fileds {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: calc(100% - 200px);
          padding-bottom: size(16);
          .content-search {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: size(16);
            .el-input {
              max-width: 260px;
            }
          }
          .content-table {
            overflow: auto;
          }
        }

        .close {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    .options {
      color: #a8abb2;
      &:hover {
        cursor: pointer;
      }
      .iconfont.icon-edit-outline {
        margin-right: size(32);
      }
    }
  }
}
</style>
