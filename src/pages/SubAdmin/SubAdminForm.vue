<template>
<div class="row">
    <div class="col">
      <div class="q-pa-md items-start q-gutter-md">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Add Sub Admin</div>
          </q-card-section>


          <q-card-section class="q-pa-md">
            <div class="q-pa-md example-row-column-width">
                <form @submit.prevent="addSubAdmin">
                  <div class="row q-col-gutter-md  my-row">
                      <!-- <label for="name"> Name</label> -->
                      <q-input
                      label="Name"
                      class="col-6 q-pa-xs"
                      v-model="name"
                      filled
                      id="name"
                      type="name"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Name']"

                      />
                      <!-- <label for="email"> Email</label> -->
                      <q-input
                      label="Email"
                      class="col-6 q-pa-xs"
                      v-model="email"
                      filled id="email"
                      type="email"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please Enter Email']"

                      />
                  </div><br>
                  <div class="row q-col-gutter-md  my-row">
                      <q-input
                        label="Mobile"
                        class="col-6 q-pa-xs"
                        v-model="tel"
                        maxlength="10"
                        filled
                        type="tel"
                        id="mobile"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || 'Please Enter Mobile']"
                      />
                      <q-input
                        label="Password"
                        class="col-6 q-pa-xs"
                        v-model="password"
                        filled
                        id="password"
                        type="text"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || 'Please Enter Password']"

                      />
                  </div>

                  <div class="q-pa-md q-gutter-xs text-center">
                    <q-btn color="primary" type="submit" label="Submit" />
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
import { useQuasar } from 'quasar';


const router = useRouter(); // Get the router instance
const $q = useQuasar()
const name = ref(null);
const email = ref(null);
const tel = ref(null);
const password = ref(null);
const store = useStore();


const token = store.getters['auth/getToken'];
console.log(token);


async function addSubAdmin() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })
  const data = {
    name: name.value,
    email: email.value,
    mobile: tel.value,
    password: password.value,
  };

  await api
    .post('/api/admin/sub_admin/add', data , {
      headers: {
            Authorization: `Bearer ${token}`
      }
    })
    .then(({ data }) => {
      $q.loading.hide()
      $q.dialog({
        title: 'Success',
        message:  data.data.message
      })
      this.$refs.myForm.reset();
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
}
</style>

