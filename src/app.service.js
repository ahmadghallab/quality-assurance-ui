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
  editCriterion (data) {
      return new Promise((resolve, reject) => {
        axios.patch(`/criterion/${data.id}`, data)
          .then(response => {
            resolve(response.data)
          }).catch(response => {
            reject(response.status)
          })
      })
  },
  postDepartment (data) {
      return new Promise ((resolve, reject) => {
          axios.post('/department', data)
              .then(response => {
                  resolve(response.data)
              }).catch(response => {
                  reject(response.status)
              })
      })
  },
  editDepartment (data) {
      return new Promise((resolve, reject) => {
        axios.patch(`/department/${data.id}`, data)
          .then(response => {
            resolve(response.data)
          }).catch(response => {
            reject(response.status)
          })
      })
  },
  postManagement (data) {
    return new Promise((resolve, reject) => {
      axios.post('/management', data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  editManagement (data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/management/${data.id}`, data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  postUnit (data) {
      return new Promise((resolve, reject) => {
        axios.post('/unit', data)
          .then(response => {
            resolve(response.data)
          }).catch(response => {
            reject(response.status)
          })
      })
  },
  editUnit (data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/unit/${data.id}`, data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  retrieveUnit (unitId) {
    return new Promise((resolve, reject) => {
      axios.get(`/unit/${unitId}`)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  }
}

export default appService
