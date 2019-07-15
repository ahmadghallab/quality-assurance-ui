<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <ul class="nested-ul my-2" v-else>
            <li class="mb-2" v-for="(department, departmentIdx) in departments"     
                v-bind:key="departmentIdx">
                <a href="javascript:void(0)" class="font-weight-bold"
                    v-bind:class="{'highlight light-highlight': selectedDepartment == department.department__id}"
                    @click="getUnitEvaluation(department.department__id)">
                    {{ department.department__name }}
                </a>
                <Loader v-if="selectedDepartment == department.department__id && getDepartmentEvaluationLoader" />
                <ul class="nested-ul" v-else-if="selectedDepartment == department.department__id">
                    <li class="my-2" v-for="(evaluation, evaluationIdx) in evaluations" v-bind:key="evaluationIdx">
                        <!-- <a href="javascript:void(0)" class="font-weight-bold"
                            v-on:click="action(evaluation.id)">
                            {{ evaluation.criterion__name }}
                        </a>
                        <ul class="nested-ul" v-if="selectedEvaluation == evaluation.id">
                            <li class="my-3">
                                <div class="row">
                                    <div class="col-auto align-self-center">
                                        <span class="highlight success-highlight ml-2">مستوفي</span>
                                        <span class="highlight light-highlight ml-2">ليس متاح</span>
                                    </div>
                                    <div class="col-auto">
                                        <input type="text" class="form-control" placeholder="ملاحظـــات">
                                    </div>
                                </div>
                            </li>
                        </ul> -->
                        <div class="row">
                            <div class="col-auto align-self-center pl-0">
                                <span v-if="evaluation.checked">+</span>
                                <span v-else>-</span>
                            </div>
                            <div class="col">
                                <a href="javascript:void(0)" class="font-weight-bold"
                                    v-on:click="check(evaluationIdx, evaluation.id)">
                                    {{ evaluation.criterion__name }}
                                </a>
                                
                            </div>
                        </div>
                    </li>
                    <div class="form-group">
                        <button type="button" class="btn btn-light btn-sm"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !checkedCriteria.length">
                            {{ savingUnitEvaluation ? 'يتم الحفظ' : 'حفظ التعديلات' }}
                        </button>
                    </div>
                </ul>
            </li>
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
    props: {
        unitId: Number,
        month: Number,
        year: Number
    },
    data () {
        return {
            editUnitEvaluationLoader: true,
            getDepartmentEvaluationLoader: false,
            savingUnitEvaluation: false,
            toggleEditEvaluationModal: false,
            selectedEvaluation: null,
            selectedDepartment: null,
            checkedCriteria: [],
            departments: [],
            evaluations: []
        }
    },
    methods: {
        action (evaluationId) {
            if (evaluationId == this.selectedEvaluation) {
                this.selectedEvaluation = null
            } else {
                this.selectedEvaluation = evaluationId
            }
        },
        check (evaluationIdx, evaluationId) {
            this.evaluations[evaluationIdx].checked = !this.evaluations[evaluationIdx].checked
            if (this.checkedCriteria.includes(evaluationId)) {
                let arrIndx = this.checkedCriteria.indexOf(evaluationId)
                this.checkedCriteria.splice(arrIndx, 1)
            } else {
                this.checkedCriteria.push(evaluationId)
            }
        },
        editEvaluationModal(evaluationId) {
            this.selectedEvaluation = evaluationId
            this.toggleEditEvaluationModal = true
        },
        editUnitEvaluation () {
            appService.displayUnitEvaluation('edit', {
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data
                this.editUnitEvaluationLoader = false
            })
        },
        getUnitEvaluation(departmentId) {
            if (this.selectedDepartment == departmentId) {
                this.selectedDepartment = null
                this.checkedCriteria = []
            } else {
                this.getDepartmentEvaluationLoader = true
                this.selectedDepartment = departmentId
                appService.displayUnitEvaluation('get', {
                    unitId: this.unitId,
                    month: this.month,
                    year: this.year,
                    department: this.selectedDepartment
                }).then(data => {
                    this.evaluations = data
                    this.getDepartmentEvaluationLoader = false
                })
            }
        },
        saveUnitEvaluation () {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                id: this.selectedEvaluation,
                criteria: this.checkedCriteria,
            }).then(() => {
                this.checkedCriteria = []
                this.savingUnitEvaluation = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>