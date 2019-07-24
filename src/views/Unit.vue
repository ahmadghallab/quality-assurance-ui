<template>  
    <div>
        <Loader v-if="listUnitEvaluationLoader" />
        <div v-else>
            <div class="card__header bg-primary text-white">
                <h6 class="font-weight-bold mb-1">{{ unit.name }}</h6>
                <small class="text-muted-white">{{ unit.management__name }}</small>
            </div>
            <div class="card__body px-0 py-0">
                <div v-for="(evaluation, evaluationIdx) in unitEvaluations"    
                    v-bind:key="evaluationIdx">
                    <div class="list">
                        <div class="row justify-content-between">
                            <div class="col align-self-center">
                                <a href="javascript:void(0)"
                                    v-on:click="toggleEvaluationList(evaluationIdx)">
                                    <small class="text-muted d-block">تقييم شهر</small>
                                    <span class="font-weight-bold">
                                        {{ evaluation.month + '.' + evaluation.year }}
                                    </span>
                                </a>
                            </div>
                            <div class="col-auto align-self-center" 
                                v-if="selectedEvaluation == evaluationIdx">
                                <router-link 
                                    class="btn btn-light btn-sm"
                                    :to="{ 
                                        name: 'unitEvaluationReport', 
                                        params: {id: unitId}, 
                                        query: {month: evaluation.month, year: evaluation.year}
                                    }">تقرير الوحدة
                                </router-link>
                                <router-link 
                                    class="btn btn-light btn-sm mx-1"
                                    :to="{ 
                                        name: 'managementEvaluationReport', 
                                        params: {id: unit.management__id}, 
                                        query: {month: evaluation.month, year: evaluation.year}
                                    }">تقرير الادارة
                                </router-link>
                                <button type="button" class="btn btn-light btn-sm"
                                    v-on:click="toggleDeleteEvaluationModal = true">حذف
                                </button>
                            </div>
                        </div>
                    </div>
                    <EvaluationEdit
                        v-if="toggleEvaluation && selectedEvaluation == evaluationIdx" 
                        v-bind:unitId="unitId" 
                        v-bind:month="evaluation.month"
                        v-bind:year="evaluation.year" 
                    />
                    <Modal width="500px" v-if="toggleDeleteEvaluationModal && selectedEvaluation == evaluationIdx">
                        <div slot="body" class="text-left">
                            <div class="card__header">
                                <p class="text-muted">
                                You are about to delete <span class="highlight primary-highlight">{{ evaluation.month + '.' + evaluation.year }}</span> evaluation. No one will be able to access this evaluation ever again
                                </p>
                                <p class="font-weight-bold mt-4 mb-0">Are you absolutely positive? There's no undo</p>
                            </div>
                            <div class="card__footer light-highlight border-top">
                                <button type="button" @click="deleteUnitEvaluation(evaluationIdx, evaluation.month, evaluation.year)"
                                    class="btn btn-primary btn-sm ml-2" :disabled="deletingUnitEvaluation">
                                    {{ deletingUnitEvaluation ? 'Deleting' : 'Yes, delete' }}
                                </button>
                                <button type="button" 
                                    class="btn btn-light btn-sm bg-white"
                                    v-on:click="toggleDeleteEvaluationModal = false">Cancel
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div class="card__body text-muted" v-if="!unitEvaluations.length">
                    لا يوجد تقييمات حتي الان
                </div>
            </div>
            <div class="card__footer">
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
        </div>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import EvaluationEdit from '../components/EvaluationEdit'

export default {
    components: {
        Modal,
        Loader,
        EvaluationEdit
    },
    data () {
        return {
            toggleDeleteEvaluationModal: false,
            toggleEvaluation: false,
            deletingUnitEvaluation: false,
            creatingUnitEvaluation: false,
            listUnitEvaluationLoader: true,
            unitId: parseInt(this.$route.params.id),
            unitName: null,
            selectedEvaluation: null,
            month: null,
            year: null,
            unitEvaluations: [],
            unit: {}
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
        toggleEvaluationList(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
                this.toggleEvaluation = false
            } else {
                this.selectedEvaluation = evaluationIdx
                this.toggleEvaluation = true
            }
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
                    this.unitEvaluations = data.evaluations
                    this.unit = data.unit
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
                this.selectedEvaluation = null
            })
        }
    },
    created () {
        this.listUnitEvaluation()
    }
}
</script>

