<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <div v-else>
            <div v-for="(department, departmentIdx) in departments"     
                v-bind:key="departmentIdx">
                <div class="list light-highlight">
                    <div class="row justify-content-between">
                        <div class="col align-self-center">
                            <a href="javascript:void(0)" class="font-weight-bold"
                                @click="getUnitEvaluation(department.department__id)">
                                {{ department.department__name }}
                            </a>
                        </div>
                        <div class="col-auto align-self-center" 
                            v-if="selectedDepartment == department.department__id">
                            <button type="button" class="btn btn-sm ml-2"
                                v-bind:class="[allSelected ? 'btn-secondary' : 'btn-light']" 
                                @click="selectAll()">تحديد</button>
                            <button type="button" class="btn btn-light btn-sm ml-1"
                                v-on:click="saveUnitEvaluation('fulfilled', true)" :disabled="savingUnitEvaluation || !selectedCriteria.length">مستوفي
                            </button>
                            <button type="button" class="btn btn-light btn-sm ml-1"
                                v-on:click="saveUnitEvaluation('fulfilled', false)" :disabled="savingUnitEvaluation || !selectedCriteria.length">غير مستوفي
                            </button>
                            <button type="button" class="btn btn-light btn-sm ml-2"
                                v-on:click="saveUnitEvaluation('fulfilled', null)" :disabled="savingUnitEvaluation || !selectedCriteria.length">غير مطبق
                            </button>
                            <button type="button" class="btn btn-light btn-sm"
                                v-on:click="toggleAddTextModal = true" :disabled="savingUnitEvaluation || !selectedCriteria.length">نص
                            </button>
                            <Modal v-if="toggleAddTextModal">
                                <div slot="body">
                                    <form v-on:submit.prevent="saveUnitEvaluation('text', evaluations[selectedCriteriaIdx[0]].text)">
                                        <div class="card__header">
                                            <div class="form-group">
                                                <textarea
                                                id="criterionText"
                                                autocomplete="off"
                                                v-model="evaluations[selectedCriteriaIdx[0]].text" 
                                                class="form-control"  
                                                placeholder="+ ادخل نص"></textarea>
                                            </div>
                                        </div>
                                        <div class="card__footer light-highlight border-top">
                                            <button type="submit" 
                                                class="btn btn-primary btn-sm ml-2"
                                                :disabled="savingUnitEvaluation">حفظ</button>
                                            <button type="button" 
                                                class="btn btn-light btn-sm"
                                                v-on:click="toggleAddTextModal = false">الغاء</button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
                <Loader v-if="selectedDepartment == department.department__id && getDepartmentEvaluationLoader" />
                <div v-else-if="selectedDepartment == department.department__id">
                    <div class="list criterion-list clickable" 
                        v-for="(evaluation, evaluationIdx) in evaluations" v-bind:key="evaluationIdx"
                        v-on:click="select(evaluationIdx, evaluation.id)"
                        v-bind:class="{
                            'primary-highlight': selected(evaluation.id),
                            'fulfilled': evaluation.fulfilled == true,
                            'not-fulfilled': evaluation.fulfilled == false,
                            'not-applicable': evaluation.fulfilled == null,
                        }">
                        <span class="font-weight-bold">{{ evaluation.criterion__name }}</span>
                        <div class="mt-1 text-muted">
                            <small v-if="evaluation.fulfilled == true">مستوفي</small>
                            <small v-else-if="evaluation.fulfilled == false">غير مسوفي</small>
                            <small v-else>غير مطبق</small>
                        </div>
                        <ul class="nested-ul mb-0" v-if="evaluation.text">
                            <li class="mt-1"><small class="text-muted">{{ evaluation.text }}</small></li>
                        </ul>
                    </div>
                </div>
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
            toggleAddTextModal: false,
            selectedEvaluation: null,
            selectedDepartment: null,
            selectedCriteria: [],
            selectedCriteriaIdx: [],
            departments: [],
            evaluations: []
        }
    },
    computed: {
        allSelected () {
            return this.selectedCriteria.length == this.evaluations.length
        },
        selected () {
        return criterion => this.selectedCriteria.includes(criterion)
        }
    },
    methods: {
        select (evaluationIdx, evaluationId) {
            if (this.selectedCriteria.includes(evaluationId)) {
                let evalIdIdx = this.selectedCriteria.indexOf(evaluationId)
                this.selectedCriteria.splice(evalIdIdx, 1)
                let evalIndexIdx = this.selectedCriteriaIdx.indexOf(evaluationIdx)
                this.selectedCriteriaIdx.splice(evalIndexIdx, 1)
            } else {
                this.selectedCriteria.push(evaluationId)
                this.selectedCriteriaIdx.push(evaluationIdx)
            }
        },
        selectAll() {
            if (this.allSelected) {
                this.selectedCriteria = []
                this.selectedCriteriaIdx = []
            } else {
                let countIndx = 0
                for (let evaluation of this.evaluations) {
                    if (!this.selectedCriteria.includes(evaluation.id)) {
                        this.selectedCriteria.push(evaluation.id)
                    }
                    if (!this.selectedCriteriaIdx.includes(countIndx)) {
                        this.selectedCriteriaIdx.push(countIndx)
                    }
                    countIndx += 1
                }
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
                this.selectedCriteria = []
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
        saveUnitEvaluation (field, value) {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                id: this.selectedEvaluation,
                criteria: this.selectedCriteria,
                [field]: value
            }).then(() => {
                for (let criterionIdx of this.selectedCriteriaIdx) {
                    this.evaluations[criterionIdx][field] = value
                }
                this.selectedCriteria = []
                this.selectedCriteriaIdx = []
                this.savingUnitEvaluation = false
                if (this.toggleAddTextModal) this.toggleAddTextModal = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>