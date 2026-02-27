const ENTRY_INDEX_PATH = "/content/entries.yaml";
const DEFAULT_TITLE_SUFFIX = "Neil Dandekar";
const titleEl = document.getElementById("entryTitle");
const metaEl = document.getElementById("entryMeta");
const contentEl = document.getElementById("entryContent");

function getTitleSuffix() {
    const configured = window.siteConfig?.site?.title_suffix;
    return typeof configured === "string" && configured.trim()
        ? configured.trim()
        : DEFAULT_TITLE_SUFFIX;
}

function normalizeEntries(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.entries)) return raw.entries;
    return [];
}

function getSlugFromRoute() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("slug");
    if (typeof fromQuery === "string" && fromQuery.trim()) {
        return fromQuery.trim();
    }

    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length >= 4 && parts[0] === "app" && parts[1] === "pages" && parts[2] === "thoughts") {
        return decodeURIComponent(parts[3].replace(/\.html$/, ""));
    }

    return "";
}

function toSitePath(value, fallback) {
    const candidate =
        typeof value === "string" && value.trim() ? value.trim() : fallback;
    if (!candidate) return "";
    if (candidate.startsWith("/")) return candidate;
    if (candidate.startsWith("./")) return `/${candidate.slice(2)}`;
    return `/${candidate}`;
}

async function loadEntryIndex() {
    if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
        throw new Error("YAML parser unavailable");
    }

    const response = await fetch(ENTRY_INDEX_PATH);
    if (!response.ok) throw new Error("Entry index unavailable");

    const source = await response.text();
    return normalizeEntries(window.jsyaml.load(source));
}

function formatDate(value) {
    if (!value) return "";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function parseFrontmatter(source) {
    if (!source.startsWith("---")) {
        return { meta: {}, body: source };
    }

    const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) {
        return { meta: {}, body: source };
    }

    const metaLines = match[1].split("\n");
    const meta = {};

    metaLines.forEach((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return;
        const key = line.slice(0, separator).trim();
        const rawValue = line.slice(separator + 1).trim();
        meta[key] = rawValue.replace(/^"(.*)"$/, "$1");
    });

    return {
        meta,
        body: source.slice(match[0].length),
    };
}

function renderError(message) {
    titleEl.textContent = "Entry not found";
    metaEl.textContent = "";
    contentEl.innerHTML = `<p>${message}</p>`;
}

function hydrateMermaid() {
    const blocks = contentEl.querySelectorAll("pre code.language-mermaid");
    if (!blocks.length) return;
    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    blocks.forEach((block, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "mermaid";
        wrapper.id = `mermaid-${index}-${Date.now()}`;
        wrapper.textContent = block.textContent ?? "";
        const pre = block.closest("pre");
        if (pre) pre.replaceWith(wrapper);
    });

    if (window.mermaid) {
        window.mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? "dark" : "neutral",
            securityLevel: "loose",
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Segoe UI", Arial, sans-serif',
        });
        window.mermaid.run({
            nodes: Array.from(contentEl.querySelectorAll(".mermaid")),
        });
    }
}

function hydrateMath() {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(contentEl, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        throwOnError: false,
    });
}

async function loadEntry() {
    const slug = getSlugFromRoute();

    if (!slug) {
        renderError("Missing entry slug.");
        return;
    }

    try {
        const entries = await loadEntryIndex();
        const indexed = entries.find((item) => item.slug === slug);
        if (!indexed) throw new Error("Entry not listed");

        const markdownPath = toSitePath(indexed.path, `/content/${slug}.md`);
        const entryResponse = await fetch(markdownPath);
        if (!entryResponse.ok) throw new Error("Markdown file unavailable");

        const raw = await entryResponse.text();
        const parsed = parseFrontmatter(raw);
        const meta = { ...indexed, ...parsed.meta };

        document.title = `${meta.title} - ${getTitleSuffix()}`;
        titleEl.textContent = meta.title || "Untitled";
        metaEl.textContent = [formatDate(meta.date), meta.kind]
            .filter(Boolean)
            .join(" · ");

        if (window.marked) {
            window.marked.setOptions({
                gfm: true,
                breaks: false,
            });
            contentEl.innerHTML = window.marked.parse(parsed.body);
        } else {
            contentEl.textContent = parsed.body;
        }

        hydrateMermaid();
        hydrateMath();
    } catch (error) {
        renderError("This entry could not be loaded.");
    }
}

let entryLoadStarted = false;

function ensureEntryLoaded() {
    if (entryLoadStarted) return;
    entryLoadStarted = true;
    loadEntry();
}

if (window.siteConfig) {
    ensureEntryLoaded();
} else {
    window.addEventListener("sitecontentloaded", ensureEntryLoaded, {
        once: true,
    });
    window.setTimeout(ensureEntryLoaded, 450);
}

window.addEventListener("themechange", () => {
    if (contentEl.querySelector(".mermaid")) {
        loadEntry();
    }
});
