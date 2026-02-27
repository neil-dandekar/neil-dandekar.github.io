const ENTRY_INDEX_PATH = "/content/entries.yaml";
const entryList = document.getElementById("entryList");
const listControls = document.getElementById("listControls");
const tagSelect = document.getElementById("tagSelect");
const sortSelect = document.getElementById("sortSelect");

const thoughtsState = {
    allEntries: [],
    activeKind: "",
    sort: "modified-desc",
};

function getThoughtsEmptyMessage() {
    const configured = window.siteCopy?.thoughtsEmptyMessage;
    return typeof configured === "string" && configured.trim()
        ? configured.trim()
        : "No entries yet.";
}

function normalizeEntries(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.entries)) return raw.entries;
    return [];
}

async function loadEntryIndex() {
    if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
        throw new Error("YAML parser unavailable");
    }

    const response = await fetch(ENTRY_INDEX_PATH);
    if (!response.ok) throw new Error("Entry index not found");

    const source = await response.text();
    return normalizeEntries(window.jsyaml.load(source));
}

function formatDate(value) {
    if (!value) return "";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getEntryRoute(slug) {
    return `/thoughts/${encodeURIComponent(slug)}/`;
}

function buildEntries(listNode, entries) {
    if (!listNode) return;
    listNode.replaceChildren();

    if (!entries.length) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = getThoughtsEmptyMessage();
        listNode.appendChild(empty);
        return;
    }

    entries.forEach((entry) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const meta = document.createElement("p");

        link.className = "entry-link";
        link.href = getEntryRoute(entry.slug);
        link.textContent = entry.title;

        meta.className = "entry-meta";
        const pieces = [formatDate(entry.date), entry.kind].filter(Boolean);
        meta.textContent = pieces.join(" · ");

        item.append(link, meta);
        listNode.appendChild(item);
    });
}

function buildFinderEntries(listNode, entries) {
    if (!listNode) return;
    listNode.replaceChildren();

    if (!entries.length) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = getThoughtsEmptyMessage();
        listNode.appendChild(empty);
        return;
    }

    entries.forEach((entry) => {
        const item = document.createElement("li");
        item.className = "finder-row";

        const name = document.createElement("span");
        name.className = "finder-name";

        const link = document.createElement("a");
        link.className = "entry-link finder-file-link";
        link.href = getEntryRoute(entry.slug);
        link.textContent = entry.title;
        name.appendChild(link);

        const kind = document.createElement("span");
        kind.className = "finder-kind";
        kind.textContent = entry.kind || "—";

        const modified = document.createElement("span");
        modified.className = "finder-date";
        modified.textContent = formatDate(entry.date) || "—";

        item.append(name, kind, modified);
        listNode.appendChild(item);
    });
}

function getUniqueKinds(entries) {
    const kinds = new Set();
    entries.forEach((entry) => {
        if (entry?.kind) kinds.add(entry.kind);
    });
    return Array.from(kinds).sort((a, b) => a.localeCompare(b));
}

function renderTagFilterOptions() {
    if (!tagSelect) return;

    const currentValue = tagSelect.value;
    const options = ["", ...getUniqueKinds(thoughtsState.allEntries)];
    tagSelect.replaceChildren();

    options.forEach((kind) => {
        const option = document.createElement("option");
        option.value = kind;
        option.textContent = kind || "All tags";
        tagSelect.appendChild(option);
    });

    tagSelect.value = options.includes(currentValue) ? currentValue : "";
    thoughtsState.activeKind = tagSelect.value || "";
}

function getSortedEntries(entries, sortMode) {
    const arranged = [...entries];
    arranged.sort((a, b) => {
        const aTime = new Date(`${a.date}T00:00:00`).getTime();
        const bTime = new Date(`${b.date}T00:00:00`).getTime();
        const dateDiff = aTime - bTime;

        if (sortMode === "modified-asc") return dateDiff;
        if (sortMode === "modified-desc") return -dateDiff;

        const aKind = (a.kind || "").toLowerCase();
        const bKind = (b.kind || "").toLowerCase();
        if (aKind !== bKind) {
            if (sortMode === "tag-desc") {
                return bKind.localeCompare(aKind);
            }
            return aKind.localeCompare(bKind);
        }

        if (sortMode === "tag-desc") return dateDiff;
        return -dateDiff;
    });
    return arranged;
}

function renderThoughtEntries() {
    let visible = thoughtsState.allEntries;
    if (thoughtsState.activeKind) {
        visible = visible.filter(
            (entry) => entry.kind === thoughtsState.activeKind,
        );
    }
    visible = getSortedEntries(visible, thoughtsState.sort);
    buildFinderEntries(entryList, visible);
}

async function loadEntryList() {
    if (!entryList) return;

    try {
        const allEntries = await loadEntryIndex();

        const sorted = getSortedEntries(allEntries, "modified-desc");
        const page = document.body.dataset.page;

        if (page === "thoughts") {
            thoughtsState.allEntries = sorted;
            thoughtsState.activeKind = "";
            thoughtsState.sort = sortSelect?.value || "modified-desc";
            if (listControls) listControls.hidden = false;
            renderTagFilterOptions();
            renderThoughtEntries();
            if (tagSelect) {
                tagSelect.addEventListener("change", (event) => {
                    thoughtsState.activeKind = event.target.value || "";
                    renderThoughtEntries();
                });
            }
            if (sortSelect) {
                sortSelect.addEventListener("change", (event) => {
                    thoughtsState.sort = event.target.value;
                    renderThoughtEntries();
                });
            }
            return;
        }

        if (page === "home") {
            const featured = sorted
                .filter((entry) => entry.featured)
                .slice(0, 6);
            buildEntries(entryList, featured);
            return;
        }

        buildEntries(entryList, []);
    } catch (error) {
        buildEntries(entryList, []);
    }
}

let entryListStarted = false;

function ensureEntryListLoaded() {
    if (entryListStarted) return;
    entryListStarted = true;
    loadEntryList();
}

if (window.siteConfig) {
    ensureEntryListLoaded();
} else {
    window.addEventListener("sitecontentloaded", ensureEntryListLoaded, {
        once: true,
    });
    window.setTimeout(ensureEntryListLoaded, 450);
}
