// ============================================================
// بنك السلام كابيتال | نظام التوقعات - التطبيق الكامل 🇾🇪
// ============================================================

// ---------- إدارة البيانات ----------
class PredictionSystem {
  constructor() {
    this.PARTICIPANTS_KEY = 'alsalam_participants';
    this.RESULTS_KEY = 'alsalam_results';
    this.SETTINGS_KEY = 'alsalam_settings';
    this.MATCH_RESULTS_KEY = 'alsalam_match_results';
    this.MATCH_PREDICTIONS_KEY = 'alsalam_match_predictions';

    this.participants = this.loadData(this.PARTICIPANTS_KEY, []);
    this.officialResults = this.loadData(this.RESULTS_KEY, {});
    this.matchResults = this.loadData(this.MATCH_RESULTS_KEY, {});
    this.matchPredictions = this.loadData(this.MATCH_PREDICTIONS_KEY, {});
    this.settings = this.loadData(this.SETTINGS_KEY, { predictionsOpen: true, announcementMode: false });
  }

  loadData(key, def) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch(e) { return def; }
  }
  saveData(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error('Save error:', e); }
  }

  registerParticipant(data) {
    const exists = this.participants.find(p => p.phone === data.phone);
    if (exists) return { success: false, message: 'رقم الجوال مسجل مسبقاً!' };

    const p = {
      id: 'P' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
      ...data,
      predictions: {}, matchPredictions: {}, points: 0, rank: 0,
      registrationDate: new Date().toISOString(),
      shareCode: this.generateShareCode(), referrals: [],
      pointsBreakdown: { groupWinners: 0, groupRunnersUp: 0, bestThird: 0, perfectGroups: 0, matchResults: 0, matchScores: 0, socialBonus: 0, referralBonus: 0 }
    };
    this.participants.push(p);
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    return { success: true, participant: p };
  }

  savePredictions(participantId, predictions) {
    const idx = this.participants.findIndex(p => p.id === participantId);
    if (idx === -1) return { success: false };
    this.participants[idx].predictions = predictions;
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    return { success: true };
  }

  saveMatchPredictions(participantId, matchPreds) {
    const idx = this.participants.findIndex(p => p.id === participantId);
    if (idx === -1) return { success: false };
    this.participants[idx].matchPredictions = matchPreds;
    this.matchPredictions[participantId] = matchPreds;
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    this.saveData(this.MATCH_PREDICTIONS_KEY, this.matchPredictions);
    return { success: true };
  }

  calculatePoints(participantId) {
    const p = this.participants.find(pp => pp.id === participantId);
    if (!p) return { success: false };
    if (!this.officialResults || Object.keys(this.officialResults).length === 0) return { success: false, message: 'لم تدخل النتائج الرسمية بعد' };

    const b = { groupWinners: 0, groupRunnersUp: 0, bestThird: 0, perfectGroups: 0, matchResults: 0, matchScores: 0, socialBonus: p.predictions.socialShare ? 5 : 0, referralBonus: (p.referrals?.length || 0) * 3 };

    WORLD_CUP_DATA.groups.forEach(g => {
      const res = this.officialResults[g.id];
      const pred = p.predictions.groups?.[g.id];
      if (!res || !pred) return;
      if (pred.winner === res.winner) b.groupWinners += WORLD_CUP_DATA.scoring.correctGroupWinner;
      if (pred.runnerUp === res.runnerUp) b.groupRunnersUp += WORLD_CUP_DATA.scoring.correctGroupRunnerUp;
      if (pred.winner === res.winner && pred.runnerUp === res.runnerUp && pred.third === res.third && pred.fourth === res.fourth) b.perfectGroups += WORLD_CUP_DATA.scoring.perfectGroupOrder;
    });

    if (p.predictions.bestThird && this.officialResults.bestThird) {
      p.predictions.bestThird.forEach(c => { if (this.officialResults.bestThird.includes(c)) b.bestThird += WORLD_CUP_DATA.scoring.correctBestThird; });
    }

    // نقاط المباريات
    if (this.matchResults && Object.keys(this.matchResults).length > 0) {
      const mp = p.matchPredictions || {};
      Object.entries(this.matchResults).forEach(([matchId, res]) => {
        const pred = mp[matchId];
        if (!pred) return;
        if (pred.homeGoals !== undefined && pred.awayGoals !== undefined) {
          if (pred.homeGoals === res.homeGoals && pred.awayGoals === res.awayGoals) {
            b.matchScores += WORLD_CUP_DATA.scoring.correctMatchScore;
          } else {
            const predOutcome = pred.homeGoals > pred.awayGoals ? 'H' : pred.homeGoals < pred.awayGoals ? 'A' : 'D';
            const resOutcome = res.homeGoals > res.awayGoals ? 'H' : res.homeGoals < res.awayGoals ? 'A' : 'D';
            if (predOutcome === resOutcome) b.matchResults += WORLD_CUP_DATA.scoring.correctMatchResult;
          }
        }
      });
    }

    const total = Object.values(b).reduce((a, v) => a + v, 0);
    const idx = this.participants.findIndex(pp => pp.id === participantId);
    this.participants[idx].points = total;
    this.participants[idx].pointsBreakdown = b;
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    return { success: true, totalPoints: total, breakdown: b };
  }

  calculateAllRanks() {
    this.participants.forEach(p => this.calculatePoints(p.id));
    const sorted = [...this.participants].sort((a, b) => b.points - a.points);
    sorted.forEach((p, i) => { const idx = this.participants.findIndex(pp => pp.id === p.id); this.participants[idx].rank = i + 1; });
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    return sorted;
  }

  getLeaderboard(limit = 100) { return this.calculateAllRanks().slice(0, limit); }

  addSocialShareBonus(participantId) {
    const idx = this.participants.findIndex(p => p.id === participantId);
    if (idx === -1) return false;
    this.participants[idx].predictions.socialShare = true;
    this.saveData(this.PARTICIPANTS_KEY, this.participants);
    return true;
  }

  generateShareCode() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += c.charAt(Math.floor(Math.random() * c.length));
    return code;
  }

  saveOfficialResults(results) { this.officialResults = results; this.saveData(this.RESULTS_KEY, results); return { success: true }; }
  saveMatchResults(results) { this.matchResults = results; this.saveData(this.MATCH_RESULTS_KEY, results); return { success: true }; }
  updateSettings(s) { this.settings = { ...this.settings, ...s }; this.saveData(this.SETTINGS_KEY, this.settings); return { success: true }; }

  getStats() {
    const tp = this.participants.length;
    const hb = this.participants.filter(p => p.hasBankAccount === 'yes').length;
    const wp = this.participants.filter(p => p.predictions && Object.keys(p.predictions).length > 0).length;
    const wmp = this.participants.filter(p => p.matchPredictions && Object.keys(p.matchPredictions).length > 0).length;
    return { totalParticipants: tp, hasBankAccount: hb, withPredictions: wp, withMatchPredictions: wmp };
  }
}

