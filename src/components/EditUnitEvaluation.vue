<template>
    <div class="container-fluid">
        <Loader v-if="editUnitEvaluationLoader" />
        <ul v-else>
            <li class="mt-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                <a href="javascript:void(0)"
                    class="highlighted">{{ department.department__name }}
                </a>
                <ul class="nested-ul">
                    <li class="mt-1" 
                        v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                        v-bind:key="evaluationIdx">
                        <a href="javascript:void(0)" class="highlighted">
                            {{ evaluation.criterion__name }}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from './Loader.vue'

export default {
    components: {
        Loader
    },
    props: {
        unitId: Number,
        month: Number,
        year: Number
    },
    data () {
        return {
            editUnitEvaluationLoader: true,
            departments: [],
            evaluations: []
        }
    },
    computed: {
        filteredEvaluations () {
            return (departmentId) => this.evaluations.filter(evaluation => departmentId == evaluation.department_id
            )
        }
    },
    methods: {
        editUnitEvaluation () {
            appService.editUnitEvaluation({
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data.departments
                this.evaluations = data.evaluations
                this.editUnitEvaluationLoader = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>
