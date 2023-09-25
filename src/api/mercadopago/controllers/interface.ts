import { Currency } from 'mercadopago/shared/currency';

export interface ProductMercadoPago {
	title: string;
	unit_price: number;
	currency_id: Currency;
	quantity: number;
}

export interface SchemaProductDB {
	id: number;
	Date: string;
	Description: string;
	Slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	NameProduct: string;
	Price: number;
	Resume: string;
	Quantity?: null;
	Discount?: null;
	metaDescription?: null;
	metaKeywords?: null;
	Color: string;
}

export interface IListSellProduct {
	id?: string | undefined;
	/** Título do item, é apresentado o fluxo de pagamento. */
	title?: string | undefined;
	/** Descrição do artigo. */
	description?: string | undefined;
	/** URL da imagem do anúncio. */
	picture_url?: string | undefined;
	/** Identificador da categoria do item. */
	category_id?: string | undefined;
	/** Quantidade de itens. */
	quantity?: number | undefined;
	/** Identificador de moeda em formato ISO_4217. */
	currency_id?: Currency | undefined;
	/** Preço unitário. */
	unit_price?: number | undefined;
}

export interface IFormData {
	id: string;
	name: string;
	email: string;
	address: string;
	hour: Date;
	date: Date;
	adicionaldata: string;
}
