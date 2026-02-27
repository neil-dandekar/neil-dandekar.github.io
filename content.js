const SITE_CONTENT_PATH = "/content/site.yaml";
const NAV_FS_ENTRY_INDEX_PATH = "/content/entries.yaml";

const DEFAULT_SITE_CONTENT = {
    site: {
        name: "Neil Dandekar",
        title_suffix: "Neil Dandekar",
        notebook_label: "Thoughts",
        footer_credit: "Built by Neil",
        source_url: "https://github.com/neildandekar/neil-dandekar.github.io",
        socials: {
            github: "https://github.com/neildandekar",
            linkedin: "https://www.linkedin.com/in/neildandekar/",
            instagram: "https://www.instagram.com/neildandekar/",
            x: "https://x.com/neildandekar",
        },
    },
    home: {
        intro_title: "Hi, I’m Neil.",
        intro_paragraphs: [],
        experience_label: "Experience",
        experience_empty: "Experience updates soon.",
        experiences: [],
    },
    thoughts: {
        heading: "Thoughts",
        sort_label: "Sort",
        sort_newest: "Newest first",
        sort_oldest: "Oldest first",
        empty_message: "No entries yet.",
    },
};

function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getText(value, fallback = "") {
    if (typeof value !== "string") return fallback;
    return value.trim() || fallback;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderInlineMarkdown(text) {
    const source = getText(text);
    if (!source) return "";

    const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let result = "";
    let lastIndex = 0;
    let match = linkPattern.exec(source);

    while (match) {
        const [fullMatch, label, url] = match;
        result += escapeHtml(source.slice(lastIndex, match.index));
        result += `<a href="${escapeAttr(url)}">${escapeHtml(label)}</a>`;
        lastIndex = match.index + fullMatch.length;
        match = linkPattern.exec(source);
    }

    result += escapeHtml(source.slice(lastIndex));
    return result;
}

function normalizeFilesystemEntries(raw) {
    if (Array.isArray(raw)) return raw;
    if (isObject(raw) && Array.isArray(raw.entries)) return raw.entries;
    return [];
}

function getFilesystemEntryFile(entry) {
    const slug = getText(entry?.slug);
    if (slug) return `${slug}.md`;
    const title = getText(entry?.title);
    if (title) {
        return `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    }
    return "entry.md";
}

function sortFilesystemEntries(entries) {
    const arranged = [...entries];
    arranged.sort((a, b) => {
        const aDate = new Date(`${getText(a?.date)}T00:00:00`).getTime();
        const bDate = new Date(`${getText(b?.date)}T00:00:00`).getTime();
        const aValid = Number.isFinite(aDate);
        const bValid = Number.isFinite(bDate);
        if (aValid && bValid) return bDate - aDate;
        if (aValid) return -1;
        if (bValid) return 1;
        return getFilesystemEntryFile(a).localeCompare(
            getFilesystemEntryFile(b),
        );
    });
    return arranged;
}

function getCurrentEntrySlug() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = getText(params.get("slug"));
    if (fromQuery) return fromQuery;

    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "thoughts") {
        return decodeURIComponent(parts[1]);
    }
    return "";
}

function getEntryRoute(slug) {
    return `/thoughts/${encodeURIComponent(slug)}/`;
}

function appendFilesystemNodeContent(node, label, kind) {
    const icon = document.createElement("span");
    icon.className = `fs-node-icon ${kind === "file" ? "is-file" : "is-dir"}`;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = kind === "file" ? "📄" : "📁";

    const text = document.createElement("span");
    text.className = "fs-node-text";
    text.textContent = label;

    node.append(icon, text);
}

function createFilesystemPathLink(label, href, current = false) {
    if (current || !href) {
        const span = document.createElement("span");
        span.className = "fs-path-current";
        span.textContent = label;
        return span;
    }

    const link = document.createElement("a");
    link.className = "fs-path-link";
    link.href = href;
    link.textContent = label;
    return link;
}

function createFilesystemTreeLink(label, href, options = {}) {
    const { current = false, kind = "dir" } = options;
    const link = document.createElement("a");
    link.className = `fs-tree-link fs-node ${kind === "file" ? "is-file" : "is-dir"}`;
    link.href = href;
    appendFilesystemNodeContent(link, label, kind);
    if (current) {
        link.classList.add("is-current");
        link.setAttribute("aria-current", "page");
    }
    return link;
}

function getNotebookDirectoryName() {
    return "thoughts";
}

function getFilesystemRootName(content) {
    const fromSiteName = getText(content?.site?.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
    return fromSiteName || "neildandekar";
}

function renderFilesystemPath(content, entries, pathNode) {
    if (!pathNode) return;
    pathNode.replaceChildren();

    const page = document.body.dataset.page;
    const rootName = getFilesystemRootName(content);
    const notebookDir = getNotebookDirectoryName();
    const currentSlug = getCurrentEntrySlug();
    const currentEntry = entries.find(
        (entry) => getText(entry?.slug) === currentSlug,
    );

    const segments = [];

    segments.push({
        label: rootName,
        href: "/",
        current: false,
    });

    if (page === "home") {
        segments.push({
            label: "home.md",
            href: "",
            current: true,
        });
    }

    if (page === "experience") {
        segments.push({
            label: "experience.md",
            href: "",
            current: true,
        });
    }

    if (page === "thoughts" || page === "entry") {
        segments.push({
            label: notebookDir,
            href: "/thoughts/",
            current: page === "thoughts",
        });
    }

    if (page === "entry") {
        segments.push({
            label: currentEntry
                ? getFilesystemEntryFile(currentEntry)
                : "entry.md",
            href: "",
            current: true,
        });
    }

    const pathIcon = document.createElement("span");
    pathIcon.className = "fs-path-icon";
    pathIcon.setAttribute("aria-hidden", "true");
    pathIcon.textContent = "📁";
    pathNode.appendChild(pathIcon);

    const prefix = document.createElement("span");
    prefix.className = "fs-prefix";
    prefix.textContent = "~";
    pathNode.appendChild(prefix);

    segments.forEach((segment, index) => {
        const separator = document.createElement("span");
        separator.className = "fs-sep";
        separator.textContent = "/";
        pathNode.appendChild(separator);
        pathNode.appendChild(
            createFilesystemPathLink(
                segment.label,
                segment.href,
                segment.current,
            ),
        );
    });
}

function renderFilesystemTree(content, entries, treeNode) {
    if (!treeNode) return;
    treeNode.replaceChildren();

    const page = document.body.dataset.page;
    const rootName = getFilesystemRootName(content);
    const notebookDir = getNotebookDirectoryName();
    const currentSlug = getCurrentEntrySlug();
    const sortedEntries = sortFilesystemEntries(entries);

    const rootList = document.createElement("ul");
    rootList.className = "fs-tree-list";

    const repoItem = document.createElement("li");
    repoItem.className = "fs-tree-item";
    repoItem.appendChild(
        createFilesystemTreeLink(`${rootName}/`, "/", {
            current: false,
            kind: "dir",
        }),
    );

    const repoChildren = document.createElement("ul");
    repoChildren.className = "fs-tree-subtree";

    const homeItem = document.createElement("li");
    homeItem.className = "fs-tree-item";
    homeItem.appendChild(
        createFilesystemTreeLink("home.md", "/", {
            current: page === "home",
            kind: "file",
        }),
    );

    const experienceItem = document.createElement("li");
    experienceItem.className = "fs-tree-item";
    experienceItem.appendChild(
        createFilesystemTreeLink("experience.md", "/experience/", {
            current: page === "experience",
            kind: "file",
        }),
    );

    const thoughtsItem = document.createElement("li");
    thoughtsItem.className = "fs-tree-item";
    thoughtsItem.appendChild(
        createFilesystemTreeLink(`${notebookDir}/`, "/thoughts/", {
            current: page === "thoughts",
            kind: "dir",
        }),
    );

    const thoughtFiles = document.createElement("ul");
    thoughtFiles.className = "fs-tree-subtree fs-tree-files";

    if (!sortedEntries.length) {
        const empty = document.createElement("li");
        empty.className = "fs-tree-item fs-tree-empty";
        empty.textContent = "(empty)";
        thoughtFiles.appendChild(empty);
    } else {
        sortedEntries.forEach((entry) => {
            const item = document.createElement("li");
            item.className = "fs-tree-item";
            const slug = getText(entry?.slug);
            const label = getFilesystemEntryFile(entry);
            const href = slug ? getEntryRoute(slug) : "/thoughts/";
            const isCurrent = page === "entry" && slug === currentSlug;
            item.appendChild(
                createFilesystemTreeLink(label, href, {
                    current: isCurrent,
                    kind: "file",
                }),
            );
            thoughtFiles.appendChild(item);
        });
    }

    thoughtsItem.appendChild(thoughtFiles);
    repoChildren.append(homeItem, experienceItem, thoughtsItem);
    repoItem.appendChild(repoChildren);
    rootList.appendChild(repoItem);
    treeNode.appendChild(rootList);
}

function attachFilesystemDisclosure(navNode, disclosureNode, treeNode) {
    if (!navNode || !disclosureNode || !treeNode) return;

    const updateState = () => {
        const expanded = !treeNode.hidden;
        disclosureNode.setAttribute(
            "aria-expanded",
            expanded ? "true" : "false",
        );
        disclosureNode.setAttribute(
            "aria-label",
            expanded ? "Collapse file tree" : "Expand file tree",
        );
    };

    const closeTree = () => {
        if (treeNode.hidden) return;
        treeNode.hidden = true;
        updateState();
    };

    if (!disclosureNode.dataset.bound) {
        disclosureNode.addEventListener("click", () => {
            treeNode.hidden = !treeNode.hidden;
            updateState();
        });

        navNode.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (link) {
                closeTree();
            }
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (navNode.contains(target)) return;
            closeTree();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeTree();
            }
        });

        disclosureNode.dataset.bound = "true";
    }

    if (!disclosureNode.dataset.initialized) {
        treeNode.hidden = true;
        disclosureNode.dataset.initialized = "true";
    }

    updateState();
}

function renderFilesystemNav(content, entries) {
    const nav = document.getElementById("fsNav");
    if (!nav) return;

    const pathNode = nav.querySelector("#fsPath");
    const treeNode = nav.querySelector("#fsTree");
    const disclosureNode = nav.querySelector("#fsDisclosure");
    if (!pathNode || !treeNode || !disclosureNode) return;

    renderFilesystemPath(content, entries, pathNode);
    renderFilesystemTree(content, entries, treeNode);
    attachFilesystemDisclosure(nav, disclosureNode, treeNode);
}

function renderTopbarPath(content, entries) {
    const pathNode = document.getElementById("topbarPath");
    if (!pathNode) return;
    renderFilesystemPath(content, entries, pathNode);
}

function applyQuickLinks(content) {
    const links = [
        {
            id: "socialGithub",
            href: content.site.socials.github,
        },
        {
            id: "socialLinkedin",
            href: content.site.socials.linkedin,
        },
        {
            id: "socialInstagram",
            href: content.site.socials.instagram,
        },
        {
            id: "socialX",
            href: content.site.socials.x,
        },
    ];

    links.forEach((item) => {
        const node = document.getElementById(item.id);
        if (!(node instanceof HTMLAnchorElement)) return;
        if (!item.href) {
            node.hidden = true;
            return;
        }
        node.href = item.href;
        node.hidden = false;
    });
}

function applyFooterCopy(content) {
    const credit = document.getElementById("footerCredit");
    if (credit) {
        credit.textContent = content.site.footer_credit;
    }

    const source = document.getElementById("sourceCodeLink");
    if (!(source instanceof HTMLAnchorElement)) return;
    if (!content.site.source_url) {
        source.hidden = true;
        return;
    }
    source.href = content.site.source_url;
    source.hidden = false;
}

function normalizeSiteContent(raw) {
    const source = isObject(raw) ? raw : {};
    const site = isObject(source.site) ? source.site : {};
    const siteSocials = isObject(site.socials) ? site.socials : {};
    const home = isObject(source.home) ? source.home : {};
    const thoughts = isObject(source.thoughts) ? source.thoughts : {};

    const introParagraphs = Array.isArray(home.intro_paragraphs)
        ? home.intro_paragraphs.filter((item) => typeof item === "string")
        : DEFAULT_SITE_CONTENT.home.intro_paragraphs;

    const experiences = Array.isArray(home.experiences)
        ? home.experiences
              .filter((item) => isObject(item))
              .map((item) => {
                  const logo = isObject(item.logo) ? item.logo : {};
                  return {
                      role: getText(item.role),
                      company: getText(item.company),
                      period: getText(item.period),
                      location: getText(item.location),
                      company_line: getText(item.company_line),
                      summary: getText(item.summary),
                      logo: {
                          src: getText(logo.src),
                          alt: getText(logo.alt),
                          text: getText(logo.text),
                      },
                  };
              })
        : DEFAULT_SITE_CONTENT.home.experiences;

    return {
        site: {
            name: getText(site.name, DEFAULT_SITE_CONTENT.site.name),
            title_suffix: getText(
                site.title_suffix,
                DEFAULT_SITE_CONTENT.site.title_suffix,
            ),
            notebook_label: getText(
                site.notebook_label,
                DEFAULT_SITE_CONTENT.site.notebook_label,
            ),
            footer_credit: getText(
                site.footer_credit,
                DEFAULT_SITE_CONTENT.site.footer_credit,
            ),
            source_url: getText(
                site.source_url,
                DEFAULT_SITE_CONTENT.site.source_url,
            ),
            socials: {
                github: getText(
                    siteSocials.github,
                    DEFAULT_SITE_CONTENT.site.socials.github,
                ),
                linkedin: getText(
                    siteSocials.linkedin,
                    DEFAULT_SITE_CONTENT.site.socials.linkedin,
                ),
                instagram: getText(
                    siteSocials.instagram,
                    DEFAULT_SITE_CONTENT.site.socials.instagram,
                ),
                x: getText(siteSocials.x, DEFAULT_SITE_CONTENT.site.socials.x),
            },
        },
        home: {
            intro_title: getText(
                home.intro_title,
                DEFAULT_SITE_CONTENT.home.intro_title,
            ),
            intro_paragraphs: introParagraphs,
            experience_label: getText(
                home.experience_label,
                DEFAULT_SITE_CONTENT.home.experience_label,
            ),
            experience_empty: getText(
                home.experience_empty,
                DEFAULT_SITE_CONTENT.home.experience_empty,
            ),
            experiences,
        },
        thoughts: {
            heading: getText(
                thoughts.heading,
                DEFAULT_SITE_CONTENT.thoughts.heading,
            ),
            sort_label: getText(
                thoughts.sort_label,
                DEFAULT_SITE_CONTENT.thoughts.sort_label,
            ),
            sort_newest: getText(
                thoughts.sort_newest,
                DEFAULT_SITE_CONTENT.thoughts.sort_newest,
            ),
            sort_oldest: getText(
                thoughts.sort_oldest,
                DEFAULT_SITE_CONTENT.thoughts.sort_oldest,
            ),
            empty_message: getText(
                thoughts.empty_message,
                DEFAULT_SITE_CONTENT.thoughts.empty_message,
            ),
        },
    };
}

function applyGlobalCopy(content, entries) {
    renderTopbarPath(content, entries);
    applyQuickLinks(content);
    applyFooterCopy(content);

    const page = document.body.dataset.page;
    if (page === "home") {
        document.title = content.site.title_suffix;
    }
    if (page === "experience") {
        document.title = `${content.home.experience_label} - ${content.site.title_suffix}`;
    }
    if (page === "thoughts") {
        document.title = `${content.thoughts.heading} - ${content.site.title_suffix}`;
    }
}

function toSitePath(value) {
    const source = getText(value);
    if (!source) return "";
    if (/^(https?:)?\/\//.test(source)) return source;
    if (source.startsWith("/")) return source;
    if (source.startsWith("./")) return `/${source.slice(2)}`;
    return `/${source}`;
}

function buildExperienceLogo(logoConfig) {
    const logo = document.createElement("div");
    logo.className = "experience-logo";

    if (logoConfig.src) {
        const image = document.createElement("img");
        image.src = toSitePath(logoConfig.src);
        image.alt = logoConfig.alt || "";
        logo.appendChild(image);
        return logo;
    }

    logo.textContent = logoConfig.text || "";
    return logo;
}

function renderExperienceList(experiences, emptyText) {
    const list = document.getElementById("experienceList");
    if (!list) return;
    list.replaceChildren();

    if (!experiences.length) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = emptyText || "Experience updates soon.";
        list.appendChild(empty);
        return;
    }

    experiences.forEach((experience) => {
        const item = document.createElement("li");
        item.className = "experience-item";

        const meta = document.createElement("article");
        meta.className = "experience-meta";

        const details = document.createElement("div");
        details.className = "experience-details";

        const header = document.createElement("div");
        header.className = "experience-header";

        const logo = buildExperienceLogo(experience.logo);
        header.appendChild(logo);

        const heading = document.createElement("div");
        heading.className = "experience-heading";

        if (experience.role || experience.company) {
            const role = document.createElement("h3");
            role.className = "experience-role";
            role.innerHTML = renderInlineMarkdown(
                experience.role || "Experience",
            );
            heading.appendChild(role);
        }

        if (experience.company_line || experience.company) {
            const company = document.createElement("p");
            company.className = "experience-company";
            company.innerHTML = renderInlineMarkdown(
                experience.company_line || experience.company || "",
            );
            heading.appendChild(company);
        }

        header.appendChild(heading);
        meta.appendChild(header);

        if (experience.period) {
            const period = document.createElement("p");
            period.className = "experience-period";
            period.innerHTML = renderInlineMarkdown(experience.period);
            meta.appendChild(period);
        }

        if (experience.location) {
            const location = document.createElement("p");
            location.className = "experience-location";
            location.innerHTML = renderInlineMarkdown(experience.location);
            meta.appendChild(location);
        }

        if (experience.summary) {
            const summary = document.createElement("p");
            summary.className = "experience-summary";
            summary.innerHTML = renderInlineMarkdown(experience.summary);
            details.appendChild(summary);
        }

        item.append(meta, details);
        list.appendChild(item);
    });
}

function applyHomeCopy(content) {
    if (document.body.dataset.page !== "home") return;

    const intro = document.getElementById("homeIntro");
    if (intro) {
        intro.replaceChildren();

        const title = document.createElement("h1");
        title.className = "home-title";
        title.innerHTML = renderInlineMarkdown(content.home.intro_title);
        intro.appendChild(title);

        content.home.intro_paragraphs.forEach((paragraph) => {
            const node = document.createElement("p");
            node.className = "lede";
            node.innerHTML = renderInlineMarkdown(paragraph);
            intro.appendChild(node);
        });
    }
}

function applyExperienceCopy(content) {
    if (document.body.dataset.page !== "experience") return;

    const experienceLabel = document.getElementById("experienceLabel");
    if (experienceLabel) {
        experienceLabel.textContent = content.home.experience_label;
    }

    renderExperienceList(
        content.home.experiences,
        content.home.experience_empty,
    );
}

function applyThoughtsCopy(content) {
    if (document.body.dataset.page !== "thoughts") return;

    const heading = document.getElementById("thoughtsHeading");
    if (heading) {
        heading.textContent = content.thoughts.heading;
    }

    const sortLabel = document.getElementById("sortLabel");
    if (sortLabel) {
        sortLabel.textContent = content.thoughts.sort_label;
    }

    const newest = document.getElementById("sortNewestLabel");
    if (newest) {
        newest.textContent = content.thoughts.sort_newest;
    }

    const oldest = document.getElementById("sortOldestLabel");
    if (oldest) {
        oldest.textContent = content.thoughts.sort_oldest;
    }
}

async function loadSiteContent() {
    try {
        if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
            throw new Error("YAML parser unavailable");
        }

        const response = await fetch(SITE_CONTENT_PATH);
        if (!response.ok) {
            throw new Error("Site content missing");
        }

        const source = await response.text();
        const parsed = window.jsyaml.load(source);
        return normalizeSiteContent(parsed);
    } catch {
        return normalizeSiteContent(DEFAULT_SITE_CONTENT);
    }
}

async function loadFilesystemEntries() {
    try {
        if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
            throw new Error("YAML parser unavailable");
        }

        const response = await fetch(NAV_FS_ENTRY_INDEX_PATH);
        if (!response.ok) {
            throw new Error("Entry index missing");
        }

        const source = await response.text();
        const parsed = window.jsyaml.load(source);
        return normalizeFilesystemEntries(parsed);
    } catch {
        return [];
    }
}

async function initSiteContent() {
    const shouldLoadFilesystemEntries =
        Boolean(document.getElementById("topbarPath")) ||
        Boolean(document.getElementById("fsNav"));
    const [content, entries] = await Promise.all([
        loadSiteContent(),
        shouldLoadFilesystemEntries
            ? loadFilesystemEntries()
            : Promise.resolve([]),
    ]);
    window.siteConfig = content;
    window.siteEntries = entries;
    window.siteCopy = {
        thoughtsEmptyMessage: content.thoughts.empty_message,
    };

    applyGlobalCopy(content, entries);
    applyHomeCopy(content);
    applyExperienceCopy(content);
    applyThoughtsCopy(content);

    window.dispatchEvent(
        new CustomEvent("sitecontentloaded", {
            detail: { content, entries },
        }),
    );
}

initSiteContent();
