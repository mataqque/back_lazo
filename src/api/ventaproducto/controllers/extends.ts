export default {
	prove: async (ctx, next) => {
		return ctx.request.body;
	},
};
