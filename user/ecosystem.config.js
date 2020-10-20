module.exports = {
	apps: [
		{
			name: 'user-login-hexagonal-node',
			script: './dist/index.js',
			instances: 1,
			autorestart: true,
			// Process manager will restart the process up to 10 times.
			// Then the platform should discard and recreate the container
			max_restarts: 10,
			watch: false,
			max_memory_restart: '384M',
			error_file: '/dev/stderr',
			out_file: '/dev/stdout'
		}
	]
};
