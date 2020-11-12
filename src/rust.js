export * from "../rust/pkg/rust";
import init, { solve } from "../rust/pkg/rust";
import wasm from "../rust/pkg/rust_bg.wasm"
export const wait_wasm = init(wasm())