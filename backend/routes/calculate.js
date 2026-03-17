const BASE = 50_000; // Minimum Haq Meher (Islamic Dower)

export function calculateMeher(inputs) {
  const {
    age,
    education = "bachelors",
    income = "middle",
    employed = "yes",
    profession = "private",
    familyWealth = "middle",
    character = "trustworthy",
    religion = "yes",
    stability = "yes",
    responsibility = "yes",
    previousMarriage = "no",
    // Bride factors
    looks = "5",
    nature = "balanced",
    isTen = "no",
    knownDuration = "1to3",
    bestfriend = "no",
    maleFriends = "none",
  } = inputs;


  // --- Validation ---
  const ageVal = parseInt(age);
  
  if (ageVal < 18 || ageVal > 75) {
    throw new Error("Age must be between 18 and 75");
  }

  let total = BASE;
  const breakdown = [];

  const add = (category, label, value) => {
    total += value;
    breakdown.push({ category, label, value });
  };

  // ── AGE ──────────────────────────────────────────────────────────────────
  // Groom's age affects meher amount
  if (ageVal >= 25 && ageVal <= 35) {
    add("Financial", "Ideal working age (25–35)", 100_000);
  } else if (ageVal >= 35 && ageVal <= 45) {
    add("Financial", "Established age (35–45)", 80_000);
  } else if (ageVal < 25) {
    add("Financial", "Younger (under 25)", 0);
  } else {
    add("Financial", "Mature (over 45)", -20_000);
  }

  // ── EDUCATION ────────────────────────────────────────────────────────────
  // Groom's education level indicates earning potential
  const eduMap = {
    none: { v: -50_000, label: "No formal education" },
    matric: { v: 0, label: "Matric (Grade 10)" },
    inter: { v: 50_000, label: "Intermediate (Grade 12)" },
    bachelors: { v: 150_000, label: "Bachelor's Degree" },
    masters: { v: 250_000, label: "Master's Degree" },
    phd: { v: 350_000, label: "PhD / Doctorate" },
  };
  const edu = eduMap[education];
  if (edu) add("Financial", edu.label, edu.v);

  // ── INCOME LEVEL ─────────────────────────────────────────────────────────
  // Most important factor in meher determination
  const incomeMap = {
    lower: { v: 50_000, label: "Lower income bracket" },
    middle: { v: 200_000, label: "Middle income bracket" },
    upper: { v: 400_000, label: "Upper income bracket" },
    wealthy: { v: 700_000, label: "Wealthy / High earner" },
  };
  const inc = incomeMap[income];
  if (inc) add("Financial", inc.label, inc.v);

  // ── EMPLOYMENT STATUS ────────────────────────────────────────────────────
  // Whether groom is employed or has stable income
  if (employed === "yes") {
    add("Career", "Currently employed/self-employed", 100_000);
  } else {
    add("Career", "Unemployed / seeking work", -100_000);
  }

  // ── PROFESSION TYPE ──────────────────────────────────────────────────────
  // Type of work indicates stability and prestige
  const profMap = {
    private: { v: 50_000, label: "Private sector employment" },
    govt: { v: 150_000, label: "Government/Public sector" },
    business: { v: 200_000, label: "Business / Entrepreneurship" },
    medical: { v: 250_000, label: "Medical / Healthcare" },
    tech: { v: 200_000, label: "Technology / IT" },
    military: { v: 180_000, label: "Military / Defense" },
  };
  const prof = profMap[profession];
  if (prof) add("Career", prof.label, prof.v);

  // ── STABILITY ────────────────────────────────────────────────────────────
  // Job security and future prospects
  const stabMap = {
    unstable: { v: -100_000, label: "Unstable / Uncertain future" },
    moderate: { v: 50_000, label: "Moderate job security" },
    yes: { v: 150_000, label: "Highly stable & secure" },
  };
  const stab = stabMap[stability];
  if (stab) add("Career", stab.label, stab.v);

  // ── FAMILY WEALTH ────────────────────────────────────────────────────────
  // Family background and wealth support system
  const famMap = {
    lower: { v: 0, label: "Lower-income family background" },
    middle: { v: 100_000, label: "Middle-class family background" },
    upper: { v: 200_000, label: "Upper-middle-class background" },
    wealthy: { v: 350_000, label: "Wealthy family background" },
  };
  const fam = famMap[familyWealth];
  if (fam) add("Financial", fam.label, fam.v);

  // ── CHARACTER & TRUSTWORTHINESS ──────────────────────────────────────────
  // Personal integrity affects bride's security and respect
  const charMap = {
    questionable: { v: -200_000, label: "Questionable character" },
    average: { v: 0, label: "Average reputation" },
    trustworthy: { v: 150_000, label: "Trustworthy & reliable" },
    exemplary: { v: 300_000, label: "Exemplary / Highly respected" },
  };
  const char = charMap[character];
  if (char) add("Character", char.label, char.v);

  // ── RELIGION ─────────────────────────────────────────────────────────────
  // Religious commitment and shared values
  if (religion === "yes") {
    add("Character", "Practicing Muslim / religious commitment", 100_000);
  } else {
    add("Character", "Minimal or no religious practice", -50_000);
  }

  // ── RESPONSIBILITY ──────────────────────────────────────────────────────
  // Financial responsibility and maturity
  if (responsibility === "yes") {
    add("Character", "Financially responsible & organized", 150_000);
  } else {
    add("Character", "Dependent or financially irresponsible", -100_000);
  }

  // ── PREVIOUS MARRIAGE ────────────────────────────────────────────────────
  // First marriage usually expectation
  const marMap = {
    no: { v: 150_000, label: "First marriage" },
    widowed: { v: 100_000, label: "Widowed (honorable)" },
    divorced: { v: 0, label: "Divorced" },
  };
  const mar = marMap[previousMarriage];
  if (mar) add("Character", mar.label, mar.v);

  // ── BRIDE FACTORS (FROM FORM) ────────────────────────────────────────────
  // Bride's physical and personality attributes
  const looksVal = parseInt(looks);
  const looksBonus = (looksVal - 5) * 80_000;
  add("Bride", `Bride looks rating (${looksVal}/10)`, looksBonus);

  // Extra bonus for exceptional looks
  if (looksVal >= 9) add("Bride", "Exceptional looks bonus", 150_000);
  else if (looksVal <= 2) add("Bride", "Below average appearance penalty", -50_000);

  // 10/10 OVERRIDE
  if (isTen === "yes") {
    add("Bride", "She's a 10/10 👑 (ultimate override)", 500_000);
  }

  // Bride personality / nature
  const natureMap = {
    loving: { v: 300_000, label: "Loving & caring nature" },
    balanced: { v: 100_000, label: "Balanced personality" },
    nonchalant: { v: -150_000, label: "Nonchalant / indifferent" },
    complicated: { v: -250_000, label: "Complicated personality" },
  };
  const nat = natureMap[nature];
  if (nat) add("Bride", nat.label, nat.v);

  // ── HOW LONG KNOWN ──────────────────────────────────────────────────────
  if (knownDuration === "less1") add("Bride", "Known less than 1 year (risky)", -100_000);
  else if (knownDuration === "1to3") add("Bride", "Known 1–3 years (established)", 100_000);
  else if (knownDuration === "3plus") add("Bride", "Known 3+ years (trusted bond)", 250_000);

  // ── BEST FRIEND ─────────────────────────────────────────────────────────
  if (bestfriend === "yes") add("Bride", "Has a best friend (drama risk)", -100_000);
  else add("Bride", "No best friend (low drama)", 50_000);

  // ── MALE FRIENDS ────────────────────────────────────────────────────────
  const mfMap = {
    none: { v: 150_000, label: "No male friends" },
    few: { v: -100_000, label: "A few male friends" },
    many: { v: -300_000, label: "Many male friends" },
  };
  const mf = mfMap[maleFriends];
  if (mf) add("Bride", mf.label, mf.v);

  // ── FINAL TOTAL ──────────────────────────────────────────────────────────
  const finalTotal = Math.max(total, BASE);

  // ── SCORE (0–100) ────────────────────────────────────────────────────────
  // Maximum possible score calculation
  const maxPossible = BASE
    + 100_000  // age ideal
    + 350_000  // PhD
    + 700_000  // wealthy income
    + 100_000  // employed
    + 250_000  // medical profession
    + 150_000  // highly stable
    + 350_000  // wealthy family
    + 300_000  // exemplary character
    + 100_000  // religious
    + 150_000  // responsible
    + 150_000  // first marriage
    // Bride factors
    + 400_000  // looks 10/10 + bonus
    + 150_000  // exceptional looks bonus
    + 500_000  // 10/10 override
    + 300_000  // loving nature
    + 250_000  // known 3+ years
    + 50_000   // no best friend
    + 150_000; // no male friends

  const score = Math.round(
    Math.min(100, Math.max(0, (finalTotal / maxPossible) * 100))
  );

  // ── VERDICT ──────────────────────────────────────────────────────────────
  // Categorize the meher amount with Islamic context
  let verdict, verdictEmoji, tag;
  if (finalTotal > 2_000_000) {
    verdict =
      "SubhanAllah! A most generous groom. The bride is extremely fortunate. May Allah bless this union with prosperity and happiness.";
    verdictEmoji = "💎";
    tag = "Exceptional";
  } else if (finalTotal > 1_200_000) {
    verdict =
      "Alhamdulillah! A most gracious meher. An excellent reflection of the groom's character and financial capacity.";
    verdictEmoji = "🏆";
    tag = "Generous";
  } else if (finalTotal > 800_000) {
    verdict =
      "A reasonable meher that reflects fair financial capacity and respect for the bride's rights.";
    verdictEmoji = "💍";
    tag = "Fair";
  } else if (finalTotal > 400_000) {
    verdict =
      "An acceptable meher. The groom should ensure this is genuinely affordable and sustainable.";
    verdictEmoji = "👍";
    tag = "Acceptable";
  } else {
    verdict =
      "The minimum meher (Haq Mahr Misal). Ensure this reflects true circumstances and the bride's dignity.";
    verdictEmoji = "⚖️";
    tag = "Minimum";
  }

  // Group breakdown by category for frontend
  const grouped = {};
  for (const item of breakdown) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  return {
    total: finalTotal,
    base: BASE,
    score,
    breakdown,
    grouped,
    verdict,
    verdictEmoji,
    tag,
    computedAt: new Date().toISOString(),
  };
}
