import { ProductMercadoPago, SchemaProductDB } from './interface';

export const transformedProducts = (productosApi, products) => {
	const res: ProductMercadoPago[] = productosApi.map((e: SchemaProductDB, index) => {
		return {
			title: e.NameProduct,
			unit_price: e.Price,
			currency_id: 'PEN',
			quantity:
				products.filter(i => {
					if (e.id == i.id) {
						return i;
					}
				})[0].quantity || 1,
		};
	});
	return res;
};
