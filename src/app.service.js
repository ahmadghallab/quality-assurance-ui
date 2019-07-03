import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'

axios.interceptors.request.use(function (config) {
    // const token = localStorage.getItem('token')
    config.headers.Authorization = 'Token 3c499018805bb43ffc9753f71112b671bd3990b3'
    // if (token) {
    //     config.headers.Authorization = `Token ${token}`
    // }
    return config
})

const appService = {
    listManagements () {
        return new Promise((resolve, reject) => {
            axios.get('/management')
                .then(response => {
                    resolve(response.data)
                }).catch(error => {
                    reject(error.response)
                })
        })
    },
    listDepartments () {
        return new Promise((resolve, reject) => {
            axios.get('/department')
                .then(response => {
                    resolve(response.data)
                }).catch(error => {
                    reject(error.response)
                })
        })
    },
    postCriterion (data) {
        return new Promise((resolve, reject) => {
          axios.post('/criterion', data)
            .then(response => {
              resolve(response.data)
            }).catch(response => {
              reject(response.status)
            })
        })
    },
}

export default appService
