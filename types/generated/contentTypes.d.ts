import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
	collectionName: 'admin_permissions';
	info: {
		name: 'Permission';
		description: '';
		singularName: 'permission';
		pluralName: 'permissions';
		displayName: 'Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		subject: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		properties: Attribute.JSON & Attribute.DefaultTo<{}>;
		conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
		role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminUser extends Schema.CollectionType {
	collectionName: 'admin_users';
	info: {
		name: 'User';
		description: '';
		singularName: 'user';
		pluralName: 'users';
		displayName: 'User';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		firstname: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastname: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		username: Attribute.String;
		email: Attribute.Email &
			Attribute.Required &
			Attribute.Private &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		password: Attribute.Password &
			Attribute.Private &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		resetPasswordToken: Attribute.String & Attribute.Private;
		registrationToken: Attribute.String & Attribute.Private;
		isActive: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
		roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> & Attribute.Private;
		blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
		preferedLanguage: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminRole extends Schema.CollectionType {
	collectionName: 'admin_roles';
	info: {
		name: 'Role';
		description: '';
		singularName: 'role';
		pluralName: 'roles';
		displayName: 'Role';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		code: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String;
		users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
		permissions: Attribute.Relation<'admin::role', 'oneToMany', 'admin::permission'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminApiToken extends Schema.CollectionType {
	collectionName: 'strapi_api_tokens';
	info: {
		name: 'Api Token';
		singularName: 'api-token';
		pluralName: 'api-tokens';
		displayName: 'Api Token';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}> &
			Attribute.DefaultTo<''>;
		type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> & Attribute.Required & Attribute.DefaultTo<'read-only'>;
		accessKey: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastUsedAt: Attribute.DateTime;
		permissions: Attribute.Relation<'admin::api-token', 'oneToMany', 'admin::api-token-permission'>;
		expiresAt: Attribute.DateTime;
		lifespan: Attribute.BigInteger;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::api-token', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
	collectionName: 'strapi_api_token_permissions';
	info: {
		name: 'API Token Permission';
		description: '';
		singularName: 'api-token-permission';
		pluralName: 'api-token-permissions';
		displayName: 'API Token Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		token: Attribute.Relation<'admin::api-token-permission', 'manyToOne', 'admin::api-token'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::api-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminTransferToken extends Schema.CollectionType {
	collectionName: 'strapi_transfer_tokens';
	info: {
		name: 'Transfer Token';
		singularName: 'transfer-token';
		pluralName: 'transfer-tokens';
		displayName: 'Transfer Token';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		description: Attribute.String &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}> &
			Attribute.DefaultTo<''>;
		accessKey: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		lastUsedAt: Attribute.DateTime;
		permissions: Attribute.Relation<'admin::transfer-token', 'oneToMany', 'admin::transfer-token-permission'>;
		expiresAt: Attribute.DateTime;
		lifespan: Attribute.BigInteger;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::transfer-token', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
	collectionName: 'strapi_transfer_token_permissions';
	info: {
		name: 'Transfer Token Permission';
		description: '';
		singularName: 'transfer-token-permission';
		pluralName: 'transfer-token-permissions';
		displayName: 'Transfer Token Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 1;
			}>;
		token: Attribute.Relation<'admin::transfer-token-permission', 'manyToOne', 'admin::transfer-token'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'admin::transfer-token-permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUploadFile extends Schema.CollectionType {
	collectionName: 'files';
	info: {
		singularName: 'file';
		pluralName: 'files';
		displayName: 'File';
		description: '';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String & Attribute.Required;
		alternativeText: Attribute.String;
		caption: Attribute.String;
		width: Attribute.Integer;
		height: Attribute.Integer;
		formats: Attribute.JSON;
		hash: Attribute.String & Attribute.Required;
		ext: Attribute.String;
		mime: Attribute.String & Attribute.Required;
		size: Attribute.Decimal & Attribute.Required;
		url: Attribute.String & Attribute.Required;
		previewUrl: Attribute.String;
		provider: Attribute.String & Attribute.Required;
		provider_metadata: Attribute.JSON;
		related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
		folder: Attribute.Relation<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> & Attribute.Private;
		folderPath: Attribute.String &
			Attribute.Required &
			Attribute.Private &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::upload.file', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUploadFolder extends Schema.CollectionType {
	collectionName: 'upload_folders';
	info: {
		singularName: 'folder';
		pluralName: 'folders';
		displayName: 'Folder';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
		parent: Attribute.Relation<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
		children: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
		files: Attribute.Relation<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
		path: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMax<{
				min: 1;
			}>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::upload.folder', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginI18NLocale extends Schema.CollectionType {
	collectionName: 'i18n_locale';
	info: {
		singularName: 'locale';
		pluralName: 'locales';
		collectionName: 'locales';
		displayName: 'Locale';
		description: '';
	};
	options: {
		draftAndPublish: false;
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.SetMinMax<{
				min: 1;
				max: 50;
			}>;
		code: Attribute.String & Attribute.Unique;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::i18n.locale', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUsersPermissionsPermission extends Schema.CollectionType {
	collectionName: 'up_permissions';
	info: {
		name: 'permission';
		description: '';
		singularName: 'permission';
		pluralName: 'permissions';
		displayName: 'Permission';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		action: Attribute.String & Attribute.Required;
		role: Attribute.Relation<'plugin::users-permissions.permission', 'manyToOne', 'plugin::users-permissions.role'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.permission', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
	collectionName: 'up_roles';
	info: {
		name: 'role';
		description: '';
		singularName: 'role';
		pluralName: 'roles';
		displayName: 'Role';
	};
	pluginOptions: {
		'content-manager': {
			visible: false;
		};
		'content-type-builder': {
			visible: false;
		};
	};
	attributes: {
		name: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 3;
			}>;
		description: Attribute.String;
		type: Attribute.String & Attribute.Unique;
		permissions: Attribute.Relation<'plugin::users-permissions.role', 'oneToMany', 'plugin::users-permissions.permission'>;
		users: Attribute.Relation<'plugin::users-permissions.role', 'oneToMany', 'plugin::users-permissions.user'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
	collectionName: 'up_users';
	info: {
		name: 'user';
		description: '';
		singularName: 'user';
		pluralName: 'users';
		displayName: 'User';
	};
	options: {
		draftAndPublish: false;
	};
	attributes: {
		username: Attribute.String &
			Attribute.Required &
			Attribute.Unique &
			Attribute.SetMinMaxLength<{
				minLength: 3;
			}>;
		email: Attribute.Email &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		provider: Attribute.String;
		password: Attribute.Password &
			Attribute.Private &
			Attribute.SetMinMaxLength<{
				minLength: 6;
			}>;
		resetPasswordToken: Attribute.String & Attribute.Private;
		confirmationToken: Attribute.String & Attribute.Private;
		confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
		blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
		role: Attribute.Relation<'plugin::users-permissions.user', 'manyToOne', 'plugin::users-permissions.role'>;
		attempts: Attribute.Integer;
		lista_productos: Attribute.Relation<'plugin::users-permissions.user', 'oneToMany', 'api::lista-producto.lista-producto'>;
		firstname: Attribute.String;
		lastname: Attribute.String;
		google_id: Attribute.String;
		gender: Attribute.Enumeration<['masculino', 'femenino']>;
		birthday: Attribute.Date;
		phone: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'api::phone.phone'>;
		code: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiCategoriaCategoria extends Schema.CollectionType {
	collectionName: 'categorias';
	info: {
		singularName: 'categoria';
		pluralName: 'categorias';
		displayName: 'Categoria';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		Namecategoria: Attribute.String;
		slug: Attribute.UID<'api::categoria.categoria', 'Namecategoria'>;
		description: Attribute.RichText;
		Imagen: Attribute.Media;
		uuid: Attribute.UID<'api::categoria.categoria', 'Namecategoria'>;
		parents: Attribute.Relation<'api::categoria.categoria', 'oneToMany', 'api::categoria.categoria'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::categoria.categoria', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::categoria.categoria', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiCompanyCompany extends Schema.CollectionType {
	collectionName: 'companies';
	info: {
		singularName: 'company';
		pluralName: 'companies';
		displayName: 'Company';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		NameCompany: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::company.company', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::company.company', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiEtiquetaEtiqueta extends Schema.CollectionType {
	collectionName: 'etiquetas';
	info: {
		singularName: 'etiqueta';
		pluralName: 'etiquetas';
		displayName: 'Etiqueta';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		NameTag: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::etiqueta.etiqueta', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::etiqueta.etiqueta', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiListaProductoListaProducto extends Schema.CollectionType {
	collectionName: 'lista_productos';
	info: {
		singularName: 'lista-producto';
		pluralName: 'lista-productos';
		displayName: 'ListaProducto';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		address: Attribute.String;
		adicionaldata: Attribute.String;
		email: Attribute.String;
		name: Attribute.String;
		users_permissions_user: Attribute.Relation<'api::lista-producto.lista-producto', 'manyToOne', 'plugin::users-permissions.user'>;
		ventaproductos: Attribute.Relation<'api::lista-producto.lista-producto', 'oneToMany', 'api::ventaproducto.ventaproducto'>;
		paid: Attribute.Boolean & Attribute.DefaultTo<false>;
		delivered: Attribute.Boolean & Attribute.DefaultTo<false>;
		date: Attribute.String;
		hour: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::lista-producto.lista-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::lista-producto.lista-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiListaipListaip extends Schema.CollectionType {
	collectionName: 'listaips';
	info: {
		singularName: 'listaip';
		pluralName: 'listaips';
		displayName: 'Listaip';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		ip: Attribute.String;
		blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
		attempts: Attribute.Integer;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::listaip.listaip', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::listaip.listaip', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiMercadopagoMercadopago extends Schema.CollectionType {
	collectionName: 'mercadopagos';
	info: {
		singularName: 'mercadopago';
		pluralName: 'mercadopagos';
		displayName: 'mercadopago';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		item: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::mercadopago.mercadopago', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::mercadopago.mercadopago', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiPhonePhone extends Schema.CollectionType {
	collectionName: 'phones';
	info: {
		singularName: 'phone';
		pluralName: 'phones';
		displayName: 'phone';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		phone: Attribute.String & Attribute.Unique;
		verified: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
		code: Attribute.String;
		user: Attribute.Relation<'api::phone.phone', 'oneToOne', 'plugin::users-permissions.user'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::phone.phone', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::phone.phone', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiProductoProducto extends Schema.CollectionType {
	collectionName: 'productos';
	info: {
		singularName: 'producto';
		pluralName: 'productos';
		displayName: 'Producto';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		NameProduct: Attribute.String &
			Attribute.Required &
			Attribute.SetMinMaxLength<{
				minLength: 5;
			}>;
		Date: Attribute.Date;
		Description: Attribute.RichText;
		Imagen: Attribute.Media;
		Slug: Attribute.UID<'api::producto.producto', 'NameProduct'>;
		Price: Attribute.Decimal & Attribute.DefaultTo<0>;
		Resume: Attribute.RichText;
		Quantity: Attribute.Integer & Attribute.DefaultTo<1>;
		Discount: Attribute.Integer &
			Attribute.SetMinMax<{
				min: 0;
				max: 100;
			}>;
		metaDescription: Attribute.String;
		metaKeywords: Attribute.String;
		Color: Attribute.String & Attribute.CustomField<'plugin::color-picker.color'>;
		tipo_producto: Attribute.Relation<'api::producto.producto', 'oneToOne', 'api::tipo-producto.tipo-producto'>;
		productos: Attribute.Relation<'api::producto.producto', 'oneToMany', 'api::producto.producto'>;
		cant: Attribute.Integer & Attribute.DefaultTo<1>;
		rank: Attribute.Integer;
		size_producto: Attribute.Relation<'api::producto.producto', 'oneToOne', 'api::size-producto.size-producto'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::producto.producto', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::producto.producto', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiPromocionPromocion extends Schema.CollectionType {
	collectionName: 'promocions';
	info: {
		singularName: 'promocion';
		pluralName: 'promocions';
		displayName: 'Promocion';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		Name: Attribute.String;
		Description: Attribute.RichText;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::promocion.promocion', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::promocion.promocion', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiPublicacionPublicacion extends Schema.CollectionType {
	collectionName: 'publicacions';
	info: {
		singularName: 'publicacion';
		pluralName: 'publicacions';
		displayName: 'Publicacion';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		title: Attribute.String;
		contain: Attribute.RichText;
		preview: Attribute.Media;
		slug: Attribute.UID<'api::publicacion.publicacion', 'title'>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::publicacion.publicacion', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::publicacion.publicacion', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiSizeProductoSizeProducto extends Schema.CollectionType {
	collectionName: 'size_productos';
	info: {
		singularName: 'size-producto';
		pluralName: 'size-productos';
		displayName: 'SizeProducto';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		name: Attribute.String;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::size-producto.size-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::size-producto.size-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiTipoProductoTipoProducto extends Schema.CollectionType {
	collectionName: 'tipo_productos';
	info: {
		singularName: 'tipo-producto';
		pluralName: 'tipo-productos';
		displayName: 'TipoProducto';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		Name: Attribute.String;
		uuid: Attribute.UID<'api::tipo-producto.tipo-producto', 'Name'>;
		Image: Attribute.Media;
		Description: Attribute.RichText;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::tipo-producto.tipo-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::tipo-producto.tipo-producto', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

export interface ApiVentaproductoVentaproducto extends Schema.CollectionType {
	collectionName: 'ventaproductos';
	info: {
		singularName: 'ventaproducto';
		pluralName: 'ventaproductos';
		displayName: 'ventaproducto';
		description: '';
	};
	options: {
		draftAndPublish: true;
	};
	attributes: {
		precioUnitario: Attribute.Decimal & Attribute.Required;
		totalVenta: Attribute.Decimal & Attribute.Required;
		lista_producto: Attribute.Relation<'api::ventaproducto.ventaproducto', 'manyToOne', 'api::lista-producto.lista-producto'>;
		MetodoPago: Attribute.String;
		Selled: Attribute.Boolean & Attribute.DefaultTo<false>;
		createdAt: Attribute.DateTime;
		updatedAt: Attribute.DateTime;
		publishedAt: Attribute.DateTime;
		createdBy: Attribute.Relation<'api::ventaproducto.ventaproducto', 'oneToOne', 'admin::user'> & Attribute.Private;
		updatedBy: Attribute.Relation<'api::ventaproducto.ventaproducto', 'oneToOne', 'admin::user'> & Attribute.Private;
	};
}

declare module '@strapi/strapi' {
	export module Shared {
		export interface ContentTypes {
			'admin::permission': AdminPermission;
			'admin::user': AdminUser;
			'admin::role': AdminRole;
			'admin::api-token': AdminApiToken;
			'admin::api-token-permission': AdminApiTokenPermission;
			'admin::transfer-token': AdminTransferToken;
			'admin::transfer-token-permission': AdminTransferTokenPermission;
			'plugin::upload.file': PluginUploadFile;
			'plugin::upload.folder': PluginUploadFolder;
			'plugin::i18n.locale': PluginI18NLocale;
			'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
			'plugin::users-permissions.role': PluginUsersPermissionsRole;
			'plugin::users-permissions.user': PluginUsersPermissionsUser;
			'api::categoria.categoria': ApiCategoriaCategoria;
			'api::company.company': ApiCompanyCompany;
			'api::etiqueta.etiqueta': ApiEtiquetaEtiqueta;
			'api::lista-producto.lista-producto': ApiListaProductoListaProducto;
			'api::listaip.listaip': ApiListaipListaip;
			'api::mercadopago.mercadopago': ApiMercadopagoMercadopago;
			'api::phone.phone': ApiPhonePhone;
			'api::producto.producto': ApiProductoProducto;
			'api::promocion.promocion': ApiPromocionPromocion;
			'api::publicacion.publicacion': ApiPublicacionPublicacion;
			'api::size-producto.size-producto': ApiSizeProductoSizeProducto;
			'api::tipo-producto.tipo-producto': ApiTipoProductoTipoProducto;
			'api::ventaproducto.ventaproducto': ApiVentaproductoVentaproducto;
		}
	}
}
