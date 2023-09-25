import mercadopage from 'mercadopago';
import { MERCADOPAGO_API_KEY } from '../config';
import { Currency } from 'mercadopago/shared/currency';
import { IFormData, IListSellProduct, ProductMercadoPago, SchemaProductDB } from './interface';
import { transformedProducts } from './common';
import { sellSchema } from './schema';
import { pick } from 'lodash';

export default {
	createPayment: async (ctx, next) => {
		const { products, form }: { products: any; form: IFormData } = JSON.parse(ctx.request.body);
		console.log(products);
		//return id

		try {
			if (products) {
				const validate = sellSchema.validateSync(form);
				const filteredData = pick(validate, Object.keys(sellSchema.fields));
				mercadopage.configure({
					access_token: MERCADOPAGO_API_KEY,
				});

				const productosApi: SchemaProductDB[] = await strapi.db.query('api::producto.producto').findMany({
					where: {
						id: [
							...products.map(e => {
								return e.id;
							}),
						],
					},
				});
				const dataProducts: IListSellProduct[] = transformedProducts(productosApi, products);

				const newSell = await strapi.entityService.create('api::lista-producto.lista-producto', {
					data: { ...filteredData },
				});

				dataProducts.forEach(async (item: IListSellProduct) => {
					const res = await strapi.entityService.create('api::ventaproducto.ventaproducto', {
						data: {
							lista_producto: newSell.id,
							precioUnitario: item.unit_price,
							totalVenta: item.unit_price * item.quantity,
							MetodoPago: 'Mercado pago',
							users_permissions_user: form.id,
						},
					});
				});

				await mercadopage.preferences
					.create({
						items: dataProducts || [],
						notification_url: 'https://e720-190-237-16-208.sa.ngrok.io/webhook',
						back_urls: {
							success: 'http://localhost:3000/success',
							pending: 'https://e720-190-237-16-208.sa.ngrok.io/pending',
							failure: 'https://e720-190-237-16-208.sa.ngrok.io/failure',
						},
					})
					.then(async (res: any) => {
						return res;
					});

				// return productosApi;
				// console.log('form', validate);
				// return newSell;
			}
		} catch (error) {
			return { message: 'error internal:', error };
		}
	},
	addForm: async (ctx, next) => {
		try {
			const data = ctx.request.body;
			console.log(data);
			// const newSell = await strapi.entityService.create('api::ventaproducto.ventaproducto', {
			// 	data: {
			// 		precioUnitario: 200,
			// 		totalVenta: 4000,
			// 		MetodoPago: 'Mercado pago',
			// 		users_permissions_user: 1,
			// 	},
			// });
			const newSell = await strapi.entityService.findMany('api::lista-producto.lista-producto', {
				populate: '*',
				filters: {
					users_permissions_user: {
						id: data.user_id,
					},
				},
			});
			return newSell;
		} catch (err) {
			return { message: err };
		}
	},
	addProcess: async (ctx, next) => {},
};
