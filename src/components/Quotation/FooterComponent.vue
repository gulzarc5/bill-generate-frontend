<template>
    <div class="footer">
        <q-img style="height: 47px;width: 64px;" class="pic" src="/images/icon.png"></q-img>
        <p>{{currentPage}} to {{totalPage}}</p>
        <p>powered by Khan Enterprise</p>
    </div>
</template>

<script setup>
defineProps({
  totalPage: [String, Number],
  currentPage: [String, Number],
});
</script>
