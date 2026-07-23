/**
 * GEMS Ebook App - Medical Dictionary Module
 * Encapsulated medical dictionary module to prevent global scope contamination and side-effects.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Dictionary = (function () {
    let termData = {};
    let dictCurrentFilter = 'all';

    async function loadDictionaryData() {
        if (Object.keys(termData).length > 0) return;
        try {
            if (window.db) {
                const snapshot = await window.db.collection('dictionary').get();
                if (!snapshot.empty) {
                    const dict = {};
                    snapshot.forEach(doc => {
                        dict[doc.id] = doc.data();
                    });
                    termData = dict;
                    console.log("🔥 Dictionary data loaded from Firebase Firestore!", Object.keys(dict).length, "terms");
                    return;
                }
            }
        } catch (firebaseErr) {
            console.warn("Firebase dictionary fetch failed, falling back to local JSON:", firebaseErr);
        }

        try {
            const response = await fetch('/data/dictionary.json');
            termData = await response.json();
            console.log("Dictionary data loaded dynamically from local JSON!");
        } catch (err) {
            console.error("Lỗi tải từ điển y khoa:", err);
        }
    }

    function openDictionary() {
        loadDictionaryData();
        const view = document.getElementById('view-dictionary');
        if (view) {
            view.classList.remove('hidden');
            const inp = document.getElementById('dict-search-input');
            if (inp) inp.value = '';
            filterDictionary('');
            setDictFilter('all');
            if (typeof updateBottomNavVisibility === 'function') {
                updateBottomNavVisibility();
            }
        }
    }

    function closeDictionary() {
        const view = document.getElementById('view-dictionary');
        if (view) view.classList.add('hidden');
        closeDictionaryTerm();
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function handleDictionaryBack() {
        closeDictionary();
        if (window.appState && window.appState.activeTab === 'dictionary') {
            if (typeof switchTab === 'function') {
                switchTab('home');
            }
        }
    }

    async function openDictionaryTerm(title, badgeLabel, badgeType, definition, clinical) {
        // Rule: #view-dict-term is nested in #view-dictionary, so ensure view-dictionary is visible first
        openDictionary();
        if (Object.keys(termData).length === 0) {
            await loadDictionaryData();
        }

        if (typeof incrementLookupCount === 'function') {
            incrementLookupCount();
        }

        const titleEl = document.getElementById('dict-term-title');
        if (titleEl) titleEl.textContent = title;

        const defEl = document.getElementById('dict-term-def');
        if (defEl) defEl.textContent = definition;

        const badge = document.getElementById('dict-term-badge');
        if (badge) {
            badge.textContent = badgeLabel;
            const colorMap = {
                benhly: 'bg-amber-100 text-amber-700',
                giaiphau: 'bg-amber-100 text-amber-700',
                thuatngu: 'bg-blue-100 text-blue-600',
                duoclieu: 'bg-blue-100 text-blue-600'
            };
            badge.className = "inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 " + (colorMap[badgeType] || 'bg-slate-100 text-slate-600');
        }

        const data = termData[title] || {
            pronunciation: "/" + title.toLowerCase() + "/",
            symptoms: ['Tham khảo tài liệu chuyên khoa để biết triệu chứng chi tiết.'],
            diagnosis: [{ label: 'Khám lâm sàng', desc: 'Cần bác sĩ chuyên khoa thăm khám để chẩn đoán chính xác.' }],
            causes: [clinical || 'Đang cập nhật nguyên nhân y khoa.']
        };

        const pronEl = document.getElementById('dict-term-pronunciation');
        if (pronEl) pronEl.textContent = data.pronunciation || ("/" + title.toLowerCase() + "/");

        const imgWrap = document.getElementById('dict-term-img-wrap');
        const imgEl = document.getElementById('dict-term-img');
        const imgCaptionEl = document.getElementById('dict-term-img-caption');
        if (imgWrap && imgEl && imgCaptionEl) {
            if (data.image) {
                imgEl.src = data.image;
                imgCaptionEl.textContent = data.caption || 'Sơ đồ minh họa.';
                imgWrap.classList.remove('hidden');
            } else {
                imgWrap.classList.add('hidden');
            }
        }

        const symptomsEl = document.getElementById('dict-term-symptoms');
        if (symptomsEl && data.symptoms) {
            symptomsEl.innerHTML = data.symptoms.map(s =>
                '<li class="text-sm text-slate-700 leading-relaxed">' + s + '</li>'
            ).join('');
        }

        const diagEl = document.getElementById('dict-term-diagnosis');
        if (diagEl && data.diagnosis) {
            diagEl.innerHTML = data.diagnosis.map(d =>
                '<div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">' +
                    '<p class="text-xs font-extrabold text-blue-700">' + d.label + '</p>' +
                    '<p class="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">' + d.desc + '</p>' +
                '</div>'
            ).join('');
        }

        const causesEl = document.getElementById('dict-term-causes');
        if (causesEl && data.causes) {
            causesEl.innerHTML = data.causes.map(c =>
                '<li class="text-sm text-slate-700 leading-relaxed">' + c + '</li>'
            ).join('');
        }

        const prevContainer = document.getElementById('dict-term-prevention-container');
        const prevEl = document.getElementById('dict-term-prevention');
        if (prevContainer && prevEl) {
            if (data.prevention) {
                prevEl.innerHTML = data.prevention.map(p =>
                    '<li class="text-sm text-slate-700 leading-relaxed">' + p + '</li>'
                ).join('');
                prevContainer.classList.remove('hidden');
            } else {
                prevContainer.classList.add('hidden');
            }
        }

        const treatContainer = document.getElementById('dict-term-treatment-container');
        const treatEl = document.getElementById('dict-term-treatment');
        const treatVal = data.treatment || clinical;
        if (treatContainer && treatEl) {
            if (treatVal) {
                treatEl.textContent = treatVal;
                treatContainer.classList.remove('hidden');
            } else {
                treatContainer.classList.add('hidden');
            }
        }

        const relatedContainer = document.getElementById('dict-term-related-container');
        const relatedTitleEl = document.getElementById('dict-term-related-title');
        const relatedChapterEl = document.getElementById('dict-term-related-chapter');
        if (relatedContainer && relatedTitleEl && relatedChapterEl) {
            if (data.relatedDoc) {
                relatedTitleEl.textContent = data.relatedDoc.title;
                relatedChapterEl.textContent = data.relatedDoc.chapter;
                relatedContainer.setAttribute('data-book-id', data.relatedDoc.bookId);
                relatedContainer.classList.remove('hidden');
            } else {
                relatedContainer.classList.add('hidden');
            }
        }

        const dictTermView = document.getElementById('view-dict-term');
        if (dictTermView) dictTermView.classList.remove('hidden');
    }

    function closeDictionaryTerm() {
        const view = document.getElementById('view-dict-term');
        if (view) view.classList.add('hidden');
    }

    function setDictFilter(filter) {
        dictCurrentFilter = filter;
        ['all', 'thuatngu', 'duoclieu', 'benhly'].forEach(f => {
            const btn = document.getElementById(`dict-filter-${f}`);
            if (!btn) return;
            btn.className = f === filter
                ? 'bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-all'
                : 'bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all hover:bg-slate-200';
        });
        const searchInput = document.getElementById('dict-search-input');
        filterDictionary(searchInput ? searchInput.value : '');
    }

    function filterDictionary(query) {
        const q = query.toLowerCase().trim();
        document.querySelectorAll('#dict-list .dict-group').forEach(group => {
            const cards = group.querySelectorAll('[onclick^="openDictionaryTerm"]');
            let groupVisible = false;
            cards.forEach(card => {
                const onclick = card.getAttribute('onclick') || '';
                const termEl = card.querySelector('.text-sm.font-black') || card.querySelector('span.text-sm');
                const termName = termEl ? termEl.textContent.toLowerCase() : '';
                const descEl = card.querySelector('p');
                const desc = descEl ? descEl.textContent.toLowerCase() : '';
                const typeMatch = dictCurrentFilter === 'all' || onclick.includes(`'${dictCurrentFilter}'`);
                const searchMatch = !q || termName.includes(q) || desc.includes(q);
                card.style.display = (typeMatch && searchMatch) ? '' : 'none';
                if (typeMatch && searchMatch) groupVisible = true;
            });
            group.style.display = groupVisible ? '' : 'none';
        });
    }

    return {
        loadDictionaryData,
        openDictionary,
        closeDictionary,
        handleDictionaryBack,
        openDictionaryTerm,
        closeDictionaryTerm,
        setDictFilter,
        filterDictionary,
        get termData() { return termData; },
        get dictCurrentFilter() { return dictCurrentFilter; }
    };
})();

// Global compatibility bindings for inline HTML handlers (onclick="...")
window.openDictionary = window.GEMS.Dictionary.openDictionary;
window.closeDictionary = window.GEMS.Dictionary.closeDictionary;
window.handleDictionaryBack = window.GEMS.Dictionary.handleDictionaryBack;
window.openDictionaryTerm = window.GEMS.Dictionary.openDictionaryTerm;
window.closeDictionaryTerm = window.GEMS.Dictionary.closeDictionaryTerm;
window.setDictFilter = window.GEMS.Dictionary.setDictFilter;
window.filterDictionary = window.GEMS.Dictionary.filterDictionary;
window.loadDictionaryData = window.GEMS.Dictionary.loadDictionaryData;
