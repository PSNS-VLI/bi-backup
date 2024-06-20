import GxDialog from './GxDialog.vue'
import { h, render } from 'vue'

/**
 * 动态创建对话框组件，目前全局仅支持一个实例
 * @param props {{title: string, content: string, onClickConfirm: () => {}, onClickCancel: () => {}}} - GxDialog组件接受的属性对象
 */
const dialog = (props) => {
  const containerID = 'gx-dialog'
  const container = document.createElement('div')
  container.id = containerID
  const removeContainer = () => document.body.removeChild(container)
  render(
    h(
      GxDialog,
      Object.assign({}, props, {
        onClickConfirm: () => {
          typeof props.onClickConfirm === 'function' && props.onClickConfirm()
          removeContainer()
        },
        onClickCancel: () => {
          typeof props.onClickCancel === 'function' && props.onClickCancel()
          removeContainer()
        }
      })
    ),
    container
  )
  document.body.appendChild(container)
}

export default dialog
