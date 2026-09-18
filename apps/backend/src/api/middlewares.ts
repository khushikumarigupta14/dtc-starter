import { allowSearchIndexes, defineMiddlewares } from '@medusajs/framework/http'

/**
 * `POST /store/search` reaches no index until one is opted in here. Only
 * published products are ever written to the `product` index, so the storefront
 * needs nothing narrowed at request time.
 */
export default defineMiddlewares({
  routes: [
    {
      method: ['POST'],
      matcher: '/store/search',
      middlewares: [allowSearchIndexes('product')],
    },
  ],
})
