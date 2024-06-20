import { defineAsyncComponent } from 'vue'

import {
  defineConfigKey,
  defineInput,
  defineInputNumber,
  defineTextWrapper,
  defineColorPicker,
  defineCheckboxWrapper,
  defineCustom
} from '../../../utils'

import { DashboardApi } from '../../DashboardInterface'

type Material = {
  url: string
  thumbnail: string
}

export const DashboardTopMaterial: Record<
  'TECHNOLOGY_ONE' | 'TECHNOLOGY_TWO' | 'ACTIVITY_ONE' | 'ACTIVITY_TWO',
  Material
> = {
  TECHNOLOGY_ONE: {
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01gVBrzU1mz2fMPWsOZ_!!6000000005024-49-tps-1440-600.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN01yTT5141x9hu1Wucw5_!!6000000006401-2-tps-60-24.png'
  },
  TECHNOLOGY_TWO: {
    url: 'https://img.alicdn.com/imgextra/i1/O1CN013Mc5sD1sfhddIQipI_!!6000000005794-49-tps-1440-600.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i3/O1CN01sHLsUT1NyhptXSrx7_!!6000000001639-2-tps-60-24.png'
  },
  ACTIVITY_ONE: {
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01KG7ALK1metEyRYrI9_!!6000000004980-49-tps-1440-600.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i1/O1CN01Kzlaez1aPWPsAVISP_!!6000000003322-2-tps-60-24.png'
  },
  ACTIVITY_TWO: {
    url: 'https://img.alicdn.com/imgextra/i4/O1CN013d6cza1h9gAeGuk9E_!!6000000004235-49-tps-1440-600.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i3/O1CN01RR1nQj1K4siEeWzBG_!!6000000001111-2-tps-60-24.png'
  }
}
export const DashboardBackgroundMaterial: Record<
  'STARRY_ONE' | 'STARRY_TWO' | 'LIGHT' | 'ACTIVITY',
  Material
> = {
  STARRY_ONE: {
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01BWUd0l1Em2UCZvABl_!!6000000000393-49-tps-1440-3000.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i1/O1CN01Bx5FeT1PuFCxRZ2fn_!!6000000001900-2-tps-60-24.png'
  },
  STARRY_TWO: {
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01g4ChXZ1NO4IaZDmKu_!!6000000001559-49-tps-1440-3000.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i1/O1CN018iB7la1qOB6WNv0qN_!!6000000005485-2-tps-60-24.png'
  },
  LIGHT: {
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01z3odbU1zwplAXRGqz_!!6000000006779-49-tps-1440-3000.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN012Cmupo1S1gsiwfO5c_!!6000000002187-2-tps-60-24.png'
  },
  ACTIVITY: {
    url: 'https://img.alicdn.com/imgextra/i2/O1CN0106bA7u1NIZXxQ8Ov3_!!6000000001547-49-tps-1440-3000.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i2/O1CN01XgRvVb1tgRkcLAtd5_!!6000000005931-2-tps-60-24.png'
  }
}
export const DashboardBottomMaterial: Record<
  'TECHNOLOGY_ONE' | 'TECHNOLOGY_TWO' | 'ACTIVITY_ONE' | 'ACTIVITY_TWO',
  Material
> = {
  TECHNOLOGY_ONE: {
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01yQaXOe1zkT4NldTmV_!!6000000006752-49-tps-1440-400.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i1/O1CN01cuPMWX1neiYuIsG4x_!!6000000005115-2-tps-60-24.png'
  },
  TECHNOLOGY_TWO: {
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01QYsO5J1bZQkHBmqGo_!!6000000003479-49-tps-1440-400.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i3/O1CN01aSnIIy1oPtMAjkPMJ_!!6000000005218-2-tps-60-24.png'
  },
  ACTIVITY_ONE: {
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01N3gBwC23opIdBBiSX_!!6000000007303-49-tps-1440-400.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i3/O1CN01YBbmBC1KgtaXR6dfo_!!6000000001194-2-tps-60-24.png'
  },
  ACTIVITY_TWO: {
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01TNdWM21KMHub5xLfx_!!6000000001149-49-tps-1440-400.webp',
    thumbnail:
      'https://img.alicdn.com/imgextra/i4/O1CN01df84s81vh1TtOtfEb_!!6000000006203-2-tps-60-24.png'
  }
}

export const dashboardTopMaterials: Array<Material> = [
  DashboardTopMaterial.TECHNOLOGY_ONE,
  DashboardTopMaterial.TECHNOLOGY_TWO,
  DashboardTopMaterial.ACTIVITY_ONE,
  DashboardTopMaterial.ACTIVITY_TWO
]
export const dashboardBackgroundMaterials: Array<Material> = [
  DashboardBackgroundMaterial.STARRY_ONE,
  DashboardBackgroundMaterial.STARRY_TWO,
  DashboardBackgroundMaterial.LIGHT,
  DashboardBackgroundMaterial.ACTIVITY
]
export const dashboardBottomMaterials: Array<Material> = [
  DashboardBottomMaterial.TECHNOLOGY_ONE,
  DashboardBottomMaterial.TECHNOLOGY_TWO,
  DashboardBottomMaterial.ACTIVITY_ONE,
  DashboardBottomMaterial.ACTIVITY_TWO
]

