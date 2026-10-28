/* Fungsi interaktif Sahabat MBPK */
document.addEventListener("DOMContentLoaded", () => {
  // Tahun footer dikemas kini secara automatik.
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  // Navigasi mudah alih yang boleh diakses.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
      toggle.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Buka menu navigasi");
      toggle.textContent = "☰";
    }));
  }

  // Peta kolaborasi: paparkan maklumat mengikut nod yang dipilih.
  const nodeData = {
    mbpk: {title:"MBPK dan keluarga", copy:"Individu dan keluarga perlu dilibatkan dalam menetapkan keutamaan, pilihan, matlamat dan persetujuan berkaitan sokongan.", question:"Apakah matlamat yang paling bermakna bagi individu, dan bagaimana pilihan mereka didengari?"},
    kpm: {title:"Kementerian Pendidikan Malaysia (KPM)", copy:"Fokus umum: pendidikan, sokongan pembelajaran dan perancangan transisi bersama sekolah serta keluarga. Tindakan sebenar perlu disahkan daripada kes dan sumber rasmi.", question:"Apakah kemahiran, penyesuaian pembelajaran dan persediaan transisi yang diperlukan?"},
    kkm: {title:"Kementerian Kesihatan Malaysia (KKM)", copy:"Fokus umum: penilaian atau sokongan kesihatan yang relevan apabila diperlukan. Penglibatan profesional bergantung pada keperluan dan laluan perkhidmatan.", question:"Adakah terdapat keperluan penilaian atau sokongan kesihatan yang dikenal pasti?"},
    kpwkm: {title:"KPWKM / Jabatan Kebajikan Masyarakat", copy:"Fokus umum: maklumat kebajikan, sokongan keluarga dan perkhidmatan berkaitan yang tertakluk pada kelayakan serta syarat semasa.", question:"Adakah keluarga mengetahui pilihan bantuan dan cara menyemak kelayakan?"},
    ksm: {title:"Kementerian Sumber Manusia (KSM)", copy:"Fokus umum: meneroka laluan latihan kemahiran, pembangunan kebolehpasaran dan pilihan pekerjaan yang bersesuaian.", question:"Apakah minat kerjaya dan pilihan latihan yang sesuai dengan kekuatan individu?"},
    ngo: {title:"NGO yang relevan", copy:"NGO mungkin melengkapi sokongan melalui program atau rangkaian komuniti. Sahkan program sebenar, ketersediaan dan kesesuaian dengan keperluan individu.", question:"Adakah NGO ini menawarkan program yang relevan dan telah disahkan melalui saluran rasmi?"}
  };
  document.querySelectorAll(".map-node").forEach(node => {
    node.addEventListener("click", () => {
      const data = nodeData[node.dataset.node];
      if (!data) return;
      document.querySelectorAll(".map-node").forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      const title = document.getElementById("node-title");
      const copy = document.getElementById("node-copy");
      const question = document.getElementById("node-question");
      if (title) title.textContent = data.title;
      if (copy) copy.textContent = data.copy;
      if (question) question.textContent = data.question;
    });
  });

  // Simulasi pilihan jawapan.
  const scenarioChoices = document.getElementById("scenario-choices");
  const scenarioFeedback = document.getElementById("scenario-feedback");
  const scenarioReset = document.getElementById("scenario-reset");
  if (scenarioChoices && scenarioFeedback) {
    scenarioChoices.querySelectorAll(".choice").forEach(choice => {
      choice.addEventListener("click", () => {
        scenarioChoices.querySelectorAll(".choice").forEach(c => {
          c.classList.remove("correct", "incorrect");
          c.disabled = true;
        });
        const correct = choice.dataset.correct === "true";
        choice.classList.add(correct ? "correct" : "incorrect");
        if (!correct) {
          const right = scenarioChoices.querySelector('[data-correct="true"]');
          if (right) right.classList.add("correct");
        }
        scenarioFeedback.textContent = correct
          ? "Tepat. Mulakan dengan mendengar individu dan keluarga, kemudian selaraskan pihak yang relevan berdasarkan keperluan, persetujuan dan perkhidmatan sebenar. Tetapkan matlamat serta tindakan susulan."
          : "Belum sesuai. Keputusan transisi tidak wajar dibuat oleh satu pihak sahaja atau ditangguhkan. Mulakan dengan perbincangan bersama individu dan keluarga, kemudian rancang sokongan kolaboratif.";
      });
    });
    if (scenarioReset) scenarioReset.addEventListener("click", () => {
      scenarioChoices.querySelectorAll(".choice").forEach(c => { c.classList.remove("correct", "incorrect"); c.disabled = false; });
      scenarioFeedback.textContent = "Pilih satu jawapan untuk melihat maklum balas.";
    });
  }

  // Kuiz 8 soalan dengan markah, maklum balas dan fungsi cuba semula.
  const quizForm = document.getElementById("quiz-form");
  const scoreDisplay = document.getElementById("quiz-score");
  const quizResult = document.getElementById("quiz-result");
  const quizReset = document.getElementById("quiz-reset");
  if (quizForm) {
    quizForm.addEventListener("submit", event => {
      event.preventDefault();
      const questions = [...quizForm.querySelectorAll(".quiz-question")];
      let score = 0;
      questions.forEach(question => {
        question.querySelectorAll("label").forEach(label => label.classList.remove("answer-correct"));
        const selected = question.querySelector('input[type="radio"]:checked');
        const correctInput = question.querySelector('input[data-correct="true"]');
        if (correctInput) correctInput.closest("label").classList.add("answer-correct");
        if (selected && selected.dataset.correct === "true") score++;
      });
      if (scoreDisplay) scoreDisplay.textContent = `${score}/${questions.length}`;
      if (quizResult) {
        const message = score === questions.length ? "Cemerlang! Anda memahami prinsip asas kolaborasi." :
          score >= 6 ? "Bagus! Semak jawapan yang betul berwarna hijau dan ulang kaji bahagian berkaitan." :
          "Teruskan belajar. Baca semula halaman kementerian, NGO dan peta kolaborasi, kemudian cuba lagi.";
        quizResult.textContent = `Keputusan anda: ${score} daripada ${questions.length}. ${message}`;
        quizResult.classList.add("visible");
      }
    });
    quizForm.addEventListener("reset", () => {
      window.setTimeout(() => {
        if (scoreDisplay) scoreDisplay.textContent = "0/8";
        if (quizResult) { quizResult.textContent = ""; quizResult.classList.remove("visible"); }
        quizForm.querySelectorAll("label").forEach(label => label.classList.remove("answer-correct"));
      }, 0);
    });
  }
});