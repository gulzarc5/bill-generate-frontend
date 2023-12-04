<template>
  <div class="row">
    <div class="col">
      <div class="q-pa-md items-start q-gutter-md">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Add Category</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
                <form @submit.prevent="createCategory" ref="myForm">
                  <div class="">
                    <label for="categoryName">Category Name</label>

                    <q-input
                    outlined
                    v-model="categoryName"
                    type="text"
                    id="categoryName"
                    label="Category Name"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please Enter Category Name']"
                    required/>

                    <div class="q-pa-md q-gutter-sm">
                      <q-btn color="primary" type="submit" label="Submit" />
                    </div>
                  </div>
                </form>
            </div>
          </q-card-section>
          <q-separator inset />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { useQuasar } from 'quasar'



const router = useRouter(); // Get the router instance
const $q = useQuasar()
const categoryName = ref(null);
const store = useStore();
const token = store.getters['auth/getToken'];
console.log(token);

async function createCategory() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    category_name: categoryName.value,
  };

  await api
    .post('/api/admin/category/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      // $q.dialog({
      //   title: 'Success',
      //   message:  data.data.message
      // })
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
      if (error.response.status == 422) {
        $q.dialog({
          title: 'Error',
          message:  error.response.data.message
        })
      } else {

        console.log('Error:', error.response.status );
      }
      // console.error('Error:', error );
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
  max-width: 100% !important;
  background-color: white !important;
  box-shadow: 2px 2px 6px #8080806b !important;
  border: 1px solid #1976d240 !important;
}
</style>
