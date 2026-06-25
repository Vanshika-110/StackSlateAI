const btns = document.querySelectorAll(".btn");

btns.forEach(btn=>{

btn.addEventListener("click",()=>{

alert("Welcome to STACKSLATE AI 🚀");

});

});
// Connect directly to your running backend server
// Example: call the server's content generator endpoint when needed.
// This was previously targeting a non-existent `/api/content-generator` path.
fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: "Your Topic Here" })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.warn('Could not contact /api/generate — is the server running?', err));

// Theme toggle logic
function applyTheme(theme) {
    if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'red' ? '' : 'red';
    applyTheme(next);
    try { localStorage.setItem('stackslate_theme', next); } catch(e){}
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('stackslate_theme');
    if (saved) applyTheme(saved);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);
});