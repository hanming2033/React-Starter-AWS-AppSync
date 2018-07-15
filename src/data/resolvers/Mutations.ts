// fieldName: (obj, args, context, info) => result;

// args: An object containing all of the arguments passed into the field. For example, if you called a mutation with updateNetworkStatus(isConnected: true), the args object would be { isConnected: true }.

// context: The context object, which is shared by all links in the Apollo Link chain. The most important thing to note here is that we’ve added the Apollo cache to the context for you, so you can manipulate the cache with cache.writeData({}).
