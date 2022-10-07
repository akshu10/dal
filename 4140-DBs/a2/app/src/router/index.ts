import {
  createRouter as createVueRouter,
  createWebHistory,
  type Router,
} from "vue-router";
import type { App } from "vue";

import HomeView from "@/views/HomeView.vue";

export function createRouter(app: App): Router {
  return createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/",
        name: "Home",
        component: HomeView,
      },

      // {
      //   path: "/clinical-notes",
      //   name: "ViewClinicalNotes",
      //   component: () => import("@/views/ClinicalNotesView.vue"),
      // },
      // {
      //   path: "/referrals/new/self",
      //   name: "NewSelfReferral",
      //   component: () => import("@/views/NewSelfReferralView.vue"),
      // },
      // {
      //   path: "/referrals/new/professional",
      //   name: "NewProfessionalReferral",
      //   component: () => import("@/views/NewProfessionalReferralView.vue"),
      // },
      // {
      //   path: "/referrals/edit/:id",
      //   name: "EditReferral",
      //   component: () => import("@/views/EditReferralView.vue"),
      // },
      {
        path: "/documents",
        name: "Documents",
        component: () => import("@/views/DocumentsView.vue"),
      },
      // {
      //   path: "/users",
      //   name: "Users",
      //   component: () => import("@/views/UsersView.vue"),
      // },
    ],
  });
}
