<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <div v-else>
            <div class="default-card">
                <p class="font-weight-bold mb-3">بيانات المنشئة الصحية</p>
                <table class="table">
                    <tbody>
                        <tr>
                            <td>الادارة الصحية</td>
                            <td class="font-weight-bold">{{ unit.management__name }}</td>
                            <td>الوحدة الصحية</td>
                            <td class="font-weight-bold">{{ unit.name }}</td>
                        </tr>
                        <tr>
                            <td>تقرير شهر</td>
                            <td class="font-weight-bold">{{ month + '-' + year }}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card__header">
                <p class="font-weight-bold mb-3">تفاصيل التقييم</p>
                <table class="table table-hover">
                    <template v-for="(department, departmentIdx) in departments">
                        <thead class="thead-light" v-bind:key="departmentIdx">
                            <tr>
                                <th colspan="2">
                                    <a href="javascript:void(0)"
                                        @click="toggleDepartmentEvaluation(department.department__id)">
                                        {{ department.department__name }}
                                    </a>
                                </th>
                            </tr>
                        </thead>
                        <Loader v-if="selectedDepartment == department.department__id && getDepartmentEvaluationLoader" v-bind:key="'A'+ departmentIdx" />
                        <tbody v-bind:key="'B'+ departmentIdx" 
                            v-else-if="selectedDepartment == department.department__id">
                            <tr v-for="(evaluation, evaluationIdx) in evaluations" 
                            v-bind:key="evaluationIdx">
                                <td class="align-middle font-weight-bold">
                                    {{ evaluation.criterion__name }}
                                </td>
                                <td>
                                    <a href="javascript:void(0)" class="circle"
                                        v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                                        v-on:click="check(evaluationIdx, evaluation.id)">
                                        <svg viewBox="0 -49 512.00075 512"
                                            class="check-icon"><path d="m190.476562 413.828125c-20.628906 0-40.503906-8.0625-55.347656-22.652344l-129.148437-126.910156c-7.878907-7.742187-7.988281-20.40625-.246094-28.28125 7.742187-7.878906 20.40625-7.992187 28.285156-.25l129.144531 126.910156c8.105469 7.964844 19.246094 11.992188 30.570313 11.050781 11.324219-.945312 21.648437-6.757812 28.324219-15.953124l253.757812-349.492188c6.488282-8.9375 18.996094-10.921875 27.933594-4.433594 8.9375 6.492188 10.921875 19 4.433594 27.9375l-253.757813 349.488282c-13.523437 18.625-34.433593 30.402343-57.371093 32.3125-2.195313.183593-4.394532.273437-6.578126.273437zm0 0"/>
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </table>
            </div>
            <div class="card__footer light-bg border-top screen-only">
                <button type="button" class="btn btn-info ml-2"
                    v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !checkedCriteria.length">
                    {{ savingUnitEvaluation ? 'يتم الحفظ' : 'حفظ التعديلات' }}
                </button>
                <button type="button" class="btn btn-light bg-white" v-on:click="print()">طباعة</button>
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
            unitId: parseInt(this.$route.params.id),
            month: this.$route.query.month,
            year: this.$route.query.year,
            editUnitEvaluationLoader: true,
            getDepartmentEvaluationLoader: false,
            savingUnitEvaluation: false,
            toggleEditEvaluationModal: false,
            selectedEvaluation: null,
            selectedDepartment: null,
            checkedCriteria: [],
            departments: [],
            evaluations: [],
            unit: {}
        }
    },
    methods: {
        check (evaluationIdx, evaluationId) {
            this.evaluations[evaluationIdx].checked = !this.evaluations[evaluationIdx].checked
            if (this.checkedCriteria.includes(evaluationId)) {
                let arrIndx = this.checkedCriteria.indexOf(evaluationId)
                this.checkedCriteria.splice(arrIndx, 1)
            } else {
                this.checkedCriteria.push(evaluationId)
            }
        },
        print () {
            window.print()
        },
        toggleDepartmentEvaluation(departmentId) {
            this.getDepartmentEvaluationLoader = true
            this.selectedDepartment = departmentId
            appService.displayUnitEvaluation('retrieve', {
                unitId: this.unitId,
                month: this.month,
                year: this.year,
                department: this.selectedDepartment
            }).then(data => {
                this.evaluations = data
                this.getDepartmentEvaluationLoader = false
            })
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
                this.departments = data.departments
                this.unit = data.unit
                this.editUnitEvaluationLoader = false

            })
        },
        saveUnitEvaluation () {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                id: this.selectedEvaluation,
                checked: this.selectedEvaluation,
                evaluation_text: this.evaluationText
            }).then(() => {
                this.checkedCriteria = []
                this.savingUnitEvaluation = false
                this.toggleEditEvaluationModal = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>