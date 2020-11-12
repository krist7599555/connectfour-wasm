all:
	# cargo clean
	# cargo build --target wasm32-unknown-unknown
	# wasm-bindgen ./target/wasm32-unknown-unknown/debug/rust.wasm --out-dir dist 
	wasm-pack build --target web
	# wasm-pack build --target web --out-dir ../dist/rust
svelte:
	wasm-pack build --target web
