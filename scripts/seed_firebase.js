const fs = require('fs');
const path = require('path');

const FIREBASE_API_KEY = "AIzaSyBqYwumJNkRogUIjCY965OQQv28nGeHI_o";
const PROJECT_ID = "gems-ebook";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number') {
        if (Number.isInteger(val)) return { integerValue: String(val) };
        return { doubleValue: val };
    }
    if (typeof val === 'string') return { stringValue: val };
    if (Array.isArray(val)) {
        return { arrayValue: { values: val.map(toFirestoreValue) } };
    }
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

async function uploadDocument(collectionId, docId, dataObject) {
    const fields = {};
    for (const [k, v] of Object.entries(dataObject)) {
        fields[k] = toFirestoreValue(v);
    }

    const url = `${BASE_URL}/${collectionId}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to upload ${collectionId}/${docId}: ${response.status} ${errText}`);
    }
    return response.json();
}

async function runSeeding() {
    console.log("🚀 Starting Firestore Seeding process...\n");
    const dataDir = path.join(__dirname, '..', 'data');

    // 1. Seed Books
    const booksPath = path.join(dataDir, 'books.json');
    if (fs.existsSync(booksPath)) {
        const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
        console.log(`📦 Seeding Books collection (${Object.keys(booksData).length} books)...`);
        for (const [bookId, item] of Object.entries(booksData)) {
            await uploadDocument('books', bookId, item);
            console.log(`  ✓ Uploaded book: ${bookId}`);
        }
    }

    // 2. Seed Dictionary
    const dictPath = path.join(dataDir, 'dictionary.json');
    if (fs.existsSync(dictPath)) {
        const dictData = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
        console.log(`\n📖 Seeding Dictionary collection (${Object.keys(dictData).length} terms)...`);
        for (const [termKey, item] of Object.entries(dictData)) {
            await uploadDocument('dictionary', termKey, item);
            console.log(`  ✓ Uploaded dictionary term: ${termKey}`);
        }
    }

    // 3. Seed Chapters
    const chapPath = path.join(dataDir, 'chapters.json');
    if (fs.existsSync(chapPath)) {
        const chapData = JSON.parse(fs.readFileSync(chapPath, 'utf8'));
        console.log(`\n📑 Seeding Chapters collection (${Object.keys(chapData).length} chapters)...`);
        for (const [chapId, item] of Object.entries(chapData)) {
            await uploadDocument('chapters', chapId, item);
            console.log(`  ✓ Uploaded chapter: ${chapId}`);
        }
    }

    console.log("\n🎉 All data successfully seeded to Firebase Firestore!");
}

runSeeding().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
