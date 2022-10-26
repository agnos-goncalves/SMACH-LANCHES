function findProduct(productCode) {
  return SMACH.products.find((product) => product.code === Number(productCode));
}
