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

    // Define size maps (copied from theme_controls.js)
    const textSizeMap = {
      '1': '0.8em',
      '2': '1.1em',
      '3': '1.7em',
      '4': '3.0em',
      '5': '5.0em'
    };

    const imageSizeMap = {
      '1': '80px',
      '2': '150px',
      '3': '250px',
      '4': '400px',
      '5': '700px'
    };

    // Apply size settings from payload
    const subtitleSettings = payload.subtitle || {};
    const root = document.documentElement;
    const subtitleContentEl = document.getElementById('subtitleContent');
    const subtitleImageEl = document.getElementById('subtitleImage');

    const subtitleFontSize = textSizeMap[subtitleSettings.textSize] || textSizeMap['2'];
    root.style.setProperty('--subtitle-font-size', subtitleFontSize);
    subtitleContentEl.style.fontSize = subtitleFontSize;

    const baseSize = parseFloat(subtitleFontSize);
    const titleFontSize = `${baseSize + 0.3}em`;
    root.style.setProperty('--title-font-size', titleFontSize);
    titleEl.style.fontSize = titleFontSize; // Apply to main title

    const imageMaxHeight = imageSizeMap[subtitleSettings.imageSize] || imageSizeMap['2'];
    root.style.setProperty('--image-max-height', imageMaxHeight);
    subtitleImageEl.style.maxHeight = imageMaxHeight; // Apply to image

    // 3) Set title and subtitle
    titleEl.textContent = payload.name || 'Shared List';
    document.title = `List Assist – Shared: ${payload.name || 'List'}`; // Update page title too
    
    // Handle subtitle and image
    const subtitleBox = document.getElementById('subtitleBox');
    // subtitleContent and subtitleImage already defined above
    
    if (payload.subtitle?.text || payload.subtitle?.imageUrl) {
        subtitleBox.style.display = 'block';
        subtitleContent.textContent = payload.subtitle.text || '';
        // subtitleContent.style.fontSize is now handled by CSS variable
        subtitleContent.style.lineHeight = '1.5';
        subtitleBox.className = `subtitle-box ${payload.subtitle.alignment || 'left'}`;
        
        if (payload.subtitle.imageUrl) {
            subtitleImage.src = payload.subtitle.imageUrl;
            subtitleImage.style.display = 'block';
            subtitleImage.style.marginLeft = payload.subtitle.imageAlignment === 'left' ? '0' : 'auto';
            subtitleImage.style.marginRight = payload.subtitle.imageAlignment === 'right' ? '0' : 'auto';
            // subtitleImage.style.maxHeight is now handled by CSS variable
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

    const tableHeaderRow = document.querySelector('#share-table thead tr'); // Get the header row
    // Clear existing headers (except for Item, Link)
    while (tableHeaderRow.children.length > 2) {
        tableHeaderRow.removeChild(tableHeaderRow.children[tableHeaderRow.children.length - 1]);
    }

    const customColumns = payload.customColumns || []; // Get custom columns from payload

    // Add custom column headers
    customColumns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.name;
        tableHeaderRow.appendChild(th);
    });

    (payload.items || []).forEach(item => {
        const tr = document.createElement('tr');

        // Item name cell
        const nameCell = document.createElement('td');
        if (item.url) {
            const a = document.createElement('a');
            a.href = maybeInjectAffiliateTag(item.url);
            a.textContent = item.name || 'Unnamed Item';
            a.target = '_blank'; // Open in new tab
            a.rel = 'noopener noreferrer'; // Security best practice
            
            // Add copy icon after name (visible on hover)
            const copyIconName = document.createElement('span');
            copyIconName.classList.add('item-copy-icon'); /* Added class for styling */
            copyIconName.textContent = ' 📋'; // Space before emoji
            copyIconName.style.cursor = 'pointer';
            copyIconName.title = 'Copy link';
            copyIconName.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    await navigator.clipboard.writeText(item.url);
                    copyIconName.title = 'Copied!';
                    setTimeout(() => copyIconName.title = 'Copy link', 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            };

            const linkIconWrapperName = document.createElement('span');
            linkIconWrapperName.classList.add('link-icon-wrapper');
            linkIconWrapperName.appendChild(a);
            linkIconWrapperName.appendChild(copyIconName);
            nameCell.appendChild(linkIconWrapperName);
        } else {
            nameCell.textContent = item.name || 'Unnamed Item';
        }
        tr.appendChild(nameCell);

        // Link cell
        const linkCell = document.createElement('td');
        if (item.url) {
            const a = document.createElement('a');
            a.href = maybeInjectAffiliateTag(item.url); // Apply affiliate tag
            a.target = '_blank'; // Open in new tab
            a.rel = 'noopener noreferrer'; // Security best practice
            
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
            
            // Add copy link icon (always visible with space)
            const copyIconLink = document.createElement('span');
            copyIconLink.textContent = ' 📋'; // Space before emoji
            copyIconLink.style.cursor = 'pointer';
            copyIconLink.title = 'Copy link';
            copyIconLink.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    await navigator.clipboard.writeText(item.url);
                    copyIconLink.title = 'Copied!';
                    setTimeout(() => copyIconLink.title = 'Copy link', 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            };

            const linkIconWrapperLink = document.createElement('span');
            linkIconWrapperLink.classList.add('link-icon-wrapper');
            linkIconWrapperLink.appendChild(a);
            linkIconWrapperLink.appendChild(copyIconLink);
            linkCell.appendChild(linkIconWrapperLink);
        } else {
            linkCell.textContent = '-'; // Placeholder if no URL
        }
        tr.appendChild(linkCell);

        // Add cells for custom columns
        customColumns.forEach(col => {
            const customCell = document.createElement('td');
            customCell.textContent = item.customColumns ? item.customColumns[col.id] || '' : ''; // Display custom data
            tr.appendChild(customCell);
        });

        listBodyEl.appendChild(tr);
    });

    // Add empty state message if no items
    if (!payload.items || payload.items.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        // Adjust colSpan based on number of custom columns
        td.colSpan = 2 + customColumns.length; 
        td.textContent = 'This shared list is empty.';
        td.style.textAlign = 'center';
        td.style.fontStyle = 'italic';
        td.style.color = 'grey'; // Maybe use CSS variable later
        tr.appendChild(td);
        listBodyEl.appendChild(tr);
    }

    // Copy List Link button functionality
    const copyListLinkBtn = document.getElementById('copyListLinkBtn');
    if (copyListLinkBtn) {
        copyListLinkBtn.addEventListener('click', async () => {
            const shareUrl = window.location.href; // Get the full URL
            
            try {
                await navigator.clipboard.writeText(shareUrl); // Copy only the URL
                copyListLinkBtn.textContent = 'Copied!';
                setTimeout(() => copyListLinkBtn.textContent = 'Copy List Link', 2000);
            } catch (err) {
                console.error('Failed to copy list link: ', err);
                alert('Failed to copy link. Please try again or copy from address bar.');
            }
        });
    }

    // Add to Calendar button functionality
    const addCalendarBtn = document.getElementById('addCalendarBtn');
    if (addCalendarBtn) {
        addCalendarBtn.addEventListener('click', async () => {
            const listName = payload.name || 'Shared List';
            const listUrl = window.location.href; // The current shared URL is the short URL

            const icsContent = generateIcsFile(listName, listUrl);
            const fileName = `${listName.replace(/[^a-z0-9]/gi, '_')}.ics`;
            downloadIcsFile(icsContent, fileName);

            addCalendarBtn.textContent = 'Added!';
            setTimeout(() => addCalendarBtn.textContent = '📅 Add to Calendar', 2000);
        });
    }
});

