<template>
  <div class="filter-item" v-if="props.contentType === 'filterItem'">
    <div class="item-left">
      <div class="item-title">
        <span>过滤字段项</span>
        <span class="iconfont icon-plus" @click="handlerAddFields"></span>
      </div>
      <div class="item-content">
        <el-tabs v-model="tabListValue" tab-position="left" @tab-change="handlerChangeTab">
          <el-tab-pane
            v-for="(tabItem, index) in tabList"
            :key="index"
            :label="tabItem.name"
            :name="tabItem.name"
          >
            <template #label>
              <el-select
                v-model="tabItem.name"
                @change="(e) => handlerTabSelect(e, index)"
                placeholder="请选择过滤字段"
                @visible-change="(e) => handlerOptions(e, tabItem.name)"
              >
                <el-option-group
                  v-for="(group, index) in flattenedTreeData"
                  :key="index"
                  :label="
                    `${group.name}` +
                    ' (' +
                    `${group.children.filter((item) => item.show).length}` +
                    ')'
                  "
                >
                  <el-option
                    v-for="item in group.children"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                    v-show="item.show"
                  >
                    <template #default>
                      <i :class="['iconfont', `${ICONMAP[item.type]}`]"></i>
                      <span>{{ item.name }}</span>
                    </template>
                  </el-option>
                </el-option-group>
              </el-select>
              <span class="iconfont icon-close" @click="handlerRemoveTab(tabItem, index)"></span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="item-right">
      <div class="string" v-if="tabValueContent === 'STRING' && tabList[tabIndex]">
        <el-form :model="tabList[tabIndex].fieldsForm" label-width="100px">
          <!-- 过滤方式 -->
          <el-form-item label="过滤方式">
            <el-radio-group
              v-model="tabList[tabIndex].fieldsForm.filterType"
              @change="handlerRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in filterTypeOptions"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 条件形式 -->
          <el-form-item
            label="条件形式"
            v-if="tabList[tabIndex].fieldsForm.filterType === 'CONDITION'"
          >
            <el-radio-group
              v-model="tabList[tabIndex].fieldsForm.conditionType"
              @change="handlerSubRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in conditionTypeOptions"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!--枚举条件形式-->
          <el-form-item
            label="查询方式"
            v-if="tabList[tabIndex].fieldsForm.filterType === 'ENUM_VALUE'"
          >
            <el-radio-group
              v-model="tabList[tabIndex].fieldsForm.conditionType"
              @change="handlerSubRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in fixedTypeOption"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!--条件 过滤条件 -->
          <el-form-item label="过滤条件">
            <el-input
              v-if="
                tabList[tabIndex].fieldsForm.filterType === 'CONDITION' &&
                tabList[tabIndex].fieldsForm.conditionType === 'SINGLE_CONDITION'
              "
              :disabled="
                tabList[tabIndex].fieldsForm.matchingType === 'IS_EMPTY' ||
                tabList[tabIndex].fieldsForm.matchingType === 'NOT_IS_EMPTY' ||
                tabList[tabIndex].fieldsForm.matchingType === 'EMPTY_TEXT' ||
                tabList[tabIndex].fieldsForm.matchingType === 'NOT_EMPTY_TEXT'
              "
              placeholder="字符或值"
              v-model="tabList[tabIndex].fieldsForm.conditionValue"
            >
              <template #prepend>
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionStringTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
              </template>
            </el-input>
            <!-- 或条件 -->
            <div
              class="alternation"
              v-if="
                tabList[tabIndex].fieldsForm.conditionType === 'OR_CONDITION' &&
                tabList[tabIndex].fieldsForm.filterType === 'CONDITION'
              "
              data-text="或"
            >
              <el-input
                :disabled="
                  tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType === 'IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType ===
                    'NOT_IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType === 'EMPTY_TEXT' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType ===
                    'NOT_EMPTY_TEXT'
                "
                placeholder="字符或值"
                v-model="tabList[tabIndex].fieldsForm.conditionValueOr.fir.conditionValue"
              >
                <template #prepend>
                  <el-select
                    v-model="tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType"
                    placeholder="请选择过滤条件"
                    @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                  >
                    <el-option-group v-for="(group, index) in optionStringTerm" :key="index">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </template>
              </el-input>
              <el-input
                :disabled="
                  tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType === 'IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType ===
                    'NOT_IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType === 'EMPTY_TEXT' ||
                  tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType ===
                    'NOT_EMPTY_TEXT'
                "
                placeholder="字符或值"
                v-model="tabList[tabIndex].fieldsForm.conditionValueOr.sec.conditionValue"
              >
                <template #prepend>
                  <el-select
                    v-model="tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType"
                    placeholder="请选择过滤条件"
                    @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                  >
                    <el-option-group v-for="(group, index) in optionStringTerm" :key="index">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </template>
              </el-input>
            </div>
            <!-- 且条件 -->
            <div
              class="alternation"
              v-if="tabList[tabIndex].fieldsForm.conditionType === 'AND_CONDITION'"
              data-text="且"
            >
              <el-input
                :disabled="
                  tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType === 'IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType ===
                    'NOT_IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType ===
                    'EMPTY_TEXT' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType ===
                    'NOT_EMPTY_TEXT'
                "
                placeholder="字符或值"
                v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.fir.conditionValue"
              >
                <template #prepend>
                  <el-select
                    v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType"
                    placeholder="请选择过滤条件"
                    @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                  >
                    <el-option-group v-for="(group, index) in optionStringTerm" :key="index">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </template>
              </el-input>
              <el-input
                :disabled="
                  tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType === 'IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType ===
                    'NOT_IS_EMPTY' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType ===
                    'EMPTY_TEXT' ||
                  tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType ===
                    'NOT_EMPTY_TEXT'
                "
                placeholder="字符或值"
                v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.sec.conditionValue"
              >
                <template #prepend>
                  <el-select
                    v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType"
                    placeholder="请选择过滤条件"
                    @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                  >
                    <el-option-group v-for="(group, index) in optionStringTerm" :key="index">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-option-group>
                  </el-select>
                </template>
              </el-input>
            </div>
            <!--            枚举 过滤条件-->
            <el-select
              v-if="
                tabList[tabIndex].fieldsForm.filterType === 'ENUM_VALUE' &&
                tabList[tabIndex].fieldsForm.conditionType === 'SINGLE_CONDITION'
              "
              v-model="tabList[tabIndex].fieldsForm.emuneCondition"
              placeholder="请选择字段"
              @visible-change="handlerSingleChange"
              clearable
            >
              <el-option
                v-for="item in EmuneOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-popover
              width="500"
              trigger="click"
              v-model:visible="isTransfer"
              @show="popoverShow"
            >
              <template #reference>
                <el-input
                  v-if="
                    tabList[tabIndex].fieldsForm.filterType === 'ENUM_VALUE' &&
                    tabList[tabIndex].fieldsForm.conditionType === 'OR_CONDITION'
                  "
                  v-model="tabList[tabIndex].fieldsForm.emuneCondition"
                  readonly
                ></el-input>
              </template>
              <transfer
                :filedsItem="filedsItem"
                :exitFields="exitFields"
                @handlerLeave="handlerLeave"
                @handleSearchChange="handleSearchChange"
              ></transfer>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <div class="time" v-if="DATEMAP.hasOwnProperty(tabValueContent) && tabList[tabIndex]">
        <el-form :model="tabList[tabIndex].fieldsForm" label-width="100px">
          <el-form-item label="过滤方式">
            <el-radio-group
              v-model="tabList[tabIndex].fieldsForm.filterType"
              @change="handlerRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in filterTimeOption"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="区间类型"
            v-if="tabList[tabIndex].fieldsForm.filterType === 'CONDITION'"
          >
            <el-radio-group
              v-if="tabList[tabIndex].fieldsForm.filterType === 'CONDITION'"
              v-model="tabList[tabIndex].fieldsForm.conditionTimeType"
              @change="handlerSubRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in fixedTimeTypeOption"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
            <el-radio-group
              v-else
              v-model="tabList[tabIndex].fieldsForm.conditionTimeType"
              @change="handlerRadioGroup(tabIndex)"
            >
              <el-radio
                v-for="option in fixedTimeTypeOption"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 过滤条件 -->

          <el-form-item label="过滤条件">
            <template
              v-if="
                tabList[tabIndex].fieldsForm.filterType === 'ENUM_VALUE' ||
                (tabList[tabIndex].fieldsForm.filterType === 'CONDITION' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BEGIN_WITH') ||
                tabList[tabIndex].fieldsForm.conditionTimeType === 'END_WITH'
              "
            >
              <div v-if="tabListFilterValue === 'year'">
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  type="year"
                  format="YYYY"
                  value-format="YYYY"
                  placeholder="Pick a year"
                />
              </div>
              <div v-if="tabListFilterValue === 'year-month'">
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  placeholder="Pick a month"
                />
              </div>
              <div v-if="tabListFilterValue === 'year-week'">
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  type="week"
                  format="YYYY-ww 周"
                  placeholder="Pick a week"
                />
              </div>
              <div v-if="tabListFilterValue === 'year-quarter'">
                <QuarterPicker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  format="YYYY-Q 季度"
                  placeholder="选择季度"
                ></QuarterPicker>
              </div>
              <div v-if="tabListFilterValue === 'year-month-day'">
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
              </div>
              <div v-if="tabListFilterValue === 'datetime'">
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  type="datetime"
                  placeholder="选择时间"
                />
              </div>
              <div v-if="tabListFilterValue === 'hour-minute'">
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间"
                />
              </div>
              <div v-if="tabListFilterValue === 'hour-minute-second'">
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  placeholder="选择时间"
                />
              </div>
              <div v-if="tabListFilterValue === 'hour'">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  placeholder="选择小时"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in hourOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </template>
            <div v-else>
              <template
                v-if="
                  tabListFilterValue === 'year' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  type="year"
                  format="YYYY"
                  value-format="YYYY"
                  placeholder="Pick a year"
                />
                ~
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  type="year"
                  format="YYYY"
                  value-format="YYYY"
                  placeholder="Pick a year"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'year-month' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  placeholder="Pick a month"
                />
                ~
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  placeholder="Pick a month"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'year-week' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  type="week"
                  format="YYYY-ww 周"
                  placeholder="Pick a week"
                />
                ~
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  type="week"
                  format="YYYY-ww 周"
                  placeholder="Pick a week"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'year-quarter' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <QuarterPicker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  format="YYYY-Q 季度"
                  placeholder="选择季度"
                ></QuarterPicker>
                ~
                <QuarterPicker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  format="YYYY-Q 季度"
                  placeholder="选择季度"
                ></QuarterPicker>
              </template>
              <template
                v-if="
                  tabListFilterValue === 'datetime' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  type="datetime"
                  placeholder="选择时间"
                />
                ~
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  type="datetime"
                  placeholder="选择时间"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'year-month-day' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
                ~
                <el-date-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'hour-minute' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  format="HH:mm"
                  :picker-options="{
                    selectableRange: '18:30 - 20:30'
                  }"
                  placeholder="选择时间"
                />
                ~
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  format="HH:mm"
                  :picker-options="{
                    selectableRange: '18:30 - 20:30'
                  }"
                  placeholder="选择时间"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'hour-minute-second' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  :picker-options="{
                    selectableRange: '18:30:00 - 20:30:00'
                  }"
                  placeholder="选择时间"
                />
                ~
                <el-time-picker
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  :picker-options="{
                    selectableRange: '18:30:00 - 20:30:00'
                  }"
                  placeholder="选择时间"
                />
              </template>
              <template
                v-if="
                  tabListFilterValue === 'hour' &&
                  tabList[tabIndex].fieldsForm.conditionTimeType === 'BETWEEN'
                "
              >
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.start"
                  placeholder="选择小时"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in hourOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                ~
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionTimeTypeBetween.end"
                  placeholder="选择小时"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in hourOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div
        class="num"
        v-if="
          (tabValueContent === 'DOUBLE' ||
            tabValueContent === 'INTEGER' ||
            tabValueContent === 'NUMBER') &&
          tabList[tabIndex]
        "
      >
        <el-form :model="tabList[tabIndex].fieldsForm" label-width="100px">
          <el-form-item label="条件形式">
            <el-radio-group
              v-model="tabList[tabIndex].fieldsForm.conditionType"
              @change="handlerRadioGroup(tabIndex, tabValueContent)"
            >
              <el-radio
                v-for="option in conditionTypeOptions"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="过滤条件">
            <template v-if="tabList[tabIndex].fieldsForm.conditionType === 'SINGLE_CONDITION'">
              <div style="display: flex">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionsNumTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
                <el-input-number
                  v-model="tabList[tabIndex].fieldsForm.conditionValue"
                  :disabled="
                    tabList[tabIndex].fieldsForm.matchingType === 'IS_EMPTY' ||
                    tabList[tabIndex].fieldsForm.matchingType === 'NOT_IS_EMPTY'
                  "
                  placeholder="数值"
                  controls-position="right"
                  @change="handleChange"
                />
              </div>
            </template>

            <div
              class="alternation"
              v-if="tabList[tabIndex].fieldsForm.conditionType === 'OR_CONDITION'"
              data-text="或"
            >
              <div style="display: flex">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionsNumTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
                <el-input-number
                  v-model="tabList[tabIndex].fieldsForm.conditionValueOr.fir.conditionValue"
                  :disabled="
                    tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType === 'IS_EMPTY' ||
                    tabList[tabIndex].fieldsForm.conditionValueOr.fir.matchingType ===
                      'NOT_IS_EMPTY'
                  "
                  placeholder="数值"
                  controls-position="right"
                  @change="handleChange"
                />
              </div>
              <div style="display: flex">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionsNumTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
                <el-input-number
                  v-model="tabList[tabIndex].fieldsForm.conditionValueOr.sec.conditionValue"
                  :disabled="
                    tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType === 'IS_EMPTY' ||
                    tabList[tabIndex].fieldsForm.conditionValueOr.sec.matchingType ===
                      'NOT_IS_EMPTY'
                  "
                  placeholder="数值"
                  controls-position="right"
                  @change="handleChange"
                />
              </div>
            </div>
            <div
              class="alternation"
              v-if="tabList[tabIndex].fieldsForm.conditionType === 'AND_CONDITION'"
              data-text="且"
            >
              <div style="display: flex">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionsNumTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
                <el-input-number
                  v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.fir.conditionValue"
                  :disabled="
                    tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType ===
                      'IS_EMPTY' ||
                    tabList[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType ===
                      'NOT_IS_EMPTY'
                  "
                  placeholder="数值"
                  controls-position="right"
                  @change="handleChange"
                />
              </div>
              <div style="display: flex">
                <el-select
                  v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType"
                  placeholder="请选择过滤条件"
                  @change="(val) => handleMatchingTypeChange(val, tabIndex)"
                >
                  <el-option-group
                    v-for="group in optionsNumTerm"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
                <el-input-number
                  v-model="tabList[tabIndex].fieldsForm.conditionValueAnd.sec.conditionValue"
                  :disabled="
                    tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType ===
                      'IS_EMPTY' ||
                    tabList[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType ===
                      'NOT_IS_EMPTY'
                  "
                  placeholder="数值"
                  controls-position="right"
                  @change="handleChange"
                />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import QuarterPicker from './QuarterPicker.vue'
import Transfer from './Transfer.vue'
import { ICONMAP, DATEMAP } from '../useInfoBlock'
import useInfoBlock from '../useInfoBlock'
import { defineProps, ref, computed, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
const { datasetApi } = api
const { optionsNumTerm, optionStringTerm } = useInfoBlock()

const props = defineProps({
  contentType: {
    //弹框类型
    type: String
  },
  options: {
    //预览树数据
    type: Array,
    required: true
  },
  filterParams: {
    type: Object
  }
})

const tabIndex = ref(null)
const tabValueContent = ref(null) //切换选中项的type
const tabListValue = ref(null) //tab下拉框选中的值
const tabListFilterValue = ref('') //()中的值
const fieldsForm = ref({
  //String
  filterType: 'ENUM_VALUE', //按条件过滤
  conditionType: 'SINGLE_CONDITION',
  matchingType: 'EQ', //匹配类型
  matchingTypeOr: 'EQ', //匹配类型
  matchingTypeAnd: 'EQ', //匹配类型
  conditionValue: '', //匹配值
  conditionValueOr: {
    fir: {
      matchingType: 'EQ',
      conditionValue: ''
    },
    sec: {
      matchingType: 'EQ',
      conditionValue: ''
    }
  }, //匹配值
  conditionValueAnd: {
    fir: {
      matchingType: 'EQ',
      conditionValue: ''
    },
    sec: {
      matchingType: 'EQ',
      conditionValue: ''
    }
  }, //匹配值
  filterConditionNumTypeOr: 'EQ', //条件形式
  filterConditionNumTypeAnd: 'EQ', //条件形式
  //time
  conditionTimeType: 'BEGIN_WITH', //区间类型--默认年区间
  conditionTimeTypeBetween: {
    start: '',
    end: ''
  },

  emuneCondition: '' //枚举 过滤条件
})

const hourOptions = Array.from({ length: 23 }, (_, index) => {
  const hour = index
  const paddedHour = hour < 10 ? `0${hour}` : hour.toString()
  return {
    label: paddedHour,
    value: paddedHour
  }
})
const filterTypeOptions = [
  { label: '按条件过滤', value: 'CONDITION' },
  { label: '按枚举过滤', value: 'ENUM_VALUE' }
]
const conditionTypeOptions = [
  //条件  条件形式
  { label: '单条件', value: 'SINGLE_CONDITION' },
  { label: '或条件', value: 'OR_CONDITION' },
  { label: '且条件', value: 'AND_CONDITION' }
]
const fixedTypeOption = [
  //枚举 条件形式
  { label: '单选', value: 'SINGLE_CONDITION' },
  { label: '多选', value: 'OR_CONDITION' }
]
const EmuneOptions = ref([])
// time类型的map
const filterTimeOption = ref([])
const fixedTimeTypeOption = [
  //枚举 条件形式
  { label: '开始于', value: 'BEGIN_WITH' },
  { label: '结束于', value: 'END_WITH' },
  { label: '时间区间', value: 'BETWEEN' }
]

// tabValueContent 的变化,更新视图label展示
watch(
  () => ({ tabValueChange: tabValueContent.value, tabSelectChange: tabListValue.value }),
  (newValue) => {
    const { tabValueChange, tabSelectChange } = newValue
    const regex = /\((.*?)\)/
    const tabSelectValue = tabSelectChange ? tabSelectChange.match(regex) : null
    if (tabSelectValue) {
      tabListFilterValue.value = tabSelectValue[1]
      switch (tabListFilterValue.value) {
        case 'year':
          filterTimeOption.value = [
            { label: '单年', value: 'ENUM_VALUE' },
            { label: '年区间', value: 'CONDITION' }
          ]
          break
        case 'year-month':
          filterTimeOption.value = [
            { label: '单月', value: 'ENUM_VALUE' },
            { label: '月区间', value: 'CONDITION' }
          ]
          break
        case 'year-week':
          filterTimeOption.value = [
            { label: '单周', value: 'ENUM_VALUE' },
            { label: '周区间', value: 'CONDITION' }
          ]
          break
        case 'year-quarter':
          filterTimeOption.value = [
            { label: '单季度', value: 'ENUM_VALUE' },
            { label: '季度区间', value: 'CONDITION' }
          ]
          break
        case 'year-month-day':
          filterTimeOption.value = [
            { label: '单日', value: 'ENUM_VALUE' },
            { label: '日区间', value: 'CONDITION' }
          ]
          break
        case 'hour':
          filterTimeOption.value = [
            { label: '单小时', value: 'ENUM_VALUE' },
            { label: '小时区间', value: 'CONDITION' }
          ]
          break
        case 'datetime':
          filterTimeOption.value = [
            { label: '单秒', value: 'ENUM_VALUE' },
            { label: '秒区间', value: 'CONDITION' }
          ]
          break
        case 'hour-minute':
          filterTimeOption.value = [
            { label: '单秒', value: 'ENUM_VALUE' },
            { label: '秒区间', value: 'CONDITION' }
          ]
          break
        case 'hour-minute-second':
          filterTimeOption.value = [
            { label: '单秒', value: 'ENUM_VALUE' },
            { label: '秒区间', value: 'CONDITION' }
          ]
          break
        default:
          break
      }
    }
  }
)

const handlerRadioGroup = (tabIndex, tabValueContent) => {
  if (tabValueContent) {
    tabList.value[tabIndex].fieldsForm.matchingType = 'EQ'
    tabList.value[tabIndex].fieldsForm.conditionValue = undefined
    tabList.value[tabIndex].fieldsForm.conditionValueOr = {
      fir: {
        matchingType: 'EQ',
        conditionValue: undefined
      },
      sec: {
        matchingType: 'EQ',
        conditionValue: undefined
      }
    }
    tabList.value[tabIndex].fieldsForm.conditionValueAnd = {
      fir: {
        matchingType: 'EQ',
        conditionValue: undefined
      },
      sec: {
        matchingType: 'EQ',
        conditionValue: undefined
      }
    }
  } else {
    Object.assign(tabList.value[tabIndex].fieldsForm, {
      conditionType: 'SINGLE_CONDITION',
      conditionTimeType: 'BEGIN_WITH',
      conditionValue: '', //匹配值
      conditionValueOr: {
        fir: {
          matchingType: 'EQ',
          conditionValue: ''
        },
        sec: {
          matchingType: 'EQ',
          conditionValue: ''
        }
      }, //匹配值
      conditionValueAnd: {
        fir: {
          matchingType: 'EQ',
          conditionValue: ''
        },
        sec: {
          matchingType: 'EQ',
          conditionValue: ''
        }
      },
      conditionTimeTypeBetween: {
        start: '',
        end: ''
      },
      emuneCondition: ''
    })
  }
}
const handlerSubRadioGroup = (tabIndex) => {
  Object.assign(tabList.value[tabIndex].fieldsForm, {
    conditionValue: '', //匹配值
    conditionValueOr: {
      fir: {
        matchingType: 'EQ',
        conditionValue: ''
      },
      sec: {
        matchingType: 'EQ',
        conditionValue: ''
      }
    }, //匹配值
    conditionValueAnd: {
      fir: {
        matchingType: 'EQ',
        conditionValue: ''
      },
      sec: {
        matchingType: 'EQ',
        conditionValue: ''
      }
    },
    conditionTimeTypeBetween: {
      start: '',
      end: ''
    },
    emuneCondition: ''
  })
}

//或、且条件中空文本-----值置空
const handleMatchingTypeChange = (val, tabIndex) => {
  const conditionType = tabList.value[tabIndex].fieldsForm.conditionType
  if (conditionType === 'OR_CONDITION') {
    const matchingTypeFir = tabList.value[tabIndex].fieldsForm.conditionValueOr.fir.matchingType
    const matchingTypeSec = tabList.value[tabIndex].fieldsForm.conditionValueOr.sec.matchingType
    if (
      matchingTypeFir === 'EMPTY_TEXT' ||
      matchingTypeFir === 'NOT_EMPTY_TEXT' ||
      matchingTypeFir === 'IS_EMPTY' ||
      matchingTypeFir === 'NOT_IS_EMPTY'
    ) {
      Object.assign(tabList.value[tabIndex].fieldsForm.conditionValueOr.fir, {
        conditionValue: undefined
      })
    }
    if (
      matchingTypeSec === 'EMPTY_TEXT' ||
      matchingTypeSec === 'NOT_EMPTY_TEXT' ||
      matchingTypeSec === 'IS_EMPTY' ||
      matchingTypeSec === 'NOT_IS_EMPTY'
    ) {
      Object.assign(tabList.value[tabIndex].fieldsForm.conditionValueOr.sec, {
        conditionValue: undefined
      })
    }
  } else if (conditionType === 'AND_CONDITION') {
    const matchingTypeFir = tabList.value[tabIndex].fieldsForm.conditionValueAnd.fir.matchingType
    const matchingTypeSec = tabList.value[tabIndex].fieldsForm.conditionValueAnd.sec.matchingType
    if (
      matchingTypeFir === 'EMPTY_TEXT' ||
      matchingTypeFir === 'NOT_EMPTY_TEXT' ||
      matchingTypeFir === 'IS_EMPTY' ||
      matchingTypeFir === 'NOT_IS_EMPTY'
    ) {
      Object.assign(tabList.value[tabIndex].fieldsForm.conditionValueAnd.fir, {
        conditionValue: undefined
      })
    }
    if (
      matchingTypeSec === 'EMPTY_TEXT' ||
      matchingTypeSec === 'NOT_EMPTY_TEXT' ||
      matchingTypeSec === 'IS_EMPTY' ||
      matchingTypeSec === 'NOT_IS_EMPTY'
    ) {
      Object.assign(tabList.value[tabIndex].fieldsForm.conditionValueAnd.sec, {
        conditionValue: undefined
      })
    }
  } else {
    if (val === 'EMPTY_TEXT' || val === 'NOT_EMPTY_TEXT') {
      Object.assign(tabList.value[tabIndex].fieldsForm, { conditionValue: undefined })
    }
  }
}

const isTransfer = ref(false)
const filedsItem = ref(null)
const exitFields = ref(null)
const popoverShow = () => {
  exitFields.value = tabList.value[tabIndex.value].fieldsForm.emuneCondition
  loadFieldData(tabList.value[tabIndex.value], 'emune')
}
const handlerLeave = (addItems) => {
  const copyText = JSON.parse(
    JSON.stringify(tabList.value[tabIndex.value].fieldsForm.emuneCondition)
  )
  if (!addItems) {
    tabList.value[tabIndex.value].fieldsForm.emuneCondition = copyText
    exitFields.value = copyText
  } else {
    tabList.value[tabIndex.value].fieldsForm.emuneCondition = addItems
  }
  isTransfer.value = false
}
const handleSearchChange = async (val) => {
  const fields = await loadFieldData(tabList.value[tabIndex.value], 'emune')
  if (val) {
    filedsItem.value = fields.filter((item) => item.includes(val))
  } else {
    filedsItem.value = fields
  }
}

const tabListDeepClone = cloneDeep(props.filterParams.filterConditions)

const tabList = ref(props.filterParams.filterConditions || []) //存储tab列表项

const handlerAddFields = () => {
  tabList.value.push({
    datasetTableName: '',
    datasetTableFieldName: '',
    datasetTableOriginName: '',
    type: '',
    fieldsForm: {
      ...fieldsForm.value
    }
  })
}
const options = computed(() => {
  return props.options.map((optionGroup) => ({
    ...optionGroup,
    children: optionGroup.children.map((optionItem) => ({
      ...optionItem,
      show: optionItem.dataType === 'MEASURE' ? optionItem.type === 'NUMBER' : true // 添加show: true属性
    }))
  }))
})

function flattenDeepestChildren(node) {
  function flatten(node) {
    if (!node.children) return node

    let deepestChildren = []
    node.children.forEach((child) => {
      const flattenedChild = flatten(child)
      if (flattenedChild.children) {
        deepestChildren = deepestChildren.concat(flattenedChild.children)
        delete flattenedChild.children
      } else {
        deepestChildren.push(flattenedChild)
      }
    })

    if (deepestChildren.length > 0) {
      node.children = deepestChildren.map((child) => ({
        ...child,
        show: true // 添加 show 属性为 true
      }))
    }

    return node
  }

  return flatten(node)
}
const flattenedTreeData = computed(() => {
  return options.value.map((rootNode) => flattenDeepestChildren({ ...rootNode }))
})

const handlerRemoveTab = (tabItem, index) => {
  if (tabList.value.length > 0) {
    tabList.value.splice(index, 1)
    // Object.assign(tabList.value[tabIndex.value], { fieldsForm: { ...fieldsForm.value } })
    tabListValue.value = null
  }
}
const handlerChangeTab = (tabValue) => {
  const selectedOption = flattenedTreeData.value
    .flatMap((optionGroup) => optionGroup.children)
    .find((option) => option.name === tabValue)
  if (selectedOption) {
    const { type, granularity } = selectedOption
    tabValueContent.value = granularity ? granularity : type
  } else {
    tabValueContent.value = null
  }
  const findIndex = (array, option) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === option?.name) {
        return i
      }
    }
    return -1 // 如果没有找到匹配的元素，返回 -1
  }
  tabIndex.value = findIndex(tabList.value, selectedOption)
}
// 选择字段变化后
const handlerTabSelect = (optionName, index) => {
  tabListValue.value = optionName
  // 找到选项对应的 type
  const selectedOption = flattenedTreeData.value
    .flatMap((optionGroup) => optionGroup.children)
    .find((option) => option.name === optionName)
  if (selectedOption) {
    //给当前选中项赋值
    // 当前选中项的index,给对应tabList赋值selectedOption
    // tabList.value[index] = selectedOption
    Object.assign(tabList.value[index], selectedOption, {
      datasetTableFieldName: selectedOption.name
    })
    const { type, granularity } = selectedOption
    tabValueContent.value = granularity ? granularity : type
  }
  const findIndex = (array, option) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === option?.name) {
        return i
      }
    }
    return -1 // 如果没有找到匹配的元素，返回 -1
  }
  tabIndex.value = findIndex(tabList.value, selectedOption)

  //右侧表单清空
  Object.assign(tabList.value[tabIndex.value].fieldsForm, {
    //String
    filterType: 'ENUM_VALUE', //按条件过滤
    conditionType: 'SINGLE_CONDITION',
    matchingType: 'EQ', //匹配类型
    matchingTypeOr: 'EQ', //匹配类型
    matchingTypeAnd: 'EQ', //匹配类型
    conditionValue:
      selectedOption.type === 'NUMBER' || selectedOption.type === 'INTEGER' ? undefined : '', //匹配值
    conditionValueOr: {
      fir: {
        matchingType: 'EQ',
        conditionValue:
          selectedOption.type === 'NUMBER' || selectedOption.type === 'INTEGER' ? undefined : ''
      },
      sec: {
        matchingType: 'EQ',
        conditionValue:
          selectedOption.type === 'NUMBER' || selectedOption.type === 'INTEGER' ? undefined : ''
      }
    }, //匹配值
    conditionValueAnd: {
      fir: {
        matchingType: 'EQ',
        conditionValue:
          selectedOption.type === 'NUMBER' || selectedOption.type === 'INTEGER' ? undefined : ''
      },
      sec: {
        matchingType: 'EQ',
        conditionValue:
          selectedOption.type === 'NUMBER' || selectedOption.type === 'INTEGER' ? undefined : ''
      }
    }, //匹配值
    filterConditionNumTypeOr: 'EQ', //条件形式
    filterConditionNumTypeAnd: 'EQ', //条件形式
    //time
    conditionTimeType: 'BEGIN_WITH', //区间类型--默认年区间
    conditionTimeTypeBetween: {
      start: '',
      end: ''
    },
    emuneCondition: '' //枚举 过滤条件
  })
}
function findItemByName(items, name) {
  for (const item of items) {
    if (item.name === name) {
      return item
    }

    if (item.children) {
      const found = findItemByName(item.children, name)
      if (found) {
        return found
      }
    }
  }
  return null
}
const handlerOptions = (visable, name) => {
  const selectedOption = findItemByName(flattenedTreeData.value, name)
  const activeName = tabList.value?.filter((item) => {
    if (item.datasetTableFieldName || item.fieldsForm.datasetTableFieldName) return item
  }) //所有选中的name

  if (selectedOption) {
    selectedOption.show = visable
  } else {
    const length =
      flattenedTreeData.value[0].children.length + flattenedTreeData.value[1].children.length
    flattenedTreeData.value.forEach((item) => {
      item.children.forEach((child) => {
        if (child.checked === 1) {
          child.show = false
        } else {
          if (activeName.length) {
            if (activeName.length !== length) {
              activeName.forEach((element) => {
                if (
                  element.datasetTableFieldName === child.name ||
                  element.fieldsForm.datasetTableFieldName === child.name
                ) {
                  child.show = false
                } else {
                  child.show = true
                }
              })
            }
          } else {
            child.show = true
          }
        }
      })
    })
  }
}
const convertTreeStructure = (dragItems) => {
  const convertNode = (node) => {
    const { datasourceId, id, name, type, unionToParent, originName, tableSql } = node
    const currentDst = {
      name,
      originName,
      datasourceId: datasourceId || id,
      type,
      tableSql: tableSql || null
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
                  field.parentDatasetTableOriginName ??
                  unionToParent.unionFields[0].parentDatasetTableOriginName
              }
            : field.parentField,
        currentField:
          typeof field.currentField === 'string'
            ? {
                name: field.currentField,
                datasetTableOriginName:
                  field.currentDatasetTableOriginName ??
                  unionToParent.unionFields[0].currentDatasetTableOriginName
              }
            : field.currentField
      }))
    }
    const result = {
      currentDst,
      childrenDst,
      unionToParent: unionToParent
        ? {
            unionType: unionToParent.unionType,
            unionFields
          }
        : {
            unionType: 'LEFT',
            unionFields
          }
    }
    return result
  }

  const treeUnion = dragItems.map(convertNode)
  return treeUnion // 包装在一个数组中，以满足所需的输出结构
}
const loadFieldData = async (currentTabData, type) => {
  const { dragItems } = props.filterParams
  //拖拽树
  const convertedTreeUnion = convertTreeStructure(dragItems)
  //所有字段
  let regex = /\(([^)]*)\)/
  const mergedAllFields = [{ ...currentTabData }]
    // .filter((item) => item.name === fieldsForm.value.fields)
    .map((child) => ({
      name: child.name,
      originName: child.originName,
      type: child.type || '',
      originType: child.originType,
      datasourceId: dragItems[0].datasourceId || dragItems[0].id,
      datasetId: null,
      datasetTableName: child.datasetTableName || null,
      datasetTableOriginName: child.datasetTableOriginName || child.datasetTableName || null,
      description: child.description || '',
      fieldAliasName: child.fieldAliasName || null,
      dataType: child.dataType || null,
      extraField: child.extraField || 0,
      checked: 0,
      datasetTableFieldType: child.type === 'FOLDER' ? 'FOLDER' : child.datasetTableFieldType, //是字段还是文件
      expression: child.expression || null,
      dataFormat: child.dataFormat || null,
      granularity:
        child.type === 'DATE' && child.name.includes('(') ? child.name.match(regex)[1] : '', //时间类型必填
      convertValue: null,
      aggregation: child.aggregation ? child.aggregation.toUpperCase() : null,
      children: child.children || null
    }))
  const result = await datasetApi.getFieldDataList.send({
    datasourceType: dragItems[0].type === 'SQL' ? currentDataSource.type : dragItems[0].type,
    treeUnion: convertedTreeUnion,
    allFields: mergedAllFields,
    filterConditions: []
  })
  let extractedValues = []
  if (result) {
    result?.fields.forEach((field) => {
      extractedValues = [...new Set(result.data.map((item) => item[field.fieldAliasName].value))]
    })
  }
  if (type === 'condition') {
    EmuneOptions.value = extractedValues.map((item) => {
      return {
        label: item,
        value: item
      }
    })
  } else if (type === 'emune') {
    filedsItem.value = extractedValues
    return extractedValues
  }
}
const convertNormalDate = (str, flag, conditionType) => {
  //-----------
  const weekFormatToDate = (weekStr) => {
    const parts = weekStr.split('-')
    const year = parseInt(parts[0])
    const week = parseInt(parts[1])

    const startOfYear = new Date(year, 0, 1)
    const firstWeekDay = startOfYear.getDay()
    const firstWeekStart = startOfYear.setDate(1 - firstWeekDay + 1)

    const weekStart = new Date(firstWeekStart)
    weekStart.setDate(weekStart.getDate() + (week - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return weekStart
    // return {
    //   start: weekStart,
    //   end: weekEnd
    // }
  }
  //---------
  const quarterFormatToDate = (quarterStr) => {
    const parts = quarterStr.split('-')
    const year = parseInt(parts[0])
    const quarter = parseInt(parts[1])

    const startMonth = (quarter - 1) * 3
    const date = new Date(year, startMonth, 1)
    date.setMonth(startMonth + 3, 0)

    return date
  }
  //---------年月日时分秒
  const timeFormatToDate = (timeStr) => {
    const [datePart, timePart] = timeStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hours, minutes, seconds] = timePart.split(':').map(Number)

    return new Date(year, month - 1, day, hours, minutes, seconds)
  }
  //------------年月 --value-format="YYYY-MM"不用转
  //------------时分秒不用转
  //------------时分不用转
  if (flag === 'year-week') {
    if (conditionType === 'BETWEEN') {
      return {
        start: weekFormatToDate(str[0].conditionValue).start,
        end: weekFormatToDate(str[0].conditionValue).end
      }
    } else {
      return weekFormatToDate(str[0].conditionValue)
    }
  } else if (flag === 'year-quarter') {
    if (conditionType === 'BETWEEN') {
      return {
        start: quarterFormatToDate(str[0].conditionValue),
        end: quarterFormatToDate(str[0].conditionValue)
      }
    } else {
      return quarterFormatToDate(str)
    }
  } else if (flag === 'datetime') {
    if (conditionType === 'BETWEEN') {
      return {
        start: timeFormatToDate(str[0].conditionValue),
        end: timeFormatToDate(str[1].conditionValue)
      }
    } else {
      return timeFormatToDate(str[0].conditionValue)
    }
  } else if (flag === 'year-month-day') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str
    }
  } else if (flag === 'year-month') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str[0].conditionValue
    }
  } else if (flag === 'hour') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str[0].conditionValue
    }
  } else if (flag === 'hour-minute') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str[0].conditionValue
    }
  } else if (flag === 'hour-minute-second') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str[0].conditionValue
    }
  } else if (flag === 'year') {
    if (conditionType === 'BETWEEN') {
      return {
        start: str[0].conditionValue,
        end: str[1].conditionValue
      }
    } else {
      return str[0].conditionValue
    }
  }
}

