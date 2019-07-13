<template>
    <div>
        <Loader v-if="unitEvaluationReportLoader" />
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
                            <td>نتيجة التقرير</td>
                            <td class="font-weight-bold">{{ ((evaluationsChecked.length/evaluations.length) * 100).toFixed(2) }} %</td>
                        </tr>
                    </tbody>
                </table>
                <p class="font-weight-bold mb-3">تقرير نتيجة التقييم</p>
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
                                <span class="highlight success-highlight">
                                    {{ filteredEvaluationsChecked(department.department__id) }}
                                </span>
                            </td>
                            <td>
                                <span class="highlight light-highlight">
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
            <div class="default-card">
                <ul class="my-2 pr-0 font-weight-bold">
                    <li class="mb-2" v-for="(department, departmentIdx) in departments"  
                        v-bind:key="departmentIdx">
                        {{ department.department__name }}
                        <ul class="nested-ul">
                            <li class="my-2" 
                                v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                                v-bind:key="evaluationIdx">
                                <div class="row">
                                    <div class="col-auto align-self-center pl-0">
                                        <span v-if="evaluation.checked">+</span>
                                        <span v-else>-</span>
                                    </div>
                                    <div class="col">
                                        {{ evaluation.criterion__name }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <button type="button" class="btn btn-light btn-sm" 
                v-on:click="print()">طباعة</button>
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
            unitEvaluationReportLoader: true,
            departments: [],
            evaluations: [],
            unit: {}
        }
    },
    computed: {
        filteredEvaluations () {
            return (departmentId) => this.evaluations.filter(evaluation => departmentId == evaluation.department_id)
        },
        filteredEvaluationsChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.checked).length
        },
        filteredEvaluationsNotChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).length - this.filteredEvaluationsChecked(departmentId)
        },
        evaluationsChecked () {
            return this.evaluations.filter(evaluation => evaluation.checked)
        }
    },
    methods: {
        print () {
            window.print()
        },
        unitEvaluationReport () {
            appService.displayUnitEvaluation('report', {
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data.departments
                this.evaluations = data.evaluations
                this.unit = data.unit
                this.unitEvaluationReportLoader = false
            })
        },
    },
    created () {
        this.unitEvaluationReport()
    }
}
</script>