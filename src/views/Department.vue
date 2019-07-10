<template>
  <div class="default-card">
    <Loader v-if="listDepartmentsLoader" />
    <ul class="list-unstyled" v-else>
      <li class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
        <a href="javascript:void(0)"
          v-on:click="editDepartmentModal(department.id)" 
          class="highlight font-weight-bold">{{ department.name }}
        </a>
        <Modal v-if="toggleEditDepartmentModal && selectedDepartment == department.id ">
          <div slot="body">
            <form v-on:submit.prevent="editDepartment(department.id, departmentIdx)">
              <div class="form-group">
                <label for="departmentName">Department Name</label>
                <input type="text"
                  id="departmentName"
                  autocomplete="off"
                  v-model="department.name" 
                  class="form-control"  
                  placeholder="+ add department">
              </div>
              <button type="submit" 
                class="btn btn-info btn-sm mr-2"
                v-on:click="toggleEditDepartmentModal = false">Save</button>
              <button type="button" 
                class="btn btn-light btn-sm"
                v-on:click="toggleEditDepartmentModal = false">Cancel</button>
            </form>
          </div>
        </Modal>
        <ul class="nested-ul">
          <li class="mt-2" v-for="(criterion, criterionIdx) in department.criteria" v-bind:key="criterionIdx">
            <a href="javascript:void(0)" 
              class="font-weight-bold"
              v-on:click="editCriterionModal(criterion.id)">
              {{ criterion.name }}
            </a>
            <ul class="nested-ul" v-if="criterion.suggested_solution">
              <li class="mt-2 text-muted">
                {{ criterion.suggested_solution }}
              </li>
            </ul>
            <Modal v-if="toggleEditCriterionModal && selectedCriterion == criterion.id ">
              <div slot="body">
                <form v-on:submit.prevent="editCriterion(criterion.id, departmentIdx, criterionIdx)">
                  <div class="form-group">
                    <input type="text"
                      id="criterionName"
                      autocomplete="off"
                      v-model="criterion.name" 
                      class="form-control"  
                      placeholder="+ المعيار">
                  </div>
                  <div class="form-group">
                    <textarea
                      id="suggSolution"
                      autocomplete="off"
                      class="form-control"  
                      v-model="criterion.suggested_solution" 
                      placeholder="+ الحل المقترح">
                    </textarea>
                  </div>
                  <button type="submit" 
                    class="btn btn-info ml-2"
                    v-on:click="toggleEditCriterionModal = false">حفظ</button>
                  <button type="button" 
                    class="btn btn-light"
                    v-on:click="toggleEditCriterionModal = false">الغاء</button>
                </form>
              </div>
            </Modal>
          </li>
          <div class="row mt-2">
            <div class="col-12 col-sm-8">
              <div class="form-group">
                <input type="text"
                  v-model="criterionName[departmentIdx]"
                  autocomplete="off"
                  class="form-control"  
                  placeholder="+ أضف معيار"
                  v-on:keydown.enter="postCriterion(department.id, departmentIdx)">
              </div>
            </div>
          </div>
        </ul>
      </li>
      <div class="row">
        <div class="col-8 col-sm-6 col-md-4">
          <div class="form-group">
            <input type="text" class="form-control"
              autocomplete="off"
              v-model="departmentName" 
              placeholder="+ أضف قسم"
              v-on:keydown.enter="postDepartment()">
          </div>
        </div>
      </div>
    </ul>
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
        name: this.departments[departmentIdx].criteria[criterionIdx].name,
        suggested_solution: this.departments[departmentIdx].criteria[criterionIdx].suggested_solution,
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
