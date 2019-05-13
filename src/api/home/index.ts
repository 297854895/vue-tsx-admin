import {
  programStatis,
  moment,
  team
} from '@/mock/home'


// 获取项目统计信息
const getProgramStatis = async () => {
  // axios.get('/xxxx')
  await new Promise(reslove => {
    setTimeout(reslove, 2000)
  })
  return programStatis
}

// 获取动态信息
const getMoment = async () => {
  // axios.get('/xxx')
  await new Promise(reslove => {
    setTimeout(reslove, 2000)
  })
  return moment
}
// 获取团队信息
const getTeam = async () => {
  // axios.get('/xxx')
  await new Promise(reslove => {
    setTimeout(reslove, 2000)
  })
  return team
}

export default {
  getProgramStatis,
  getMoment,
  getTeam
}