// ---------- واجهة المستخدم ----------
class UIManager {
  constructor(sys) {
    this.sys = sys;
    this.current = null;
    this.tab = 'predict';
    this.matchFilter = 1;
    this.init();
  }

  init() {
    const saved = localStorage.getItem('alsalam_current_user');
    if (saved) { try { const u = JSON.parse(saved); this.current = this.sys.participants.find(p => p.id === u.id); } catch(e){} }
    this.render();
    this.attachEvents();
    this.startCountdown();
  }

  render() {
    const main = document.getElementById('mainContent');
    if (!main) return;

    if (this.current) this.renderLoggedIn(main);
    else this.renderLoggedOut(main);
  }

  renderLoggedIn(main) {
    const sc = this.sys;
    main.innerHTML = `
      <div class="container">
        <div class="card mb-20">
          <div class="card-body" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:15px;">
            <div>
              <h3 style="font-size:18px;">👋 مرحباً ${this.current.name}</h3>
              <p style="color:var(--text-light);font-size:14px;">رمزك: <strong style="color:var(--primary);font-family:monospace;font-size:18px;letter-spacing:2px;">${this.current.shareCode}</strong></p>
            </div>
            <button class="btn btn-secondary" style="background:var(--accent);color:white;border:none;" onclick="ui.logout()">🚪 خروج</button>
          </div>
        </div>
        <div class="card">
          <div class="tabs">
            <button class="tab ${this.tab==='predict'?'active':''}" onclick="ui.switchTab('predict')">📝 توقعاتي</button>
            <button class="tab ${this.tab==='matches'?'active':''}" onclick="ui.switchTab('matches')">⚽ المباريات</button>
            <button class="tab ${this.tab==='leaderboard'?'active':''}" onclick="ui.switchTab('leaderboard')">🏆 المتصدرون</button>
            <button class="tab ${this.tab==='prizes'?'active':''}" onclick="ui.switchTab('prizes')">🎁 الجوائز</button>
            <button class="tab ${this.tab==='share'?'active':''}" onclick="ui.switchTab('share')">📢 شارك</button>
          </div>
          <div id="tabPredict" class="tab-content ${this.tab==='predict'?'active':''}">${this.renderPredictionsTab()}</div>
          <div id="tabMatches" class="tab-content ${this.tab==='matches'?'active':''}">${this.renderMatchesTab()}</div>
          <div id="tabLeaderboard" class="tab-content ${this.tab==='leaderboard'?'active':''}">${this.renderLeaderboardTab()}</div>
          <div id="tabPrizes" class="tab-content ${this.tab==='prizes'?'active':''}">${this.renderPrizesTab()}</div>
          <div id="tabShare" class="tab-content ${this.tab==='share'?'active':''}">${this.renderShareTab()}</div>
        </div>
      </div>`;

    if (this.tab === 'predict') this.populateUserPredictions();
    if (this.tab === 'matches') this.populateMatchPredictions();
    if (this.tab === 'leaderboard') this.renderLeaderboard();
  }

