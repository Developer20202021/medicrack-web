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
                html += `<p style="margin-bottom: 1em;">${getCleanedAndSanitizedText(block.data.text)}</p>`;
                break;

            case 'header':
                const fontSize = {
                    1: '1.5em', // h1
                    2: '1.5em', // h2
                    3: '1.5em', // h3
                    4: '1.5em', // h4
                    5: '1.25em', // h5
                    6: '1em' // h6
                }[block.data.level] || '1.5em';

                html += `<h${block.data.level} ${headerIdAttribute} style="margin-top: 1.5em; margin-bottom: 0.8em; font-weight: bold; font-size: ${fontSize}; color: #333;">${getCleanedAndSanitizedText(block.data.text)}</h${block.data.level}>`;
                break;

            case 'list':
                const tag = block.data.style === 'unordered' ? 'ul' : 'ol';
                html += `<${tag} style="margin-left: 25px; margin-bottom: 1em; list-style-type: ${block.data.style === 'unordered' ? 'disc' : 'decimal'};">`;
                (block.data.items || []).forEach(item => {
                    const listItemText = typeof item === 'object' && item !== null && item.content ? item.content : item;
                    html += `<li style="margin-bottom: 0.5em;">${getCleanedAndSanitizedText(listItemText)}</li>`;
                });
                html += `</${tag}>`;
                break;

            case 'image':
                const imageUrl = block.data.file && block.data.file.url ? block.data.file.url : '';
                const imageCaption = block.data.caption || '';
                html += `<div style="text-align: center; margin: 15px 0;">`;
                if (imageUrl) {
                    html += `<img src="${DOMPurify.sanitize(imageUrl)}" alt="${getCleanedAndSanitizedText(imageCaption)}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 5px;"/>`;
                }
                if (imageCaption) {
                    html += `<p style="font-size: 0.9em; color: #555; margin-top: 5px; text-align: center;">${getCleanedAndSanitizedText(imageCaption)}</p>`;
                }
                html += `</div>`;
                break;

            case 'linkTool':
                const linkHref = block.data.link || '#';
                const linkTitle = block.data.meta && block.data.meta.title ? block.data.meta.title : linkHref;
                html += `<p><a href="${DOMPurify.sanitize(linkHref)}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">${getCleanedAndSanitizedText(linkTitle)}</a></p>`;
                break;

            case 'quote':
                const quoteText = block.data.text || '';
                const quoteCaption = block.data.caption || '';
                html += `<blockquote style="border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; font-style: italic; color: #555;">${getCleanedAndSanitizedText(quoteText)}`;
                if (quoteCaption) {
                    html += ` <cite style="display: block; font-size: 0.9em; color: #777; margin-top: 5px;">- ${getCleanedAndSanitizedText(quoteCaption)}</cite>`;
                }
                html += `</blockquote>`;
                break;

            case 'code':
                html += `<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;"><code style="font-family: monospace;">${getCleanedAndSanitizedText(block.data.code)}</code></pre>`;
                break;

            case 'embed':
                const embedUrl = block.data.embed || '';
                const embedCaption = block.data.caption || '';
                html += `<div style="text-align: center; margin: 15px 0;"><iframe src="${DOMPurify.sanitize(embedUrl)}" frameborder="0" allowfullscreen style="width: 100%; max-width: 560px; height: 315px; margin: 0 auto; display: block; border-radius: 5px;"></iframe>`;
                if (embedCaption) {
                    html += `<p style="font-size: 0.9em; color: #555; margin-top: 5px; text-align: center;">${getCleanedAndSanitizedText(embedCaption)}</p>`;
                }
                html += `</div>`;
                break;

            case 'table':
                let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">';
                (block.data.content || []).forEach((row) => {
                    tableHtml += `<tr>`;
                    (row || []).forEach(cell => {
                        tableHtml += `<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${getCleanedAndSanitizedText(cell)}</td>`;
                    });
                    tableHtml += `</tr>`;
                });
                tableHtml += '</table>';
                html += tableHtml;
                break;

            case 'delimiter':
                html += `<div style="text-align: center; margin: 20px 0;"><span style="display: inline-block; width: 80px; height: 1px; background-color: #ccc; border-radius: 5px;"></span></div>`;
                break;

            case 'inlineCode':
                html += `<p><code style="background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${getCleanedAndSanitizedText(block.data.text)}</code></p>`;
                break;

            case 'marker':
                html += `<p><mark style="background-color: yellow; padding: 2px 4px; border-radius: 3px;">${getCleanedAndSanitizedText(block.data.text)}</mark></p>`;
                break;

            default:
                console.warn('Unknown block type encountered:', block.type, block);
                html += `<p style="margin-bottom: 1em; color: #888;">${getCleanedAndSanitizedText(block.data.text || 'Unsupported block type')}</p>`;
                break;
        }
    });
    return html;
};
