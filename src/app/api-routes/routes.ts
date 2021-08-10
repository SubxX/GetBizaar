export const marketplace = {
  ADD: 'marketplace/addMarketplace',
  CHECK_VERIFICATION: 'marketplace/checkVerificationCode',
  UPLOAD_IMAGE: 'marketplace/updateMarketplaceImages',
  CHECK_MARKETPLACE: 'marketplace/checkEmail/'
}

export const login = {
  CHECK_EMAIL: 'login/checkEmail/',
  CHECK_CODE: 'login/checkVerificationCode',
  UPDATE_USER: 'login/updateUser',
  EDIT_USER:'login/editUser',
  REFESH_USER:'login/updateProfileImg'
}

export const products = {
  MARKETPLACE_PRODUCTS: 'product/productListing',
  ADD_PRODUCT:'product/addProduct',
  MY_LISTING:'product/myProductListing',
  DELETE_PRODUCT:'product/remove',
  SEARCH_PRODUCTS:'product/searchProductListing',
  FILTER_PRODUCTS:'product/filterProductListing',
  UPDATE_PRODUCT:'product/updateProduct',
  PURCHASED_PRODUCTS:'product/myPurchase',
  SALES_RENTAL:'product/mySale'
}

export const purchase = {
  CREATE_STRIPE_SESSION:'payment/stripe',
  CREATE_BRAINTREE_CLIENT_TOKEN:'payment/paypal_clientToken',
  BUY_USING_PAYPAL:'payment/paypal'
}

export const log={
  GET_LOG:'audit/log',
  FILTER_LOG:'audit/filterLog',
  SORT_LOG:'audit/sortLog'
}
