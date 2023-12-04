<template>
<div class="row">
    <div class="col">
      <div class="q-pa-md items-start q-gutter-md">

      </div>
    </div>
</div>
</template>


<script setup>
import { reactive,ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { useQuasar } from 'quasar'



const router = useRouter(); // Get the router instance
const $q = useQuasar()
const materialName = ref(null);
const glass_mms = ref(null);
const selectGlassmm = ref(null);
const materialPerSqFtAmount = ref(null);
const materialPerMilliSqFtAmount = ref(null);
const store = useStore();
const token = store.getters['auth/getToken'];


const fetchGlassMM = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const response = await api.get('/api/admin/glass_mm/dropDown', { headers });
    glass_mms.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

onMounted(async () => {
  await fetchGlassMM();
});

async function addMaterial() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    material_name: materialName.value,
    glass_mm_id: selectGlassmm.value,
    per_sq_feet_amount: materialPerSqFtAmount.value,
    // per_milli_sq_feet_amount: materialPerMilliSqFtAmount.value,
  };

  await api
    .post('/api/admin/material/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      if (data.status == true) {
        $q.notify({
          message: 'Data Added Successfully',
          color: 'green',
          position: 'center'
        })
        // categoryName.value = null
      }else{
        $q.notify({
          message: 'Validation Errors',
          color: 'red',
          position: 'center'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error );
      // Handle the error
    })
    .finally(() => {
      $q.loading.hide()
    });
}
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form {
  position: absolute;
}
.my-card {
  width: 100% !important;
}
</style>
