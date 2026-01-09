

      // DOM elements
      const noteInput = document.getElementById("noteInput");
      const summaryOutput = document.getElementById("summaryOutput");
      const summarizeBtn = document.getElementById("summarizeBtn");
      const clearBtn = document.getElementById("clearBtn");
      const exampleBtn = document.getElementById("exampleBtn");
      const copyBtn = document.getElementById("copyBtn");
      const clearSummaryBtn = document.getElementById("clearSummaryBtn");
      const compressionSlider = document.getElementById("compressionSlider");
      const sliderValue = document.getElementById("sliderValue");
      const loaderOverlay = document.getElementById("loaderOverlay");
      const btnLoader = document.getElementById("btnLoader");
      const progressContainer = document.getElementById("progressContainer");
      const progressBar = document.getElementById("progressBar");
      const summaryProcessing = document.getElementById("summaryProcessing");

      // Stats elements
      const charCount = document.getElementById("charCount");
      const wordCount = document.getElementById("wordCount");
      const sentenceCount = document.getElementById("sentenceCount");
      const summaryCharCount = document.getElementById("summaryCharCount");
      const summaryWordCount = document.getElementById("summaryWordCount");
      const reductionPercent = document.getElementById("reductionPercent");

      // Update stats when page loads
      document.addEventListener("DOMContentLoaded", function () {
        updateStats();
        // Load the example text that's already in the textarea
        summarizeExample();
      });

      // Update slider value display
      compressionSlider.addEventListener("input", function () {
        sliderValue.textContent = `${this.value}%`;
      });

      // Summarize button click event
      summarizeBtn.addEventListener("click", async function () {
        const text = noteInput.value.trim();
        if (!text) {
          alert("Please enter some text to summarize.");
          return;
        }

        // Show loading states
        showLoading();

        const compressionRatio = parseInt(compressionSlider.value) / 100;

        // Use setTimeout to allow UI to update before heavy processing
        setTimeout(() => {
          try {
            const summary = summarizeText(text, compressionRatio);
            displaySummary(summary);
          } catch (error) {
            console.error("Error during summarization:", error);
            summaryOutput.textContent =
              "An error occurred while generating the summary. Please try again.";
            summaryOutput.classList.remove("empty");
          } finally {
            // Hide loading states
            hideLoading();
          }
        }, 100);
      });

      // Clear note button
      clearBtn.addEventListener("click", function () {
        if (
          noteInput.value.trim() &&
          confirm("Are you sure you want to clear the note?")
        ) {
          noteInput.value = "";
          updateStats();
        }
      });

      // Load example button
      exampleBtn.addEventListener("click", function () {
        noteInput.value = `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. Leading AI textbooks define the field as the study of "intelligent agents": any system that perceives its environment and takes actions that maximize its chance of achieving its goals. Some popular accounts use the term "artificial intelligence" to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving", however, this definition is rejected by major AI researchers.

AI applications include advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Waymo), automated decision-making and competing at the highest level in strategic game systems (such as chess and Go). As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect. For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology.

Artificial intelligence was founded as an academic discipline in 1956, and in the years since has experienced several waves of optimism, followed by disappointment and the loss of funding (known as an "AI winter"), followed by new approaches, success and renewed funding. AI research has tried and discarded many different approaches during its lifetime, including simulating the brain, modeling human problem solving, formal logic, large databases of knowledge and imitating animal behavior. In the first decades of the 21st century, highly mathematical and statistical machine learning has dominated the field, and this technique has proved highly successful, helping to solve many challenging problems throughout industry and academia.

The various sub-fields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include reasoning, knowledge representation, planning, learning, natural language processing, perception, and the ability to move and manipulate objects. General intelligence (the ability to solve an arbitrary problem) is among the field's long-term goals. To solve these problems, AI researchers have adapted and integrated a wide range of problem-solving techniques, including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, probability and economics. AI also draws upon computer science, psychology, linguistics, philosophy, and many other fields.`;
        updateStats();
        summarizeExample();
      });

      // Copy summary button
      copyBtn.addEventListener("click", function () {
        const summaryText = summaryOutput.textContent;
        if (!summaryText || summaryOutput.classList.contains("empty")) {
          alert("No summary to copy.");
          return;
        }

        navigator.clipboard
          .writeText(summaryText)
          .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML =
              '<i class="fas fa-check"></i> <span class="btn-text">Copied!</span>';
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            alert("Failed to copy summary to clipboard.");
          });
      });

      // Clear summary button
      clearSummaryBtn.addEventListener("click", function () {
        if (
          !summaryOutput.classList.contains("empty") &&
          confirm("Are you sure you want to clear the summary?")
        ) {
          clearSummary();
        }
      });

      // Update stats when text changes
      noteInput.addEventListener("input", updateStats);

      // Show loading state
      function showLoading() {
        // Show full screen loader for large texts
        const textLength = noteInput.value.length;
        if (textLength > 5000) {
          loaderOverlay.classList.add("active");
        } else {
          // For smaller texts, just show button loader and summary area loader
          summarizeBtn.classList.add("loading");
          btnLoader.classList.add("active");
          summarizeBtn.disabled = true;
        }

        // Show progress bar
        progressContainer.classList.add("active");
        progressBar.style.width = "30%";

        // Show processing animation in summary area
        summaryProcessing.classList.add("active");

        // Simulate progress for longer processing
        if (textLength > 10000) {
          setTimeout(() => {
            progressBar.style.width = "70%";
          }, 300);
        }
      }

      // Hide loading state
      function hideLoading() {
        // Hide loaders
        loaderOverlay.classList.remove("active");
        summarizeBtn.classList.remove("loading");
        btnLoader.classList.remove("active");
        summarizeBtn.disabled = false;
        summaryProcessing.classList.remove("active");

        // Complete progress bar
        progressBar.style.width = "100%";

        // Hide progress bar after a delay
        setTimeout(() => {
          progressContainer.classList.remove("active");
          progressBar.style.width = "0%";
        }, 500);
      }

      // Function to summarize text using extractive summarization
      function summarizeText(text, compressionRatio = 0.4) {
        // Update progress
        progressBar.style.width = "50%";

        // Clean and split text into sentences
        const sentences = splitIntoSentences(text);
        if (sentences.length <= 3) return text; // Too short to summarize

        // Update progress
        progressBar.style.width = "60%";

        // Calculate sentence scores based on word frequency
        const wordFrequencies = calculateWordFrequencies(text);

        // Update progress
        progressBar.style.width = "70%";

        const sentenceScores = calculateSentenceScores(
          sentences,
          wordFrequencies
        );

        // Update progress
        progressBar.style.width = "80%";

        // Determine how many sentences to include in summary
        const targetSentenceCount = Math.max(
          2,
          Math.floor(sentences.length * compressionRatio)
        );

        // Get top sentences
        const topSentences = getTopSentences(
          sentences,
          sentenceScores,
          targetSentenceCount
        );

        // Update progress
        progressBar.style.width = "90%";

        // Return summary with original sentence order
        return topSentences.join(" ");
      }

      // Split text into sentences
      function splitIntoSentences(text) {
        // Simple sentence splitting regex (covers common cases)
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const matches = text.match(sentenceRegex);

        if (!matches) return [text];

        // Trim whitespace from each sentence
        return matches.map((sentence) => sentence.trim());
      }

      // Calculate word frequencies in text
      function calculateWordFrequencies(text) {
        // Remove punctuation and convert to lowercase
        const words = text
          .toLowerCase()
          .replace(/[^\w\s]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length > 0);

        // Common stop words to ignore
        const stopWords = new Set([
          "a",
          "an",
          "the",
          "and",
          "or",
          "but",
          "in",
          "on",
          "at",
          "to",
          "for",
          "of",
          "with",
          "by",
          "is",
          "are",
          "was",
          "were",
          "be",
          "been",
          "being",
          "have",
          "has",
          "had",
          "do",
          "does",
          "did",
          "will",
          "would",
          "should",
          "can",
          "could",
          "may",
          "might",
          "must",
          "i",
          "you",
          "he",
          "she",
          "it",
          "we",
          "they",
          "me",
          "him",
          "her",
          "us",
          "them",
          "this",
          "that",
          "these",
          "those",
          "am",
          "my",
          "your",
          "his",
          "its",
          "our",
          "their",
        ]);

        // Calculate frequencies
        const frequencies = {};
        words.forEach((word) => {
          if (!stopWords.has(word) && word.length > 1) {
            frequencies[word] = (frequencies[word] || 0) + 1;
          }
        });

        return frequencies;
      }

      // Calculate scores for each sentence
      function calculateSentenceScores(sentences, wordFrequencies) {
        const scores = [];

        sentences.forEach((sentence) => {
          let score = 0;
          let wordCount = 0;

          // Clean sentence and split into words
          const words = sentence
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter((word) => word.length > 0);

          // Add frequency score for each non-stop word
          words.forEach((word) => {
            if (wordFrequencies[word]) {
              score += wordFrequencies[word];
              wordCount++;
            }
          });

          // Average score per word (normalize by sentence length)
          const normalizedScore = wordCount > 0 ? score / wordCount : 0;
          scores.push(normalizedScore);
        });

        return scores;
      }

      // Get top sentences based on scores
      function getTopSentences(sentences, sentenceScores, targetCount) {
        // Create array of sentence-score pairs
        const sentenceScorePairs = sentences.map((sentence, index) => ({
          sentence,
          score: sentenceScores[index],
          index,
        }));

        // Sort by score (descending)
        sentenceScorePairs.sort((a, b) => b.score - a.score);

        // Take top sentences
        const topPairs = sentenceScorePairs.slice(0, targetCount);

        // Sort by original order
        topPairs.sort((a, b) => a.index - b.index);

        return topPairs.map((pair) => pair.sentence);
      }

      // Display summary in the output area
      function displaySummary(summary) {
        if (!summary || summary.trim().length === 0) {
          summaryOutput.textContent =
            "Could not generate summary. Please try with a longer text.";
          summaryOutput.classList.add("empty");
        } else {
          summaryOutput.textContent = summary;
          summaryOutput.classList.remove("empty");
        }

        // Update summary stats
        updateSummaryStats(summary);
      }

      // Clear summary
      function clearSummary() {
        summaryOutput.textContent =
          'Your summary will appear here after you click "Summarize Note"';
        summaryOutput.classList.add("empty");

        // Reset summary stats
        summaryCharCount.textContent = "0";
        summaryWordCount.textContent = "0";
        reductionPercent.textContent = "0%";
      }

      // Update text statistics
      function updateStats() {
        const text = noteInput.value;

        // Character count
        const charCountValue = text.length;
        charCount.textContent = charCountValue.toLocaleString();

        // Word count
        const words = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const wordCountValue = text.trim() ? words.length : 0;
        wordCount.textContent = wordCountValue.toLocaleString();

        // Sentence count
        const sentences = splitIntoSentences(text);
        const sentenceCountValue = text.trim() ? sentences.length : 0;
        sentenceCount.textContent = sentenceCountValue.toLocaleString();
      }

      // Update summary statistics
      function updateSummaryStats(summary) {
        if (!summary || summary.includes("Could not generate summary")) {
          summaryCharCount.textContent = "0";
          summaryWordCount.textContent = "0";
          reductionPercent.textContent = "0%";
          return;
        }

        // Summary character count
        const summaryCharCountValue = summary.length;
        summaryCharCount.textContent = summaryCharCountValue.toLocaleString();

        // Summary word count
        const summaryWords = summary
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const summaryWordCountValue = summary.trim() ? summaryWords.length : 0;
        summaryWordCount.textContent = summaryWordCountValue.toLocaleString();

        // Original word count
        const originalWords = noteInput.value
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const originalWordCountValue = noteInput.value.trim()
          ? originalWords.length
          : 0;

        // Calculate reduction percentage
        if (originalWordCountValue > 0) {
          const reduction = Math.round(
            100 - (summaryWordCountValue / originalWordCountValue) * 100
          );
          reductionPercent.textContent = `${reduction}%`;
        } else {
          reductionPercent.textContent = "0%";
        }
      }

      // Summarize the example text on page load
      function summarizeExample() {
        const text = noteInput.value.trim();
        if (!text) return;

        const compressionRatio = parseInt(compressionSlider.value) / 100;
        const summary = summarizeText(text, compressionRatio);
        displaySummary(summary);
      }
   