watch(
  () => props.filterParams.filterConditions,
  (n) => {
    // 遍历每一个过滤项，赋值
    if (n.length > 0) {
      n.forEach((item, index) => {
        const selectedOption = flattenedTreeData.value
          .flatMap((optionGroup) => optionGroup.children)
          .find((option) => option.name === item.fieldsForm.datasetTableFieldName)
        Object.assign(n[index], selectedOption)
        const { conditions, ...originFields } = item.fieldsForm
        if (conditions) {
          let convertConditions = {}
          if (item.type === 'DATE') {
            if (item.fieldsForm.conditionType === 'BETWEEN') {
              convertConditions = {
                conditionTimeTypeBetween: convertNormalDate(
                  conditions,
                  item.granularity,
                  item.fieldsForm.conditionType
                ),
                conditionTimeType:
                  item.fieldsForm.conditionType || item.fieldsForm.conditionTimeType,
                conditionType: '',
                conditionValue: ''
              }
            } else {
              convertConditions = {
                conditionValue:
                  item.fieldsForm.conditionValue ||
                  convertNormalDate(conditions, item.granularity, item.fieldsForm.conditionType),
                conditionTimeType: item.fieldsForm.conditionTimeType
              }
            }
          } else {
            convertConditions = {
              emuneCondition:
                item.fieldsForm.filterType === 'ENUM_VALUE'
                  ? item.fieldsForm.conditionType !== 'OR_CONDITION'
                    ? conditions[0].conditionValue
                    : item.fieldsForm.conditions.map((item) => item.conditionValue)
                  : '',
              conditionValue: conditions[0].conditionValue,
              matchingType: conditions[0].matchingType
            }
          }

          Object.assign(n[index].fieldsForm, convertConditions)
        }
      })
      tabIndex.value = 0
      tabValueContent.value = tabList.value[tabIndex.value]?.granularity
        ? tabList.value[tabIndex.value].granularity
        : tabList.value[tabIndex.value].type
      tabListValue.value = tabList.value[tabIndex.value].name
    }
  },
  {
    immediate: true
  }
)