  renderLoggedOut(main) {
    const stats = this.sys.getStats();
    main.innerHTML = `
      <div class="container">
        <div class="stats-banner">
          <div class="stat-card"><div class="stat-number">${stats.totalParticipants}</div><div class="stat-label">👥 المشاركون</div></div>
          <div class="stat-card"><div class="stat-number">${stats.withPredictions}</div><div class="stat-label">📝 توقعوا المجموعات</div></div>
          <div class="stat-card"><div class="stat-number">${stats.withMatchPredictions}</div><div class="stat-label">⚽ توقعوا المباريات</div></div>
          <div class="stat-card"><div class="stat-number">${stats.hasBankAccount}</div><div class="stat-label">🏦 عملاء البنك</div></div>
        </div>
        <div class="registration-section">
          <div class="card" style="border-top:5px solid var(--secondary);">
            <div class="card-header"><h2>📝 سجل الآن وتوقع!</h2><span class="team-badge">🏆 كأس العالم 2026</span></div>
            <div class="card-body">
              <form id="registrationForm" onsubmit="ui.handleRegistration(event)">
                <div class="form-group"><label>الاسم الكامل <span class="required">*</span></label><input type="text" class="form-control" id="fullName" required placeholder="اسمك الكامل" maxlength="100"></div>
                <div class="form-group"><label>رقم الجوال <span class="required">*</span></label><input type="tel" class="form-control" id="phone" required placeholder="7xxxxxxxx" pattern="7[0-9]{8}" maxlength="9" dir="ltr" style="text-align:left;"><div class="form-error" id="phoneError">أدخل رقم جوال يمني صحيح (7xxxxxxxx)</div></div>
                <div class="form-group"><label>المدينة <span class="required">*</span></label><select class="form-control" id="city" required><option value="">-- اختر المدينة --</option><option value="مأرب">مأرب</option><option value="صنعاء">صنعاء</option><option value="عدن">عدن</option><option value="تعز">تعز</option><option value="الحديدة">الحديدة</option><option value="حضرموت">حضرموت</option><option value="إب">إب</option><option value="ذمار">ذمار</option><option value="أخرى">أخرى</option></select></div>
                <div class="form-group"><label>البريد (اختياري)</label><input type="email" class="form-control" id="email" placeholder="example@email.com"></div>
                <div class="form-group"><label>هل لديك حساب في بنك السلام كابيتال؟ <span class="required">*</span></label><select class="form-control" id="hasBankAccount" required><option value="">-- اختر --</option><option value="yes">نعم</option><option value="no">لا</option></select></div>
                <div class="form-check"><input type="checkbox" id="agreeTerms" required><label for="agreeTerms">أوافق على <a href="#" onclick="ui.showTerms()" style="color:var(--primary);">الشروط والأحكام</a> <span class="required">*</span></label></div>
                <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:15px;">🚀 سجل وابدأ</button>
                <p style="text-align:center;margin-top:15px;font-size:13px;color:var(--text-light);">🏆 جوائز تصل إلى 20,000 ريال يمني</p>
              </form>
            </div>
          </div>
        </div>
        <div class="card mb-20">
          <div class="card-header"><h2>🌍 المجموعات الـ12</h2></div>
          <div class="card-body"><div class="groups-grid" id="groupsPreview">${this.renderAllGroupsPreview()}</div></div>
        </div>
        <div class="prizes-section">
          <h2 style="text-align:center;margin-bottom:25px;font-size:28px;">🎁 الجوائز</h2>
          <div class="prizes-grid">
            <div class="prize-card gold"><div class="prize-icon">🥇</div><div class="prize-amount">20,000 ر.ي</div><div class="prize-label">المركز الأول</div></div>
            <div class="prize-card silver"><div class="prize-icon">🥈</div><div class="prize-amount">10,000 ر.ي</div><div class="prize-label">المركز الثاني</div></div>
            <div class="prize-card bronze"><div class="prize-icon">🥉</div><div class="prize-amount">5,000 ر.ي</div><div class="prize-label">المركز الثالث</div></div>
            <div class="prize-card"><div class="prize-icon">🎁</div><div class="prize-amount">1,000 ر.ي</div><div class="prize-label">10 جوائز تشجيعية</div></div>
          </div>
        </div>
      </div>`;
  }

