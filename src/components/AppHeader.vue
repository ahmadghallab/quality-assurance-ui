<template>
<div class="bg-info customNav">
    <div class="row bootstrap-nav">
        <div class="col-auto align-self-center">
            <p class="mb-0 text-white">Quality Assurance</p>
        </div>
        <div class="col-auto align-self-center">
            <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <router-link class="text-white" :to="{name: 'home'}">Home</router-link>
                </li>
                <li class="list-inline-item">
                    <router-link class="text-white" :to="{name: 'department'}">Department</router-link>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