// [common] image picker
export const defineImagePicker = (
  wrapperKey: string,
  options: {
    materials?: Array<Material>
  } = {}
) => {
  const { materials = [] } = options

  return defineCustom({
    key: wrapperKey,
    label: '',
    component: defineAsyncComponent(() => import('./custom-components/image-picker.vue')),
    attributes: {
      materials,
      uploadApi: async (file: File) => await DashboardApi.uploadImage({ file: file })
    }
  })
}

// [common] bakground image
export const backgroundImageKeys = ['showImg', 'imgSrc']
export const defineBackgroundImage = (
  wrapperKey: string,
  options: {
    inline?: boolean
    label?: string
    materials?: Array<Material>
  } = {}
) => {
  const { inline = false, label = '叠加背景图片', materials = [] } = options

  const configKey = defineConfigKey(wrapperKey, backgroundImageKeys)

  return defineCheckboxWrapper({
    key: wrapperKey,
    checkboxKey: configKey.showImg,
    label,
    inline,
    children: [defineImagePicker(configKey.imgSrc, { materials })]
  })
}
export const getBackgroundImageConfigData = (
  wrapperKey: string,
  configStore: Record<string, any>
) => {
  const configKey = defineConfigKey(wrapperKey, backgroundImageKeys)
  const configWrapper = configStore?.[wrapperKey]
  const confgiData = {
    imgSrc: ''
  }

  if (configWrapper?.[configKey.showImg]) {
    confgiData.imgSrc = configWrapper?.[configKey.imgSrc] ?? ''
  }

  return confgiData.imgSrc
}

// [common] background
export const backgroundKeys = ['color', 'img']
export const defineBackground = (
  wrapperKey: string,
  options: {
    label?: string
    materials?: Array<Material>
  } = {}
) => {
  const { label = '背景', materials = [] } = options

  const configKey = defineConfigKey(wrapperKey, backgroundKeys)

  return defineTextWrapper({
    key: wrapperKey,
    label,
    inline: true,
    children: [
      defineColorPicker({
        key: configKey.color,
        label: ''
      }),
      defineBackgroundImage(configKey.img, {
        inline: true,
        materials
      })
    ]
  })
}
export const getBackgroundConfigData = (wrapperKey: string, configStore: Record<string, any>) => {
  const configKey = defineConfigKey(wrapperKey, backgroundKeys)
  const configWrapper = configStore?.[wrapperKey]
  const configData = {
    backgroundImage: '',
    backgroundColor: configWrapper?.[configKey.color] ?? ''
  }
  const backgroundImageConfigData = getBackgroundImageConfigData(configKey.img, configWrapper)

  if (backgroundImageConfigData) {
    configData.backgroundImage = backgroundImageConfigData
  }

  return configData
}

// [common] header and footer
export const footerItemKeys = [
  'comment',
  'showComment',
  'commentContent',
  'padding',
  'background',
  'backgroundHeight'
]
export const defineFooterItems = (
  wrapperKey: string,
  options: {
    materials?: Array<Material>
  } = {}
) => {
  const { materials = [] } = options
  const configKey = defineConfigKey(wrapperKey, footerItemKeys)

  return [
    defineCheckboxWrapper({
      key: configKey.comment,
      checkboxKey: configKey.showComment,
      label: '备注',
      children: [
        defineInput({
          key: configKey.commentContent,
          label: '备注内容',
          placeholder: '请输入备注内容',
          inline: true
        })
      ]
    }),
    defineInputNumber({
      key: configKey.padding,
      label: '与内容区边距',
      inline: true,
      suffix: 'px',
      attribute: {
        min: 0,
        max: 200
      },
      default: 10
    }),
    defineTextWrapper({
      key: configKey.background,
      label: '封面背景',
      flexColumn: true,
      children: [
        defineBackground(configKey.background, {
          materials
        }),
        defineInputNumber({
          key: configKey.backgroundHeight,
          label: '背景区域高度',
          inline: true,
          suffix: 'px',
          attribute: {
            min: 0,
            max: 100000
          },
          default: 200
        })
      ]
    })
  ]
}
export const getFooterItemsConfigData = (wrapperKey: string, configStore: Record<string, any>) => {
  const configKey = defineConfigKey(wrapperKey, footerItemKeys)
  const configWrapper = configStore
  const commentConfigWrapper = configWrapper?.[configKey.comment]
  const backgroundConfigWrapper = configWrapper?.[configKey.background]

  const configData = {
    comment: '',
    padding: `${configWrapper?.[configKey.padding] ?? 10}px`,
    height: `${backgroundConfigWrapper?.[configKey.backgroundHeight] ?? 200}px`,
    background: getBackgroundConfigData(configKey.background, backgroundConfigWrapper)
  }

  if (commentConfigWrapper?.[configKey.showComment]) {
    configData.comment = commentConfigWrapper?.[configKey.commentContent] ?? ''
  } else {
    configData.comment = ''
  }

  return configData
}

export const globalConfigKey = defineConfigKey('globalConfig', [
  'theme',
  'themeName',

  'globalStyle',
  'chartColorSchemes',
  'cardRadius',
  'cardSpacing',

  'pageLayout',
  'pageBackground',
  'pagePadding',
  'pageHeader',
  'pageHeaderTitle',
  'pageHeaderShowTitle',
  'pageHeaderTitleText',
  'pageHeaderLogo',
  'pageHeaderShowLogo',
  'pageHeaderLogoImgSrc',
  'pageHeaderLogoPosition',
  'pageHeaderAlign',
  'pageFooter',

  // dashboard
  'dashboardBckground',
  'dashboardBckgroundTop',
  'dashboardBckgroundBottom'
])
