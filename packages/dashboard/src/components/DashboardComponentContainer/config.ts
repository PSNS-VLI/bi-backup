import {
  deepAssign,
  defineConfigKey,
  defineCollapse,
  defineSubCollapse,
  defineRadioGroup,
  defineInput,
  defineInputNumber,
  defineSelect,
  defineColorPicker,
  defineTextStyle,
  defineTextWrapper,
  defineCheckboxWrapper
} from '../../utils'

export const CTConfigKey = defineConfigKey('componentContainer', [
  'titleAndCardConfig',
  // [title]
  'titleConfig',
  'titleConfigMainTitle',
  'titleConfigShowMainTitle',
  'titleConfigTitle',
  'titleConfigText',
  'titleConfigTextFontColor',
  'titleConfigTextFontSize',
  'titleConfigTextStyle',
  // [title] anchor
  'anchorConfig',
  'anchorConfigShowAnchor',
  'anchorConfigAnchorText',
  'anchorConfigAnchorAddress',
  'anchorConfigOpenMethod',
  // [title] split line
  'splitLineConfig',
  'splitLineConfigColor',
  'splitLineConfigWidth',
  // [title] state icon
  'stateIconConfig',
  'stateIconConfigDisplayMethod',
  'stateIconConfigIconColor',
  // comment
  'commentConfig',
  'commentConfigComment',
  'commentConfigShowComment',
  'commentConfigCommentContent',
  'commentConfigCommentPosition',
  'commentConfigEndnote',
  'commentConfigShowEndnote',
  'commentConfigEndnoteContent',
  // container
  'containerConfig',
  'containerConfigBackground',
  'containerConfigCustomBackground',
  'containerConfigBackgroundColor',
  'containerConfigBorderRadius'
])

export const defineComponentContainerConfig = (options?: { componentName?: string }) => {
  return defineCollapse({
    key: CTConfigKey.titleAndCardConfig,
    label: '标题与卡片',
    children: [
      defineSubCollapse({
        key: CTConfigKey.titleConfig,
        label: '标题',
        type: 'collapse',
        children: [
          defineCheckboxWrapper({
            key: CTConfigKey.titleConfigMainTitle,
            label: '显示主标题',
            checkboxKey: CTConfigKey.titleConfigShowMainTitle,
            children: [
              defineInput({
                key: CTConfigKey.titleConfigTitle,
                label: '标题',
                inline: true,
                default: options?.componentName
              }),
              defineTextWrapper({
                key: CTConfigKey.titleConfigText,
                label: '文本',
                inline: true,
                children: [
                  defineColorPicker({
                    key: CTConfigKey.titleConfigTextFontColor,
                    label: '',
                    inline: true
                  }),
                  defineInputNumber({
                    key: CTConfigKey.titleConfigTextFontSize,
                    label: '',
                    prefixIcon: 'icon-monitor',
                    suffix: 'px',
                    attribute: {
                      min: 14
                    },
                    inline: true
                  }),
                  defineTextStyle({
                    key: CTConfigKey.titleConfigTextStyle,
                    label: ''
                  })
                ]
              })
            ]
          }),
          defineCheckboxWrapper({
            key: CTConfigKey.anchorConfig,
            label: '展示链接跳转',
            checkboxKey: CTConfigKey.anchorConfigShowAnchor,
            children: [
              defineInput({
                key: CTConfigKey.anchorConfigAnchorText,
                label: '链接文案',
                tooltip: {
                  description: '建议按左侧宽度填写内容，超出将按…显示'
                },
                placeholder: '链接跳转',
                inline: true
              }),
              defineInput({
                key: CTConfigKey.anchorConfigAnchorAddress,
                label: '链接地址',
                placeholder: 'https://baidu.com',
                inline: true
              }),
              defineRadioGroup({
                key: CTConfigKey.anchorConfigOpenMethod,
                label: '弹出方式',
                options: [
                  {
                    label: '新窗口',
                    value: '_blank'
                  },
                  {
                    label: '弹窗',
                    value: '_popup'
                  },
                  {
                    label: '当前窗口',
                    value: '_self'
                  }
                ],
                inline: true,
                default: '_blank'
              })
            ]
          }),
          defineTextWrapper({
            key: CTConfigKey.splitLineConfig,
            label: '分割线',
            inline: true,
            children: [
              defineColorPicker({
                key: CTConfigKey.splitLineConfigColor,
                label: '',
                inline: true
              }),
              defineInputNumber({
                key: CTConfigKey.splitLineConfigWidth,
                label: '',
                prefixIcon: 'icon-monitor',
                suffix: 'px',
                attribute: {
                  min: 0
                },
                inline: true
              })
            ]
          }),
          defineCheckboxWrapper({
            key: CTConfigKey.stateIconConfig,
            label: '状态icon',
            children: [
              defineSelect({
                key: CTConfigKey.stateIconConfigDisplayMethod,
                label: '展示方式',
                options: [
                  {
                    label: '悬停显示',
                    value: 'hover'
                  },
                  {
                    label: '始终显示',
                    value: 'always'
                  }
                ],
                default: 'hover',
                inline: true
              }),
              defineColorPicker({
                key: CTConfigKey.stateIconConfigIconColor,
                label: '图标颜色',
                inline: true
              })
            ]
          })
        ]
      }),
      defineSubCollapse({
        key: CTConfigKey.commentConfig,
        label: '备注与尾注',
        type: 'collapse',
        children: [
          defineCheckboxWrapper({
            key: CTConfigKey.commentConfigComment,
            label: '备注',
            checkboxKey: CTConfigKey.commentConfigShowComment,
            children: [
              defineInput({
                key: CTConfigKey.commentConfigCommentContent,
                label: '备注内容',
                inline: true
              }),
              defineRadioGroup({
                key: CTConfigKey.commentConfigCommentPosition,
                label: '位置',
                options: [
                  {
                    label: '紧跟标题',
                    value: 'behind'
                  },
                  {
                    label: '图表上方',
                    value: 'top'
                  }
                ],
                default: 'behind',
                inline: true
              })
            ]
          }),
          defineCheckboxWrapper({
            key: CTConfigKey.commentConfigEndnote,
            checkboxKey: CTConfigKey.commentConfigShowEndnote,
            label: '尾注',
            children: [
              defineInput({
                key: CTConfigKey.commentConfigEndnoteContent,
                label: '尾注内容',
                inline: true
              })
            ]
          })
        ]
      }),
      defineSubCollapse({
        key: CTConfigKey.containerConfig,
        label: '组件容器',
        type: 'collapse',
        children: [
          defineCheckboxWrapper({
            key: CTConfigKey.containerConfigBackground,
            label: '自定义背景填充',
            checkboxKey: CTConfigKey.containerConfigCustomBackground,
            children: [
              defineColorPicker({
                key: CTConfigKey.containerConfigBackgroundColor,
                label: '卡片颜色',
                inline: true
              })
            ]
          }),
          defineInputNumber({
            key: CTConfigKey.containerConfigBorderRadius,
            label: '圆角',
            prefixIcon: 'icon-monitor',
            suffix: 'px',
            attribute: {
              min: 0
            },
            inline: true
          })
        ]
      })
    ]
  })
}

