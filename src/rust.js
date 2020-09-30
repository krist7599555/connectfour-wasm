export * from "../rust/pkg/rust";
import init, { greet } from "../rust/pkg/rust";
import wasm from "../rust/pkg/rust_bg.wasm"
export const wait_wasm = init(wasm())
// console.log("wait_wasm", wait_wasm)
// wait_wasm.then(() => {
//   greet()
// })