mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(js_name = "parseOpenApi")]
pub fn parse_open_api(data: String) -> Result<JsValue, JsValue> {
    match jsona_openapi::parse(data.as_str()) {
        Ok(ast) => Ok(JsValue::from_serde(&ast).unwrap()),
        Err(err) => Err(JsValue::from_serde(&err).unwrap()),
    }
}