export const setCardRadius = (configStore: Record<string, any> = {}, cardRadius: number) => {
  deepAssign(configStore, {
    [CTConfigKey.titleAndCardConfig]: {
      [CTConfigKey.containerConfig]: {
        [CTConfigKey.containerConfigBorderRadius]: cardRadius
      }
    }
  })
}

export const getComponentContainerConfigData = (configStore: Record<string, any> = {}) => {
  const titleAndCardConfig = configStore[CTConfigKey.titleAndCardConfig]

  const titleConfig = titleAndCardConfig?.[CTConfigKey.titleConfig]

  const mainTitle = titleConfig?.[CTConfigKey.titleConfigMainTitle]
  const mainTitleStyle = mainTitle?.[CTConfigKey.titleConfigText]
  const anchorConfig = titleConfig?.[CTConfigKey.anchorConfig]
  const splitLineConfig = titleConfig?.[CTConfigKey.splitLineConfig]
  // const stateIconConfig = titleConfig?.[CTConfigKey.stateIconConfig]
  const commentAndEndnoteConfig = titleAndCardConfig?.[CTConfigKey.commentConfig]
  const commentConfig = commentAndEndnoteConfig?.[CTConfigKey?.commentConfigComment]
  const endNoteConfig = commentAndEndnoteConfig?.[CTConfigKey?.commentConfigEndnote]
  const containerConfig = titleAndCardConfig?.[CTConfigKey.containerConfig]

  const containerBackgroundConfig = containerConfig?.[CTConfigKey.containerConfigBackground]
  const containerStyle = {
    borderRadius: `${containerConfig?.[CTConfigKey.containerConfigBorderRadius] ?? 0}px`
  }
  if (containerBackgroundConfig) {
    Object.assign(containerStyle, {
      backgroundColor: containerBackgroundConfig?.[CTConfigKey.containerConfigCustomBackground]
        ? containerBackgroundConfig?.[CTConfigKey.containerConfigBackgroundColor]
        : ''
    })
  }

  const showTitle = mainTitle?.[CTConfigKey.titleConfigShowMainTitle]
  const showAnchor = anchorConfig?.[CTConfigKey.anchorConfigShowAnchor]
  const showComment = commentConfig?.[CTConfigKey.commentConfigShowComment]
  const commentPosition = commentConfig?.[CTConfigKey.commentConfigCommentPosition]
  const showEndnote = endNoteConfig?.[CTConfigKey.commentConfigShowEndnote]

  return {
    containerStyle,
    showHeader: showTitle || showAnchor || (showComment && commentPosition === 'top'),
    headerStyle: {
      borderBottomStyle: 'solid',
      borderBottomColor: splitLineConfig?.[CTConfigKey.splitLineConfigColor],
      borderBottomWidth: `${splitLineConfig?.[CTConfigKey.splitLineConfigWidth] ?? 1}px`
    },
    showTitle,
    title: mainTitle?.[CTConfigKey.titleConfigTitle] ?? '',
    showTooltip: showTitle && commentPosition === 'behind',
    titleStyle: {
      color: mainTitleStyle?.[CTConfigKey.titleConfigTextFontColor],
      fontSize: `${mainTitleStyle?.[CTConfigKey.titleConfigTextFontSize] ?? 14}px`,
      ...mainTitleStyle?.[CTConfigKey.titleConfigTextStyle],
      justifyContent:
        mainTitleStyle?.[CTConfigKey.titleConfigTextStyle]?.textAlign === 'center'
          ? 'center'
          : 'flex-start'
    },
    showAnchor,
    anchorAddress: anchorConfig?.[CTConfigKey.anchorConfigAnchorAddress],
    anchorOpenMethod: anchorConfig?.[CTConfigKey.anchorConfigOpenMethod],
    anchorText: anchorConfig?.[CTConfigKey.anchorConfigAnchorText] ?? '链接跳转',
    showComment,
    showHeaderComment: showComment && commentPosition === 'top',
    commentContent: commentConfig?.[CTConfigKey.commentConfigCommentContent],
    showEndnote,
    endNoteContent: endNoteConfig?.[CTConfigKey.commentConfigEndnoteContent]
  }
}
