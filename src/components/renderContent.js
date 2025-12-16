import DOMPurify from 'dompurify';

// headerIdMap হলো একটি অবজেক্ট যেখানে key হলো block-এর originalIndex
// এবং value হলো সেই block-এর জন্য তৈরি করা header ID
export const renderEditorJsContent = (blocks, headerIdMap = {}) => {
    // কনসোলে headerIdMap এর ধরন এবং মান লগ করুন ডিবাগিং এর জন্য
    console.log("renderEditorJsContent: received headerIdMap as", typeof headerIdMap, headerIdMap);

    // যদি blocks ডেটা না থাকে বা এটি একটি অ্যারে না হয়, তাহলে খালি স্ট্রিং ফেরত দিন।
    if (!blocks || !Array.isArray(blocks)) {
        return '';
    }

    let html = '';

    // সকল টেক্সট কন্টেন্ট প্রক্রিয়াকরণের জন্য একটি শক্তিশালী হেল্পার ফাংশন
    const getCleanedAndSanitizedText = (text) => {
        if (typeof text !== 'string') {
            return ''; // অ-স্ট্রিং ইনপুটের জন্য খালি স্ট্রিং ফেরত দিন
        }
        // Step 1: HTML non-breaking space entities to regular spaces
        let cleanedText = text.replace(/&nbsp;|\u00A0/g, ' '); // &nbsp; বা Unicode non-breaking space কে সাধারণ স্পেসে রূপান্তর করুন

        // Step 2: Replace multiple spaces with a single space
        cleanedText = cleanedText.replace(/\s+/g, ' ');

        // Step 3: Trim leading/trailing spaces
        cleanedText = cleanedText.trim();

        // Step 4: Sanitize using DOMPurify
        return DOMPurify.sanitize(cleanedText, { USE_PROFILES: { html: true } });
    };

    // প্রতিটি ব্লকের জন্য লুপ চালান এবং তার ধরন অনুযায়ী HTML তৈরি করুন।
    blocks.forEach((block, index) => { // `index` হলো blocks অ্যারের মধ্যে এই ব্লকের আসল অবস্থান
        let headerIdAttribute = '';
        // যদি বর্তমান ব্লক একটি হেডার হয় এবং headerIdMap-এ তার জন্য ID থাকে
        if (block.type === 'header' && headerIdMap[index]) {
            headerIdAttribute = `id="${headerIdMap[index].id}"`;
        } else if (block.type === 'header' && !headerIdMap[index]) {
            // যদি কোনো কারণে headerIdMap-এ ID না থাকে, একটি ফলব্যাক ID তৈরি করুন
            // এটি সাধারণত হওয়া উচিত নয় যদি BlogDetail.js সঠিকভাবে ID তৈরি করে
            const fallbackIdText = getCleanedAndSanitizedText(block.data.text);
            const fallbackId = `fallback-header-${index}-${fallbackIdText.toLowerCase().replace(/[^a-z0-9-]+/g, '').substring(0, 50)}`;
            headerIdAttribute = `id="${fallbackId}"`;
            console.warn(`Fallback ID generated for header at index ${index}: ${fallbackId}`);
        }

        switch (block.type) {
            case 'paragraph':
                html += `<p style="margin-bottom: 1.5em; line-height: 1.8; color: #374151; font-size: 1.05rem;" class="dark:!text-gray-100">${getCleanedAndSanitizedText(block.data.text)}</p>`;
                break;

            case 'header':
                const headerStyles = {
                    1: { 
                        fontSize: '2.25rem', 
                        marginTop: '2.5rem', 
                        marginBottom: '1.25rem',
                        color: '#111827',
                        fontWeight: '800'
                    },
                    2: { 
                        fontSize: '1.875rem', 
                        marginTop: '2rem', 
                        marginBottom: '1rem',
                        color: '#1f2937',
                        fontWeight: '700'
                    },
                    3: { 
                        fontSize: '1.5rem', 
                        marginTop: '1.75rem', 
                        marginBottom: '0.875rem',
                        color: '#374151',
                        fontWeight: '600'
                    },
                    4: { 
                        fontSize: '1.25rem', 
                        marginTop: '1.5rem', 
                        marginBottom: '0.75rem',
                        color: '#4b5563',
                        fontWeight: '600'
                    },
                    5: { 
                        fontSize: '1.125rem', 
                        marginTop: '1.25rem', 
                        marginBottom: '0.625rem',
                        color: '#6b7280',
                        fontWeight: '600'
                    },
                    6: { 
                        fontSize: '1rem', 
                        marginTop: '1rem', 
                        marginBottom: '0.5rem',
                        color: '#9ca3af',
                        fontWeight: '600'
                    }
                };

                const style = headerStyles[block.data.level] || headerStyles[3];
                html += `<h${block.data.level} ${headerIdAttribute} style="margin-top: ${style.marginTop}; margin-bottom: ${style.marginBottom}; font-weight: ${style.fontWeight}; font-size: ${style.fontSize}; color: ${style.color}; line-height: 1.3; scroll-margin-top: 100px;" class="dark:!text-gray-50">${getCleanedAndSanitizedText(block.data.text)}</h${block.data.level}>`;
                break;

            case 'list':
                const tag = block.data.style === 'unordered' ? 'ul' : 'ol';
                const listStyle = block.data.style === 'unordered' ? 'disc' : 'decimal';
                html += `<${tag} style="margin-left: 2rem; margin-bottom: 1.5em; margin-top: 1em; list-style-type: ${listStyle}; color: #374151; line-height: 1.8;" class="dark:!text-gray-100">`;
                (block.data.items || []).forEach(item => {
                    const listItemText = typeof item === 'object' && item !== null && item.content ? item.content : item;
                    html += `<li style="margin-bottom: 0.75em; padding-left: 0.5rem;">${getCleanedAndSanitizedText(listItemText)}</li>`;
                });
                html += `</${tag}>`;
                break;

            case 'image':
                const imageUrl = block.data.file && block.data.file.url ? block.data.file.url : '';
                const imageCaption = block.data.caption || '';
                html += `<div style="text-align: center; margin: 2rem 0;">`;
                if (imageUrl) {
                    html += `<img src="${DOMPurify.sanitize(imageUrl)}" alt="${getCleanedAndSanitizedText(imageCaption)}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);" class="dark:shadow-2xl dark:shadow-emerald-500/10"/>`;
                }
                if (imageCaption) {
                    html += `<p style="font-size: 0.95em; color: #6b7280; margin-top: 1rem; text-align: center; font-style: italic;" class="dark:!text-gray-300">${getCleanedAndSanitizedText(imageCaption)}</p>`;
                }
                html += `</div>`;
                break;

            case 'linkTool':
                const linkHref = block.data.link || '#';
                const linkTitle = block.data.meta && block.data.meta.title ? block.data.meta.title : linkHref;
                html += `<div style="margin: 1.5rem 0; padding: 1.25rem; background: linear-gradient(to right, #f0fdf4, #dcfce7); border-left: 4px solid #10b981; border-radius: 0.75rem;" class="dark:bg-gradient-to-r dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-500">
                    <a href="${DOMPurify.sanitize(linkHref)}" target="_blank" rel="noopener noreferrer" style="color: #059669; text-decoration: none; font-weight: 600; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;" class="dark:text-emerald-400 hover:underline">
                        <svg style="width: 1.25rem; height: 1.25rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        ${getCleanedAndSanitizedText(linkTitle)}
                    </a>
                </div>`;
                break;

            case 'quote':
                const quoteText = block.data.text || '';
                const quoteCaption = block.data.caption || '';
                html += `<blockquote style="border-left: 5px solid #10b981; padding: 1.5rem 1.5rem 1.5rem 2rem; margin: 2rem 0; font-style: italic; color: #4b5563; background: linear-gradient(to right, #f0fdf4, #ffffff); border-radius: 0.75rem; box-shadow: 0 4px 10px rgba(0,0,0,0.05); font-size: 1.15rem; line-height: 1.8;" class="dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:border-emerald-500 dark:!text-gray-100">${getCleanedAndSanitizedText(quoteText)}`;
                if (quoteCaption) {
                    html += ` <cite style="display: block; font-size: 0.95em; color: #6b7280; margin-top: 1rem; font-weight: 600; font-style: normal;" class="dark:!text-gray-300">— ${getCleanedAndSanitizedText(quoteCaption)}</cite>`;
                }
                html += `</blockquote>`;
                break;

            case 'code':
                html += `<pre style="background: linear-gradient(to right, #1e293b, #0f172a); padding: 1.5rem; border-radius: 1rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; margin: 2rem 0; border: 1px solid #334155; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" class="dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-950 dark:border-slate-800"><code style="font-family: 'Courier New', monospace; color: #10b981; font-size: 0.95rem; line-height: 1.6;" class="dark:text-emerald-400">${getCleanedAndSanitizedText(block.data.code)}</code></pre>`;
                break;

            case 'embed':
                const embedUrl = block.data.embed || '';
                const embedCaption = block.data.caption || '';
                html += `<div style="text-align: center; margin: 2rem 0;">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15);" class="dark:shadow-2xl dark:shadow-emerald-500/10">
                        <iframe src="${DOMPurify.sanitize(embedUrl)}" frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
                    </div>`;
                if (embedCaption) {
                    html += `<p style="font-size: 0.95em; color: #6b7280; margin-top: 1rem; text-align: center; font-style: italic;" class="dark:!text-gray-300">${getCleanedAndSanitizedText(embedCaption)}</p>`;
                }
                html += `</div>`;
                break;

            case 'table':
                let tableHtml = '<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);" class="dark:border-slate-700">';
                (block.data.content || []).forEach((row, rowIndex) => {
                    const isHeader = rowIndex === 0;
                    tableHtml += `<tr style="background-color: ${isHeader ? '#f0fdf4' : (rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb')};" class="${isHeader ? 'dark:bg-emerald-900/20' : (rowIndex % 2 === 0 ? 'dark:bg-slate-900' : 'dark:bg-slate-800')}">`;
                    (row || []).forEach((cell, cellIndex) => {
                        const cellTag = isHeader ? 'th' : 'td';
                        tableHtml += `<${cellTag} style="border: 1px solid #e5e7eb; padding: 1rem; text-align: left; color: ${isHeader ? '#059669' : '#374151'}; font-weight: ${isHeader ? '600' : 'normal'}; font-size: ${isHeader ? '1rem' : '0.95rem'};" class="dark:border-slate-700 ${isHeader ? 'dark:text-emerald-400' : 'dark:!text-gray-100'}">${getCleanedAndSanitizedText(cell)}</${cellTag}>`;
                    });
                    tableHtml += `</tr>`;
                });
                tableHtml += '</table></div>';
                html += tableHtml;
                break;

            case 'delimiter':
                html += `<div style="text-align: center; margin: 3rem 0;">
                    <div style="display: inline-flex; align-items: center; gap: 1rem;">
                        <span style="display: inline-block; width: 40px; height: 2px; background: linear-gradient(to right, transparent, #10b981, transparent); border-radius: 5px;" class="dark:bg-gradient-to-r dark:from-transparent dark:via-emerald-500 dark:to-transparent"></span>
                        <span style="color: #10b981; font-size: 1.5rem;" class="dark:text-emerald-400">◆</span>
                        <span style="display: inline-block; width: 40px; height: 2px; background: linear-gradient(to right, transparent, #10b981, transparent); border-radius: 5px;" class="dark:bg-gradient-to-r dark:from-transparent dark:via-emerald-500 dark:to-transparent"></span>
                    </div>
                </div>`;
                break;

            case 'inlineCode':
                html += `<p><code style="background-color: #f3f4f6; color: #059669; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: 'Courier New', monospace; font-size: 0.95em; border: 1px solid #e5e7eb;" class="dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700">${getCleanedAndSanitizedText(block.data.text)}</code></p>`;
                break;

            case 'marker':
                html += `<p><mark style="background: linear-gradient(to right, #fef3c7, #fde68a); color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-weight: 600;" class="dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-amber-900/40 dark:text-yellow-400">${getCleanedAndSanitizedText(block.data.text)}</mark></p>`;
                break;

            default:
                console.warn('Unknown block type encountered:', block.type, block);
                html += `<p style="margin-bottom: 1.5em; color: #9ca3af; font-style: italic;" class="dark:!text-gray-400">${getCleanedAndSanitizedText(block.data.text || 'Unsupported block type')}</p>`;
                break;
        }
    });
    return html;
};