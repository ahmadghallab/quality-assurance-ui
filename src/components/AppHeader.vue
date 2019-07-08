<template>
<nav class="customNav">
    <div class="row justify-content-between bootstrap-nav">
        <div class="col-auto align-self-center">
            <p class="mb-0 text-white font-weight-bold">رقابة الجودة</p>
        </div>
        <div class="col-auto align-self-center">
            <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <router-link class="text-white" :to="{name: 'home'}">الرئيسية</router-link>
                </li>
                <li class="list-inline-item">
                    <router-link class="text-white" :to="{name: 'department'}">المعايير</router-link>
                </li>
                <li class="list-inline-item mr-3 pr-3 nav-user">
                    <router-link class="text-white" :to="{name: 'home'}">مرحبا</router-link>
                </li>
            </ul>
        </div>
    </div>
</nav>
</template>
