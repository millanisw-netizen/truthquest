/* ═══════════════════════════════════════════════════════════════
   story-data.js — Inline story fallback
   Loaded before engine.js so the game works on file:// AND http://
   TruthQuest | UNESCO Youth Hackathon 2026
═══════════════════════════════════════════════════════════════ */

const STORY_FALLBACK = {
  "chapters": [
    {
      "id": 1,
      "title": "The Viral Video",
      "intro": "Breaking news floods your screen. A video has gone viral overnight — and the city is starting to panic.",
      "scenes": [
        {
          "id": "1-1",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "A video just went viral claiming the mayor poisoned the Veridis water supply. 50,000 shares in 2 hours. My phone is exploding. Do we run with it?",
          "choices": [
            { "text": "Publish immediately — the public needs to know!", "trustDelta": -15, "badge": null, "feedback": "You published without verifying. The story spreads fast — but so does panic. Hours later, the water tests come back clean. Your credibility takes a hit.", "next": "1-2b" },
            { "text": "Wait — let's verify the source first.", "trustDelta": 5, "badge": "critical_thinker", "feedback": "Smart move. Taking time to verify is the cornerstone of responsible journalism. The city stays calm while you investigate.", "next": "1-2a" }
          ]
        },
        {
          "id": "1-2a",
          "speaker": "Tech Analyst Jordan",
          "avatar": "🧑‍💻",
          "text": "I ran the video through our tools. The metadata is strange — the file was created 3 years ago, but the filename references 'this week.' I think this video was re-edited. Want me to dig deeper?",
          "choices": [
            { "text": "Yes — pull the original footage and compare.", "trustDelta": 10, "badge": "digital_detective", "feedback": "Excellent instinct. You find the original 2021 clip — a routine water test, completely taken out of context. Key evidence secured.", "next": "1-3a" },
            { "text": "That's enough. Let's expose the edit now.", "trustDelta": -5, "badge": null, "feedback": "You published too soon. You were right about the edit, but without the original footage, critics dismiss your story as speculation.", "next": "1-3b" }
          ]
        },
        {
          "id": "1-2b",
          "speaker": "Citizen Rania",
          "avatar": "😰",
          "text": "Your article is everywhere! People are storming supermarkets for bottled water. Three schools closed. But... someone just sent me a link showing that video is from 2021. Did you check?",
          "choices": [
            { "text": "Issue a correction immediately.", "trustDelta": 8, "badge": "accountability", "feedback": "Issuing a swift correction rebuilds some trust. It won't undo the panic, but the city sees your integrity.", "next": "1-3b" },
            { "text": "Double down — the water could still be unsafe.", "trustDelta": -20, "badge": null, "feedback": "City health officials release test results proving the water is safe. Your credibility collapses.", "next": "1-3c" }
          ]
        },
        {
          "id": "1-3a",
          "speaker": "You",
          "avatar": "🎙️",
          "text": "You have the original 2021 footage side-by-side with the doctored version. Now you need to verify the account that first posted it. Time for a deep investigation.",
          "minigame": {
            "type": "source_verify", "id": "mg-1", "title": "Verify the Source",
            "content": { "type": "tweet", "username": "VeridasTruth_Official", "handle": "@VeridasTruth_Official", "avatar": "🦅", "verified_badge": true, "text": "🚨 BREAKING: Mayor Chen CAUGHT poisoning Veridis water supply. Video proof inside. Share before they DELETE this! #Veridis #WaterGate #ExposeTheMayor", "timestamp": "2 hours ago", "likes": "14.2K", "retweets": "8.9K", "image_desc": "[Screenshot of a water treatment facility — blurry, low resolution]" },
            "tools": {
              "source_history": { "result": "⚠️ Account created 3 days ago. No post history before today. Classic 'fresh account' pattern used in coordinated disinformation campaigns.", "correct_signal": "suspicious" },
              "reverse_image": { "result": "🖼️ Image match found! This exact photo appears in a 2021 municipal report about routine water treatment upgrades — completely unrelated to any contamination.", "correct_signal": "manipulated" },
              "publication_date": { "result": "📅 Account age: 3 days. The video file metadata traces to a 3-year-old upload date. This content was staged recently using old material.", "correct_signal": "old_content" },
              "ai_detector": { "result": "🤖 The caption text shows 98.7% probability of AI generation. Emotional trigger words (CAUGHT, proof, DELETE) are common in AI-generated disinformation scripts.", "correct_signal": "ai_generated" }
            },
            "correct_verdict": "misinformation", "trustReward": 15, "trustPenalty": -20, "badge_on_correct": "source_sleuth",
            "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "1-4" }]
          },
          "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "1-4" }]
        },
        {
          "id": "1-3b",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "You exposed the edit, but without solid sourcing, critics are calling your report 'speculation.' Let's still verify the account behind the original post.",
          "minigame": {
            "type": "source_verify", "id": "mg-1b", "title": "Verify the Source",
            "content": { "type": "tweet", "username": "VeridasTruth_Official", "handle": "@VeridasTruth_Official", "avatar": "🦅", "verified_badge": true, "text": "🚨 BREAKING: Mayor Chen CAUGHT poisoning Veridis water supply. Share before they DELETE this! #WaterGate", "timestamp": "2 hours ago", "likes": "14.2K", "retweets": "8.9K", "image_desc": "[Screenshot of a water treatment facility — blurry, low resolution]" },
            "tools": {
              "source_history": { "result": "⚠️ Account created 3 days ago. No post history before today.", "correct_signal": "suspicious" },
              "reverse_image": { "result": "🖼️ Image match found — 2021 municipal report, unrelated to contamination.", "correct_signal": "manipulated" },
              "publication_date": { "result": "📅 Account age: 3 days. Video metadata traces to 3-year-old upload.", "correct_signal": "old_content" },
              "ai_detector": { "result": "🤖 98.7% probability of AI-generated caption text.", "correct_signal": "ai_generated" }
            },
            "correct_verdict": "misinformation", "trustReward": 10, "trustPenalty": -15, "badge_on_correct": "source_sleuth",
            "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "1-4" }]
          },
          "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "1-4" }]
        },
        {
          "id": "1-3c",
          "speaker": "Mayor Chen",
          "avatar": "🏛️",
          "text": "City health officials just held an emergency press conference. The water is completely safe. They're calling for a retraction from your outlet. What do you do?",
          "choices": [
            { "text": "Issue a full retraction and apology.", "trustDelta": 5, "badge": "accountability", "feedback": "A humble retraction. It hurts, but the city respects the honesty. You live to report another day.", "next": "1-4" },
            { "text": "Claim the officials are covering it up.", "trustDelta": -25, "badge": null, "feedback": "The conspiracy angle backfires badly. Independent lab tests confirm safe water.", "next": "1-4" }
          ]
        },
        {
          "id": "1-4",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "Chapter 1 complete. We've learned something crucial: in a world of viral misinformation, the first step is always to verify. A whistleblower just contacted us — Chapter 2 begins now.",
          "choices": [{ "text": "Continue to Chapter 2 →", "trustDelta": 0, "badge": "chapter_1_complete", "feedback": "✅ Chapter 1 complete! Your instincts are sharpening. The investigation continues — a whistleblower is waiting.", "next": "2-1" }]
        }
      ]
    },
    {
      "id": 2,
      "title": "The Hidden Agenda",
      "intro": "A mysterious whistleblower reaches out with explosive claims. But in the age of disinformation, even sources can be weaponized.",
      "scenes": [
        {
          "id": "2-1",
          "speaker": "Unknown Caller",
          "avatar": "🎭",
          "text": "I have documents proving the water contamination is real — and the mayor's office is covering it up. I can't say who I am. Not yet. But I'll send you the files. Trust me.",
          "choices": [
            { "text": "Ask for their identity before proceeding.", "trustDelta": 8, "badge": "critical_thinker", "feedback": "Protecting sources is vital — but vetting them first is equally important.", "next": "2-2a" },
            { "text": "Accept the documents — whistleblowers need protection.", "trustDelta": -5, "badge": null, "feedback": "You accept the documents without vetting the source. Something feels off.", "next": "2-2b" }
          ]
        },
        {
          "id": "2-2a",
          "speaker": "Tech Analyst Jordan",
          "avatar": "🧑‍💻",
          "text": "I traced the encrypted message's metadata. The sender's VPN routes through an IP address registered to a political consulting firm linked to Councilman Delaney — the mayor's main rival.",
          "choices": [
            { "text": "Confront the source about the Delaney connection.", "trustDelta": 10, "badge": "digital_detective", "feedback": "The 'whistleblower' goes silent when confronted. You've uncovered a political operation.", "next": "2-3" },
            { "text": "The documents might still be real — verify them independently.", "trustDelta": 5, "badge": "evidence_analyst", "feedback": "Wise. The source may be compromised but the documents could still contain truth.", "next": "2-3" }
          ]
        },
        {
          "id": "2-2b",
          "speaker": "Colleague Sam",
          "avatar": "🧑‍🤝‍🧑",
          "text": "I looked into our 'whistleblower.' They've been all over political forums, always pushing anti-mayor content. Every post links back to Councilman Delaney's campaign circle. We've been played.",
          "choices": [
            { "text": "Investigate Delaney's connection before publishing anything.", "trustDelta": 8, "badge": "critical_thinker", "feedback": "Good recovery. Pausing to investigate the real story behind the story is excellent journalism.", "next": "2-3" },
            { "text": "The documents are the story — publish and let the public decide.", "trustDelta": -15, "badge": null, "feedback": "The Delaney connection surfaces hours later, and now YOUR outlet looks complicit in the smear campaign.", "next": "2-3" }
          ]
        },
        {
          "id": "2-3",
          "speaker": "You",
          "avatar": "🎙️",
          "text": "You receive an audio clip — allegedly the mayor ordering the cover-up. It sounds convincing. But deepfakes aren't just for video anymore. Time to verify.",
          "minigame": {
            "type": "source_verify", "id": "mg-2", "title": "Analyze the Audio Evidence",
            "content": { "type": "audio_post", "username": "Anonymous Source", "handle": "via encrypted channel", "avatar": "🎭", "verified_badge": false, "text": "🔊 LEAKED AUDIO: Mayor Chen speaking to aide: 'Keep the water report buried. Delaney can't get this before the election.' [Duration: 0:47]", "timestamp": "Received 20 minutes ago", "likes": "N/A", "retweets": "N/A", "image_desc": "[Audio waveform — unusually uniform peaks across the entire clip]" },
            "tools": {
              "source_history": { "result": "🚫 Anonymous burner account created today. Cannot establish chain of custody.", "correct_signal": "suspicious" },
              "reverse_image": { "result": "🔊 Waveform analysis: Suspiciously uniform amplitude — real speech has natural variation. Consistent with AI voice synthesis.", "correct_signal": "manipulated" },
              "publication_date": { "result": "📅 Audio file created 40 minutes ago — conveniently timed right after your investigation became public.", "correct_signal": "suspicious_timing" },
              "ai_detector": { "result": "🤖 Voice AI analysis: 94.2% probability of AI-generated speech. Phoneme transitions show micro-artifacts consistent with text-to-speech synthesis.", "correct_signal": "ai_generated" }
            },
            "correct_verdict": "misinformation", "trustReward": 15, "trustPenalty": -20, "badge_on_correct": "deepfake_detector",
            "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "2-4" }]
          },
          "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "2-4" }]
        },
        {
          "id": "2-4",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "We have a story here — but it's not about the mayor poisoning water. It's about a coordinated disinformation campaign by a political actor. What do we publish?",
          "choices": [
            { "text": "Publish the full story: 'Disinformation Campaign Targets Mayor Before Election'", "trustDelta": 15, "badge": "truth_teller", "feedback": "Brilliant. You've turned a disinformation attack into a story about disinformation itself. Trust soars.", "next": "2-5" },
            { "text": "Publish only what we can 100% prove — a narrower story.", "trustDelta": 8, "badge": "accountability", "feedback": "Cautious but responsible. Publishing only what you can prove keeps your credibility intact.", "next": "2-5" },
            { "text": "Hold the story — we need more evidence.", "trustDelta": 2, "badge": null, "feedback": "Sometimes the most ethical choice is patience. Meanwhile, the disinformation continues to spread...", "next": "2-5" }
          ]
        },
        {
          "id": "2-5",
          "speaker": "Colleague Sam",
          "avatar": "🧑‍🤝‍🧑",
          "text": "Chapter 2 done. We've seen how disinformation can use legitimate channels as weapons. Chapter 3 will be the hardest yet.",
          "choices": [{ "text": "Continue to Chapter 3 →", "trustDelta": 0, "badge": "chapter_2_complete", "feedback": "Chapter 2 complete! The final chapter awaits...", "next": "3-1" }]
        }
      ]
    },
    {
      "id": 3,
      "title": "The Truth Spreads",
      "intro": "Your reporting has made waves. Now the city's future depends on what you do next. The pressure to back down has never been greater.",
      "scenes": [
        {
          "id": "3-1",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "Your article on the disinformation campaign went viral. 200,000 reads in 6 hours. But Delaney's team just published a counter-narrative calling YOUR report 'fake news' — and it's spreading just as fast.",
          "choices": [
            { "text": "Publish a detailed rebuttal with all your sources cited.", "trustDelta": 12, "badge": "evidence_analyst", "feedback": "Transparency wins. Showing your work lets readers verify your reporting themselves. Trust climbs.", "next": "3-2" },
            { "text": "Let the work speak for itself. Don't engage.", "trustDelta": -3, "badge": null, "feedback": "Silence can look like doubt. In the attention economy, the louder voice often wins.", "next": "3-2" }
          ]
        },
        {
          "id": "3-2",
          "speaker": "Social Media Wave",
          "avatar": "📱",
          "text": "Hundreds of accounts demand you retract the story. Some are clearly bots — identical messages, no profile pictures, all created within the past month. But some seem real and genuinely upset.",
          "choices": [
            { "text": "Analyze the accounts — identify the bot network.", "trustDelta": 10, "badge": "digital_detective", "feedback": "You expose a coordinated inauthentic behavior campaign. 73% of the 'outrage' was bot-amplified.", "next": "3-3" },
            { "text": "Engage with the genuine critics thoughtfully.", "trustDelta": 8, "badge": "truth_teller", "feedback": "Authentic engagement builds real trust. Many critics become supporters.", "next": "3-3" },
            { "text": "Cave to the pressure — issue a soft retraction.", "trustDelta": -20, "badge": null, "feedback": "Retracting a true, well-sourced story because of pressure is a betrayal of journalism.", "next": "3-3" }
          ]
        },
        {
          "id": "3-3",
          "speaker": "You",
          "avatar": "🎙️",
          "text": "A government document has been delivered to your office. It appears to confirm the disinformation campaign originated from Delaney's office. This could be the smoking gun — or another trap.",
          "minigame": {
            "type": "source_verify", "id": "mg-3", "title": "Authenticate the Government Document",
            "content": { "type": "document", "username": "Veridis City Council — Internal", "handle": "Physical document + digital scan", "avatar": "📄", "verified_badge": false, "text": "INTERNAL MEMO — CONFIDENTIAL\nFrom: Office of Councilman Delaney\nTo: Communications Director\nRe: Operation Watershed\n\n'Proceed with Phase 2. The journalist's investigation must be discredited before Thursday. Use the prepared assets.'", "timestamp": "Date on document: This week", "likes": "N/A", "retweets": "N/A", "image_desc": "[Scanned document with official letterhead, signatures, and a city council watermark]" },
            "tools": {
              "source_history": { "result": "✅ Document letterhead matches authentic Veridis City Council formats. Font, spacing, and seal are consistent with verified official documents. However — we cannot rule out sophisticated forgery.", "correct_signal": "needs_more_verification" },
              "reverse_image": { "result": "📄 Pixel analysis shows no signs of digital manipulation in the text layers. The signature ink patterns appear consistent with a real pen signature.", "correct_signal": "likely_authentic" },
              "publication_date": { "result": "📅 The document references 'Phase 2' — we can cross-reference with the timeline of bot activity we documented. The dates align perfectly with the surge in coordinated posts.", "correct_signal": "timeline_match" },
              "ai_detector": { "result": "🤖 The formal language is consistent with human-written bureaucratic communication. Low probability of AI generation. Writing style matches other confirmed Delaney office communications on public record.", "correct_signal": "likely_authentic" }
            },
            "correct_verdict": "verified", "trustReward": 20, "trustPenalty": -10, "badge_on_correct": "document_authenticator",
            "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "3-4" }]
          },
          "choices": [{ "text": "Continue →", "trustDelta": 0, "badge": null, "feedback": "", "next": "3-4" }]
        },
        {
          "id": "3-4",
          "speaker": "Editor Maya",
          "avatar": "👩‍💼",
          "text": "We have the document. We have the timeline. We have the proof. This is the moment, journalist. What do we publish?",
          "choices": [
            { "text": "Publish the full truth — the complete disinformation operation exposed.", "trustDelta": 20, "badge": "truth_teller", "feedback": "This is it. The complete story, with every source cited. Veridis finally gets the truth it deserves.", "next": "3-5" },
            { "text": "Publish a 'safe' version — omit the most politically explosive parts.", "trustDelta": 5, "badge": null, "feedback": "You protect yourself, but you leave the full picture incomplete.", "next": "3-5" },
            { "text": "Hand everything to prosecutors first — let the law handle it.", "trustDelta": 12, "badge": "accountability", "feedback": "A responsible choice. Justice and journalism work together.", "next": "3-5" }
          ]
        },
        {
          "id": "3-5",
          "speaker": "Veridis",
          "avatar": "🏙️",
          "text": "The city breathes. For the first time in weeks, people know what actually happened. Delaney's operation is under investigation. And you — you're just a journalist doing your job. The most important job in a democracy.",
          "choices": [{ "text": "See your final Truth Score →", "trustDelta": 0, "badge": "veridis_defender", "feedback": "You've completed TruthQuest. Thank you for defending the truth.", "next": "END" }]
        }
      ]
    }
  ],
  "badges": {
    "critical_thinker":        { "icon": "🧠", "name": "Critical Thinker",        "description": "You questioned before acting — the first principle of media literacy." },
    "digital_detective":       { "icon": "🔎", "name": "Digital Detective",        "description": "You followed the digital trail to uncover hidden truths." },
    "source_sleuth":           { "icon": "🕵️", "name": "Source Sleuth",           "description": "You exposed a fake account using professional verification tools." },
    "deepfake_detector":       { "icon": "🤖", "name": "Deepfake Detector",       "description": "You identified AI-generated media before it could mislead the public." },
    "evidence_analyst":        { "icon": "📊", "name": "Evidence Analyst",        "description": "You analyzed evidence carefully and drew conclusions from facts." },
    "truth_teller":            { "icon": "📰", "name": "Truth Teller",            "description": "You published the truth even when it was difficult and risky." },
    "accountability":          { "icon": "⚖️", "name": "Accountable",             "description": "You took responsibility for your reporting decisions." },
    "document_authenticator":  { "icon": "📄", "name": "Document Authenticator", "description": "You authenticated a complex document using multiple verification methods." },
    "chapter_1_complete":      { "icon": "🏅", "name": "Chapter 1 Complete",      "description": "You survived the viral video crisis." },
    "chapter_2_complete":      { "icon": "🏅", "name": "Chapter 2 Complete",      "description": "You navigated the hidden political agenda." },
    "veridis_defender":        { "icon": "🏆", "name": "Defender of Veridis",     "description": "You completed TruthQuest and helped save Veridis from disinformation." }
  }
};
