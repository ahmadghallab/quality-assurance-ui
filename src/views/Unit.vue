<template>  
    <div class="default-card">
        <Loader v-if="retrieveUnitLoader" />
        <div v-else>
            <h6 class="font-weight-bold mb-3">{{ unitName }}</h6>
            <Loader v-if="listUnitEvaluationLoader" />
            <div v-else>
                <ul class="pr-0">
                    <li class="mb-2" v-for="(evaluation, evaluationIdx) in unitEvaluations" v-bind:key="evaluationIdx">
                        <div class="btn-group">
                            <a href="javascript:void(0)"
                                class="font-weight-bold"
                                v-bind:class="{'highlight light-highlight': selectedEvaluation == evaluationIdx}" 
                                v-on:click="toggleUnitEvaluationList(evaluationIdx)">
                                {{ evaluation.month + '.' + evaluation.year }}
                            </a>
                            <!-- <div class="dropdown-menu text-right"
                                v-bind:class="[selectedEvaluation == evaluationIdx ? 'show' : '']">
                                <router-link 
                                :to="{ 
                                    name: 'evaluation', 
                                    params: {id: unitId}, 
                                    query: {month: evaluation.month, year: evaluation.year}
                                }" class="dropdown-item" >تعديل</router-link>
                                <a class="dropdown-item" href="javascript:void(0)">تحديث</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item text-danger" 
                                    href="javascript:void(0)"
                                    v-on:click="toggleDeleteEvaluationModal = true">حذف
                                </a>
                            </div> -->
                        </div>
                        <UnitEvaluation
                            v-if="toggleUnitEvaluation && selectedEvaluation == evaluationIdx" 
                            v-bind:unitId="unitId" 
                            v-bind:month="evaluation.month"
                            v-bind:year="evaluation.year" 
                        />
                        <Modal width="450px" v-if="toggleDeleteEvaluationModal && selectedEvaluation == evaluationIdx">
                            <div slot="body" class="text-left">
                                <p class="text-muted">
                                You are about to delete <span class="highlight info-highlight">{{ evaluation.month + '.' + evaluation.year }}</span> evaluation. No one will be able to access this evaluation ever again
                                </p>
                                <p class="font-weight-bold my-4">Are you absolutely positive? There's no undo</p>
                                <div>
                                    <button type="button" @click="deleteUnitEvaluation(evaluationIdx, evaluation.month, evaluation.year)"
                                        class="btn btn-info ml-2" :disabled="deletingUnitEvaluation">
                                        {{ deletingUnitEvaluation ? 'Deleting' : 'Yes, delete' }}
                                    </button>
                                    <button type="button" 
                                        class="btn btn-light"
                                        v-on:click="toggleDeleteEvaluationModal = false">Cancel
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    </li>
                    <p class="text-muted" v-if="!unitEvaluations.length">لا يوجد تقييمات حتي الان</p>
                    <div>
                        <form v-on:submit.prevent="createUnitEvaluation()">
                            <div class="form-row">
                                <div class="col-2">
                                    <input type="number" v-model="month" class="form-control" placeholder="شهر">
                                </div>
                                <div class="col-2">
                                    <input type="number" v-model="year" class="form-control" placeholder="سنة">
                                </div>
                                <div class="col-auto">
                                    <button type="submit" class="btn btn-light btn-sm" :disabled="createUnitEvalValidator">
                                        {{ creatingUnitEvaluation ? 'رجاء الانتظار' : 'إنشاء' }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import UnitEvaluation from '../components/UnitEvaluation'

export default {
    components: {
        Modal,
        Loader,
        UnitEvaluation
    },
    data () {
        return {
            toggleDeleteEvaluationModal: false,
            toggleUnitEvaluation: false,
            deletingUnitEvaluation: false,
            creatingUnitEvaluation: false,
            retrieveUnitLoader: true,
            listUnitEvaluationLoader: true,
            unitId: parseInt(this.$route.params.id),
            unitName: null,
            selectedEvaluation: null,
            month: null,
            year: null,
            unitEvaluations: []
        }
    },
    computed: {
        createUnitEvalValidator () {
            return (this.month && this.year && !this.creatingUnitEvaluation) ? false : true
        }
    },
    methods: {
        toggleEvaluationDropdown(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
            } else {
                this.selectedEvaluation = evaluationIdx
            }
        },
        toggleUnitEvaluationList(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
                this.toggleUnitEvaluation = false
            } else {
                this.selectedEvaluation = evaluationIdx
                this.toggleUnitEvaluation = true
            }
        },
        retrieveUnit () {
            appService.retrieveUnit(this.unitId)
                .then(data => {
                    this.unitName = data.name
                    this.retrieveUnitLoader = false
                })
        },
        createUnitEvaluation () {
            this.creatingUnitEvaluation = true
            appService.createUnitEvaluation({
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(() => {
                this.unitEvaluations.push({
                    "month": this.month,
                    "year": this.year
                })
                this.month = null
                this.year = null
                this.creatingUnitEvaluation = false
            })
        },
        listUnitEvaluation () {
            appService.listUnitEvaluation(this.unitId)
                .then(data => {
                    this.unitEvaluations = data
                    this.listUnitEvaluationLoader = false
                })
        },
        deleteUnitEvaluation (index, month, year) {
            this.deletingUnitEvaluation = true
            appService.deleteUnitEvaluation({
                unitId: this.unitId,
                month: month,
                year: year
            }).then(() => {
                this.deletingUnitEvaluation = false
                this.toggleDeleteEvaluationModal = false
                this.unitEvaluations.splice(index, 1)
            })
        }
    },
    created () {
        this.retrieveUnit()
        this.listUnitEvaluation()
    }
}
</script>

