const API_BASE_URL = "";

// Tab switching logic
document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });
});

// Asynchronous Style Analysis
async function analyze() {
    const textVal = document.getElementById("content").value.trim();
    const resultBox = document.getElementById("result");
    const analyzeBtn = document.getElementById("analyze-btn");
    const spinner = document.getElementById("analyzer-spinner");
    const btnText = analyzeBtn.querySelector(".btn-text");

    if (!textVal) {
        alert("Please enter some text to analyze.");
        return;
    }

    // Set loading state
    analyzeBtn.disabled = true;
    spinner.style.display = "block";
    btnText.style.opacity = "0.7";
    resultBox.classList.add("hidden");

    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: textVal })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        // Render metrics cards
        resultBox.innerHTML = `
            <div class="analysis-results">
                <div class="metric-card">
                    <div class="metric-label">Tone</div>
                    <div class="metric-value highlight">${data.tone}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Vocabulary</div>
                    <div class="metric-value highlight">${data.vocabulary}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Writing Style</div>
                    <div class="metric-value highlight">${data.writingStyle}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Authenticity Score</div>
                    <div class="metric-value highlight" id="auth-score-val">${data.authenticityScore}</div>
                </div>
                <div class="score-container">
                    <div class="metric-label">Authenticity Rating</div>
                    <div class="score-bar-bg">
                        <div class="score-bar-fill" id="auth-score-bar"></div>
                    </div>
                </div>
            </div>
        `;
        resultBox.classList.remove("hidden");

        // Animate the score progress bar
        setTimeout(() => {
            const bar = document.getElementById("auth-score-bar");
            if (bar) {
                // Remove the percentage sign to set width
                const numericScore = parseFloat(data.authenticityScore);
                bar.style.width = `${numericScore}%`;
            }
        }, 100);

    } catch (error) {
        console.error("Error analyzing style:", error);
        resultBox.innerHTML = `
            <div style="color: #f87171; text-align: center; font-weight: 500;">
                ⚠️ Connection Error: Failed to contact the backend analyzer service. Ensure the server is running on ${API_BASE_URL}.
            </div>
        `;
        resultBox.classList.remove("hidden");
    } finally {
        analyzeBtn.disabled = false;
        spinner.style.display = "none";
        btnText.style.opacity = "1";
    }
}

// Asynchronous Content Generation
async function generate() {
    const topicVal = document.getElementById("topic").value.trim();
    const generatedBox = document.getElementById("generated");
    const generateBtn = document.getElementById("generate-btn");
    const spinner = document.getElementById("generator-spinner");
    const btnText = generateBtn.querySelector(".btn-text");

    if (!topicVal) {
        alert("Please enter a topic to generate content.");
        return;
    }

    // Set loading state
    generateBtn.disabled = true;
    spinner.style.display = "block";
    btnText.style.opacity = "0.7";
    generatedBox.classList.add("hidden");

    try {
        const lengthVal = document.getElementById('gen-length')?.value || 'medium';
        const styleVal = document.getElementById('gen-style')?.value || 'professional';

        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ topic: topicVal, length: lengthVal, style: styleVal })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        // Render generated copy layout
        generatedBox.innerHTML = `
            <div class="gen-text-container">
                <div class="generated-text" id="gen-output-text">${data.generatedText}</div>
                <div class="btn-group">
                    <button onclick="copyToClipboard()" class="sec-btn">
                        <span>📋 Copy Text</span>
                    </button>
                    <button onclick="downloadText('${data.topic}')" class="sec-btn">
                        <span>💾 Save Text</span>
                    </button>
                </div>
            </div>
        `;
        generatedBox.classList.remove("hidden");

    } catch (error) {
        console.error("Error generating content:", error);
        generatedBox.innerHTML = `
            <div style="color: #f87171; text-align: center; font-weight: 500;">
                ⚠️ Connection Error: Failed to contact the backend generator service. Ensure the server is running on ${API_BASE_URL}.
            </div>
        `;
        generatedBox.classList.remove("hidden");
    } finally {
        generateBtn.disabled = false;
        spinner.style.display = "none";
        btnText.style.opacity = "1";
    }
}

// Clipboard copying utility
function copyToClipboard() {
    const text = document.getElementById("gen-output-text").innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert("Content copied to clipboard! 🚀"))
        .catch(err => console.error("Could not copy text: ", err));
}

// Download/Save text utility
function downloadText(topic) {
    const text = document.getElementById("gen-output-text").innerText;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StackSlate-${topic.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
