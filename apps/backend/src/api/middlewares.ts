import { authenticate, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/vendor-products*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
})
