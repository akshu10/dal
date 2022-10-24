<template>
  <div>
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row wrap>
        <v-flex v-for="item in parts" :key="item.partNo471" xs6>
          <v-card :loading="loading" class="mx-auto my-12" max-width="374">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-card-title>{{ item.name471 }}</v-card-title>
            <v-card-text>
              <div class="my-4 text-subtitle-1">Description</div>
              <div>{{ item.description471 }}</div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-title>Quantity</v-card-title>
            <v-card-text>
              <v-slider
                v-model="sliderValues[item.partNo471]"
                :max="item.quantityOnHand471"
                step="1"
                thumb-label
                ticks
              ></v-slider>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- <div v-for="item of parts" :key="item.partNo471">
      <v-card :loading="loading" class="mx-auto my-12" max-width="374">
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title>{{ item.name471 }}</v-card-title>
        <v-card-text>
          <div class="my-4 text-subtitle-1">Description</div>
          <div>{{ item.description471 }}</div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-title>Quantity</v-card-title>
        <v-card-text>
          <v-slider
            v-model="sliderValues[item.partNo471]"
            :max="item.quantityOnHand471"
            step="1"
            thumb-label
            ticks
          ></v-slider>
        </v-card-text>
      </v-card>
    </div> -->
    <v-row align="center" justify="space-around">
      <v-btn
        class="d-flex justify-md-center ma-2"
        color="success"
        @click="reserve"
      >
        Purchase
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import Service from "@/lib/service";

export default {
  name: "MainFile",

  data() {
    return {
      parts: null,
      sliderValues: {},
      value: 0,
      loading: true,
    };
  },

  async mounted() {
    const result = await Service.getParts();

    this.parts = result;

    console.log("Parts", this.parts);

    this.loading = false;

    for (const a of this.parts) {
      this.sliderValues[a.partNo471] = 0;
    }
  },

  methods: {
    reserve() {
      console.log("Reserved");
    },
  },
};
</script>
