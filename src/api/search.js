/**
 *  获取联想建议（自动补全）
 */
import request from '@/utils/request'

export const getSearchSuggestions = q => {
  return request({
   method: 'GET',
   url: '/app/v1_0/suggestion',
  params:{
    q
  }
  })
}


export const getSearchResult = params => {
  return request({
   method: 'GET',
   url: '/app/v1_0/search',
   params
  })
}