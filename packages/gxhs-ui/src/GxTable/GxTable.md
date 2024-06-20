> **_author:_** yuhongliang **_createTime:_** 2023-08-08 17:41:13 **_updateTime_** 2024-01-26 11:37:14

# GxTable 列表

实现项目常用的列表逻辑

## API

### <a name="Attributes"> Attributes </a>

| 属性名          | 说明                                                                                                                                            | 类型                                                | 可选值     | 默认值 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------- | ------ |
| tableData       | 表格需要的数据，参考[el-table](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)                                    | Array                                               | --         | --     |
| tableColumns    | 控制列表列的类型                                                                                                                                | Array<[TableColumn](#TableColumn)>                  | --         | --     |
| tableIndex      | 控制列表是否开启索引列（已弃用）                                                                                                                | Boolean                                             | true/false | true   |
| tableOperations | 控制列表是否开启操作列（已弃用），参考[ActionList](../ActionList/ActionList.md#Action)                                                          | Array<[Action](../ActionList/ActionList.md#Action)> | --         | --     |
| tableRowNum     | 控制平分列表页的行的数量                                                                                                                        | Number                                              | --         | 5      |
| rowStyle        | 控制列表行的样式，参考[el-table Table 属性 row-style](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)             | Object                                              | --         | --     |
| headerRowStyle  | 控制头部行的样式，参考[el-table Table 属性 header-row-style](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)      | Object                                              | --         | --     |
| headerCellStyle | 控制表头单元格的样式，参考[el-table Table 属性 header-cell-style](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7) | Object                                              | --         | --     |

> TIPS: tableIndex/tableOperations 已经被弃用，在未来的更新中可能会被删除 2023-09-15

### <a name="Slots"> Slots </a>

| 插槽名                                                                 | 说明                                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [TableColumn.scopeName](#TableColumn)/[TableColumn.prop](#TableColumn) | [TableColumn.type](#TableColumn)为 custom 时接受的插槽，作用域参数为{ row, column, $index } |

### <a name="Events"> Events </a>

| 事件名          | 说明                                                                                                                     | 回调参数         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| operateTable    | 点击操作列的按钮时触发                                                                                                   | (e, row, $index) |
| selectionChange | 参考[el-table table-事件 selection-change](https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6) | (selection)      |
| select          | 参考[el-table table-事件 select](https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6)           | (selection, row) |
| selectAll       | 参考[el-table table-事件 select-all](https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6)       | (selection)      |

### <a name="Exposes"> Exposes </a>

| 属性名             | 说明                                                                                                                       | 类型                    | 描述                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| clearSelection     | 详见[el-table Table 方法 clearSelection](https://element-plus.org/zh-CN/component/table.html#table-%E6%96%B9%E6%B3%95)     | Function                | 用于多选表格，清空用户的选择                                                          |
| getSelectionRows   | 详见[el-table Table 方法 getSelectionRows](https://element-plus.org/zh-CN/component/table.html#table-%E6%96%B9%E6%B3%95)   | Function                | 返回当前选中的行                                                                      |
| toggleRowSelection | 详见[el-table Table 方法 toggleRowSelection](https://element-plus.org/zh-CN/component/table.html#table-%E6%96%B9%E6%B3%95) | Function(row, selected) | 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否 |
| toggleAllSelection | 详见[el-table Table 方法 toggleAllSelection](https://element-plus.org/zh-CN/component/table.html#table-%E6%96%B9%E6%B3%95) | Function                | 用于多选表格，切换全选和全不选                                                        |

### <a name="TableColumn"> TableColumn </a>

| 键名      | 说明                                                                             | 类型                                                                                                                                | 可选值                                          | 默认值                           |
| --------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| type      | 渲染的列类型                                                                     | String                                                                                                                              | index/img/custom/operation/input/select/operate | text                             |
| label     | 列表表头的 label                                                                 | String                                                                                                                              | --                                              | --                               |
| prop      | 列表绑定数据时的对应该列的 Key                                                   | String                                                                                                                              | --                                              | --                               |
| align     | 控制此列内容对齐方式                                                             | String                                                                                                                              | left/center/right                               | center                           |
| width     | 控制列表列的宽度                                                                 | String                                                                                                                              | --                                              | --                               |
| fixed     | 控制列表列是否在列表宽度超出的时候固定                                           | String                                                                                                                              | left/right                                      | --                               |
| children  | 控制嵌套列                                                                       | Array<[TableColumn](#TableColumn)>                                                                                                  | --                                              | --                               |
| prefix    | type=img 时控制图片地址的前缀(已弃用)                                            | String                                                                                                                              | --                                              | --                               |
| imgWidth  | type=img 时图片宽度                                                              | String                                                                                                                              | String                                          | --                               |
| imgHeight | type=img 时图片高度                                                              | String                                                                                                                              | String                                          | --                               |
| scopeName | type=custom 时作用域插槽名                                                       | String                                                                                                                              | --                                              | [TableColumn.prop](#TableColumn) |
| actions   | 此属性的最终产生值将被用作[ActionList](../ActionList/ActionList.md#Action)的参数 | Array<[Action](../ActionList/ActionList.md#Action)>/({ row, column, $index}) => Array<[Action](../ActionList/ActionList.md#Action)> | --                                              | --                               |

> TIPS: prefix 已经弃用，在未来的更新中可能会被删除 2023-09-15

> TIPS: actions被设计为可以是函数类型，以在用户期望根据表格数据动态调整按钮内容时发挥作用
