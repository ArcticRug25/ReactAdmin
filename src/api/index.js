import ajax from './ajax'


const BASE = '/api1'

export const reqLogin = (username, password) => ajax(BASE + '/login', {
    username,
    password
}, 'POST');

export const reqAddUser = user => ajax(BASE + '/manage/user/add', user, 'POST')

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {
    parentId
}, 'GET')

export const reqAddCategorys = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST')

export const reqUpdateCategorys = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {
    pageNum,
    pageSize
})

export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {
    categoryId
})

export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST')

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {
    name
}, "POST")

export const reqUploadImg = (file) => ajax(BASE + '/manage/img/upload',
    file, "POST");

export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

export const reqRoles = () => ajax(BASE + '/manage/role/list')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {
    roleName
}, 'POST')

export const reqWeather = () => ajax('/api2', {
    district_id: 420100,
    data_type: 'all',
    ak: 'NyKusAHEsSqCdselj4GwuXhv9Vqb4K5m'
}, 'GET')