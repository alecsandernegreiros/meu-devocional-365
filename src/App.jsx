import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Filter,
  Flame,
  Heart,
  Home,
  ListChecks,
  Music2,
  PauseCircle,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
} from 'lucide-react';
import {
  FAST_TYPES,
  MILESTONES,
  MOTIVATIONAL_PHRASES,
  PRAISE_BANK,
  PRAISE_OPTIONS,
  PURPOSE_TYPES,
  QUICK_DURATIONS,
  RESPONSE_TYPES,
  THEMES,
  VERSE_BANK,
  VERSE_OPTIONS,
  createInitialPurposes,
} from './data.js';

const STORAGE_KEY = 'meu-devocional-365:propositos:v1';

const STATUS_LABELS = {
  em_andamento: 'Em andamento',
  pausado: 'Pausado',
  concluido: 'Concluído',
};

function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function parseDate(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(iso, amount) {
  const date = parseDate(iso);
  if (!date) return todayIso();
  date.setDate(date.getDate() + amount);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function daysBetween(startIso, endIso = todayIso()) {
  const start = parseDate(startIso);
  const end = parseDate(endIso);
  if (!start || !end) return 0;
  return Math.floor((end - start) / 86400000);
}

function formatDate(iso) {
  if (!iso) return 'Sem data';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    parseDate(iso)
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizePurpose(purpose) {
  return {
    id: purpose.id || `purpose-${Date.now()}`,
    nome: purpose.nome || 'Novo propósito',
    tema: purpose.tema || 'Outro',
    tipo: purpose.tipo || 'Oração',
    duracao: Number(purpose.duracao) || 7,
    dataInicio: purpose.dataInicio || todayIso(),
    diaInicialRegistro: Number(purpose.diaInicialRegistro) || 1,
    status: purpose.status || 'em_andamento',
    configuracaoVersiculos: purpose.configuracaoVersiculos || 'auto',
    configuracaoLouvores: purpose.configuracaoLouvores || 'auto',
    versiculosPredefinidos: purpose.versiculosPredefinidos || {},
    louvoresPredefinidos: purpose.louvoresPredefinidos || {},
    observacoes: purpose.observacoes || '',
    jejum: {
      tipoJejum: purpose.jejum?.tipoJejum || '',
      horarioInicio: purpose.jejum?.horarioInicio || '',
      horarioTermino: purpose.jejum?.horarioTermino || '',
      evitando: purpose.jejum?.evitando || '',
    },
    registros: Array.isArray(purpose.registros) ? purpose.registros : [],
    criadoEm: purpose.criadoEm || new Date().toISOString(),
  };
}

function loadPurposes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialPurposes().map(normalizePurpose);
    const parsed = JSON.parse(stored);
    const purposes = Array.isArray(parsed) ? parsed : parsed.purposes;
    return Array.isArray(purposes) ? purposes.map(normalizePurpose) : createInitialPurposes().map(normalizePurpose);
  } catch {
    return createInitialPurposes().map(normalizePurpose);
  }
}

function getCurrentDay(purpose, dateIso = todayIso()) {
  const elapsed = daysBetween(purpose.dataInicio, dateIso) + 1;
  const baseline = Math.max(elapsed, Number(purpose.diaInicialRegistro) || 1);
  return clamp(baseline, 1, purpose.duracao);
}

function getProgress(purpose) {
  return Math.round((getCurrentDay(purpose) / purpose.duracao) * 100);
}

function getBankTheme(theme, bank) {
  return bank[theme] ? theme : 'Outro';
}

function getSuggestedVerse(purpose, day) {
  if (purpose.configuracaoVersiculos === 'nenhum') return '';
  if (purpose.configuracaoVersiculos === 'predefinido') {
    return purpose.versiculosPredefinidos?.[day] || '';
  }

  const verses = VERSE_BANK[getBankTheme(purpose.tema, VERSE_BANK)] || VERSE_BANK.Outro;
  const verse = verses[(day - 1) % verses.length];
  return `${verse.text}\n${verse.reference}`;
}

function getSuggestedPraise(purpose, day) {
  if (purpose.configuracaoLouvores === 'nenhum') return '';
  if (purpose.configuracaoLouvores === 'predefinido') {
    return purpose.louvoresPredefinidos?.[day] || '';
  }

  const praises = PRAISE_BANK[getBankTheme(purpose.tema, PRAISE_BANK)] || PRAISE_BANK.Outro;
  const praise = praises[(day - 1) % praises.length];
  return `${praise.title} - ${praise.artist}`;
}

function hasRecordContent(record) {
  if (!record) return false;
  return Boolean(
    record.concluido ||
      record.oracao ||
      record.versiculo ||
      record.louvor ||
      record.oQueDeusFalou ||
      record.respostaRecebida ||
      record.jejum?.observacaoEspiritual
  );
}

function makeEmptyRecord(purpose, day) {
  return {
    dia: day,
    data: addDays(purpose.dataInicio, day - 1),
    oracao: '',
    versiculo: getSuggestedVerse(purpose, day),
    louvor: getSuggestedPraise(purpose, day),
    oQueDeusFalou: '',
    concluido: false,
    respostaRecebida: false,
    resposta: {
      tipo: RESPONSE_TYPES[0],
      resumo: '',
      descricao: '',
      data: todayIso(),
      observacoes: '',
    },
    jejum: {
      tipoJejum: purpose.jejum?.tipoJejum || '',
      horarioInicio: purpose.jejum?.horarioInicio || '',
      horarioTermino: purpose.jejum?.horarioTermino || '',
      evitando: purpose.jejum?.evitando || '',
      observacaoEspiritual: '',
    },
  };
}

function hydrateRecord(purpose, day) {
  const existing = purpose.registros.find((record) => record.dia === day);
  const blank = makeEmptyRecord(purpose, day);
  if (!existing) return blank;

  return {
    ...blank,
    ...existing,
    resposta: { ...blank.resposta, ...(existing.resposta || {}) },
    jejum: { ...blank.jejum, ...(existing.jejum || {}) },
  };
}

function purposeStats(purpose) {
  const currentDay = getCurrentDay(purpose);
  const recordsWithContent = purpose.registros.filter(hasRecordContent);
  const responses = purpose.registros.filter((record) => record.respostaRecebida);
  const preAppDays = Math.max(0, purpose.diaInicialRegistro - 1);
  const unregisteredUntilToday = Math.max(0, currentDay - preAppDays - recordsWithContent.length);

  return {
    currentDay,
    registered: recordsWithContent.length,
    responses: responses.length,
    preAppDays,
    unregisteredUntilToday,
    progress: getProgress(purpose),
  };
}

function statusClass(status) {
  if (status === 'concluido') return 'success';
  if (status === 'pausado') return 'paused';
  return 'active';
}

function dayStatus(purpose, day) {
  const record = purpose.registros.find((item) => item.dia === day);
  if (day < purpose.diaInicialRegistro && !record) return { label: 'Iniciado antes do app', tone: 'muted' };
  if (record?.respostaRecebida) return { label: 'Com resposta recebida', tone: 'gold' };
  if (record?.concluido) return { label: 'Concluído', tone: 'success' };
  if (hasRecordContent(record)) return { label: 'Oração registrada', tone: 'active' };
  return { label: 'Ainda sem registro', tone: 'neutral' };
}

function nextMilestone(purpose) {
  const current = getCurrentDay(purpose);
  return MILESTONES.find((milestone) => milestone > current && milestone <= purpose.duracao) || purpose.duracao;
}

function parseLinesToMap(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line, index) => {
      acc[index + 1] = line;
      return acc;
    }, {});
}