/**
 * Generates an iCalendar (.ics) file content for a given shopping list.
 * @param {string} listName - The name of the shopping list.
 * @param {string} listUrl - The short URL of the shopping list.
 * @returns {string} The iCalendar file content.
 */
function generateIcsFile(listName, listUrl) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // DTSTAMP and UID should be unique and consistent
    const dtStamp = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    const uid = `${dtStamp}-${Math.random().toString(36).substring(2)}@listassist.com`;

    // Event start and end times (e.g., 1 hour from now, or just a single point in time)
    // For simplicity, let's make it a 1-hour event starting now.
    const startTime = dtStamp; // Using current time as start
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
    const endYear = endTime.getFullYear();
    const endMonth = (endTime.getMonth() + 1).toString().padStart(2, '0');
    const endDay = endTime.getDate().toString().padStart(2, '0');
    const endHours = endTime.getHours().toString().padStart(2, '0');
    const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
    const endSeconds = endTime.getSeconds().toString().padStart(2, '0');
    const dtEnd = `${endYear}${endMonth}${endDay}T${endHours}${endMinutes}${endSeconds}Z`;

    // Description can include the list URL
    const description = `Your List Assist shopping list: ${listUrl}\n\nView your list here: ${listUrl}`;

    // Summary is the event title
    const summary = `List Assist: ${listName}`;

    // Timezone information (using UTC for simplicity, as calendars handle conversion)
    const timeZone = 'UTC'; // Default to UTC

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//List Assist//Shopping List v1.0//EN
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:${timeZone}
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:${dtStamp}
UID:${uid}
DTSTART:${startTime}
DTEND:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${listUrl}
END:VEVENT
END:VCALENDAR`;

    return icsContent;
}

/**
 * Downloads the generated iCalendar file.
 * @param {string} icsContent - The iCalendar file content.
 * @param {string} fileName - The desired file name (e.g., "My Shopping List.ics").
 */
function downloadIcsFile(icsContent, fileName) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
}
