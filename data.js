// ============================================================
// بنك السلام كابيتال | مسابقة توقعات كأس العالم 2026 🇾🇪
// البيانات: المجموعات، المباريات، النقاط، الجوائز، الروابط
// ============================================================

const WORLD_CUP_DATA = {
  tournamentName: "كأس العالم 2026",
  bankName: "بنك السلام كابيتال",
  bankLocation: "مأرب - اليمن",
  bankFullName: "بنك السلام كابيتال - مأرب",
  organizer: "بنك السلام كابيتال",
  country: "اليمن",
  currency: "ريال يمني",
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  groupsEndDate: "2026-06-27",

  social: {
    website: "https://www.alsalamcb.com/",
    facebook: "https://www.facebook.com/acbsalambank",
    twitter: "https://x.com/acbsalambank",
    instagram: "https://www.instagram.com/acbsalambank",
    youtube: "https://www.youtube.com/@acbsalambank",
    whatsapp: "https://wa.me/9678000086",
    phone: "8000086",
    googlePlay: "https://play.google.com/store/apps/details?id=com.acbsalambank",
    appStore: "https://apps.apple.com/app/alsalamcapital/id000000000"
  },

  groups: [
    { id: "A", name: "المجموعة A", teams: [
      { name: "المكسيك", flag: "🇲🇽", code: "MEX" },
      { name: "جنوب أفريقيا", flag: "🇿🇦", code: "RSA" },
      { name: "كوريا الجنوبية", flag: "🇰🇷", code: "KOR" },
      { name: "التشيك", flag: "🇨🇿", code: "CZE" }
    ]},
    { id: "B", name: "المجموعة B", teams: [
      { name: "كندا", flag: "🇨🇦", code: "CAN" },
      { name: "البوسنة والهرسك", flag: "🇧🇦", code: "BIH" },
      { name: "قطر", flag: "🇶🇦", code: "QAT" },
      { name: "سويسرا", flag: "🇨🇭", code: "SUI" }
    ]},
    { id: "C", name: "المجموعة C", teams: [
      { name: "البرازيل", flag: "🇧🇷", code: "BRA" },
      { name: "المغرب", flag: "🇲🇦", code: "MAR" },
      { name: "هايتي", flag: "🇭🇹", code: "HAI" },
      { name: "اسكتلندا", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO" }
    ]},
    { id: "D", name: "المجموعة D", teams: [
      { name: "الولايات المتحدة", flag: "🇺🇸", code: "USA" },
      { name: "باراغواي", flag: "🇵🇾", code: "PAR" },
      { name: "أستراليا", flag: "🇦🇺", code: "AUS" },
      { name: "تركيا", flag: "🇹🇷", code: "TUR" }
    ]},
    { id: "E", name: "المجموعة E", teams: [
      { name: "ألمانيا", flag: "🇩🇪", code: "GER" },
      { name: "كوراساو", flag: "🇨🇼", code: "CUW" },
      { name: "ساحل العاج", flag: "🇨🇮", code: "CIV" },
      { name: "الإكوادور", flag: "🇪🇨", code: "ECU" }
    ]},
    { id: "F", name: "المجموعة F", teams: [
      { name: "هولندا", flag: "🇳🇱", code: "NED" },
      { name: "اليابان", flag: "🇯🇵", code: "JPN" },
      { name: "تونس", flag: "🇹🇳", code: "TUN" },
      { name: "السويد", flag: "🇸🇪", code: "SWE" }
    ]},
    { id: "G", name: "المجموعة G", teams: [
      { name: "بلجيكا", flag: "🇧🇪", code: "BEL" },
      { name: "مصر", flag: "🇪🇬", code: "EGY" },
      { name: "إيران", flag: "🇮🇷", code: "IRN" },
      { name: "نيوزيلندا", flag: "🇳🇿", code: "NZL" }
    ]},
    { id: "H", name: "المجموعة H", teams: [
      { name: "إسبانيا", flag: "🇪🇸", code: "ESP" },
      { name: "الرأس الأخضر", flag: "🇨🇻", code: "CPV" },
      { name: "السعودية", flag: "🇸🇦", code: "KSA" },
      { name: "الأوروغواي", flag: "🇺🇾", code: "URU" }
    ]},
    { id: "I", name: "المجموعة I", teams: [
      { name: "فرنسا", flag: "🇫🇷", code: "FRA" },
      { name: "السنغال", flag: "🇸🇳", code: "SEN" },
      { name: "العراق", flag: "🇮🇶", code: "IRQ" },
      { name: "النرويج", flag: "🇳🇴", code: "NOR" }
    ]},
    { id: "J", name: "المجموعة J", teams: [
      { name: "الأرجنتين", flag: "🇦🇷", code: "ARG" },
      { name: "الجزائر", flag: "🇩🇿", code: "ALG" },
      { name: "النمسا", flag: "🇦🇹", code: "AUT" },
      { name: "الأردن", flag: "🇯🇴", code: "JOR" }
    ]},
    { id: "K", name: "المجموعة K", teams: [
      { name: "البرتغال", flag: "🇵🇹", code: "POR" },
      { name: "الكونغو الديمقراطية", flag: "🇨🇩", code: "COD" },
      { name: "أوزبكستان", flag: "🇺🇿", code: "UZB" },
      { name: "كولومبيا", flag: "🇨🇴", code: "COL" }
    ]},
    { id: "L", name: "المجموعة L", teams: [
      { name: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" },
      { name: "كرواتيا", flag: "🇭🇷", code: "CRO" },
      { name: "غانا", flag: "🇬🇭", code: "GHA" },
      { name: "بنما", flag: "🇵🇦", code: "PAN" }
    ]}
  ],

  // ========== جدول النقاط ==========
  scoring: {
    correctGroupWinner: 10,
    correctGroupRunnerUp: 10,
    correctBestThird: 15,
    perfectGroupOrder: 30,
    correctMatchResult: 2,
    correctMatchScore: 5,
    socialShareBonus: 5,
    referralBonus: 3
  },

  // ========== الجوائز ==========
  prizes: {
    first: { label: "المركز الأول", amount: "20,000 ريال يمني", count: 1 },
    second: { label: "المركز الثاني", amount: "10,000 ريال يمني", count: 1 },
    third: { label: "المركز الثالث", amount: "5,000 ريال يمني", count: 1 },
    encouragement: { label: "جوائز تشجيعية", amount: "1,000 ريال يمني", count: 10 },
    daily: { label: "جوائز يومية", amount: "500 ريال يمني", count: 30 }
  },

  predictionsOpen: true,
  officialResults: {}
};

// ========== دوال مساعدة ==========
function getAllTeams() {
  const allTeams = [];
  WORLD_CUP_DATA.groups.forEach(g => {
    g.teams.forEach(t => allTeams.push({ ...t, groupId: g.id }));
  });
  return allTeams;
}

function getGroupById(id) {
  return WORLD_CUP_DATA.groups.find(g => g.id === id);
}

function getTeamCodeByName(groupId, teamName) {
  const group = getGroupById(groupId);
  if (!group) return null;
  const team = group.teams.find(t => t.name === teamName);
  return team ? team.code : null;
}

function getTeamNameByCode(groupId, code) {
  const group = getGroupById(groupId);
  if (!group) return null;
  const team = group.teams.find(t => t.code === code);
  return team ? team.name : null;
}

function getTeamFlagByCode(groupId, code) {
  const group = getGroupById(groupId);
  if (!group) return '🏳️';
  const team = group.teams.find(t => t.code === code);
  return team ? team.flag : '🏳️';
}

function getTeamByCode(code) {
  for (const g of WORLD_CUP_DATA.groups) {
    const t = g.teams.find(t => t.code === code);
    if (t) return { ...t, groupId: g.id };
  }
  return null;
}

// ========== توليد جدول المباريات ==========
function generateMatchSchedule() {
  const matches = [];
  const groupDates = {
    1: ['2026-06-11','2026-06-12','2026-06-13','2026-06-14'],
    2: ['2026-06-18','2026-06-19','2026-06-20','2026-06-21'],
    3: ['2026-06-24','2026-06-25','2026-06-26','2026-06-27']
  };

  let matchNum = 1;

  WORLD_CUP_DATA.groups.forEach(group => {
    const teams = group.teams;
    // الجولة 1
    const d1 = groupDates[1][WORLD_CUP_DATA.groups.indexOf(group) % 4];
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[0].code, team2: teams[1].code, date: d1, matchday: 1 });
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[2].code, team2: teams[3].code, date: d1, matchday: 1 });
    // الجولة 2
    const d2 = groupDates[2][WORLD_CUP_DATA.groups.indexOf(group) % 4];
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[0].code, team2: teams[2].code, date: d2, matchday: 2 });
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[3].code, team2: teams[1].code, date: d2, matchday: 2 });
    // الجولة 3
    const d3 = groupDates[3][WORLD_CUP_DATA.groups.indexOf(group) % 4];
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[0].code, team2: teams[3].code, date: d3, matchday: 3 });
    matches.push({ id: `M${String(matchNum++).padStart(3,'0')}`, groupId: group.id, team1: teams[1].code, team2: teams[2].code, date: d3, matchday: 3 });
  });

  // مرحلة خروج المغلوب (32 مباراة)
  const knockoutMatches = [
    // دور الـ32 (16 مباراة)
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 1', team1: '1A', team2: '3C/D/E/F', date: '2026-06-28' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 2', team1: '1C', team2: '3A/B/F', date: '2026-06-28' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 3', team1: '2C', team2: '2F', date: '2026-06-29' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 4', team1: '1B', team2: '3A/B/F', date: '2026-06-29' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 5', team1: '1D', team2: '3E/F', date: '2026-06-30' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 6', team1: '2E', team2: '2H', date: '2026-06-30' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 7', team1: '1F', team2: '3A/B/C/D', date: '2026-07-01' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 8', team1: '1E', team2: '3C/D/F', date: '2026-07-01' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 9', team1: '1G', team2: '3E/F', date: '2026-07-02' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 10', team1: '2G', team2: '2L', date: '2026-07-02' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 11', team1: '1H', team2: '3C/D/E/F', date: '2026-07-03' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 12', team1: '2D', team2: '2A', date: '2026-07-03' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 13', team1: '1I', team2: '3A/B/C/D', date: '2026-07-04' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 14', team1: '2I', team2: '2K', date: '2026-07-04' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 15', team1: '1J', team2: '3C/D/E/F', date: '2026-07-05' },
    { stage: 'roundOf32', label: 'دور الـ32 - مباراة 16', team1: '2J', team2: '2I', date: '2026-07-05' },
    // دور الـ16 (8 مباريات)
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 1', team1: 'W32-1', team2: 'W32-2', date: '2026-07-07' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 2', team1: 'W32-3', team2: 'W32-4', date: '2026-07-07' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 3', team1: 'W32-5', team2: 'W32-6', date: '2026-07-08' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 4', team1: 'W32-7', team2: 'W32-8', date: '2026-07-08' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 5', team1: 'W32-9', team2: 'W32-10', date: '2026-07-09' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 6', team1: 'W32-11', team2: 'W32-12', date: '2026-07-09' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 7', team1: 'W32-13', team2: 'W32-14', date: '2026-07-10' },
    { stage: 'roundOf16', label: 'دور الـ16 - مباراة 8', team1: 'W32-15', team2: 'W32-16', date: '2026-07-10' },
    // ربع النهائي (4 مباريات)
    { stage: 'quarterfinals', label: 'ربع النهائي 1', team1: 'W16-1', team2: 'W16-2', date: '2026-07-12' },
    { stage: 'quarterfinals', label: 'ربع النهائي 2', team1: 'W16-3', team2: 'W16-4', date: '2026-07-12' },
    { stage: 'quarterfinals', label: 'ربع النهائي 3', team1: 'W16-5', team2: 'W16-6', date: '2026-07-13' },
    { stage: 'quarterfinals', label: 'ربع النهائي 4', team1: 'W16-7', team2: 'W16-8', date: '2026-07-13' },
    // نصف النهائي
    { stage: 'semifinals', label: 'نصف النهائي 1', team1: 'QF-1', team2: 'QF-2', date: '2026-07-15' },
    { stage: 'semifinals', label: 'نصف النهائي 2', team1: 'QF-3', team2: 'QF-4', date: '2026-07-16' },
    // المركز الثالث
    { stage: 'thirdPlace', label: 'المركز الثالث', team1: 'SF-L1', team2: 'SF-L2', date: '2026-07-18' },
    // النهائي
    { stage: 'final', label: '🏆 النهائي', team1: 'SF-W1', team2: 'SF-W2', date: '2026-07-19' }
  ];

  knockoutMatches.forEach(km => {
    matches.push({
      id: `M${String(matchNum++).padStart(3,'0')}`,
      groupId: '',
      stage: km.stage,
      stageLabel: km.label,
      team1: km.team1,
      team2: km.team2,
      date: km.date,
      matchday: 4
    });
  });

  return matches;
}

const ALL_MATCHES = generateMatchSchedule();
const GROUP_MATCHES = ALL_MATCHES.filter(m => m.matchday <= 3);
const KNOCKOUT_MATCHES = ALL_MATCHES.filter(m => m.matchday === 4);