function downloadText(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildPurposeSummaryText(purpose) {
  const stats = purposeStats(purpose);
  const responses = purpose.registros.filter((record) => record.respostaRecebida);

  return [
    `Meu Devocional 365 - Resumo do propósito`,
    ``,
    `Nome: ${purpose.nome}`,
    `Tema: ${purpose.tema}`,
    `Tipo: ${purpose.tipo}`,
    `Duração: ${purpose.duracao} dias`,
    `Data de início: ${formatDate(purpose.dataInicio)}`,
    `Dia atual: ${stats.currentDay} de ${purpose.duracao}`,
    `Dias registrados: ${stats.registered}`,
    `Dias não registrados: ${stats.unregisteredUntilToday}`,
    `Respostas recebidas: ${stats.responses}`,
    `Progresso: ${stats.progress}%`,
    `Próximo marco: dia ${nextMilestone(purpose)}`,
    ``,
    `Observações:`,
    purpose.observacoes || 'Sem observações gerais.',
    ``,
    `Respostas:`,
    responses.length
      ? responses
          .map((record) => {
            const title = record.resposta?.resumo || record.resposta?.descricao || 'Resposta registrada';
            return `- Dia ${record.dia} (${formatDate(record.resposta?.data || record.data)}): ${record.resposta?.tipo} - ${title}`;
          })
          .join('\n')
      : 'Nenhuma resposta registrada até aqui.',
  ].join('\n');
}

function IconButton({ icon: Icon, children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {Icon ? <Icon aria-hidden="true" size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function App() {
  const [purposes, setPurposes] = useState(loadPurposes);
  const [view, setView] = useState('dashboard');
  const [selectedPurposeId, setSelectedPurposeId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [purposeTab, setPurposeTab] = useState('resumo');
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purposes));
  }, [purposes]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedPurpose = purposes.find((purpose) => purpose.id === selectedPurposeId) || null;
  const phrase = useMemo(() => {
    const index = new Date().getDate() % MOTIVATIONAL_PHRASES.length;
    return MOTIVATIONAL_PHRASES[index];
  }, []);

  function showToast(message) {
    setToast(message);
  }

  function goDashboard() {
    setView('dashboard');
    setSelectedPurposeId(null);
    setSelectedDay(null);
  }

  function openPurpose(purposeId, tab = 'resumo') {
    setSelectedPurposeId(purposeId);
    setPurposeTab(tab);
    setView('purpose');
  }

  function openRecord(purposeId, day) {
    const purpose = purposes.find((item) => item.id === purposeId);
    setSelectedPurposeId(purposeId);
    setSelectedDay(day || (purpose ? getCurrentDay(purpose) : 1));
    setView('record');
  }

  function upsertRecord(purposeId, record, message = 'Registro salvo.') {
    setPurposes((current) =>
      current.map((purpose) => {
        if (purpose.id !== purposeId) return purpose;
        const registros = purpose.registros
          .filter((item) => item.dia !== record.dia)
          .concat(record)
          .sort((a, b) => a.dia - b.dia);
        return { ...purpose, registros };
      })
    );
    showToast(message);
  }

  function updatePurpose(purposeId, patch) {
    setPurposes((current) => current.map((purpose) => (purpose.id === purposeId ? { ...purpose, ...patch } : purpose)));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" type="button" onClick={goDashboard} aria-label="Ir para a tela inicial">
          <span className="brand-mark">
            <BookOpen aria-hidden="true" size={24} />
          </span>
          <span>
            <strong>Meu Devocional 365</strong>
            <small>Propósitos, Orações e Respostas</small>
          </span>
        </button>
        <p className="header-phrase">{phrase}</p>
      </header>

      <main className="main-shell">
        {view === 'dashboard' ? (
          <Dashboard
            purposes={purposes}
            onNew={() => setView('new')}
            onToday={() => setView('today')}
            onResponses={() => setView('responses')}
            onBackup={() => setView('backup')}
            onOpenPurpose={openPurpose}
            onOpenRecord={openRecord}
          />
        ) : null}

        {view === 'today' ? <TodayView purposes={purposes} onOpenRecord={openRecord} onBack={goDashboard} /> : null}

        {view === 'new' ? (
          <NewPurposeView
            onBack={goDashboard}
            onCreate={(purpose) => {
              setPurposes((current) => [purpose, ...current]);
              showToast('Propósito criado.');
              openPurpose(purpose.id, 'resumo');
            }}
          />
        ) : null}

        {view === 'purpose' && selectedPurpose ? (
          <PurposeView
            purpose={selectedPurpose}
            tab={purposeTab}
            setTab={setPurposeTab}
            onBack={goDashboard}
            onOpenRecord={openRecord}
            onUpdatePurpose={updatePurpose}
          />
        ) : null}

        {view === 'record' && selectedPurpose ? (
          <RecordView
            purpose={selectedPurpose}
            day={selectedDay || getCurrentDay(selectedPurpose)}
            onBack={() => openPurpose(selectedPurpose.id, 'historico')}
            onSave={(record, message) => upsertRecord(selectedPurpose.id, record, message)}
          />
        ) : null}

        {view === 'responses' ? (
          <ResponsesView purposes={purposes} onBack={goDashboard} onOpenRecord={openRecord} />
        ) : null}

        {view === 'backup' ? (
          <BackupView
            purposes={purposes}
            setPurposes={setPurposes}
            onBack={goDashboard}
            onToast={showToast}
          />
        ) : null}
      </main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button className={view === 'dashboard' ? 'active' : ''} type="button" onClick={goDashboard}>
          <Home size={19} aria-hidden="true" />
          <span>Início</span>
        </button>
        <button className={view === 'today' ? 'active' : ''} type="button" onClick={() => setView('today')}>
          <CalendarDays size={19} aria-hidden="true" />
          <span>Hoje</span>
        </button>
        <button className={view === 'responses' ? 'active' : ''} type="button" onClick={() => setView('responses')}>
          <Heart size={19} aria-hidden="true" />
          <span>Respostas</span>
        </button>
        <button className={view === 'backup' ? 'active' : ''} type="button" onClick={() => setView('backup')}>
          <Archive size={19} aria-hidden="true" />
          <span>Backup</span>
        </button>
      </nav>

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}

function Dashboard({ purposes, onNew, onToday, onResponses, onBackup, onOpenPurpose, onOpenRecord }) {
  const totals = purposes.reduce(
    (acc, purpose) => {
      const stats = purposeStats(purpose);
      acc.active += purpose.status === 'em_andamento' ? 1 : 0;
      acc.responses += stats.responses;
      acc.registered += stats.registered;
      return acc;
    },
    { active: 0, responses: 0, registered: 0 }
  );

  return (
    <section className="view-stack">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Painel de propósitos</p>
          <h1>Seu altar diário, bem guardado.</h1>
        </div>
        <div className="mini-metrics" aria-label="Resumo geral">
          <span>
            <strong>{totals.active}</strong>
            ativos
          </span>
          <span>
            <strong>{totals.registered}</strong>
            registros
          </span>
          <span>
            <strong>{totals.responses}</strong>
            respostas
          </span>
        </div>
      </div>

      <div className="action-grid">
        <IconButton icon={Plus} onClick={onNew}>
          Novo propósito
        </IconButton>
        <IconButton icon={CalendarDays} variant="secondary" onClick={onToday}>
          Hoje
        </IconButton>
        <IconButton icon={Heart} variant="secondary" onClick={onResponses}>
          Respostas
        </IconButton>
        <IconButton icon={Archive} variant="secondary" onClick={onBackup}>
          Backup
        </IconButton>
      </div>

      <div className="section-heading">
        <h2>Propósitos cadastrados</h2>
        <span>{purposes.length} no total</span>
      </div>

      {purposes.length ? (
        <div className="purpose-grid">
          {purposes.map((purpose) => (
            <PurposeCard
              key={purpose.id}
              purpose={purpose}
              onOpenPurpose={onOpenPurpose}
              onOpenRecord={onOpenRecord}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Nenhum propósito cadastrado"
          text="Comece criando um propósito simples para registrar oração, respostas e memória espiritual."
          action={
            <IconButton icon={Plus} onClick={onNew}>
              Novo propósito
            </IconButton>
          }
        />
      )}
    </section>
  );
}

function PurposeCard({ purpose, onOpenPurpose, onOpenRecord }) {
  const stats = purposeStats(purpose);

  return (
    <article className="purpose-card">
      <button className="card-main" type="button" onClick={() => onOpenPurpose(purpose.id, 'resumo')}>
        <div className="card-topline">
          <span className={`status-pill ${statusClass(purpose.status)}`}>{STATUS_LABELS[purpose.status]}</span>
          <span className="day-pill">Dia {stats.currentDay}</span>
        </div>
        <h3>{purpose.nome}</h3>
        <div className="tag-row">
          <span>{purpose.tema}</span>
          <span>{purpose.tipo}</span>
        </div>
        <div className="progress-block">
          <div className="progress-copy">
            <span>
              Dia {stats.currentDay} de {purpose.duracao}
            </span>
            <strong>{stats.progress}%</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
        <div className="card-stats">
          <span>
            <strong>{stats.registered}</strong>
            dias registrados
          </span>
          <span>
            <strong>{stats.responses}</strong>
            respostas recebidas
          </span>
        </div>
      </button>
      <div className="card-actions">
        <button type="button" onClick={() => onOpenPurpose(purpose.id, 'historico')}>
          <ListChecks size={17} aria-hidden="true" />
          Histórico
        </button>
        <button type="button" onClick={() => onOpenRecord(purpose.id, stats.currentDay)}>
          <Save size={17} aria-hidden="true" />
          Registrar
        </button>
      </div>
    </article>
  );
}

function TodayView({ purposes, onOpenRecord, onBack }) {
  const activePurposes = purposes.filter((purpose) => purpose.status === 'em_andamento');

  return (
    <section className="view-stack">
      <ViewTitle
        icon={CalendarDays}
        title="Hoje"
        subtitle="Ore hoje pelo que você ainda vai viver amanhã."
        onBack={onBack}
      />

      {activePurposes.length ? (
        <div className="today-list">
          {activePurposes.map((purpose) => {
            const day = getCurrentDay(purpose);
            const record = purpose.registros.find((item) => item.dia === day);
            const pending = !record?.concluido;

            return (
              <article className="today-card" key={purpose.id}>
                <div>
                  <span className={`status-dot ${pending ? 'pending' : 'done'}`} />
                  <h3>{purpose.nome}</h3>
                  <p>
                    Dia {day} de {purpose.duracao} - {pending ? 'Registro pendente' : 'Registro concluído'}
                  </p>
                </div>
                <IconButton
                  icon={pending ? Save : CheckCircle2}
                  variant={pending ? 'primary' : 'secondary'}
                  onClick={() => onOpenRecord(purpose.id, day)}
                >
                  {pending ? 'Registrar hoje' : 'Editar hoje'}
                </IconButton>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={PauseCircle}
          title="Nenhum propósito ativo"
          text="Os propósitos pausados ou concluídos ficam guardados no painel inicial."
        />
      )}
    </section>
  );
}

function NewPurposeView({ onBack, onCreate }) {
  const [form, setForm] = useState({
    nome: '',
    tema: 'Ministério',
    temaPersonalizado: '',
    tipo: 'Oração',
    duracao: 7,
    duracaoPersonalizada: '',
    dataInicio: todayIso(),
    diaInicialRegistro: 1,
    status: 'em_andamento',
    configuracaoVersiculos: 'auto',
    configuracaoLouvores: 'auto',
    versiculosPredefinidosTexto: '',
    louvoresPredefinidosTexto: '',
    observacoes: '',
    tipoJejum: FAST_TYPES[0],
    horarioInicio: '',
    horarioTermino: '',
    evitando: '',
  });

  const durationValue = form.duracao === 'custom' ? Number(form.duracaoPersonalizada) : Number(form.duracao);
  const selectedTheme = form.tema === 'Outro' && form.temaPersonalizado.trim() ? form.temaPersonalizado.trim() : form.tema;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const duration = Number(durationValue);
    const startDay = clamp(Number(form.diaInicialRegistro) || 1, 1, duration || 1);

    if (!form.nome.trim() || !duration || duration < 1) {
      return;
    }

    onCreate(
      normalizePurpose({
        id: `purpose-${Date.now()}`,
        nome: form.nome.trim(),
        tema: selectedTheme,
        tipo: form.tipo,
        duracao: duration,
        dataInicio: form.dataInicio || todayIso(),
        diaInicialRegistro: startDay,
        status: form.status,
        configuracaoVersiculos: form.configuracaoVersiculos,
        configuracaoLouvores: form.configuracaoLouvores,
        versiculosPredefinidos: parseLinesToMap(form.versiculosPredefinidosTexto),
        louvoresPredefinidos: parseLinesToMap(form.louvoresPredefinidosTexto),
        observacoes: form.observacoes.trim(),
        jejum:
          form.tipo === 'Jejum'
            ? {
                tipoJejum: form.tipoJejum,
                horarioInicio: form.horarioInicio,
                horarioTermino: form.horarioTermino,
                evitando: form.evitando,
              }
            : {},
        registros: [],
        criadoEm: new Date().toISOString(),
      })
    );
  }

  return (
    <section className="view-stack">
      <ViewTitle
        icon={Plus}
        title="Novo propósito"
        subtitle="Propósito não é peso, é direção."
        onBack={onBack}
      />

      <form className="form-card" onSubmit={submit}>
        <Field label="Nome do propósito">
          <input
            value={form.nome}
            onChange={(event) => update('nome', event.target.value)}
            placeholder="Ex.: 21 dias de jejum pela saúde"
            required
          />
        </Field>

        <div className="two-columns">
          <Field label="Tema geral">
            <select value={form.tema} onChange={(event) => update('tema', event.target.value)}>
              {THEMES.map((theme) => (
                <option value={theme} key={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de propósito">
            <select value={form.tipo} onChange={(event) => update('tipo', event.target.value)}>
              {PURPOSE_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {form.tema === 'Outro' ? (
          <Field label="Tema personalizado">
            <input
              value={form.temaPersonalizado}
              onChange={(event) => update('temaPersonalizado', event.target.value)}
              placeholder="Escreva o tema"
            />
          </Field>
        ) : null}

        <fieldset className="field-group">
          <legend>Duração</legend>
          <div className="segmented">
            {QUICK_DURATIONS.map((duration) => (
              <button
                className={form.duracao === duration ? 'selected' : ''}
                type="button"
                key={duration}
                onClick={() => update('duracao', duration)}
              >
                {duration} dias
              </button>
            ))}
            <button
              className={form.duracao === 'custom' ? 'selected' : ''}
              type="button"
              onClick={() => update('duracao', 'custom')}
            >
              Personalizado
            </button>
          </div>
          {form.duracao === 'custom' ? (
            <input
              className="inline-input"
              type="number"
              min="1"
              value={form.duracaoPersonalizada}
              onChange={(event) => update('duracaoPersonalizada', event.target.value)}
              placeholder="Quantidade de dias"
              required
            />
          ) : null}
        </fieldset>

        <div className="two-columns">
          <Field label="Data de início">
            <input
              type="date"
              value={form.dataInicio}
              onChange={(event) => update('dataInicio', event.target.value)}
            />
          </Field>
          <Field label="Começar registro no dia">
            <input
              type="number"
              min="1"
              max={durationValue || 1}
              value={form.diaInicialRegistro}
              onChange={(event) => update('diaInicialRegistro', event.target.value)}
            />
          </Field>
        </div>

        <Field label="Opção de versículos">
          <select
            value={form.configuracaoVersiculos}
            onChange={(event) => update('configuracaoVersiculos', event.target.value)}
          >
            {VERSE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {form.configuracaoVersiculos === 'predefinido' ? (
          <Field label="Versículos pré-definidos" hint="Digite um versículo por linha. A primeira linha será o dia 1.">
            <textarea
              rows="5"
              value={form.versiculosPredefinidosTexto}
              onChange={(event) => update('versiculosPredefinidosTexto', event.target.value)}
            />
          </Field>
        ) : null}

        <Field label="Opção de louvores">
          <select
            value={form.configuracaoLouvores}
            onChange={(event) => update('configuracaoLouvores', event.target.value)}
          >
            {PRAISE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {form.configuracaoLouvores === 'predefinido' ? (
          <Field label="Louvores pré-definidos" hint="Digite um louvor por linha. A primeira linha será o dia 1.">
            <textarea
              rows="5"
              value={form.louvoresPredefinidosTexto}
              onChange={(event) => update('louvoresPredefinidosTexto', event.target.value)}
            />
          </Field>
        ) : null}

        {form.tipo === 'Jejum' ? (
          <div className="nested-panel">
            <div className="panel-title">
              <Flame size={18} aria-hidden="true" />
              <strong>Modo jejum</strong>
            </div>
            <Field label="Tipo de jejum">
              <select value={form.tipoJejum} onChange={(event) => update('tipoJejum', event.target.value)}>
                {FAST_TYPES.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <div className="two-columns">
              <Field label="Horário de início">
                <input
                  type="time"
                  value={form.horarioInicio}
                  onChange={(event) => update('horarioInicio', event.target.value)}
                />
              </Field>
              <Field label="Horário de término">
                <input
                  type="time"
                  value={form.horarioTermino}
                  onChange={(event) => update('horarioTermino', event.target.value)}
                />
              </Field>
            </div>
            <Field label="Alimento ou prática evitada">
              <input
                value={form.evitando}
                onChange={(event) => update('evitando', event.target.value)}
                placeholder="Ex.: redes sociais, doce, almoço"
              />
            </Field>
          </div>
        ) : null}

        <Field label="Observações gerais">
          <textarea
            rows="5"
            value={form.observacoes}
            onChange={(event) => update('observacoes', event.target.value)}
            placeholder="Direção, foco espiritual, pedidos e detalhes importantes"
          />
        </Field>

        <IconButton icon={CheckCircle2} className="full-width" type="submit">
          Criar propósito
        </IconButton>
      </form>
    </section>
  );
}

function PurposeView({ purpose, tab, setTab, onBack, onOpenRecord, onUpdatePurpose }) {
  const stats = purposeStats(purpose);
  const milestone = nextMilestone(purpose);

  return (
    <section className="view-stack">
      <ViewTitle icon={ClipboardList} title={purpose.nome} subtitle={`${purpose.tema} - ${purpose.tipo}`} onBack={onBack} />

      <div className="tabbar" role="tablist" aria-label="Detalhes do propósito">
        <button className={tab === 'resumo' ? 'active' : ''} type="button" onClick={() => setTab('resumo')}>
          Resumo
        </button>
        <button className={tab === 'historico' ? 'active' : ''} type="button" onClick={() => setTab('historico')}>
          Histórico
        </button>
      </div>

      {tab === 'resumo' ? (
        <div className="summary-grid">
          <article className="summary-panel">
            <div className="summary-header">
              <span className={`status-pill ${statusClass(purpose.status)}`}>{STATUS_LABELS[purpose.status]}</span>
              <strong>{stats.progress}%</strong>
            </div>
            <h2>Dia {stats.currentDay} de {purpose.duracao}</h2>
            <div className="progress-track large" aria-hidden="true">
              <span style={{ width: `${stats.progress}%` }} />
            </div>
            <div className="summary-actions">
              <IconButton icon={Save} onClick={() => onOpenRecord(purpose.id, stats.currentDay)}>
                Registrar dia atual
              </IconButton>
              <IconButton
                icon={FileText}
                variant="secondary"
                onClick={() =>
                  downloadText(
                    `resumo-${purpose.nome.toLowerCase().replace(/\s+/g, '-')}.txt`,
                    buildPurposeSummaryText(purpose)
                  )
                }
              >
                Exportar resumo
              </IconButton>
            </div>
          </article>

          <article className="info-panel">
            <h3>Resumo</h3>
            <dl>
              <div>
                <dt>Tema</dt>
                <dd>{purpose.tema}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{purpose.tipo}</dd>
              </div>
              <div>
                <dt>Duração</dt>
                <dd>{purpose.duracao} dias</dd>
              </div>
              <div>
                <dt>Início</dt>
                <dd>{formatDate(purpose.dataInicio)}</dd>
              </div>
              <div>
                <dt>Dias registrados</dt>
                <dd>{stats.registered}</dd>
              </div>
              <div>
                <dt>Dias não registrados</dt>
                <dd>{stats.unregisteredUntilToday}</dd>
              </div>
              <div>
                <dt>Respostas recebidas</dt>
                <dd>{stats.responses}</dd>
              </div>
              <div>
                <dt>Próximo marco</dt>
                <dd>Dia {milestone}</dd>
              </div>
            </dl>
          </article>

          <article className="info-panel">
            <h3>Status</h3>
            <div className="segmented compact">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <button
                  type="button"
                  className={purpose.status === value ? 'selected' : ''}
                  onClick={() => onUpdatePurpose(purpose.id, { status: value })}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>
          </article>

          <article className="info-panel notes">
            <h3>Observações</h3>
            <p>{purpose.observacoes || 'Sem observações gerais.'}</p>
          </article>
        </div>
      ) : (
        <HistoryView purpose={purpose} onOpenRecord={onOpenRecord} />
      )}
    </section>
  );
}

function HistoryView({ purpose, onOpenRecord }) {
  const days = Array.from({ length: purpose.duracao }, (_, index) => index + 1);

  return (
    <div className="history-list">
      {days.map((day) => {
        const status = dayStatus(purpose, day);
        return (
          <button className="history-row" type="button" key={day} onClick={() => onOpenRecord(purpose.id, day)}>
            <span className="history-day">Dia {day}</span>
            <span className={`history-status ${status.tone}`}>{status.label}</span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

function RecordView({ purpose, day, onBack, onSave }) {
  const [draft, setDraft] = useState(() => hydrateRecord(purpose, day));

  useEffect(() => {
    setDraft(hydrateRecord(purpose, day));
  }, [purpose, day]);

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateResponse(field, value) {
    setDraft((current) => ({ ...current, resposta: { ...current.resposta, [field]: value } }));
  }

  function updateFast(field, value) {
    setDraft((current) => ({ ...current, jejum: { ...current.jejum, [field]: value } }));
  }

  function save(message = 'Registro salvo.') {
    onSave(draft, message);
  }

  return (
    <section className="view-stack">
      <ViewTitle
        icon={Save}
        title={`Dia ${day} de ${purpose.duracao}`}
        subtitle={`${purpose.nome} - ${formatDate(draft.data)}`}
        onBack={onBack}
      />

      <form
        className="form-card record-card"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="record-meta">
          <span>{purpose.tema}</span>
          <span>{purpose.tipo}</span>
          <span>{dayStatus(purpose, day).label}</span>
        </div>

        <Field label="Oração de hoje">
          <textarea
            rows="7"
            value={draft.oracao}
            onChange={(event) => update('oracao', event.target.value)}
            placeholder="Escreva sua oração com liberdade"
          />
        </Field>

        {purpose.configuracaoVersiculos !== 'nenhum' ? (
          <Field label="Versículo do dia">
            <textarea
              rows="4"
              value={draft.versiculo}
              onChange={(event) => update('versiculo', event.target.value)}
            />
          </Field>
        ) : null}

        {purpose.configuracaoLouvores !== 'nenhum' ? (
          <Field label="Louvor do dia">
            <textarea rows="3" value={draft.louvor} onChange={(event) => update('louvor', event.target.value)} />
          </Field>
        ) : null}

        <Field label="O que Deus falou comigo hoje?">
          <textarea
            rows="5"
            value={draft.oQueDeusFalou}
            onChange={(event) => update('oQueDeusFalou', event.target.value)}
            placeholder="Direções, impressões, palavras, aprendizados"
          />
        </Field>

        {purpose.tipo === 'Jejum' ? (
          <div className="nested-panel">
            <div className="panel-title">
              <Flame size={18} aria-hidden="true" />
              <strong>Modo jejum</strong>
            </div>
            <Field label="Tipo de jejum">
              <select value={draft.jejum.tipoJejum} onChange={(event) => updateFast('tipoJejum', event.target.value)}>
                {FAST_TYPES.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <div className="two-columns">
              <Field label="Horário de início">
                <input
                  type="time"
                  value={draft.jejum.horarioInicio}
                  onChange={(event) => updateFast('horarioInicio', event.target.value)}
                />
              </Field>
              <Field label="Horário de término">
                <input
                  type="time"
                  value={draft.jejum.horarioTermino}
                  onChange={(event) => updateFast('horarioTermino', event.target.value)}
                />
              </Field>
            </div>
            <Field label="Alimento ou prática evitada">
              <input
                value={draft.jejum.evitando}
                onChange={(event) => updateFast('evitando', event.target.value)}
              />
            </Field>
            <Field label="Observação espiritual do dia">
              <textarea
                rows="4"
                value={draft.jejum.observacaoEspiritual}
                onChange={(event) => updateFast('observacaoEspiritual', event.target.value)}
              />
            </Field>
          </div>
        ) : null}

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={draft.respostaRecebida}
            onChange={(event) => update('respostaRecebida', event.target.checked)}
          />
          <span>
            <strong>Resposta recebida hoje?</strong>
            <small>Registrar para não esquecer o que Deus já fez.</small>
          </span>
        </label>

        {draft.respostaRecebida ? (
          <div className="nested-panel">
            <div className="panel-title">
              <Heart size={18} aria-hidden="true" />
              <strong>Resposta recebida</strong>
            </div>
            <div className="two-columns">
              <Field label="Tipo de resposta">
                <select value={draft.resposta.tipo} onChange={(event) => updateResponse('tipo', event.target.value)}>
                  {RESPONSE_TYPES.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Data da resposta">
                <input
                  type="date"
                  value={draft.resposta.data}
                  onChange={(event) => updateResponse('data', event.target.value)}
                />
              </Field>
            </div>
            <Field label="Resumo da resposta">
              <input
                value={draft.resposta.resumo}
                onChange={(event) => updateResponse('resumo', event.target.value)}
                placeholder="Ex.: porta aberta para agenda ministerial"
              />
            </Field>
            <Field label="Descrição da resposta">
              <textarea
                rows="5"
                value={draft.resposta.descricao}
                onChange={(event) => updateResponse('descricao', event.target.value)}
              />
            </Field>
            <Field label="Observações">
              <textarea
                rows="3"
                value={draft.resposta.observacoes}
                onChange={(event) => updateResponse('observacoes', event.target.value)}
              />
            </Field>
          </div>
        ) : null}

        <div className="sticky-form-actions">
          <IconButton icon={Save} type="submit" variant="secondary">
            Salvar
          </IconButton>
          <IconButton
            icon={CheckCircle2}
            type="button"
            onClick={() => {
              const completed = { ...draft, concluido: true };
              setDraft(completed);
              onSave(completed, 'Dia marcado como concluído.');
            }}
          >
            Marcar concluído
          </IconButton>
        </div>
      </form>
    </section>
  );
}

function ResponsesView({ purposes, onBack, onOpenRecord }) {
  const [purposeFilter, setPurposeFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('');

  const responses = purposes.flatMap((purpose) =>
    purpose.registros
      .filter((record) => record.respostaRecebida)
      .map((record) => ({
        purpose,
        record,
        response: record.resposta || {},
      }))
  );

  const filtered = responses.filter((item) => {
    const byPurpose = purposeFilter === 'todos' || item.purpose.id === purposeFilter;
    const byType = typeFilter === 'todos' || item.response.tipo === typeFilter;
    const byDate = !dateFilter || item.response.data === dateFilter;
    return byPurpose && byType && byDate;
  });

  return (
    <section className="view-stack">
      <ViewTitle
        icon={Heart}
        title="Memorial de respostas"
        subtitle="Não esqueça o que Deus já fez."
        onBack={onBack}
      />

      <div className="filter-panel">
        <div className="panel-title">
          <Filter size={18} aria-hidden="true" />
          <strong>Filtros</strong>
        </div>
        <div className="filter-grid">
          <Field label="Propósito">
            <select value={purposeFilter} onChange={(event) => setPurposeFilter(event.target.value)}>
              <option value="todos">Todos</option>
              {purposes.map((purpose) => (
                <option value={purpose.id} key={purpose.id}>
                  {purpose.nome}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo">
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="todos">Todos</option>
              {RESPONSE_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Data">
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </Field>
        </div>
      </div>

      {filtered.length ? (
        <div className="response-list">
          {filtered.map(({ purpose, record, response }) => {
            const title = response.resumo || response.descricao || 'Resposta registrada';
            return (
              <button
                className="response-card"
                type="button"
                key={`${purpose.id}-${record.dia}`}
                onClick={() => onOpenRecord(purpose.id, record.dia)}
              >
                <span className="response-date">{formatDate(response.data || record.data)}</span>
                <h3>{title}</h3>
                <div className="tag-row">
                  <span>{purpose.nome}</span>
                  <span>Dia {record.dia}</span>
                  <span>{response.tipo || 'Outro'}</span>
                </div>
                {response.descricao ? <p>{response.descricao}</p> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="Nenhuma resposta encontrada"
          text="Respostas registradas ao longo da caminhada aparecerão aqui."
        />
      )}
    </section>
  );
}

function BackupView({ purposes, setPurposes, onBack, onToast }) {
  const [summaryPurposeId, setSummaryPurposeId] = useState(purposes[0]?.id || '');

  useEffect(() => {
    if (!summaryPurposeId && purposes[0]) setSummaryPurposeId(purposes[0].id);
  }, [purposes, summaryPurposeId]);

  function exportJson() {
    downloadText(
      `meu-devocional-365-backup-${todayIso()}.json`,
      JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), purposes }, null, 2),
      'application/json;charset=utf-8'
    );
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const imported = Array.isArray(parsed) ? parsed : parsed.purposes;
        if (!Array.isArray(imported)) throw new Error('Formato inválido');
        setPurposes(imported.map(normalizePurpose));
        onToast('Backup importado.');
      } catch {
        onToast('Não foi possível importar o arquivo.');
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    const confirmed = window.confirm('Apagar todos os dados salvos neste navegador?');
    if (!confirmed) return;
    setPurposes([]);
    onToast('Dados apagados.');
  }

  const selectedPurpose = purposes.find((purpose) => purpose.id === summaryPurposeId);

  return (
    <section className="view-stack">
      <ViewTitle icon={Archive} title="Backup" subtitle="Seus registros ficam salvos neste navegador." onBack={onBack} />

      <div className="backup-grid">
        <article className="info-panel">
          <div className="panel-title">
            <Download size={18} aria-hidden="true" />
            <strong>Exportar dados</strong>
          </div>
          <p>Gere um arquivo JSON com todos os propósitos, registros e respostas.</p>
          <IconButton icon={Download} onClick={exportJson}>
            Exportar JSON
          </IconButton>
        </article>

        <article className="info-panel">
          <div className="panel-title">
            <Upload size={18} aria-hidden="true" />
            <strong>Importar dados</strong>
          </div>
          <p>Escolha um arquivo JSON exportado anteriormente.</p>
          <label className="file-button">
            <Upload size={18} aria-hidden="true" />
            <span>Importar JSON</span>
            <input type="file" accept="application/json,.json" onChange={(event) => importJson(event.target.files[0])} />
          </label>
        </article>

        <article className="info-panel">
          <div className="panel-title">
            <FileText size={18} aria-hidden="true" />
            <strong>Resumo em texto</strong>
          </div>
          <Field label="Propósito">
            <select value={summaryPurposeId} onChange={(event) => setSummaryPurposeId(event.target.value)}>
              {purposes.map((purpose) => (
                <option value={purpose.id} key={purpose.id}>
                  {purpose.nome}
                </option>
              ))}
            </select>
          </Field>
          <IconButton
            icon={FileText}
            variant="secondary"
            disabled={!selectedPurpose}
            onClick={() => {
              if (!selectedPurpose) return;
              downloadText(
                `resumo-${selectedPurpose.nome.toLowerCase().replace(/\s+/g, '-')}.txt`,
                buildPurposeSummaryText(selectedPurpose)
              );
            }}
          >
            Exportar resumo
          </IconButton>
        </article>

        <article className="info-panel danger-panel">
          <div className="panel-title">
            <Trash2 size={18} aria-hidden="true" />
            <strong>Apagar dados</strong>
          </div>
          <p>Remove todos os registros salvos neste navegador após confirmação.</p>
          <IconButton icon={Trash2} variant="danger" onClick={clearAll}>
            Apagar tudo
          </IconButton>
        </article>
      </div>
    </section>
  );
}

function ViewTitle({ icon: Icon, title, subtitle, onBack }) {
  return (
    <div className="view-title">
      <button type="button" className="back-button" onClick={onBack} aria-label="Voltar">
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <span className="view-icon">
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export default App;
