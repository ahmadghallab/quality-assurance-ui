<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <div v-else>
            <div class="default-card">
                <p class="highlight font-weight-bold mb-3">بيانات المنشئة الصحية</p>
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
                            <td>نتيجة التقرير</td>
                            <td class="font-weight-bold">{{ ((evaluationsChecked.length/evaluations.length) * 100).toFixed(2) }} %</td>
                        </tr>
                    </tbody>
                </table>
                <p class="highlight font-weight-bold mb-3">تقرير نتيجة التقييم</p>
                <table class="table">
                    <thead>
                        <tr>
                            <th>البند</th>
                            <th>الاجمالي</th>
                            <th>مستوفي</th>
                            <th>غير مستوفي</th>
                            <th>النسبة %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                            <td class="font-weight-bold">{{ department.department__name }}</td>
                            <td>{{ filteredEvaluations(department.department__id).length }}</td>
                            <td>
                                <span class="highlight success-highlight ml-2">
                                    {{ filteredEvaluationsChecked(department.department__id) }}
                                </span>
                            </td>
                            <td>
                                <span class="highlight light-highlight ml-2">
                                    {{ filteredEvaluationsNotChecked(department.department__id) }}
                                </span>
                            </td>
                            <td>
                                {{ ((filteredEvaluationsChecked(department.department__id) / filteredEvaluations(department.department__id).length) * 100).toFixed(2) }} %
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card__header">
                <div class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                    <p class="font-weight-bold mb-3">{{ department.department__name }}</p>
                    <ul class="nested-ul">
                        <li class="mb-2" 
                            v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                            v-bind:key="evaluationIdx">
                            <a href="javascript:void(0)" 
                                class="highlight"
                                v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                                v-on:click="check(evaluation)">
                                <span v-if="evaluation.checked">+</span>
                                <span v-else>-</span>
                                {{ evaluation.criterion__name }}
                            </a>
                        </li>
                    </ul>
                </div>
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

export default {
    components: {
        Loader
    },
    data () {
        return {
            unitId: parseInt(this.$route.params.id),
            month: this.$route.query.month,
            year: this.$route.query.year,
            editUnitEvaluationLoader: true,
            savingUnitEvaluation: false,
            checkedCriteria: [],
            departments: [],
            evaluations: [],
            unit: {}
        }
    },
    computed: {
        filteredEvaluations () {
            return (departmentId) => this.evaluations.filter(evaluation => departmentId == evaluation.department_id
            )
        },
        filteredEvaluationsChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.checked).length
        },
        filteredEvaluationsNotChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).length - this.filteredEvaluationsChecked(departmentId)
        },
        evaluationsChecked () {
            return this.evaluations.filter(evaluation => evaluation.checked)
        },
        highlight () {
            return (evaluationId) => this.checkedCriteria.includes(evaluationId) 
        }
    },
    methods: {
        print () {
            window.print()
        },
        check (evaluation) {
            const evaluationIndx = this.evaluations.indexOf(evaluation)
            this.evaluations[evaluationIndx].checked = !this.evaluations[evaluationIndx].checked
            
            if (this.checkedCriteria.includes(evaluation.id)) {
                let arrIndx = this.checkedCriteria.indexOf(evaluation.id)
                this.checkedCriteria.splice(arrIndx, 1)
            } else {
                this.checkedCriteria.push(evaluation.id)
            }
        },
        editUnitEvaluation () {
            appService.editUnitEvaluation({
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data.departments
                this.evaluations = data.evaluations
                this.unit = data.unit
                this.editUnitEvaluationLoader = false
            })
        },
        saveUnitEvaluation () {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                criteria: this.checkedCriteria
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