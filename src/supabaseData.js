import { supabase } from './supabaseClient.js';

const PURPOSES_TABLE = 'devocional_purposes';
const RECORDS_TABLE = 'devocional_records';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function purposeToRow(purpose, userId) {
  return {
    id: purpose.id,
    user_id: userId,
    nome: purpose.nome,
    tema: purpose.tema,
    tipo: purpose.tipo,
    duracao: purpose.duracao,
    data_inicio: purpose.dataInicio,
    dia_inicial_registro: purpose.diaInicialRegistro,
    status: purpose.status,
    configuracao_versiculos: purpose.configuracaoVersiculos,
    configuracao_louvores: purpose.configuracaoLouvores,
    versiculos_predefinidos: purpose.versiculosPredefinidos || {},
    louvores_predefinidos: purpose.louvoresPredefinidos || {},
    observacoes: purpose.observacoes || '',
    jejum: purpose.jejum || {},
    criado_em: purpose.criadoEm || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function rowToPurpose(row) {
  return {
    id: row.id,
    nome: row.nome,
    tema: row.tema,
    tipo: row.tipo,
    duracao: row.duracao,
    dataInicio: row.data_inicio,
    diaInicialRegistro: row.dia_inicial_registro,
    status: row.status,
    configuracaoVersiculos: row.configuracao_versiculos,
    configuracaoLouvores: row.configuracao_louvores,
    versiculosPredefinidos: row.versiculos_predefinidos || {},
    louvoresPredefinidos: row.louvores_predefinidos || {},
    observacoes: row.observacoes || '',
    jejum: row.jejum || {},
    registros: [],
    criadoEm: row.criado_em,
  };
}

function recordToRow(record, purposeId, userId) {
  return {
    user_id: userId,
    purpose_id: purposeId,
    dia: record.dia,
    data: record.data,
    oracao: record.oracao || '',
    versiculo: record.versiculo || '',
    louvor: record.louvor || '',
    o_que_deus_falou: record.oQueDeusFalou || '',
    concluido: Boolean(record.concluido),
    resposta_recebida: Boolean(record.respostaRecebida),
    resposta: record.resposta || {},
    jejum: record.jejum || {},
    updated_at: new Date().toISOString(),
  };
}

function rowToRecord(row) {
  return {
    dia: row.dia,
    data: row.data,
    oracao: row.oracao || '',
    versiculo: row.versiculo || '',
    louvor: row.louvor || '',
    oQueDeusFalou: row.o_que_deus_falou || '',
    concluido: Boolean(row.concluido),
    respostaRecebida: Boolean(row.resposta_recebida),
    resposta: row.resposta || {},
    jejum: row.jejum || {},
  };
}

export async function loadCloudData(userId) {
  const client = requireSupabase();

  const { data: purposeRows, error: purposeError } = await client
    .from(PURPOSES_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('criado_em', { ascending: false });

  if (purposeError) throw purposeError;

  const { data: recordRows, error: recordError } = await client
    .from(RECORDS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('dia', { ascending: true });

  if (recordError) throw recordError;

  const purposes = (purposeRows || []).map(rowToPurpose);
  const recordsByPurpose = (recordRows || []).reduce((acc, row) => {
    if (!acc[row.purpose_id]) acc[row.purpose_id] = [];
    acc[row.purpose_id].push(rowToRecord(row));
    return acc;
  }, {});

  return purposes.map((purpose) => ({
    ...purpose,
    registros: recordsByPurpose[purpose.id] || [],
  }));
}

export async function saveCloudPurpose(userId, purpose) {
  const client = requireSupabase();
  const { error } = await client.from(PURPOSES_TABLE).upsert(purposeToRow(purpose, userId), {
    onConflict: 'id,user_id',
  });
  if (error) throw error;
}

export async function deleteCloudPurpose(userId, purposeId) {
  const client = requireSupabase();
  const { error } = await client.from(PURPOSES_TABLE).delete().eq('user_id', userId).eq('id', purposeId);
  if (error) throw error;
}

export async function saveCloudRecord(userId, purposeId, record) {
  const client = requireSupabase();
  const { error } = await client.from(RECORDS_TABLE).upsert(recordToRow(record, purposeId, userId), {
    onConflict: 'user_id,purpose_id,dia',
  });
  if (error) throw error;
}

export async function deleteCloudRecord(userId, purposeId, day) {
  const client = requireSupabase();
  const { error } = await client
    .from(RECORDS_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('purpose_id', purposeId)
    .eq('dia', day);
  if (error) throw error;
}

export async function replaceCloudData(userId, purposes) {
  const client = requireSupabase();

  const { error: recordsError } = await client.from(RECORDS_TABLE).delete().eq('user_id', userId);
  if (recordsError) throw recordsError;

  const { error: purposesError } = await client.from(PURPOSES_TABLE).delete().eq('user_id', userId);
  if (purposesError) throw purposesError;

  for (const purpose of purposes) {
    await saveCloudPurpose(userId, purpose);
    for (const record of purpose.registros || []) {
      await saveCloudRecord(userId, purpose.id, record);
    }
  }
}

export async function importPurposesToCloud(userId, purposes) {
  for (const purpose of purposes) {
    await saveCloudPurpose(userId, purpose);
    for (const record of purpose.registros || []) {
      await saveCloudRecord(userId, purpose.id, record);
    }
  }
}
