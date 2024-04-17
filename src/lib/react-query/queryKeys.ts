export enum QUERY_KEYS {
	//Auth keys
	CREATE_USER_ACCOUNT = "createUserAccount",

	//User Keys
	GET_CURRENT_USER = "getCurrentUser",
	GET_USER_PROFILE = "getUserProfile",
	GET_ALL_USERS = "getAllUsers",
	GET_USER_BY_ID = "getUserById",
	GET_USER_BY_USERNAME = "getUserByUsername",

	//Post Keys
	GET_POST = "getPost",
	GET_INFINITE_POSTS = "getInfinitePosts",
	GET_RECENT_POSTS = "getRecentPosts",
	GET_POST_BY_ID = "getPostById",
	GET_POSTS_BY_USER = "getPostsByUser",
	GET_POSTS_BY_TAG = "getPostsByTag",
	GET_POSTS_BY_LOCATION = "getPostsByLocation",
	GET_POSTS_BY_IMAGE = "getPostsByImage",
	GET_POSTS_BY_CREATOR = "getPostsByCreator",
	GET_POSTS_BY_CREATOR_NAME = "getPostsByCreatorName",
	GET_FILE_PREVIEW = "getFilePreview",

	//Search Keys
	SEARCH_POSTS = "getSearchPosts",
}
