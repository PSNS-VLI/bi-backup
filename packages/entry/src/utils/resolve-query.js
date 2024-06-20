import { useRoute } from 'vue-router'

/**
 * 获取路由参数中的ID
 */
const resolveQueryId = () => {
  return useRoute().query
}

export default resolveQueryId
