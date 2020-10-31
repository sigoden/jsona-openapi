import jsona_openapi, { parse } from "./jsona_openapi_js.js";
jsona_openapi();
const uiTabBtn = document.getElementById("tabBtnUi");
const docTabBtn = document.getElementById("tabBtnDoc");
const docYamlTabBtn = document.getElementById("tabBtnDocYaml");
const genBtn = document.getElementById("genBtn"); 
const uiNode =document.getElementById("ui");
const sourceEditor = ace.edit("source", {
    autoScrollEditorIntoView: true,
    minLines: 5,
    maxLines: Number.POSITIVE_INFINITY,
    mode: "ace/mode/json5",
});
const docNode = document.getElementById("doc");
const docEditor = ace.edit("doc", {
    maxLines: Number.POSITIVE_INFINITY,
    mode: "ace/mode/json",
});
docNode.style.display = "none";
const docYamlNode = document.getElementById("docYaml");
const docYamlEditor = ace.edit("docYaml", {
    maxLines: Number.POSITIVE_INFINITY,
    mode: "ace/mode/yaml",
});
docYamlNode.style.display = "none";
document.addEventListener("DOMContentLoaded", () => {
    uiTabBtn.addEventListener("click", showUi);
    docTabBtn.addEventListener("click", showDoc);
    docYamlTabBtn.addEventListener("click", showDocYaml);
    genBtn.addEventListener("click", generate);
    const { source } = parseQuery(window.location.search);
    if (source) loadSource(source);
});
function showUi() {
    uiTabBtn.classList.add("active");
    docTabBtn.classList.remove("active");
    docYamlTabBtn.classList.remove("active");
    uiNode.style.display = ""
    docNode.style.display = "none";
    docYamlNode.style.display = "none";
}
function showDoc() {
    uiTabBtn.classList.remove("active");
    docTabBtn.classList.add("active");
    docYamlTabBtn.classList.remove("active");
    uiNode.style.display = "none";
    docNode.style.display = "";
    docYamlNode.style.display = "none";
}
function showDocYaml() {
    uiTabBtn.classList.remove("active");
    docTabBtn.classList.remove("active");
    docYamlTabBtn.classList.add("active");
    uiNode.style.display = "none";
    docNode.style.display = "none";
    docYamlNode.style.display = "";
}
function parseQuery(queryString) {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

async function loadSource(url) {
    try {
        const res = await fetch(url, { cache: "no-cache"});
        if (res.status >= 400) {
            toast("error", `fail to fetch jsona, ${await res.text()}`);
            return;
        }
        const source = await res.text();
        sourceEditor.setValue(source);
        setTimeout(generate, 500);
    } catch (err) {
    }
}

function generate() {
    sourceEditor.getSession().clearAnnotations();
    const source = sourceEditor.getValue().trim();
    if (!source) {
        toast("error", "no jsona");
        return;
    }
    try {
        window.spec = parse(source);
    } catch (err) {
        const position = err.position || { line: 1, col: 1 };
        const message = err.info ? `${err.info} at line ${position.line} col ${position.col}` : err.message;

        sourceEditor.getSession().setAnnotations([{
          row: position.line - 1,
          column: position.column - 1,
          text: message,
          type: "error"
        }]);
        toast("error", message);
        return;
    }
    updateSwaggerUi();
    docEditor.setValue(JSON.stringify(spec, null, 2));
    docYamlEditor.setValue(jsyaml.dump(spec));
}

function toast(kind, message) {
    let color;
    if (kind === "success") {
        color = "green"
    } else if (kind === "error") {
        color = "red"
    } else if (kind === "warning") {
        color = "yellow"
    }
    Toastify({
        text: message,
        duration: 5000, 
        backgroundColor: color,
        stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
}
function updateSwaggerUi() {
    let { spec, swagger } = window;
    if (!spec) return;
    if (!swagger) {
        window.swagger = SwaggerUIBundle({
            dom_id: "#ui",
            spec,
            presets: [ SwaggerUIBundle.presets.apis],
        })
    } else {
        swagger.specActions.updateJsonSpec(spec);
    }
}