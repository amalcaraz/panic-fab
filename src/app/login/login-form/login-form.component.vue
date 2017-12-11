<template>
  <v-card light>
    <v-card-title class="headline">Insert your alias</v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-text-field @keyup.enter="submit(alias)"
                      label="Alias"
                      v-model="alias"
                      required
        ></v-text-field>
        <v-card-actions>
          <v-btn @click="submit(alias)"
                 :disabled="!valid">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" src="./login-form.component.ts"></script>
