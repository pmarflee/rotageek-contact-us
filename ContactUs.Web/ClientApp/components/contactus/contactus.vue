<template>
  <div>
  <h1>Contact Us</h1>
  <form id="contact-form" method="post" action="api/contact/create" role="form" @submit.prevent="validateAndSubmit">
    <p v-if="showSuccessMessage" class="alert alert-success" role="alert">Your message was submitted successfully</p>
    <div class="controls">
      <div class="row">
        <div class="col-md-2">
          <div class="form-group" :class="{ 'has-error': errors.has('title') }">
            <label for="form_name">Title *</label>
            <select id="title" name="title" v-model="title" class="form-control" v-validate="'required'">
              <option disabled="" value="">Please select your title *</option>
              <option v-for="title in titles" v-bind:value="title">{{ title }}</option>
            </select>
            <span v-show="errors.has('title')" class="help text-danger">{{ errors.first('title') }}</span>
          </div>
        </div>
        <div class="col-md-5">
          <div class="form-group" :class="{ 'has-error': errors.has('firstname') }">
            <label for="form_name">First name *</label>
            <input id="form_firstname" type="text" name="firstname" v-model="firstName" class="form-control" placeholder="Please enter your first name *" v-validate="'required'" />
            <span v-show="errors.has('firstname')" class="help text-danger">{{ errors.first('firstname') }}</span>
          </div>
        </div>
        <div class="col-md-5">
          <div class="form-group" :class="{ 'has-error': errors.has('lastname') }">
            <label for="form_lastname">Last name *</label>
            <input id="form_lastname" type="text" name="lastname" v-model="lastName" class="form-control" placeholder="Please enter your last name *" v-validate="'required'" />
            <span v-show="errors.has('lastname')" class="help text-danger">{{ errors.first('lastname') }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group" :class="{ 'has-error': errors.has('email') }">
            <label for="form_email">Email *</label>
            <input id="form_email" type="email" name="email" v-model="email" class="form-control" placeholder="Please enter your email *" v-validate="'required|email'" />
            <span v-show="errors.has('email')" class="help text-danger">{{ errors.first('email') }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group" :class="{ 'has-error': errors.has('message') }">
            <label for="form_message">Message *</label>
            <textarea id="form_message" name="message" v-model="message" class="form-control" placeholder="Please enter your message *" rows="4" v-validate="'required'"></textarea>
            <span v-show="errors.has('message')" class="help text-danger">{{ errors.first('message') }}</span>
          </div>
        </div>
        <div class="col-md-12">
          <button type="submit" class="btn btn-success btn-send">Send message</button>
        </div>
      </div>
    </div>
    </form>
  </div>
</template>

<script lang="ts" src="./contactus.ts"></script>
