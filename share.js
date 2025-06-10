// share.js - Renders a shared list with theme support

// --- Helper Functions ---

// Helper function to decode a Base64 string (encoded from UTF-8) back to UTF-8
// (Copied from shopping_list.js for decoding the payload)
function b64_to_utf8(str) {
    try {
        return decodeURIComponent(escape(window.atob(str)));
    } catch (e) {
        console.error("Base64 decoding failed:", e);
        return null; // Indicate failure
    }
}

// Helper function to inject affiliate tag if applicable
// (Copied from shopping_list.js for consistency)
function maybeInjectAffiliateTag(url) {
    if (!url) return url; 
    try {
        const u = new URL(url);
        // Currently only handles eBay
        if (/\.ebay\./i.test(u.hostname) && !u.searchParams.has('campid')) {
            u.searchParams.set('campid', '5339108180');
            return u.toString();
        }
    } catch (e) {
        // Ignore invalid URLs
    }
    return url; 
}

// Apply theme settings using CSS Variables
function applyThemeSettings(theme, defaults) {
    const currentTheme = { 
        mainBg: '#f5f5f5',
        boxBg: '#ffffff', 
        text: '#333333',
        font: 'Arial, sans-serif',
        ...defaults, 
        ...theme 
    };
    const root = document.documentElement;
    root.style.setProperty('--user-main-bg-color', currentTheme.mainBg);
    root.style.setProperty('--user-bg-color', currentTheme.boxBg);
    root.style.setProperty('--user-text-color', currentTheme.text);
    root.style.setProperty('--user-font-family', currentTheme.font);
    document.body.style.backgroundColor = currentTheme.mainBg;
}

// Apply Dark Mode class
function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// --- Main Logic ---
window.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('title');
    const listBodyEl = document.getElementById('sharedListBody'); // Target tbody now
    const defaultTheme = {
        mainBg: '#f5f5f5',
        boxBg: '#ffffff',
        text: '#333333',
        font: 'Arial, sans-serif'
    };

    if (!listBodyEl) {
        console.error("Table body element #sharedListBody not found.");
        titleEl.textContent = 'Error displaying list (HTML structure mismatch).';
        return;
    }
  
    // 1) Read and decode the fragment
    const fragment = location.hash.slice(1); // Remove leading #
    if (!fragment) {
        titleEl.textContent = 'No list data found.';
        return;
    }

    let payload;
    try {
        // Decode URI Component first, then Base64
        const jsonPayload = b64_to_utf8(decodeURIComponent(fragment));
        if (!jsonPayload) throw new Error("Decoding failed");
        payload = JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Payload parsing failed:", e);
        titleEl.textContent = 'Invalid or corrupted list data';
        return;
    }
  
    // 2) Apply Theme and Dark Mode
    const theme = payload.theme || {};
    const isDarkMode = payload.isDarkMode === true;
    
    applyDarkMode(isDarkMode);
    applyThemeSettings(theme, defaultTheme); // Apply theme from payload

    // 3) Set title and subtitle
    titleEl.textContent = payload.name || 'Shared List';
    document.title = `List Assist – Shared: ${payload.name || 'List'}`; // Update page title too
    
    // Handle subtitle and image
    const subtitleBox = document.getElementById('subtitleBox');
    const subtitleContent = document.getElementById('subtitleContent');
    const subtitleImage = document.getElementById('subtitleImage');
    
    if (payload.subtitle?.text || payload.subtitle?.imageUrl) {
        subtitleBox.style.display = 'block';
        subtitleContent.textContent = payload.subtitle.text || '';
        subtitleContent.style.fontSize = '1.2em';
        subtitleContent.style.lineHeight = '1.5';
        subtitleBox.className = `subtitle-box ${payload.subtitle.alignment || 'left'}`;
        
        if (payload.subtitle.imageUrl) {
            subtitleImage.src = payload.subtitle.imageUrl;
            subtitleImage.style.display = 'block';
            subtitleImage.style.marginLeft = payload.subtitle.imageAlignment === 'left' ? '0' : 'auto';
            subtitleImage.style.marginRight = payload.subtitle.imageAlignment === 'right' ? '0' : 'auto';
            subtitleImage.onerror = () => {
                subtitleImage.style.display = 'none';
            };
        } else {
            subtitleImage.style.display = 'none';
        }
    } else {
        subtitleBox.style.display = 'none';
    }

    // 4) Render items into the table
    listBodyEl.innerHTML = ''; // Clear any potential placeholder
    (payload.items || []).forEach(item => {
        const tr = document.createElement('tr');

        // Item name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name || 'Unnamed Item'; // Handle missing name
        tr.appendChild(nameCell);

        // Link cell
        const linkCell = document.createElement('td');
        if (item.url) {
            const a = document.createElement('a');
            a.href = maybeInjectAffiliateTag(item.url); // Apply affiliate tag
            a.target = '_blank';
            
            try {
              const urlObj = new URL(item.url);
              let hostname = urlObj.hostname;
              // Remove "www." prefix if present
              if (hostname.startsWith('www.')) {
                hostname = hostname.substring(4);
              }
              // Remove TLDs like .com, .co.uk, etc. to get just the domain name
              const parts = hostname.split('.');
              if (parts.length > 1) {
                hostname = parts[0];
              }
              a.textContent = hostname.charAt(0).toUpperCase() + hostname.slice(1); // Capitalize first letter
            } catch (e) {
              a.textContent = 'View'; // Fallback to 'View' if URL is invalid
            }
            
            a.style.fontStyle = 'italic'; // Apply italic format
            linkCell.appendChild(a);
        } else {
            linkCell.textContent = '-'; // Placeholder if no URL
        }
        tr.appendChild(linkCell);

        listBodyEl.appendChild(tr);
    });

    // Add empty state message if no items
    if (!payload.items || payload.items.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 2; // Span across Item and Link columns
        td.textContent = 'This shared list is empty.';
        td.style.textAlign = 'center';
        td.style.fontStyle = 'italic';
        td.style.color = 'grey'; // Maybe use CSS variable later
        tr.appendChild(td);
        listBodyEl.appendChild(tr);
    }
});
