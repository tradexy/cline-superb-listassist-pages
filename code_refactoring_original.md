# Refactoring Blueprint: List Assist Chrome Extension

**Project:** List Assist Chrome Extension
**Lead Architect:** (Superb Engineer)
**Assigned Engineer:** (Superb Engineer)
**Date:** (Current Date)
**Version:** 1.0

## 1. Project Overview & Goals

The List Assist Chrome Extension allows users to create, manage, customize, and share shopping lists, with affiliate link integration. The current codebase has grown organically, leading to some duplication and inefficiencies.

**Primary Goals of this Refactoring Initiative:**

1.  **Code Reduction:** Achieve approximately 50% reduction in overall lines of code (CSS & JS) by eliminating duplication and abstracting common logic.
2.  **Improved Maintainability:** Create a more modular and easier-to-understand codebase.
3.  **Enhanced Performance:** Optimize DOM manipulation and resource loading for a smoother user experience.
4.  **Consistent Functionality:** Ensure all existing features work as expected or better post-refactoring. This includes fixing existing bugs like inconsistent affiliate link generation.
5.  **Consistent UI/UX:** Maintain or improve the visual consistency and user experience across the extension and the shared pages.
6.  **Single Source of Truth:** Establish canonical files for shared styles and utility functions.

## 2. Guiding Principles for Refactoring

