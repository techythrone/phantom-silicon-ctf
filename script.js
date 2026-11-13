/*
  OPERATION: PHANTOM SILICON — public demo front-end.
  IMPORTANT: This is a static-site demonstration. Answers and validation logic
  are visible to visitors in this JavaScript file. Do not use it for a prize
  competition or secure scoring without a server-side validation backend.
*/
const missions = [
  {
    title: "THE INSIDER'S MESSAGE",
    short: "The Insider's Message",
    description: "An internal message was recovered from the Nexora Systems archive. Inspect the email and identify the unusual project reference.",
    file: "evidence_01_email.txt",
    flag: "TT{PROJECT_MOONLIT}",
    hint: "Look at the subject and the unusual project codename. The answer is the codename, not the employee's name.",
    unlocked: true
  },
  {
    title: "THE PHOTOGRAPH",
    short: "The Photograph",
    description: "A prototype photograph contains metadata left behind by the person who exported it. Read the evidence note and inspect the metadata clue.",
    file: "evidence_02_photo_metadata.txt",
    flag: "TT{EAST_WAREHOUSE}",
    hint: "The evidence note reproduces the relevant metadata field. Convert the location into uppercase words joined by an underscore.",
    unlocked: false
  },
  {
    title: "THE FAKE SHIPMENT",
    short: "The Fake Shipment",
    description: "A shipment manifest includes several records. Compare the entries and find the only shipment whose destination code does not match the declared route.",
    file: "evidence_03_manifest.csv",
    flag: "TT{CN-4471}",
    hint: "Compare the declared destination with the routing note. Find the shipment ID on the mismatched row.",
    unlocked: false
  },
  {
    title: "THE ENCRYPTED INSTRUCTION",
    short: "The Encrypted Instruction",
    description: "A configuration note contains a Base64 string. Decode it to reveal a short instruction, then submit the destination phrase.",
    file: "evidence_04_config.txt",
    flag: "TT{ARCHIVE_ROOM_3}",
    hint: "The string after 'payload=' is Base64. Use CyberChef's From Base64 operation or a trusted offline decoder.",
    unlocked: false
  },
  {
    title: "THE MONEY TRAIL",
    short: "The Money Trail",
    description: "A fictional vendor-payment ledger contains an unusual repeated payment reference. Identify the shell vendor named in the Chinese-language memo.",
    file: "evidence_05_vendor_memo.txt",
    flag: "TT{JADE_HARBOR_TRADING}",
    hint: "In the Chinese memo, find the vendor name after 供应商 (supplier). Use the English vendor name shown in the bilingual note, with underscores.",
    unlocked: false
  },
  {
    title: "OPERATION PHANTOM",
    short: "Operation Phantom",
    description: "Combine the evidence trail. The final incident note gives the operation's internal code. Submit that code to close the case.",
    file: "evidence_06_final_report.txt",
    flag: "TT{SILICON_SHADOW}",
    hint: "The final report includes a Chinese phrase and its context. The answer is the operation codename in English, not the group name.",
    unlocked: false
  }
];

let completed = new Set();
let activeIndex = 0;

const $ = id => document.getElementById(id);
function renderMissions() {
  $("mission-list").innerHTML = missions.map((m, i) => {
    const done = completed.has(i);
    const open = i === 0 || completed.has(i - 1);
    return `<article class="mission-card ${open ? "unlocked" : "locked"}">
      <div class="mission-no">${String(i + 1).padStart(2, "0")}</div>
      <div><h3>${m.short.toUpperCase()}</h3><p>${done ? "Investigation complete" : open ? "Evidence packet available" : "Complete the previous mission to unlock"}</p></div>
      <div class="mission-state">${done ? "✓ COMPLETE" : open ? "● OPEN" : "▣ LOCKED"}</div>
    </article>`;
  }).join("");
}
function renderActive() {
  const m = missions[activeIndex];
  $("active-title").innerHTML = `MISSION ${String(activeIndex + 1).padStart(2, "0")}<br><span class="green">${m.title}</span>`;
  $("active-description").textContent = m.description;
  $("evidence-name").textContent = m.file;
  $("evidence-download").href = `assets/evidence/${m.file}`;
  $("evidence-download").setAttribute("download", m.file);
  $("active-hint").textContent = m.hint;
  $("flag-input").value = "";
  $("feedback").textContent = completed.has(activeIndex) ? "This mission has already been completed." : "Awaiting investigator input.";
  $("feedback").className = "feedback";
  $("next-note").textContent = completed.has(activeIndex) ? "Mission completed. Select the next available evidence packet." : `Complete Mission ${String(activeIndex + 1).padStart(2, "0")} to progress.`;
}
function updateProgress() {
  const count = completed.size;
  $("progress-count").textContent = `${count} / 6 COMPLETE`;
  $("progress-bar").style.width = `${count / 6 * 100}%`;
  if (count === 6) {
    $("finish").hidden = false;
    $("next-note").textContent = "All investigations complete. Case closed.";
  }
  renderMissions();
}
function submitFlag() {
  const entered = $("flag-input").value.trim();
  const expected = missions[activeIndex].flag;
  if (completed.has(activeIndex)) {
    $("feedback").textContent = "This mission is already complete.";
    $("feedback").className = "feedback good";
    return;
  }
  if (entered.toUpperCase() === expected.toUpperCase()) {
    completed.add(activeIndex);
    $("feedback").textContent = "FLAG ACCEPTED — evidence verified. Next mission unlocked.";
    $("feedback").className = "feedback good";
    updateProgress();
    if (activeIndex < missions.length - 1) {
      activeIndex += 1;
      $("next-note").textContent = `Mission ${String(activeIndex + 1).padStart(2, "0")} is now available.`;
      setTimeout(() => {
        renderActive();
        document.querySelector("#workbench").scrollIntoView({behavior:"smooth", block:"start"});
      }, 850);
    } else {
      $("next-note").textContent = "All investigations complete. Case closed.";
    }
  } else {
    $("feedback").textContent = "FLAG NOT RECOGNIZED — review the evidence and try again.";
    $("feedback").className = "feedback bad";
  }
}
$("submit-flag").addEventListener("click", submitFlag);
$("flag-input").addEventListener("keydown", e => { if (e.key === "Enter") submitFlag(); });
renderMissions();
renderActive();
updateProgress();
