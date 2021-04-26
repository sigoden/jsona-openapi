mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(js_name = "parse")]
pub fn parse(data: String) -> Result<JsValue, JsValue> {
    match jsona_openapi::from_str(data.as_str()) {
        Ok(value) => Ok(JsValue::from_serde(&value).unwrap()),
        Err(err) => Err(JsValue::from_serde(&err).unwrap()),
    }
}
