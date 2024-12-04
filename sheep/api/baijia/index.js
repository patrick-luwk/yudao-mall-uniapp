import { baseUrl, apiPath, tenantId } from '@/sheep/config';
import request from '@/sheep/request';


// 大路数据 API
const BigroadApi = {
  // 查询大路数据分页
  getBigroadPage:  (params) => {
    return request({
      url: '/bjl/bigroad/page',
      method: 'GET',
      params
    });
  },
  // 查询投资数据分页
  getBigroadBidRecordPage:  (params) => {
    return request({
      url: '/bjl/bid-record/page',
      method: 'GET',
      params
    });
  },

  getBigroadUserSummary:  (params) => {
    return request({
      url: '/bjl/bigroad/summary',
      method: 'GET',
      params
    });
  },

  // 查询大路数据详情
  getBigroad:  (id) => {
    return request({
      url: `/bjl/bigroad/get?id=` + id,
      method: 'GET'
    });
  },

  // 新增大路数据
  createBigroad:  (data) => {
    return request({
      url: `/bjl/bigroad/create`,
      method: 'POST',
      data
    });
  },

  
  // 上传大路数据列表
  addBigroad:  (id,odd) => {
    return request({
      url: `/bjl/bigroad/add?id=${id}&&isOdd=${odd}`,
      method: 'GET'
    });
},

}
export default BigroadApi