  renderAllGroupsPreview() {
    return WORLD_CUP_DATA.groups.map(g => `
      <div class="group-card">
        <div class="group-header"><h3>${g.name}</h3><span class="group-badge">${g.id}</span></div>
        <div class="group-body">${g.teams.map((t, i) => `<div class="team-select-row"><span class="position-label ${i<2?(i===0?'winner':'runner-up'):(i===2?'third':'fourth')}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':'⚪'}</span><span style="font-size:20px;">${t.flag}</span><span style="font-weight:${i<2?'700':'400'}">${t.name}</span></div>`).join('')}</div>
      </div>`).join('');
  }

  renderPredictionsTab() {
    if (!this.sys.settings.predictionsOpen && this.current?.predictions?.groups && Object.keys(this.current.predictions.groups).length > 0)
      return `<div class="card-body text-center"><div style="font-size:60px;margin-bottom:15px;">✅</div><h3>تم تسجيل توقعاتك!</h3><p style="color:var(--text-light);">تابع النتائج من لوحة المتصدرين.</p><button class="btn btn-primary mt-20" onclick="ui.switchTab('leaderboard')">🏆 المتصدرون</button></div>`;
    if (!this.sys.settings.predictionsOpen)
      return `<div class="card-body text-center"><div style="font-size:60px;margin-bottom:15px;">🔒</div><h3>باب التوقعات مغلق</h3><p style="color:var(--text-light);">ترقبوا الإعلان عن الفائزين!</p></div>`;

    return `
      <div class="card-body">
        <div class="progress-bar"><div class="progress-info"><span>📊 التقدم</span></div><div class="progress-track"><div class="progress-fill" id="predictionProgress" style="width:0%"></div></div><span class="progress-text" id="predictionProgressText">0/48</span></div>
        <form id="predictionsForm" onsubmit="ui.submitPredictions(event)">
          <div class="groups-grid" id="predictionsGroups"></div>
          <div class="best-third-section"><div class="card"><div class="card-header" style="background:#fefaf0;"><h2>⭐ أفضل 8 من المركز الثالث</h2><span class="team-badge">اختر 8</span></div><div class="card-body"><p style="margin-bottom:15px;color:var(--text-light);font-size:14px;">اختر 8 منتخبات من أصحاب المركز الثالث ستتأهل</p><div class="best-third-grid" id="bestThirdGrid"></div></div></div></div>
          <div class="card mb-20"><div class="card-body"><div class="form-check"><input type="checkbox" id="shareSocial" checked><label for="shareSocial">🔗 مشاركة توقعاتي (نقاط إضافية)</label></div></div></div>
          <div class="action-bar"><button type="submit" class="btn btn-primary btn-lg">✅ تأكيد التوقعات</button></div>
        </form>
      </div>`;
  }

  populateUserPredictions() {
    const container = document.getElementById('predictionsGroups');
    if (!container) return;
    const ex = this.current?.predictions?.groups || {};
    container.innerHTML = WORLD_CUP_DATA.groups.map(g => {
      const p = ex[g.id] || {};
      const opts = g.teams.map(t => `<option value="${t.code}">${t.flag} ${t.name}</option>`).join('');
      return `
        <div class="group-card">
          <div class="group-header"><h3>${g.name}</h3><span class="group-badge">${g.id}</span></div>
          <div class="group-body">
            <div class="team-select-row"><span class="position-label winner">🥇 المتصدر</span><select class="team-select" data-group="${g.id}" data-position="winner" onchange="ui.updateProgress()"><option value="">-- اختر --</option>${opts}</select></div>
            <div class="team-select-row"><span class="position-label runner-up">🥈 الوصيف</span><select class="team-select" data-group="${g.id}" data-position="runnerUp" onchange="ui.updateProgress()"><option value="">-- اختر --</option>${opts}</select></div>
            <div class="team-select-row"><span class="position-label third">🥉 الثالث</span><select class="team-select" data-group="${g.id}" data-position="third" onchange="ui.updateProgress()"><option value="">-- اختر --</option>${opts}</select></div>
            <div class="team-select-row"><span class="position-label fourth">⚪ الرابع</span><select class="team-select" data-group="${g.id}" data-position="fourth" onchange="ui.updateProgress()"><option value="">-- اختر --</option>${opts}</select></div>
          </div>
        </div>`;
    }).join('');

    setTimeout(() => {
      WORLD_CUP_DATA.groups.forEach(g => {
        const p = ex[g.id] || {};
        container.querySelectorAll(`[data-group="${g.id}"]`).forEach(s => { if (p[s.dataset.position]) s.value = p[s.dataset.position]; });
      });
      this.updateProgress();
    }, 100);
    this.populateBestThird();
  }

  populateBestThird() {
    const grid = document.getElementById('bestThirdGrid');
    if (!grid) return;
    const exThird = this.current?.predictions?.bestThird || [];
    const thirdTeams = WORLD_CUP_DATA.groups.map(g => ({ code: g.teams[2]?.code, name: g.teams[2]?.name, flag: g.teams[2]?.flag, groupId: g.id })).filter(t => t.code);
    grid.innerHTML = thirdTeams.map((t, i) => `<div class="best-third-item"><span class="rank">${i+1}</span><span style="font-size:22px;">${t.flag}</span><span>${t.name}</span><span style="font-size:12px;color:var(--text-light);">(مجموعة ${t.groupId})</span><input type="checkbox" data-third-code="${t.code}" ${exThird.includes(t.code)?'checked':''} style="margin-right:auto;width:20px;height:20px;" onchange="ui.updateProgress()"></div>`).join('');
  }

  updateProgress() {
    let filled = 0;
    document.querySelectorAll('.team-select').forEach(s => { if (s.value) filled++; });
    document.querySelectorAll('[data-third-code]').forEach(c => { if (c.checked) filled++; });
    const pct = Math.min(100, Math.round((filled / 48) * 100));
    const bar = document.getElementById('predictionProgress');
    const txt = document.getElementById('predictionProgressText');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `${filled}/48`;
  }

  async submitPredictions(e) {
    e.preventDefault();
    if (!this.current) return this.showNotification('خطأ', 'سجل أولاً', 'error');

    const preds = { groups: {}, bestThird: [] };
    const errors = [];

    WORLD_CUP_DATA.groups.forEach(g => {
      const w = document.querySelector(`[data-group="${g.id}"][data-position="winner"]`)?.value;
      const r = document.querySelector(`[data-group="${g.id}"][data-position="runnerUp"]`)?.value;
      const t = document.querySelector(`[data-group="${g.id}"][data-position="third"]`)?.value;
      const f = document.querySelector(`[data-group="${g.id}"][data-position="fourth"]`)?.value;
      const sel = [w, r, t, f].filter(v => v);
      if (new Set(sel).size !== sel.length) { errors.push(`المجموعة ${g.id}: لا تكرر المنتخب!`); return; }
      if (!w || !r) { errors.push(`المجموعة ${g.id}: اختر المتصدر والوصيف!`); return; }
      preds.groups[g.id] = { winner: w, runnerUp: r, third: t || '', fourth: f || '' };
    });

    document.querySelectorAll('[data-third-code]').forEach(c => { if (c.checked) preds.bestThird.push(c.dataset.thirdCode); });
    if (preds.bestThird.length !== 8) errors.push('اختر 8 منتخبات بالضبط من المركز الثالث');

    if (errors.length) return this.showNotification('أخطاء', errors.join('\n'), 'error');

    preds.socialShare = document.getElementById('shareSocial')?.checked || false;
    const res = this.sys.savePredictions(this.current.id, preds);
    if (!res.success) return this.showNotification('خطأ', res.message, 'error');

    if (preds.socialShare) this.sys.addSocialShareBonus(this.current.id);
    this.showNotification('✅ تم!', 'حُفظت توقعاتك بنجاح', 'success');
    setTimeout(() => this.render(), 1500);
  }

  renderMatchesTab() {
    const matchdayBtns = [1, 2, 3, 4].map(d => `<button class="filter-btn ${this.matchFilter===d?'active':''}" onclick="ui.setMatchFilter(${d})">${d===4?'🏆 خروج المغلوب':'الجولة '+d}</button>`).join('');
    return `
      <div class="card-body">
        <h3 style="margin-bottom:15px;">⚽ توقع نتائج المباريات</h3>
        <p style="color:var(--text-light);margin-bottom:15px;font-size:14px;">توقع نتيجة كل مباراة: <strong>2 نقطة</strong> للفائز/تعادل صحيح، <strong>5 نقاط</strong> للنتيجة الدقيقة</p>
        <div class="matches-filter">${matchdayBtns}</div>
        <div class="matches-grid" id="matchesGrid"></div>
        <div class="action-bar"><button type="button" class="btn btn-primary btn-lg" onclick="ui.submitMatchPredictions()">⚽ تأكيد توقعات المباريات</button></div>
      </div>`;
  }

  setMatchFilter(d) { this.matchFilter = d; this.render(); }

  populateMatchPredictions() {
    const grid = document.getElementById('matchesGrid');
    if (!grid) return;

    const filtered = this.matchFilter === 4 ? KNOCKOUT_MATCHES : GROUP_MATCHES.filter(m => m.matchday === this.matchFilter);
    const existing = this.current?.matchPredictions || {};

    grid.innerHTML = filtered.map(m => {
      const t1 = getTeamByCode(m.team1);
      const t2 = getTeamByCode(m.team2);
      const pred = existing[m.id] || {};

      if (this.matchFilter === 4) {
        // Knockout match - show stage label
        const team1Label = m.team1.startsWith('W') || m.team1.startsWith('QF') || m.team1.startsWith('SF') ? m.team1 : (getTeamByCode(m.team1)?.name || m.team1);
        const team2Label = m.team2.startsWith('W') || m.team2.startsWith('QF') || m.team2.startsWith('SF') ? m.team2 : (getTeamByCode(m.team2)?.name || m.team2);
        const flag1 = m.team1.length <= 3 ? getTeamFlagByCode('', m.team1) : '⚽';
        const flag2 = m.team2.length <= 3 ? getTeamFlagByCode('', m.team2) : '⚽';
        return this.renderMatchCard(m.id, team1Label, team2Label, flag1, flag2, m.date, pred);
      } else {
        return this.renderMatchCard(m.id, t1.name, t2.name, t1.flag, t2.flag, m.date, pred);
      }
    }).join('');
  }

  renderMatchCard(matchId, team1, team2, flag1, flag2, date, pred) {
    const hasPred = pred.homeGoals !== undefined;
    return `
      <div class="match-card ${hasPred ? 'match-predicted' : ''}">
        <div class="match-header">
          <span class="match-id">${matchId}</span>
          <span class="match-date">${date}</span>
        </div>
        <div class="match-teams">
          <div class="team"><span class="flag">${flag1}</span><span class="name">${team1}</span></div>
          <span class="vs">VS</span>
          <div class="team"><span class="flag">${flag2}</span><span class="name">${team2}</span></div>
        </div>
        <div class="score-inputs">
          <label>${team1.split(' ')[0]}</label>
          <input type="number" min="0" max="20" id="home_${matchId}" value="${pred.homeGoals !== undefined ? pred.homeGoals : ''}" placeholder="0">
          <span class="vs-text">-</span>
          <input type="number" min="0" max="20" id="away_${matchId}" value="${pred.awayGoals !== undefined ? pred.awayGoals : ''}" placeholder="0">
          <label>${team2.split(' ')[0]}</label>
        </div>
        ${hasPred ? '<p style="text-align:center;margin-top:8px;font-size:12px;color:var(--success);font-weight:700;">✅ تم التوقع</p>' : ''}
      </div>`;
  }

  submitMatchPredictions() {
    if (!this.current) return this.showNotification('خطأ', 'سجل أولاً', 'error');

    const matchPreds = {};
    let filled = 0;

    const allMatches = this.matchFilter === 4 ? KNOCKOUT_MATCHES : GROUP_MATCHES.filter(m => m.matchday === this.matchFilter);
    allMatches.forEach(m => {
      const home = document.getElementById(`home_${m.id}`)?.value;
      const away = document.getElementById(`away_${m.id}`)?.value;
      if (home !== '' && away !== '') {
        matchPreds[m.id] = { homeGoals: parseInt(home), awayGoals: parseInt(away) };
        filled++;
      }
    });

    if (filled === 0) return this.showNotification('تنبيه', 'أدخل نتيجة مباراة واحدة على الأقل', 'warning');

    this.sys.saveMatchPredictions(this.current.id, matchPreds);
    this.showNotification('✅ تم!', `حُفظت توقعات ${filled} مباراة`, 'success');
    setTimeout(() => this.render(), 1000);
  }

  renderLeaderboardTab() {
    return `
      <div class="card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
          <h3>🏆 ترتيب المشاركين</h3>
          <button class="btn btn-primary btn-sm" onclick="ui.refreshLeaderboard()">🔄 تحديث</button>
        </div>
        <div id="leaderboardContainer"><div style="text-align:center;padding:40px;"><div class="loading-spinner" style="border-color:rgba(0,0,0,0.1);border-top-color:var(--primary);"></div><p style="margin-top:15px;color:var(--text-light);">جاري التحميل...</p></div></div>
      </div>`;
  }

  renderLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;

    const lb = this.sys.getLeaderboard(100);
    if (lb.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px;"><div style="font-size:60px;margin-bottom:15px;">📊</div><h3>لا مشاركون بعد</h3></div>`;
      return;
    }

    const hasResults = this.sys.officialResults && Object.keys(this.sys.officialResults).length > 0;
    const hasMatchResults = this.sys.matchResults && Object.keys(this.sys.matchResults).length > 0;

    if (!hasResults && !hasMatchResults) {
      container.innerHTML = `<div style="text-align:center;padding:40px;"><div style="font-size:60px;margin-bottom:15px;">⏳</div><h3>بانتظار النتائج</h3><p style="color:var(--text-light);">المشاركون: ${lb.length}</p></div>`;
      return;
    }

    const userId = this.current?.id;
    let userRank = null;
    lb.forEach((p, i) => { if (p.id === userId) userRank = i + 1; });

    let html = `
      <div class="stats-banner" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px;">
        <div class="stat-card"><div class="stat-number">${lb.length}</div><div class="stat-label">👥 المشاركون</div></div>
        <div class="stat-card"><div class="stat-number">${lb[0]?.points || 0}</div><div class="stat-label">🏆 أعلى نقاط</div></div>
        ${userId ? `<div class="stat-card"><div class="stat-number" style="color:var(--primary);">#${userRank || '--'}</div><div class="stat-label">📊 ترتيبي</div></div>` : ''}
      </div>
      <div style="overflow-x:auto;">
        <table class="leaderboard-table">
          <thead><tr><th>#</th><th>المشارك</th><th>النقاط</th><th>المجموعات</th><th>المباريات</th><th>النتيجة الدقيقة</th><th>إضافي</th></tr></thead>
          <tbody>`;

    lb.forEach((p, i) => {
      const b = p.pointsBreakdown || {};
      const isMe = p.id === userId;
      html += `
        <tr style="${isMe ? 'background:#fefaf0;font-weight:700;' : ''}">
          <td><span class="rank-badge ${i < 3 ? `rank-${i+1}` : 'rank-other'}">${i < 3 ? ['🥇','🥈','🥉'][i] : '#'+(i+1)}</span></td>
          <td>${isMe ? '⭐ ' : ''}${p.name} ${isMe ? '(أنت)' : ''}</td>
          <td style="font-weight:900;font-size:18px;color:var(--primary);">${p.points}</td>
          <td style="font-size:13px;">${(b.groupWinners||0) + (b.groupRunnersUp||0) + (b.bestThird||0) + (b.perfectGroups||0)}</td>
          <td style="font-size:13px;">${b.matchResults || 0}</td>
          <td style="font-size:13px;">${b.matchScores || 0}</td>
          <td style="font-size:13px;">${(b.socialBonus||0) + (b.referralBonus||0)}</td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  refreshLeaderboard() {
    const c = document.getElementById('leaderboardContainer');
    if (c) { c.innerHTML = '<div style="text-align:center;padding:40px;"><div class="loading-spinner" style="border-color:rgba(0,0,0,0.1);border-top-color:var(--primary);"></div></div>'; }
    setTimeout(() => this.renderLeaderboard(), 500);
  }

  renderPrizesTab() {
    return `
      <div class="card-body">
        <div class="prizes-grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr));">
          <div class="prize-card gold"><div class="prize-icon">🥇</div><div class="prize-amount">20,000 ر.ي</div><div class="prize-label">المركز الأول</div></div>
          <div class="prize-card silver"><div class="prize-icon">🥈</div><div class="prize-amount">10,000 ر.ي</div><div class="prize-label">المركز الثاني</div></div>
          <div class="prize-card bronze"><div class="prize-icon">🥉</div><div class="prize-amount">5,000 ر.ي</div><div class="prize-label">المركز الثالث</div></div>
          <div class="prize-card"><div class="prize-icon">🎁</div><div class="prize-amount">1,000 ر.ي</div><div class="prize-label">10 جوائز تشجيعية</div></div>
          <div class="prize-card"><div class="prize-icon">📅</div><div class="prize-amount">500 ر.ي</div><div class="prize-label">جوائز يومية</div></div>
          <div class="prize-card"><div class="prize-icon">👕</div><div class="prize-amount">قميص منتخب</div><div class="prize-label">أفضل 5 مشاركات</div></div>
        </div>
        <div class="card mt-20" style="background:#f8f9fa;">
          <div class="card-body text-center">
            <h4>📋 شروط الجوائز</h4>
            <ul style="text-align:right;list-style:none;padding:0;margin-top:15px;line-height:2;">
              <li>✅ تُودع في حسابات الفائزين لدى بنك السلام كابيتال</li>
              <li>✅ غير العملاء: يُفتح حساب مجاني لإيداع الجائزة</li>
              <li>✅ الإعلان عبر حسابات البنك الرسمية</li>
              <li>✅ القرارات النهائية للبنك</li>
            </ul>
          </div>
        </div>
      </div>`;
  }

  renderShareTab() {
    const ref = this.current?.shareCode || '';
    const url = `https://alsalamcb.com/worldcup?ref=${ref}`;
    const text = `🏆 بنك السلام كابيتال | توقعات كأس العالم 2026\n💰 جوائز حتى 20,000 ريال يمني\n🇾🇪 مأرب - اليمن\n🔗 ${url}\n#بنك_السلام #كأس_العالم_2026`;
    return `
      <div class="card-body text-center">
        <div style="font-size:60px;margin-bottom:15px;">📢</div>
        <h3>ادعُ أصدقاءك واربح!</h3>
        <p style="color:var(--text-light);margin:10px 0 20px;">كل صديق يسجل عبر رابطك = 3 نقاط إضافية 🎉</p>
        <div class="share-code" style="background:#f0f4ff;border-color:var(--primary);">${ref}</div>
        <div class="share-buttons">
          <button class="share-btn twitter" onclick="ui.share('twitter')">🐦 X</button>
          <button class="share-btn facebook" onclick="ui.share('facebook')">📘 فيسبوك</button>
          <button class="share-btn whatsapp" onclick="ui.share('whatsapp')">💬 واتساب</button>
          <button class="share-btn copy" onclick="ui.copyLink()">📋 نسخ الرابط</button>
        </div>
      </div>`;
  }

  share(platform) {
    const ref = this.current?.shareCode || '';
    const url = `https://alsalamcb.com/worldcup?ref=${ref}`;
    const text = `🏆 بنك السلام كابيتال | توقعات كأس العالم 2026\n💰 جوائز حتى 20,000 ريال يمني\n🇾🇪 مأرب - اليمن\n🔗 ${url}\n#بنك_السلام #كأس_العالم_2026`;
    let shareUrl;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    else if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    if (this.current) this.sys.addSocialShareBonus(this.current.id);
  }

  copyLink() {
    const url = `https://alsalamcb.com/worldcup?ref=${this.current?.shareCode || ''}`;
    navigator.clipboard.writeText(url).then(() => this.showNotification('✅ تم!', 'نُسخ الرابط', 'success')).catch(() => this.showNotification('خطأ', 'انسخ يدوياً: ' + url, 'error'));
  }

  async handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value;
    const hasBankAccount = document.getElementById('hasBankAccount').value;

    if (!/^7[0-9]{8}$/.test(phone)) {
      document.getElementById('phone').classList.add('error');
      document.getElementById('phoneError').style.display = 'block';
      return;
    }
    document.getElementById('phone').classList.remove('error');
    document.getElementById('phoneError').style.display = 'none';

    const res = this.sys.registerParticipant({ name, phone, email, city, hasBankAccount, source: 'web' });
    if (!res.success) return this.showNotification('خطأ', res.message, 'error');

    this.current = res.participant;
    localStorage.setItem('alsalam_current_user', JSON.stringify({ id: res.participant.id }));
    this.showNotification('🎉 مرحباً!', `رمزك: ${res.participant.shareCode}`, 'success');
    setTimeout(() => this.render(), 1000);
  }

