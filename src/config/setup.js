import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";

import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import {
  AppConfigListProperties,
  AppConfigProperty,
} from "../models/globalConfig.js";
AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Product,
    },
    {
      resource: Models.Category,
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Counter,
    },
    {
      resource: Models.Order,
    },
    {
      resource: Models.AppConfig,
      options: {
        properties: AppConfigProperty,
        // listProperties: AppConfigListProperties,
        actions: {
          delete: {
            isVisible: false,
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
  ],

  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
    favicon:
      "https://res.cloudinary.com/dl4elxvt3/image/upload/v1727001494/n0zck2n6uwsfj6lrdkv0.png",
  },
  defaultTheme: light.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    { authenticate, cookiePassword: COOKIE_PASSWORD },
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