*   **Incremental Changes:** Make small, testable changes. Commit frequently.
*   **Test Thoroughly:** After each significant step, test all related functionality.
*   **Don't Break Existing Functionality:** The primary directive is to refactor without introducing regressions. If a refactoring step proves too complex or risky for a feature, document it and we can reassess.
*   **Readability Counts:** Write clear, well-commented code.
*   **DRY (Don't Repeat Yourself):** Actively look for and eliminate redundancy.
*   **Communicate:** Ask questions if anything is unclear. Report progress and any roadblocks.

## 3. Prerequisites & Setup

1.  **Version Control:**
    *   Ensure both repositories (`cline-listassist` and `cline-listassist-pages`) are under Git version control.
    *   Create a new feature branch in each repository for this refactoring work (e.g., `refactor/code-consolidation`).
2.  **Development Environment:**
    *   Set up a local development environment where you can load the extension as an "unpacked extension" in Chrome.
    *   Ensure you can serve the `docs` folder locally (e.g., using a simple HTTP server like `python -m http.server` or VS Code Live Server) to test `share.html`.
3.  **Understanding the Code:**
    *   Review the existing codebase provided, focusing on the files mentioned in the initial analysis (CSS files, JS files with helpers, `share.html`, `shopping_list.html`, etc.).
    *   Familiarize yourself with the extension's core features by using it.

## 4. Refactoring Roadmap (Top-Down Plan)

This roadmap is divided into phases and tasks. Each task will have detailed step-by-step instructions below.

**Phase 1: Preparation & Analysis (Foundation)**

*   **Task 1.1:** Full Code Backup and Branching
*   **Task 1.2:** Detailed Audit of Duplicated Code (CSS & JS)
*   **Task 1.3:** Establish a "Golden Source" Directory Structure

**Phase 2: CSS Consolidation & Unification**

*   **Task 2.1:** Create the Master `core.css`
*   **Task 2.2:** Merge Styles from `docs/core.css` into Master `core.css`
*   **Task 2.3:** Relocate Inline Styles from `share.html` to Master `core.css`
*   **Task 2.4:** Update All HTML Files to Link Master `core.css`
*   **Task 2.5:** Set Up `core.css` Sync to `docs` Folder

**Phase 3: JavaScript Utility Abstraction**

*   **Task 3.1:** Create `utils.js` in the Main Extension
*   **Task 3.2:** Consolidate Encoding/Decoding Functions into `utils.js`
*   **Task 3.3:** Consolidate Theme/Dark Mode Application Functions into `utils.js`
*   **Task 3.4:** Create Unified Affiliate Link Generation Function in `utils.js`
*   **Task 3.5:** Update Extension JS Files to Use `utils.js`
*   **Task 3.6:** Set Up `utils.js` Sync to `docs` Folder

**Phase 4: Refactoring Core Extension Logic**

*   **Task 4.1:** Refactor `shopping_list.js`
*   **Task 4.2:** Refactor `lists.js`
*   **Task 4.3:** Refactor `options.js`
*   **Task 4.4:** Refactor `background.js`
*   **Task 4.5:** Refactor `collaboration-features.js`

**Phase 5: Refactoring Shared Page Logic (`docs` folder)**

*   **Task 5.1:** Update `share.html` to use Synced `core.css` and `utils.js`
*   **Task 5.2:** Refactor `share.js` to Use `utils.js` and Streamline

**Phase 6: Performance Optimization & UI/UX Enhancements (Iterative)**

*   **Task 6.1:** Review and Optimize DOM Manipulations
*   **Task 6.2:** Ensure Consistent UI Styling
*   **Task 6.3 (Optional):** Address `enhanced_list.html` (Future Feature)

**Phase 7: Testing & Final Review**

*   **Task 7.1:** Comprehensive Functional Testing
*   **Task 7.2:** Code Review and Cleanup
*   **Task 7.3:** Measure Code Reduction

---

## 5. Detailed Task Instructions

---

### **Phase 1: Preparation & Analysis**

---

#### **Task 1.1: Full Code Backup and Branching**

*   **Goal:** Safeguard the current working state.
*   **Steps:**
    1.  Ensure all current changes in both `cline-listassist` and `cline-listassist-pages` repositories are committed to their respective main branches (e.g., `main` or `master`).
    2.  Create a full backup (e.g., zip archive) of both project directories outside of the Git repositories. Store this backup safely.
    3.  In the `cline-listassist` repository, create a new branch named `refactor/code-consolidation` from the main branch. Check out this new branch.
    4.  In the `cline-listassist-pages` repository (which contains the `docs` folder), create a new branch named `refactor/code-consolidation` from its main branch. Check out this new branch.
    5.  All subsequent work for this refactoring effort will be done on these new branches.

---

#### **Task 1.2: Detailed Audit of Duplicated Code (CSS & JS)**

*   **Goal:** Identify specific instances of duplicated CSS rules and JavaScript functions.
*   **Tools:** Use a text editor with good search functionality (e.g., VS Code "Search in files") or a diff tool.
*   **Steps:**
    1.  **CSS Audit:**
        *   Compare `cline-listassist/core.css` and `cline-listassist/docs/core.css`.
        *   List all identical or near-identical CSS rule blocks.
        *   Note CSS rules that are unique to `docs/core.css` (e.g., for `#share-container`).
        *   Identify any inline `<style>` blocks in HTML files (especially `share.html`).
    2.  **JavaScript Audit:**
        *   Search for the following function names or similar logic across all `.js` files (`background.js`, `collaboration-features.js`, `lists.js`, `options.js`, `shopping_list.js`, `share.js`):
            *   `utf8_to_b64` / `b64_to_utf8` (and similar Base64 logic)
            *   `applyThemeSettings` / `applyTheme` / `applyDarkMode` (logic that sets CSS variables or body classes for theming)
            *   `maybeInjectAffiliateTag` (affiliate link generation logic)
            *   Any other helper functions that appear in multiple files (e.g., DOM helpers if any).
        *   Document where each duplicated function is found and note any minor variations.
    3.  Create a simple document (e.g., `refactoring_audit.txt`) in your `cline-listassist` branch to list these findings. This will be your checklist for elimination.

---

#### **Task 1.3: Establish a "Golden Source" Directory Structure**

*   **Goal:** Define where the canonical shared files will reside.
*   **Decision:** The "golden source" for `core.css` and the new `utils.js` will be within the main extension's directory structure (e.g., `cline-listassist/css/core.css` and `cline-listassist/js/utils.js`). These will then be synced/copied to the `cline-listassist/docs/` folder for the GitHub Pages deployment.
*   **Steps:**
    1.  If they don't exist, create `css` and `js` subdirectories in your main `cline-listassist` project root if you prefer to organize (e.g., `cline-listassist/css/` and `cline-listassist/js/`). Otherwise, root is fine.
    2.  Confirm that the `docs` folder for GitHub pages is at `cline-listassist/docs/`.

---

### **Phase 2: CSS Consolidation & Unification**

---

#### **Task 2.1: Create the Master `core.css`**

*   **Goal:** Start with a single CSS file that will become the source of truth.
*   **Steps:**
    1.  In the `cline-listassist` repository (on your `refactor/code-consolidation` branch):
    2.  Decide which existing `core.css` is more comprehensive or a better starting point. Let's assume it's `cline-listassist/core.css` (the one from the main extension, not the `docs` folder).
    3.  If you created a `css` subdirectory: Move `cline-listassist/core.css` to `cline-listassist/css/core.css`. Update its path in any HTML files that currently link to it from the root.
    4.  This file is now your "Master `core.css`".

---

#### **Task 2.2: Merge Styles from `docs/core.css` into Master `core.css`**

*   **Goal:** Integrate all necessary styles into one file, eliminating redundancy.
*   **Steps:**
    1.  Open both the Master `core.css` (e.g., `cline-listassist/css/core.css`) and the `cline-listassist/docs/core.css`.
    2.  Carefully review `cline-listassist/docs/core.css`. For each rule or block of rules:
        *   **If identical or very similar to a rule in Master `core.css`:** Do nothing yet, or if the version in Master is older/less complete, update the Master version. The goal is one best version.
        *   **If unique and specific to the share page functionality (e.g., styles for `#share-table`, `#share-container`, or specific subtitle styling for the share page):** Copy these unique rules into the Master `core.css`.
            *   Consider grouping these under a comment like `/* === Share Page Specific Styles === */` or even wrapping them with a parent class like `.share-page-body { ... }` if you want to scope them more tightly, though direct element/ID selectors should be fine if `share.html` has a unique body class or top-level container ID. For now, direct integration is fine.
        *   **If a general style (e.g., table, p, body) from `docs/core.css` is better or more up-to-date than what's in Master `core.css`:** Replace the version in Master `core.css`.
    3.  **Focus on CSS Variables:** Ensure that all theme-related styling (colors, fonts, backgrounds) consistently uses the CSS variables:
        *   `--user-font-family`
        *   `--user-main-bg-color`
        *   `--user-bg-color`
        *   `--user-text-color`
        *   And the dark mode overrides.
    4.  Once all relevant styles from `docs/core.css` are merged, you can (for now) keep `docs/core.css` as is, or empty it. It will be overwritten in Task 2.5.
    5.  **Test:** Load the extension and navigate through its pages. Check for any visual regressions.

---

#### **Task 2.3: Relocate Inline Styles from `share.html` to Master `core.css`**

*   **Goal:** Remove inline styles for better maintainability and CSP compliance.
*   **Steps:**
    1.  Open `cline-listassist/docs/share.html`.
    2.  Locate the `<style>` block at the end of the `<body>`.
    3.  Copy all CSS rules from this inline `<style>` block.
    4.  Paste these rules into your Master `core.css` (e.g., `cline-listassist/css/core.css`), preferably under the `/* === Share Page Specific Styles === */` section if you created one.
    5.  Delete the entire `<style> ... </style>` block from `cline-listassist/docs/share.html`.
    6.  **Test:** Serve `share.html` locally and ensure styles are still applied correctly from the (yet to be synced) Master `core.css`. For now, you might need to temporarily link `share.html` to the master `core.css` in your local `cline-listassist` checkout for testing this step, or wait until Task 2.5.

---

#### **Task 2.4: Update All HTML Files to Link Master `core.css`**

*   **Goal:** Ensure all parts of the extension and the share page use the single CSS source.
*   **Steps:**
    1.  In the `cline-listassist` repository:
        *   For each HTML file (`shopping_list.html`, `lists.html`, `options.html`, `disclosure.html`, `enhanced_list.html`):
            *   Update the `<link rel="stylesheet" ...>` tag to point to the Master `core.css`.
            *   Example: If Master `core.css` is now at `css/core.css`, the link should be `<link rel="stylesheet" type="text/css" href="css/core.css">`.
    2.  In `cline-listassist/docs/share.html`:
        *   Update its `<link rel="stylesheet" ...>` to point to `core.css` (it will expect `core.css` to be in the same `docs` directory after the sync step). The href should be `href="core.css"`.
    3.  **Test:**
        *   Load the extension. Navigate to all its pages. Verify styling.
        *   Locally serve `docs/share.html` (after performing Task 2.5 or manually copying the Master `core.css` to `docs` for this test). Verify styling.

---

#### **Task 2.5: Set Up `core.css` Sync to `docs` Folder**

*   **Goal:** Automate or establish a clear process for keeping `docs/core.css` identical to Master `core.css`.
*   **Options:**
    *   **Manual Copy:** The simplest. After any change to Master `core.css`, manually copy it to `cline-listassist/docs/core.css`. Document this step clearly.
    *   **Simple Script (Recommended for consistency):**
        *   Create a very simple shell script (e.g., `sync_shared_files.sh`) or a `package.json` script (if using Node.js for anything else).
        *   This script would simply copy `cline-listassist/css/core.css` to `cline-listassist/docs/core.css`.
        *   Example `sync_shared_files.sh`:
            ```bash
            #!/bin/bash
            echo "Syncing core.css to docs..."
            cp ./css/core.css ./docs/core.css
            # Add utils.js later
            echo "Sync complete."
            ```
        *   Run this script whenever Master `core.css` is updated.
*   **Steps:**
    1.  Choose your preferred method (manual or script).
    2.  If scripting, create and test the script.
    3.  Perform the sync/copy now.
    4.  **Test:**
        *   Commit changes in `cline-listassist`.
        *   Commit changes in `cline-listassist-pages` (specifically the updated `docs/core.css` if you copied it, and `docs/share.html` if its link changed).
        *   Push both `refactor/code-consolidation` branches.
        *   Check if GitHub Pages for `cline-listassist-pages` rebuilds and if the shared list page uses the new styles correctly. (This depends on how GitHub Pages is set up for the `cline-listassist-pages` repo – it usually deploys from a specific branch like `main` or `gh-pages` from the `docs` folder of that branch). For now, local testing of `share.html` with the synced `core.css` is key.

---

### **Phase 3: JavaScript Utility Abstraction**

---

#### **Task 3.1: Create `utils.js` in the Main Extension**

*   **Goal:** Create a central file for shared JavaScript utility functions.
*   **Steps:**
    1.  In the `cline-listassist` repository:
    2.  Create a new file named `utils.js`.
    3.  Place it in the `js/` subdirectory if you created one (e.g., `cline-listassist/js/utils.js`), or in the root.
    4.  Add a simple structure, perhaps an object to namespace the utilities, or just plain functions:
        ```javascript
        // js/utils.js

        // Option 1: Namespace object (recommended)
        const ListAssistUtils = {
            // functions will go here
        };

        // Option 2: Plain functions (ensure names are unique)
        // function util_functionName() { ... }
        ```
        For this blueprint, we'll assume the namespace object `ListAssistUtils`.

---

#### **Task 3.2: Consolidate Encoding/Decoding Functions into `utils.js`**

*   **Goal:** Single implementation for Base64 utility functions.
*   **Steps:**
    1.  Identify the best/most complete versions of `utf8_to_b64` and `b64_to_utf8` from your audit (Task 1.2). The versions in `background.js` or `shopping_list.js` are good candidates.
    2.  Add them to `ListAssistUtils` in `utils.js`:
        ```javascript
        // js/utils.js
        const ListAssistUtils = {
            utf8_to_b64: function(str) {
                // First, URI-encode the string to handle UTF-8 characters,
                // then unescape to get a string of Latin-1 characters.
                try {
                    return btoa(unescape(encodeURIComponent(str)));
                } catch (e) {
                    console.error("utf8_to_b64 failed:", e, "for string:", str);
                    return null; // Or throw e;
                }
            },

            b64_to_utf8: function(str) {
                // First, decodeURIComponent to handle any percent-encoding,
                // then atob to decode Base64, then decodeURIComponent again
                // to convert the resulting URI-encoded string back to UTF-8.
                 try {
                    return decodeURIComponent(escape(atob(str)));
                } catch (e) {
                    console.error("b64_to_utf8 failed:", e, "for string:", str);
                    return null; // Or throw e;
                }
            },
            // ... other utils will follow
        };
        ```
    3.  Include error handling (e.g., try-catch) as shown, because `btoa`/`atob` can fail with certain inputs.

---

#### **Task 3.3: Consolidate Theme/Dark Mode Application Functions into `utils.js`**

*   **Goal:** Centralized logic for applying themes and dark mode.
*   **Steps:**
    1.  Review the theme application logic in `lists.js`, `options.js`, `shopping_list.js`, and `share.js`.
    2.  Create generalized functions in `ListAssistUtils`:
        ```javascript
        // js/utils.js (continuing ListAssistUtils object)
            // ... previous utils ...
            applyThemeSettings: function(themeConfig) {
                const defaults = {
                    mainBg: '#f5f5f5',
                    boxBg: '#ffffff',
                    text: '#333333',
                    font: 'Arial, sans-serif'
                };
                const currentTheme = { ...defaults, ...themeConfig };
                const root = document.documentElement;

                root.style.setProperty('--user-main-bg-color', currentTheme.mainBg);
                root.style.setProperty('--user-bg-color', currentTheme.boxBg);
                root.style.setProperty('--user-text-color', currentTheme.text);
                root.style.setProperty('--user-font-family', currentTheme.font);

                // This direct body style might be redundant if --user-main-bg-color is applied to body in CSS
                // but keeping it for now as it was in original scripts.
                // Review if body { background-color: var(--user-main-bg-color); } in core.css is sufficient.
                if (document.body) { // Ensure body exists
                   document.body.style.backgroundColor = currentTheme.mainBg;
                }
            },

            applyDarkMode: function(isDark) {
                if (document.body) { // Ensure body exists
                    if (isDark) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                }
            }
        // ...
        ```
    3.  **Note:** The theme application function sets CSS variables. `core.css` should be the primary consumer of these variables. The direct `document.body.style.backgroundColor` might be removable if `body { background-color: var(--user-main-bg-color); }` is present and effective in `core.css`.

---

#### **Task 3.4: Create Unified Affiliate Link Generation Function in `utils.js`**

*   **Goal:** Fix inconsistent affiliate tagging and centralize this critical logic.
*   **Steps:**
    1.  This is the most complex utility. Combine the logic from `shopping_list.js`'s `maybeInjectAffiliateTag` (which handles Amazon, eBay, AliExpress) and the Cloudflare worker logic for Amazon.
    2.  Add to `ListAssistUtils`:
        ```javascript
        // js/utils.js (continuing ListAssistUtils object)
            // ... previous utils ...
            extractAsinFromUrl: function(url) { // Helper for Amazon
                try {
                    const urlObj = new URL(url);
                    const pathMatch = urlObj.pathname.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i);
                    if (pathMatch) return pathMatch[1];
                    const queryAsin = urlObj.searchParams.get('ASIN');
                    if (queryAsin?.match(/^[A-Z0-9]{10}$/i)) return queryAsin;
                } catch (e) { /* ignore */ }
                return null;
            },

            generateAffiliateUrl: async function(originalUrl) {
                if (!originalUrl || typeof originalUrl !== 'string') {
                    return originalUrl;
                }

                try {
                    const u = new URL(originalUrl); // Check if valid URL first

                    // eBay
                    if (/\.ebay\.(com|co\.uk|ca|de|fr|es|it|au)/i.test(u.hostname) && !u.searchParams.has('campid')) {
                        u.searchParams.set('campid', '5339108180'); // Ensure this ID is correct
                        return u.toString();
                    }

                    // Amazon
                    if (/amazon\.(com|co\.uk|ca|de|fr|es|it|co\.jp|com\.mx|com\.br|com\.au)/i.test(u.hostname)) {
                        const asin = this.extractAsinFromUrl(originalUrl); // Use this.extractAsinFromUrl
                        if (asin) {
                            // IMPORTANT: The Cloudflare worker URL should be configurable or a constant
                            const CF_WORKER_BASE = 'https://amzn-affil-chrome-ext-0521.dftopcat.workers.dev';
                            const workerUrl = `${CF_WORKER_BASE}/get-product?asin=${asin}`;
                            try {
                                const response = await fetch(workerUrl);
                                if (response.ok) {
                                    const productData = await response.json();
                                    if (productData && productData.DetailPageURL) {
                                        return productData.DetailPageURL;
                                    }
                                } else {
                                    console.warn(`Failed to fetch affiliate link for ASIN ${asin} from worker: ${response.status}`);
                                }
                            } catch (fetchError) {
                                console.error("Error fetching from Cloudflare worker:", fetchError);
                            }
                        }
                    }

                    // AliExpress
                    if (/aliexpress\.com/i.test(u.hostname)) {
                        if (!u.searchParams.has('aff_trace_key')) { // Or other relevant Ali parameters
                            u.searchParams.set('aff_trace_key', 'listassist_collab'); // Confirm this key
                            return u.toString();
                        }
                    }
                } catch (e) {
                    // console.error('Error processing affiliate URL:', originalUrl, e);
                    return originalUrl; // Return original if any error in URL processing
                }
                return originalUrl; // Return original if no rules matched
            }
        // ...
        ```
    3.  **Important:** This function is `async` due to the `fetch` call for Amazon links. Any code calling this will need to use `await` or handle Promises.

---

#### **Task 3.5: Update Extension JS Files to Use `utils.js`**

*   **Goal:** Eliminate duplicated code from individual JS files and use the new utilities.
*   **Steps:**
    1.  For each relevant JS file in the main extension (`background.js`, `shopping_list.js`, `lists.js`, `options.js`, `collaboration-features.js`):
        *   **Include `utils.js`:** Ensure the corresponding HTML file includes `<script src="js/utils.js"></script>` *before* the page-specific script. For `background.js` (service worker), you'll need to use `importScripts('js/utils.js');` at the top of `background.js`.
        *   **Remove Duplicates:** Delete the local implementations of `utf8_to_b64`, `b64_to_utf8`, theme/dark mode applicators, and affiliate link generators.
        *   **Replace Calls:**
            *   Change `utf8_to_b64(str)` to `ListAssistUtils.utf8_to_b64(str)`.
            *   Change `b64_to_utf8(str)` to `ListAssistUtils.b64_to_utf8(str)`.
            *   Replace theme/dark mode logic with calls to `ListAssistUtils.applyThemeSettings(theme)` and `ListAssistUtils.applyDarkMode(isDark)`.
            *   Replace calls to `maybeInjectAffiliateTag(url)` with `await ListAssistUtils.generateAffiliateUrl(url)`. Update the calling function to be `async` if it's not already.
    2.  **Specific to `background.js`:**
        *   Ensure `importScripts('js/utils.js');` is at the very top.
        *   Update `utf8_to_b64` usage.
    3.  **Specific to `shopping_list.js`:**
        *   This file heavily uses these utilities. Pay close attention to the `async` nature of the new affiliate function when adding items or processing imported items.
    4.  **Test Extensively:** After refactoring each JS file:
        *   Reload the extension.
        *   Test all features related to that file:
            *   Importing items (background, shopping_list)
            *   Adding items manually (shopping_list)
            *   Theming and dark mode (options, shopping_list, lists)
            *   Sharing (collaboration-features, shopping_list) - check the generated URL payload.

---

#### **Task 3.6: Set Up `utils.js` Sync to `docs` Folder**

*   **Goal:** Make `utils.js` available to `share.html`.
*   **Steps:**
    1.  Update your sync script (e.g., `sync_shared_files.sh`) or manual process to also copy `cline-listassist/js/utils.js` to `cline-listassist/docs/utils.js`.
        *   Example addition to `sync_shared_files.sh`:
            ```bash
            echo "Syncing utils.js to docs..."
            cp ./js/utils.js ./docs/utils.js
            ```
    2.  Run the script/process.

---

### **Phase 4: Refactoring Core Extension Logic**

This phase focuses on cleaning up the individual JS files now that utilities are centralized.

---

#### **Task 4.1: Refactor `shopping_list.js`**

*   **Goal:** Streamline, improve readability, ensure correct use of `utils.js`.
*   **Steps:**
    1.  Verify all utility function calls are correctly pointing to `ListAssistUtils` and `await` is used for `generateAffiliateUrl`.
    2.  **DOM Caching:** At the top of the `DOMContentLoaded` listener, cache frequently accessed DOM elements:
        ```javascript
        const backBtn = document.getElementById('backBtn');
        const shareBtn = document.getElementById('shareBtn');
        // ... other elements ...
        ```
    3.  **Event Handlers:** Review event handlers. Ensure they are concise.
    4.  **Import Logic:** The `?import=` handling logic should now use `ListAssistUtils.b64_to_utf8` and `await ListAssistUtils.generateAffiliateUrl`.
    5.  **Share Button Logic:**
        *   Ensure it correctly gets theme settings (from UI elements or storage) to pass to the payload.
        *   The payload generation should use `ListAssistUtils.utf8_to_b64`.
        *   The shared list items should have their URLs processed by `ListAssistUtils.generateAffiliateUrl` *before* being added to the share payload if the intent is for the shared link itself to contain potentially affiliated item links (this is a design choice - current code seems to do affiliation on the share page itself). For consistency, it's better if the shared payload contains the *original* URLs and the `share.js` on the GitHub page applies the affiliation, as this makes the payload smaller and affiliation logic consistent on the viewing end. *Clarify this design choice: does the share payload URL carry original item URLs or affiliate-processed URLs? Current `share.js` re-processes. Let's stick to share.js processing them.* So, the payload sent from `shopping_list.js` should contain original item URLs.
    6.  **Theme Controls:** Ensure the theme controls UI correctly loads initial values from `chrome.storage.local` and calls `ListAssistUtils.applyThemeSettings` and `ListAssistUtils.applyDarkMode` on change, then saves to storage.
    7.  **Code Comments:** Add comments to explain complex sections.
    8.  **Test:** All shopping list page functionalities: adding, editing, deleting, marking done, sharing, theme changes, dark mode, import via URL param.

---

#### **Task 4.2: Refactor `lists.js`**

*   **Goal:** Simplify theme application and general cleanup.
*   **Steps:**
    1.  Verify `ListAssistUtils.applyThemeSettings` and `ListAssistUtils.applyDarkMode` are used for initial theme setup.
    2.  Cache DOM elements.
    3.  Review list rendering logic for clarity.
    4.  **Test:** Creating, renaming, deleting, and opening lists. Ensure theme/dark mode from storage is applied correctly.

---

#### **Task 4.3: Refactor `options.js`**

*   **Goal:** Simplify theme/dark mode toggle and cleanup.
*   **Steps:**
    1.  The comment `// Remove theme controls since they're now in shopping_list.html` and subsequent removal logic in `options.js` should be re-evaluated. If theme controls *are indeed fully removed* from `options.html` (as the JS suggests it tries to do), then the `applyThemeSettings` calls related to `backgroundColorInput`, `textColorInput`, `fontFamilySelect` might be dead code if those elements are gone from `options.html`.
    2.  **ACTION:** Modify `options.html` to physically remove the color pickers and font selector for "Basic Theming" if they are meant to be deprecated. Only keep "Advanced Share" and "Dark Mode Toggle".
    3.  Update `options.js` to only handle the remaining controls:
        *   Load and save `useAdvancedShare`.
        *   Load and save `isDarkMode`, calling `ListAssistUtils.applyDarkMode` to reflect changes on the options page itself.
    4.  If `options.html` still needs to be themed (e.g., background for dark mode), ensure it loads the current theme from storage and applies it using `ListAssistUtils.applyThemeSettings({ mainBg: storedTheme.mainBg /* etc */ })` and `ListAssistUtils.applyDarkMode(isDark)`.
    5.  **Test:** Options page functionality, dark mode toggle on the options page itself.

---

#### **Task 4.4: Refactor `background.js`**

*   **Goal:** Ensure correct use of `utils.js` for `importScripts`.
*   **Steps:**
    1.  Confirm `importScripts('js/utils.js');` is the first line.
    2.  All calls to `utf8_to_b64` should now be `ListAssistUtils.utf8_to_b64`.
    3.  Review `chrome.action.onClicked` and `updateActionIcon` logic for clarity. The Amazon domain regex is quite long; it's fine but ensure it's readable or commented.
    4.  **Test:** Extension icon behavior on Amazon vs. non-Amazon pages. Importing items via icon click and keyboard shortcut. Notifications.

---

#### **Task 4.5: Refactor `collaboration-features.js`**

*   **Goal:** Integrate with `utils.js` and ensure efficient share payload creation.
*   **Steps:**
    1.  This script creates a `CollaborationManager` class, which is good.
    2.  The `encodeShareData` method should use `ListAssistUtils.utf8_to_b64`.
    3.  The `shareList` method:
        *   When constructing `shareData`, the item URLs should be the *original* URLs. The `share.js` on the GitHub page will handle applying affiliate tags.
        *   It gets `isDarkMode` from `document.body.classList.contains('dark-mode')`. This is fine if `CollaborationManager` is only used in contexts where the body class is already set.
    4.  The dynamic creation of the sharing dialog and its styles is complex.
        *   **CSS:** Can any of these dialog styles be moved to `core.css` to reduce the JS string? E.g., common dialog overlay, box styles. Some dynamic parts (like list name in header) will need to stay in JS.
        *   This might be a larger sub-task. For now, ensure it functions, but note it for potential future CSS refactoring.
    5.  **Test:** Invoking the share dialog from `shopping_list.html`. Test all quick share buttons (they open new tabs/mailto links). Ensure the generated share URL fragment is correctly encoded.

---

### **Phase 5: Refactoring Shared Page Logic (`docs` folder)**

This phase targets the files that are deployed to GitHub Pages.

---

#### **Task 5.1: Update `share.html` to use Synced `core.css` and `utils.js`**

*   **Goal:** Ensure `share.html` uses the canonical shared resources.
*   **Steps:**
    1.  Open `cline-listassist/docs/share.html`.
    2.  Ensure it links to `core.css` (no path, as it's in the same directory): `<link rel="stylesheet" type="text/css" href="core.css">`.
    3.  Add a script tag to include `utils.js` *before* `share.js`:
        ```html
        <!-- ... other head elements ... -->
        <script src="utils.js"></script>
        <script src="share.js"></script>
        </body>
        </html>
        ```
    4.  The inline styles should already be removed (Task 2.3).

---

#### **Task 5.2: Refactor `share.js` to Use `utils.js` and Streamline**

*   **Goal:** Simplify `share.js`, remove its duplicated utilities, and ensure correct affiliate link generation on the shared page.
*   **Steps:**
    1.  Open `cline-listassist/docs/share.js`.
    2.  **Remove Duplicates:**
        *   Delete the local `b64_to_utf8` function.
        *   Delete the local `maybeInjectAffiliateTag` function.
        *   Delete the local `applyThemeSettings` and `applyDarkMode` functions.
    3.  **Update Calls:**
        *   Replace `b64_to_utf8(decodedFragment)` with `ListAssistUtils.b64_to_utf8(decodedFragment)`.
        *   In the item rendering loop, replace `a.href = maybeInjectAffiliateTag(item.url);` with `a.href = await ListAssistUtils.generateAffiliateUrl(item.url);`.
            *   This means the main `DOMContentLoaded` listener in `share.js` needs to become `async`: `window.addEventListener('DOMContentLoaded', async () => { ... });`.
            *   And the loop itself:
                ```javascript
                for (const item of (payload.items || [])) {
                    // ... create tr, nameCell ...
                    if (item.url) {
                        a.href = await ListAssistUtils.generateAffiliateUrl(item.url); // Await here
                        // ...
                    }
                    // ...
                }
                ```
        *   Replace theme/dark mode application with calls to `ListAssistUtils.applyThemeSettings(theme, defaultTheme)` and `ListAssistUtils.applyDarkMode(isDark)`.
    4.  **Error Handling:** Improve error handling for payload parsing or missing elements.
    5.  **Test:**
        *   Generate a share link from the extension.
        *   Open it in a browser (serving `docs` locally).
        *   Verify:
            *   List title, subtitle, and items are displayed correctly.
            *   Theme and dark mode from the payload are applied.
            *   Item links (especially Amazon, eBay, AliExpress) are correctly processed by `ListAssistUtils.generateAffiliateUrl` and have the affiliate tags if applicable. Inspect the links.

---

### **Phase 6: Performance Optimization & UI/UX Enhancements (Iterative)**

---

#### **Task 6.1: Review and Optimize DOM Manipulations**

*   **Goal:** Ensure efficient updates to the UI.
*   **Steps:**
    1.  **`shopping_list.js` (`renderRow`, `edit`, `toggle`, `remove`):** The current approach of updating/removing single rows instead of re-rendering the whole list is good. Double-check this is consistently applied.
    2.  **`lists.js` (`renderLists`, `addListRow`):** This re-renders the entire list table. For a small number of lists, this is fine. If performance were an issue with many lists, targeted updates would be better, but this is likely okay for now.
    3.  **Minimize Direct Style Manipulations:** Prefer adding/removing CSS classes over directly setting many `element.style.property` values in JS, especially if those styles can be defined in `core.css`. The theme application via CSS variables is good.

---

#### **Task 6.2: Ensure Consistent UI Styling**

*   **Goal:** A polished and consistent look and feel.
*   **Steps:**
    1.  With the Master `core.css`, review all extension pages (`shopping_list.html`, `lists.html`, `options.html`) and `share.html`.
    2.  Check for consistency in:
        *   Button styles
        *   Input field styles
        *   Table appearance
        *   Font usage
        *   Spacing and layout
        *   Dark mode appearance
    3.  Make any necessary adjustments in Master `core.css`.

---

#### **Task 6.3 (Optional): Address `enhanced_list.html` (Future Feature)**

*   **Goal:** Decide fate or plan for this incomplete feature.
*   **Steps:**
    1.  This file seems to be for a future, more advanced list builder.
    2.  **Discussion with Lead:** Is this feature to be developed soon?
        *   **If yes:** Ensure it also links to Master `core.css` and `utils.js`. Plan its refactoring/development separately.
        *   **If no/on hold:** It can be left as is, or commented out/removed from `manifest.json`'s `web_accessible_resources` if it's causing clutter or confusion. For now, ensure it doesn't break anything and uses the shared resources if it remains.
    3.  For this refactoring pass, the primary goal is to stabilize and optimize existing functionality.

---

### **Phase 7: Testing & Final Review**

---

#### **Task 7.1: Comprehensive Functional Testing**

*   **Goal:** Catch any regressions or new bugs.
*   **Create a Test Plan/Checklist covering:**
    1.  **List Management (`lists.html`, `lists.js`):**
        *   Create new list (empty name, valid name).
        *   Open list.
        *   Rename list (cancel, new name, same name).
        *   Delete list (cancel, confirm).
        *   Empty state message.
    2.  **Shopping List Page (`shopping_list.html`, `shopping_list.js`):**
        *   "Back to All Lists" button.
        *   Add item (no URL, with URL - test Amazon, eBay, Ali, other).
        *   Mark item as done/undone.
        *   Edit item name (save, cancel).
        *   Delete item.
        *   Empty state message.
        *   Link functionality (opens in new tab, affiliate tag applied correctly).
        *   Theme controls: change main bg, box bg, text color, font. Verify changes apply live and are saved.
        *   Dark mode toggle: verify live apply and save.
        *   Subtitle controls: add text, image URL, change alignments. Verify live apply and save.
    3.  **Importing Items (`background.js`, `shopping_list.html`):**
        *   Using extension icon on an Amazon product page.
        *   Using keyboard shortcut (Cmd/Ctrl+Shift+I) on various pages.
        *   Fallback notification if info parsing is poor.
        *   Verify imported item appears in the current list with name and (affiliate) URL.
    4.  **Sharing (`shopping_list.js`, `collaboration-features.js`, `share.html`, `share.js`):**
        *   Click "Share List" button.
        *   Verify share dialog appearance (if using `CollaborationManager`'s dialog).
        *   Copy generated share URL.
        *   Test quick share buttons (Email, Twitter, Facebook, More/Native).
        *   Open the share URL:
            *   Verify list name, subtitle, items.
            *   Verify theme and dark mode are correctly rendered from payload.
            *   Verify item links in shared page have affiliate tags.
    5.  **Options Page (`options.html`, `options.js`):**
        *   Toggle "Advanced Share" (verify saved state).
        *   Toggle "Dark Mode" (verify saved state and live apply on options page).
        *   Link to customize keyboard shortcuts.
    6.  **Extension Icon Behavior (`background.js`):**
        *   Icon and tooltip change on Amazon product pages vs. other pages.
    7.  **Affiliate Disclosure (`disclosure.html`):**
        *   Page loads correctly.
    8.  **Cross-Browser (Optional, if supporting more than Chrome):** Basic checks.
    9.  **Error States:** Try to break things (e.g., malformed import data if possible, network errors during affiliate link generation).

---

#### **Task 7.2: Code Review and Cleanup**

*   **Goal:** Final polish of the codebase.
*   **Steps:**
    1.  Remove any `console.log` statements used for debugging.
    2.  Ensure consistent code formatting (use a formatter like Prettier if possible).
    3.  Add/update comments where necessary for clarity.
    4.  Remove any dead or commented-out old code that is no longer needed.
    5.  Self-review against the Guiding Principles.

---

#### **Task 7.3: Measure Code Reduction**

*   **Goal:** Quantify the success of the refactoring.
*   **Steps:**
    1.  Use a line counting tool (e.g., `cloc` or VS Code extensions) on the codebase *before* starting Phase 2 (after initial setup).
    2.  Run the same tool on the codebase *after* completing Phase 7.
    3.  Calculate the percentage reduction for JS and CSS files.
    4.  Note this in your final report/PR.

---

## 6. Testing Strategy (Summary)

*   **Unit Testing (Implicit):** By testing each utility function in `utils.js` as you create it and integrate it.
*   **Integration Testing:** Testing how different parts of the extension work together after refactoring each JS file (e.g., `shopping_list.js` using `utils.js` correctly).
*   **End-to-End Functional Testing:** Following the comprehensive test plan in Task 7.1.
*   **Manual Testing:** Primary mode of testing for this UI-heavy extension.
*   **Focus on Regressions:** The main goal is that everything that worked before still works.

## 7. Code Style & Documentation Guidelines

*   **JavaScript:**
    *   Follow existing style or adopt a common one (e.g., Airbnb, StandardJS - if a linter/formatter is set up).
    *   Use `const` for variables that are not reassigned, `let` otherwise.
    *   Use descriptive variable and function names.
    *   Comment complex logic or non-obvious decisions. JSDoc-style comments for functions in `utils.js` are beneficial.
*   **CSS:**
    *   Maintain readable formatting.
    *   Comment major sections or complex selectors.
*   **HTML:**
    *   Maintain proper indentation.
*   **Commits:**
    *   Write clear, concise commit messages (e.g., "Refactor: Centralize Base64 utils in utils.js", "Fix: Affiliate link for Amazon on shared page").
    *   Commit small, logical units of work.

---

* End