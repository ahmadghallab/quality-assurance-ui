<template>
  <div>
    <div class="default-card">
      <h6 class="font-weight-bold mb-0">الادارات الصحية والوحدات التابعه لها</h6> 
    </div>
    <Loader v-if="listManagementsLoader" />
    <div v-else>
      <div v-for="(management, managementIdx) in managements" v-bind:key="managementIdx">
        <div class="card__header border-bottom">
          <a href="javascript:void(0)"
            v-on:click="editManagementModal(management.id)" 
            class="font-weight-bold">{{ management.name }}
          </a>
          <Modal v-if="toggleEditManagementModal && selectedManagement == management.id ">
            <div slot="body" class="default-card">
              <form v-on:submit.prevent="editManagement(management.id, managementIdx)">
                <div class="form-group">
                  <label for="managementName">اسم الادارة</label>
                  <input type="text"
                    id="managementName"
                    autocomplete="off"
                    v-model="management.name" 
                    class="form-control"  
                    placeholder="+ أضف إدارة صحية">
                </div>
                <button type="submit" 
                  class="btn btn-primary btn-sm ml-2"
                  v-on:click="toggleEditManagementModal = false">حفظ</button>
                <button type="button" 
                  class="btn btn-light btn-sm"
                  v-on:click="toggleEditManagementModal = false">إلغاء</button>
              </form>
            </div>
          </Modal>
        </div>
        <div class="card__body light-highlight px-0 py-0">
          <div class="list list-lc" v-for="(unit, unitIdx) in management.units" v-bind:key="unitIdx">
            <div class="row justify-centent-between">
              <div class="col align-self-center">
                <router-link class="font-weight-bold" 
                  :to="{ name: 'unit', params: {id: unit.id} }">{{ unit.name }}</router-link>
              </div>
              <div class="col-auto align-self-center">
                <button type="button" class="btn btn-light btn-sm ml-1" 
                  v-on:click="unitEdit(unit.id)">تعديل</button>
                <button type="button" class="btn btn-light btn-sm">حذف</button>
              </div>
            </div>
            <Modal v-if="toggleEditUnitModal && selectedUnit == unit.id ">
              <div slot="body" class="default-card">
                <form v-on:submit.prevent="editUnit(unit.id, managementIdx, unitIdx)">
                  <div class="form-group">
                    <label for="unitName">إسم الوحدة الصحية</label>
                    <input type="text"
                      id="unitName"
                      autocomplete="off"
                      v-model="unit.name" 
                      class="form-control"  
                      placeholder="+ أضف وحدة صحية">
                  </div>
                  <button type="submit" 
                    class="btn btn-primary btn-sm ml-2"
                    v-on:click="toggleEditUnitModal = false">حفظ</button>
                  <button type="button" 
                    class="btn btn-light btn-sm"
                    v-on:click="toggleEditUnitModal = false">إلغاء</button>
                </form>
              </div>
            </Modal>
          </div>
          <div class="text-muted py-4 px-4" v-if="!management.units.length">
            <small>لا يوجد وحدات صحية لهذه الادارة</small>
          </div>
        </div>
        <div class="card__footer border-top">
          <form v-on:submit.prevent="postUnit(management.id, managementIdx)">
            <div class="form-row">
              <div class="col">
                <input type="text"
                v-model="unitName[managementIdx]"
                autocomplete="off"
                class="form-control"  
                placeholder="+ أضف وحدة صحية">
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-sm btn-light">إنشاء</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="default-card">
        <form v-on:submit.prevent="postManagement()">
          <div class="form-row">
            <div class="col">
              <input type="text" class="form-control"
                autocomplete="off"
                v-model="managementName" 
                placeholder="+ أضف إدارة صحية">
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
      listManagementsLoader: true,
      toggleEditUnitModal: false,
      toggleEditManagementModal: false,
      selectedUnit: null,
      selectedManagement: null,
      managementName: null,
      unitName: [],
      managements: []
    }
  },
  methods: {
    unitEdit(unitId) {
      this.selectedUnit = unitId
      this.toggleEditUnitModal = true
    },
    editManagementModal(managementtId) {
      this.selectedManagement = managementtId
      this.toggleEditManagementModal = true
    },
    postManagement() {
      appService.postManagement({name: this.managementName})
        .then((data) => {
          this.managementName = null
          this.managements.push(data)
        })
    },
    editManagement(managementId, managementIdx) {
      appService.editManagement({
        id: managementId,
        name: this.managements[managementIdx].name,
      })
      .then((data) => {
        this.toggleEditManagementModal = false
      })
    },
    postUnit(managementId, managementIdx) {
      appService.postUnit({
        management: managementId,
        name: this.unitName[managementIdx],
      })
      .then((data) => {
        this.unitName[managementIdx] = null
        this.managements[managementIdx].units.push(data)
      })
    },
    editUnit(unitId, managementIdx, unitIdx) {
      appService.editUnit({
        id: unitId,
        name: this.managements[managementIdx].units[unitIdx].name,
      })
      .then((data) => {
        this.toggleEditUnitModal = false
      })
    },
    listManagements () {
      appService.listManagements()
        .then(data => {
          this.managements = data
          this.listManagementsLoader = false
        })
    }
  },
  created () {
    this.listManagements()
  }
}
</script>