  logout() {
    this.current = null;
    localStorage.removeItem('alsalam_current_user');
    this.render();
    this.showNotification('🚪 خروج', 'نراكم قريباً!', 'warning');
  }

  switchTab(tab) { this.tab = tab; this.render(); }

  startCountdown() {
    const update = () => {
      const now = new Date();
      const target = new Date('2026-07-19T23:59:00');
      let diff = target - now;
      if (diff <= 0) {
        document.querySelectorAll('.countdown').forEach(el => { el.innerHTML = '<div style="font-size:18px;font-weight:700;">🏆 انتهت البطولة!</div>'; });
        return;
      }
      const d = Math.floor(diff / 86400000); diff %= 86400000;
      const h = Math.floor(diff / 3600000); diff %= 3600000;
      const m = Math.floor(diff / 60000); diff %= 60000;
      const s = Math.floor(diff / 1000);
      document.querySelectorAll('.countdown').forEach(el => {
        el.innerHTML = `
          <div class="time-box"><span class="number">${d}</span><span class="label">يوم</span></div>
          <div class="time-box"><span class="number">${h}</span><span class="label">ساعة</span></div>
          <div class="time-box"><span class="number">${m}</span><span class="label">دقيقة</span></div>
          <div class="time-box"><span class="number">${s}</span><span class="label">ثانية</span></div>`;
      });
    };
    update();
    setInterval(update, 1000);
  }

  showNotification(title, msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${msg}</div></div>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; t.style.transition = 'all 0.3s ease'; setTimeout(() => t.remove(), 300); }, 4000);
  }

  showTerms() { const m = document.getElementById('termsModal'); if (m) m.classList.add('show'); }
  hideTerms() { const m = document.getElementById('termsModal'); if (m) m.classList.remove('show'); }

  attachEvents() {
    document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('show'); });
  }
}

let ui = null, system = null;
document.addEventListener('DOMContentLoaded', () => {
  system = new PredictionSystem();
  ui = new UIManager(system);
  window.ui = ui;
  window.system = system;
});