//枚举---过滤条件---字段下的信息
const handlerSingleChange = (visable) => {
  if (visable) {
    const currentTabData = tabList.value[tabIndex.value]
    loadFieldData(currentTabData, 'condition')
  }
}
defineExpose({
  tabListDeepClone,
  tabList
})
</script>
<style lang="scss" scoped>
.filter-item {
  width: size(926);
  height: size(590);
  display: flex;
  justify-content: space-between;
  .item-left {
    width: size(240);
    height: size(590);
    border: size(1) solid #dcdfe6;
    display: flex;
    flex-direction: column;
    align-items: center;
    .item-title {
      width: size(224);
      height: size(22);
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        @include regular-text;
        font-size: $normal-text-size;
      }
      &:first-child {
        color: #606266;
      }
      .iconfont {
        color: $theme-text-color;
        font-weight: bold;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .item-content {
      height: calc(100% - size(22));
      width: size(238);
      overflow-y: auto;

      &::-webkit-scrollbar {
        /*高宽分别对应横竖滚动条的尺寸*/
        width: size(6);
        height: 0;
      }

      /*滚动条里面小方块*/
      &::-webkit-scrollbar-thumb {
        border-radius: size(10);
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        background: #ededed;
      }
      :deep(.el-tabs__header) {
        width: 100%;
        margin-right: 0;
      }
    }
    :deep(.el-tabs__item) {
      width: size(239);
      &:hover {
        background: aliceblue;
      }
    }
  }
  .item-right {
    width: size(670);
    height: size(590);
    border: size(1) solid #dcdfe6;
    //单条件
    :deep(.el-input.el-input-group.el-input-group--prepend) {
      max-width: size(400);
      .el-input-group__prepend {
        width: size(150);
        padding: size(0);
      }
    }
    .alternation {
      display: flex;
      flex-direction: column;
      gap: size(5);
      margin-left: size(60);
      &::before {
        content: attr(data-text);
        height: size(26);
        line-height: size(26);
        width: size(65);
        top: 50%;
        transform: translateY(-50%);
        left: size(15);
        border: size(1) dashed #000;
        border-right: none;
        position: absolute;
        color: #333;
      }
    }
  }
}
</style>
