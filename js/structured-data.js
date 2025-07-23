// Function to load and inject JSON-LD structured data
async function loadStructuredData(jsonFiles) {
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            const data = await response.json();
            
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        } catch (error) {
            console.error(`Error loading structured data from ${file}:`, error);
        }
    }
}

// Load structured data for index page
document.addEventListener('DOMContentLoaded', function() {
    loadStructuredData([
        'data/organization.json',
        'data/website.json'
    ]);
});
