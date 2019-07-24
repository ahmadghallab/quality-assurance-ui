<template>
  <div>
    <div class="default-card">
      <h6 class="font-weight-bold mb-0">الاقسام والمعايير التابعه لها</h6> 
    </div>
    <Loader v-if="listDepartmentsLoader" />
    <div v-else>
      <div v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
        <div class="card__header border-bottom">
          <a href="javascript:void(0)"
            v-on:click="editDepartmentModal(department.id)" 
            class="font-weight-bold">{{ department.name }}
          </a>
          <Modal v-if="toggleEditDepartmentModal && selectedDepartment == department.id ">
            <div slot="body" class="default-card">
              <form v-on:submit.prevent="editDepartment(department.id, departmentIdx)">
                <div class="form-group">
                  <label for="departmentName">اسم القسم</label>
                  <input type="text"
                    id="departmentName"
                    autocomplete="off"
                    v-model="department.name" 
                    class="form-control"  
                    placeholder="+ أضف قسم">
                </div>
                <button type="submit" 
                  class="btn btn-primary btn-sm ml-2"
                  v-on:click="toggleEditDepartmentModal = false">حفظ</button>
                <button type="button" 
                  class="btn btn-light btn-sm"
                  v-on:click="toggleEditDepartmentModal = false">إلغاء</button>
              </form>
            </div>
          </Modal>
        </div>
        <div class="card__body light-highlight px-0 py-0">
          <div class="list list-lc" v-for="(criterion, criterionIdx) in department.criteria" v-bind:key="criterionIdx">
            <a href="javascript:void(0)" 
              class="font-weight-bold"
              v-on:click="editCriterionModal(criterion.id)">
              {{ criterion.name }}
            </a>
            <Modal v-if="toggleEditCriterionModal && selectedCriterion == criterion.id ">
              <div slot="body" class="default-card">
                <form v-on:submit.prevent="editCriterion(criterion.id, departmentIdx, criterionIdx)">
                  <div class="form-group">
                    <label for="departmentName">المعيار</label>
                    <input type="text"
                      id="criterionName"
                      autocomplete="off"
                      v-model="criterion.name" 
                      class="form-control"  
                      placeholder="+ المعيار">
                  </div>
                  <button type="submit" 
                    class="btn btn-primary btn-sm ml-2"
                    v-on:click="toggleEditCriterionModal = false">حفظ</button>
                  <button type="button" 
                    class="btn btn-light btn-sm"
                    v-on:click="toggleEditCriterionModal = false">الغاء</button>
                </form>
              </div>
            </Modal>
          </div>
        </div>
        <div class="card__footer border-top">
          <form v-on:submit.prevent="postCriterion(department.id, departmentIdx)">
            <div class="form-row">
              <div class="col">
                <input type="text"
                  v-model="criterionName[departmentIdx]"
                  autocomplete="off"
                  class="form-control"  
                  placeholder="+ أضف معيار">
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-sm btn-light">إنشاء</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="default-card">
        <form v-on:submit.prevent="postDepartment()">
          <div class="form-row">
            <div class="col">
              <input type="text" class="form-control"
                autocomplete="off"
                v-model="departmentName" 
                placeholder="+ أضف قسم">
            </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-sm btn-light">إنشاء</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from '../components/Loader.vue'
import Modal from '../components/Modal.vue'

export default {
  components: {
    Loader,
    Modal
  },
  data () {
    return {
      listDepartmentsLoader: true,
      toggleEditCriterionModal: false,
      toggleEditDepartmentModal: false,
      selectedCriterion: null,
      selectedDepartment: null,
      departmentName: null,
      criterionName: [],
      departments: []
    }
  },
  methods: {
    editCriterionModal(criterionId) {
      this.selectedCriterion = criterionId
      this.toggleEditCriterionModal = true
    },
    editDepartmentModal(departmentId) {
      this.selectedDepartment = departmentId
      this.toggleEditDepartmentModal = true
    },
    postCriterion(departmentId, departmentIdx) {
      appService.postCriterion({
        department: departmentId,
        name: this.criterionName[departmentIdx],
      })
      .then((data) => {
        this.criterionName[departmentIdx] = null
        this.departments[departmentIdx].criteria.push(data)
      }).catch(() => {
        //
      })
    },
    editCriterion(criterionId, departmentIdx, criterionIdx) {
      appService.editCriterion({
        id: criterionId,
        name: this.departments[departmentIdx].criteria[criterionIdx].name
      })
      .then((data) => {
        this.toggleEditCriterionModal = false
      })
    },
    postDepartment() {
      appService.postDepartment({name: this.departmentName})
        .then((data) => {
          this.departmentName = null
          this.departments.push(data)
        })
    },
    editDepartment(departmentId, departmentIdx) {
      appService.editDepartment({
        id: departmentId,
        name: this.departments[departmentIdx].name,
      })
      .then((data) => {
        this.toggleEditDepartmentModal = false
      })
    },
    listDepartments () {
      appService.listDepartments()
        .then(data => {
          this.departments = data
          this.listDepartmentsLoader = false
        })
    }
  },
  created () {
    this.listDepartments()
  }
}
</script>
