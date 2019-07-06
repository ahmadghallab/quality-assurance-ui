<template>
    <div class="container-fluid custom_font">
        <Loader v-if="retrieveUnitLoader" />
        <div class="row">
            <div class="col-md-4">
                <div>
                    <h6 class="font-weight-bold">Empoyee</h6>
                    <p class="text-muted">No empoyee yet</p>
                </div>
                <div>
                    <h6 class="font-weight-bold">Evaluations</h6>
                    <p class="text-muted">No evaluations yet</p>
                </div>
            </div>
            <div class="col-md-8 text-right">
                <h6 class="font-weight-bold">{{ unitName }}</h6>
                <p class="text-muted">
                    وزارة الصحة والسكان، هي وزارة مصرية مسؤولة عن توفير وإدارة وتطوير الخدمات الصحية المركزية بشقيها العلاجي والدوائي في جمهورية مصر العربية . يقدر عدد العاملين في مستشفيات الوزارة عام 2014 نحو 70 ألف طبيب بشري، ويقدر عدد الصيادلة ب20 ألفا، ويبلغ عدد الأطباء البيطرين، نحو 15 ألف طبيب
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from '../components/Loader'

export default {
    data () {
        return {
            retrieveUnitLoader: true,
            unitId: this.$route.params.id,
            unitName: null
        }
    },
    methods: {
        retrieveUnit () {
            appService.retrieveUnit(this.unitId)
                .then(data => {
                    this.unitName = data.name
                    this.retrieveUnitLoader = false
                })
        }
    },
    created () {
        this.retrieveUnit()
    }
}
</script>

