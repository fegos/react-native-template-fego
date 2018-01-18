export default {
	clone: function (state) {
		return state && JSON.parse(JSON.stringify(state));
	},
	// gets the current screen from navigation state
	getCurRouteName: function (navState) {
		if (!navState) {
			return null;
		}
		const route = navState.routes[navState.index];
		// dive into nested navigators
		if (route.routes) {
			return this.getCurRouteName(route);
		}
		return route.routeName;
	},
	getCurRoute: function (navState) {
		if (!navState) {
			return null;
		}
		const route = navState.routes[navState.index];
		// dive into nested navigators
		if (route.routes) {
			return this.getCurRoute(route);
		}
		return route;
	},
}