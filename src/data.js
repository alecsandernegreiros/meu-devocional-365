export const THEMES = [
  'Ministério',
  'Família',
  'Saúde',
  'Casamento',
  'Filhos',
  'Vida espiritual',
  'Direção de Deus',
  'Portas abertas',
  'Finanças',
  'Igreja',
  'Liderança',
  'Cura',
  'Libertação',
  'Gratidão',
  'Chamado',
  'Outro',
];

export const PURPOSE_TYPES = [
  'Oração',
  'Jejum',
  'Devocional',
  'Consagração',
  'Intercessão',
  'Gratidão',
  'Outro',
];

export const QUICK_DURATIONS = [7, 21, 40, 365];

export const VERSE_OPTIONS = [
  { value: 'auto', label: 'Sugerir versículos automaticamente com base no tema' },
  { value: 'predefinido', label: 'Eu quero pré-definir os versículos de cada dia' },
  { value: 'nenhum', label: 'Não usar versículos neste propósito' },
];

export const PRAISE_OPTIONS = [
  { value: 'auto', label: 'Sugerir louvores automaticamente com base no tema' },
  { value: 'predefinido', label: 'Eu quero pré-definir os louvores de cada dia' },
  { value: 'nenhum', label: 'Não usar louvores neste propósito' },
];

export const RESPONSE_TYPES = [
  'Porta aberta',
  'Direção',
  'Confirmação',
  'Provisão',
  'Cura',
  'Mudança interior',
  'Agenda ministerial',
  'Palavra recebida',
  'Livramento',
  'Outro',
];

export const FAST_TYPES = [
  'Jejum parcial',
  'Jejum de alimento específico',
  'Jejum de redes sociais',
  'Jejum de entretenimento',
  'Outro',
];

export const MILESTONES = [7, 21, 40, 100, 180, 365];

export const MOTIVATIONAL_PHRASES = [
  'Antes de viver grandes agendas, construa grandes altares.',
  'Não é só rotina. É construção espiritual.',
  'Ore hoje pelo que você ainda vai viver amanhã.',
  'O altar de hoje prepara as portas de amanhã.',
  'Registre para não esquecer o que Deus fez.',
  'Propósito não é peso, é direção.',
  'Cada dia de oração também é uma semente.',
];

export const VERSE_BANK = {
  Ministério: [
    { reference: 'Jeremias 1:5', text: 'Antes que eu te formasse no ventre, eu te conheci.' },
    { reference: 'Isaías 6:8', text: 'Eis-me aqui, envia-me a mim.' },
    { reference: '2 Timóteo 4:2', text: 'Pregue a palavra, esteja preparado a tempo e fora de tempo.' },
    { reference: 'Atos 20:24', text: 'Importa-me completar a carreira e o ministério que recebi do Senhor Jesus.' },
    { reference: '1 Pedro 4:10', text: 'Sirvam uns aos outros mediante o dom que cada um recebeu.' },
    { reference: 'Mateus 28:19', text: 'Vão e façam discípulos de todas as nações.' },
    { reference: 'Colossenses 3:23', text: 'Tudo o que fizerem, façam de todo o coração, como para o Senhor.' },
    { reference: '1 Coríntios 15:58', text: 'Permaneçam firmes, sabendo que o trabalho de vocês no Senhor não é inútil.' },
  ],
  Família: [
    { reference: 'Josué 24:15', text: 'Eu e a minha casa serviremos ao Senhor.' },
    { reference: 'Salmos 128:1', text: 'Bem-aventurado aquele que teme ao Senhor e anda nos seus caminhos.' },
    { reference: 'Provérbios 22:6', text: 'Ensine a criança no caminho em que deve andar.' },
    { reference: 'Efésios 4:32', text: 'Sejam bondosos e compassivos uns para com os outros.' },
  ],
  Saúde: [
    { reference: 'Jeremias 30:17', text: 'Restaurarei a sua saúde e curarei as suas feridas.' },
    { reference: '3 João 1:2', text: 'Oro para que você tenha boa saúde e tudo corra bem.' },
    { reference: 'Salmos 103:2-3', text: 'Bendiga ao Senhor e não se esqueça de nenhum de seus benefícios.' },
    { reference: 'Isaías 53:5', text: 'Pelas suas feridas fomos curados.' },
  ],
  Casamento: [
    { reference: 'Eclesiastes 4:12', text: 'O cordão de três dobras não se rompe com facilidade.' },
    { reference: 'Cânticos 8:7', text: 'Muitas águas não podem apagar o amor.' },
    { reference: 'Efésios 5:25', text: 'Maridos, amem suas mulheres, assim como Cristo amou a igreja.' },
    { reference: 'Colossenses 3:14', text: 'Acima de tudo, porém, revistam-se do amor.' },
  ],
  Filhos: [
    { reference: 'Isaías 54:13', text: 'Todos os seus filhos serão ensinados pelo Senhor.' },
    { reference: 'Salmos 127:3', text: 'Os filhos são herança do Senhor.' },
    { reference: 'Provérbios 20:7', text: 'Bem-aventurados são os filhos do justo.' },
    { reference: 'Lucas 2:52', text: 'Jesus crescia em sabedoria, estatura e graça.' },
  ],
  'Vida espiritual': [
    { reference: 'João 15:5', text: 'Quem permanece em mim, e eu nele, esse dá muito fruto.' },
    { reference: 'Romanos 12:2', text: 'Transformem-se pela renovação da sua mente.' },
    { reference: 'Gálatas 5:22', text: 'O fruto do Espírito é amor, alegria, paz, paciência, amabilidade.' },
    { reference: 'Tiago 4:8', text: 'Aproximem-se de Deus, e ele se aproximará de vocês.' },
  ],
  'Direção de Deus': [
    { reference: 'Provérbios 3:5-6', text: 'Reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.' },
    { reference: 'Salmos 32:8', text: 'Eu o instruirei e o ensinarei no caminho que você deve seguir.' },
    { reference: 'Isaías 30:21', text: 'Este é o caminho, sigam por ele.' },
    { reference: 'Tiago 1:5', text: 'Se alguém tem falta de sabedoria, peça-a a Deus.' },
  ],
  'Portas abertas': [
    { reference: 'Apocalipse 3:8', text: 'Coloquei diante de você uma porta aberta que ninguém pode fechar.' },
    { reference: 'Isaías 45:2', text: 'Irei adiante de você e endireitarei os caminhos tortuosos.' },
    { reference: '1 Coríntios 16:9', text: 'Uma porta grande e oportuna se abriu para mim.' },
    { reference: 'Colossenses 4:3', text: 'Orem também para que Deus nos abra uma porta para a palavra.' },
  ],
  Finanças: [
    { reference: 'Filipenses 4:19', text: 'O meu Deus suprirá todas as necessidades de vocês.' },
    { reference: 'Provérbios 3:9-10', text: 'Honre o Senhor com todos os seus recursos.' },
    { reference: '2 Coríntios 9:8', text: 'Deus é poderoso para fazer que toda graça lhes seja acrescentada.' },
    { reference: 'Mateus 6:33', text: 'Busquem em primeiro lugar o Reino de Deus.' },
  ],
  Igreja: [
    { reference: 'Mateus 16:18', text: 'Edificarei a minha igreja, e as portas do Hades não poderão vencê-la.' },
    { reference: 'Atos 2:42', text: 'Eles se dedicavam ao ensino, à comunhão, ao partir do pão e às orações.' },
    { reference: 'Efésios 4:16', text: 'Todo o corpo cresce e edifica-se em amor.' },
    { reference: 'Hebreus 10:25', text: 'Não deixemos de reunir-nos como igreja.' },
  ],
  Liderança: [
    { reference: 'Marcos 10:45', text: 'O Filho do homem não veio para ser servido, mas para servir.' },
    { reference: 'Provérbios 11:14', text: 'Na multidão de conselheiros há segurança.' },
    { reference: '1 Timóteo 4:12', text: 'Seja um exemplo para os fiéis na palavra, no procedimento, no amor, na fé e na pureza.' },
    { reference: 'Neemias 2:18', text: 'Vamos reconstruir. E se dispuseram a começar a boa obra.' },
  ],
  Cura: [
    { reference: 'Salmos 147:3', text: 'Só ele cura os de coração quebrantado e cuida das suas feridas.' },
    { reference: 'Êxodo 15:26', text: 'Eu sou o Senhor que os cura.' },
    { reference: 'Mateus 11:28', text: 'Venham a mim, todos os que estão cansados e sobrecarregados.' },
    { reference: 'Lucas 8:48', text: 'Filha, a sua fé a curou. Vá em paz.' },
  ],
  Libertação: [
    { reference: 'João 8:36', text: 'Se o Filho os libertar, vocês de fato serão livres.' },
    { reference: 'Salmos 34:17', text: 'Os justos clamam, o Senhor os ouve e os livra de todas as suas tribulações.' },
    { reference: '2 Coríntios 3:17', text: 'Onde está o Espírito do Senhor, ali há liberdade.' },
    { reference: 'Gálatas 5:1', text: 'Foi para a liberdade que Cristo nos libertou.' },
  ],
  Gratidão: [
    { reference: '1 Tessalonicenses 5:18', text: 'Deem graças em todas as circunstâncias.' },
    { reference: 'Salmos 107:1', text: 'Deem graças ao Senhor porque ele é bom.' },
    { reference: 'Colossenses 3:17', text: 'Façam tudo em nome do Senhor Jesus, dando graças a Deus.' },
    { reference: 'Salmos 103:2', text: 'Bendiga ao Senhor a minha alma, não esqueça nenhum de seus benefícios.' },
  ],
  Chamado: [
    { reference: 'Romanos 11:29', text: 'Os dons e o chamado de Deus são irrevogáveis.' },
    { reference: 'Efésios 2:10', text: 'Fomos criados em Cristo Jesus para boas obras.' },
    { reference: 'Filipenses 1:6', text: 'Aquele que começou boa obra em vocês vai completá-la.' },
    { reference: '2 Pedro 1:10', text: 'Empenhem-se para consolidar o chamado e a eleição de vocês.' },
  ],
  Outro: [
    { reference: 'Salmos 37:5', text: 'Entregue o seu caminho ao Senhor; confie nele, e ele agirá.' },
    { reference: 'Isaías 41:10', text: 'Não tema, pois eu estou com você.' },
    { reference: 'Lamentações 3:22-23', text: 'As misericórdias do Senhor se renovam a cada manhã.' },
    { reference: 'Hebreus 11:1', text: 'A fé é a certeza daquilo que esperamos.' },
  ],
};

export const PRAISE_BANK = {
  Ministério: [
    { title: 'Eis-me Aqui', artist: 'Diante do Trono', theme: 'Ministério', link: '' },
    { title: 'Me Atraiu', artist: 'Gabriela Rocha', theme: 'Chamado', link: '' },
    { title: 'A Resposta', artist: 'Thalles Roberto', theme: 'Direção', link: '' },
    { title: 'Tua Presença', artist: 'Paulo César Baruk', theme: 'Consagração', link: '' },
  ],
  Família: [
    { title: 'Casa', artist: 'Palavrantiga', theme: 'Família', link: '' },
    { title: 'Minha Família', artist: 'Aline Barros', theme: 'Família', link: '' },
    { title: 'Teu Amor Não Falha', artist: 'Nívea Soares', theme: 'Amor', link: '' },
    { title: 'Bondade de Deus', artist: 'Isaías Saad', theme: 'Gratidão', link: '' },
  ],
  Saúde: [
    { title: 'Raridade', artist: 'Anderson Freire', theme: 'Valor', link: '' },
    { title: 'Descansarei', artist: 'Comunidade Evangélica de Maringá', theme: 'Descanso', link: '' },
    { title: 'Deus de Promessas', artist: 'Toque no Altar', theme: 'Esperança', link: '' },
    { title: 'Lugar Secreto', artist: 'Gabriela Rocha', theme: 'Presença', link: '' },
  ],
  Casamento: [
    { title: 'Escolhi Te Esperar', artist: 'Marcela Taís', theme: 'Aliança', link: '' },
    { title: 'Aliança', artist: 'André Valadão', theme: 'Compromisso', link: '' },
    { title: 'O Amor Venceu', artist: 'Fernandinho', theme: 'Amor', link: '' },
    { title: 'Casa Favorita', artist: 'Casa Worship', theme: 'Lar', link: '' },
  ],
  Filhos: [
    { title: 'Aos Olhos do Pai', artist: 'Diante do Trono', theme: 'Identidade', link: '' },
    { title: 'Cuido dos Detalhes', artist: 'André e Felipe', theme: 'Cuidado', link: '' },
    { title: 'Ninguém Explica Deus', artist: 'Preto no Branco', theme: 'Fé', link: '' },
    { title: 'Jesus, Filho de Deus', artist: 'Fernandinho', theme: 'Cristo', link: '' },
  ],
  'Vida espiritual': [
    { title: 'Lugar Secreto', artist: 'Gabriela Rocha', theme: 'Intimidade', link: '' },
    { title: 'Aquieta Minh\'alma', artist: 'Ministério Zoe', theme: 'Descanso', link: '' },
    { title: 'Me Leva', artist: 'Nívea Soares', theme: 'Entrega', link: '' },
    { title: 'Eu Navegarei', artist: 'Gabriela Rocha', theme: 'Espírito Santo', link: '' },
  ],
  'Direção de Deus': [
    { title: 'Guia-me', artist: 'Laura Souguellis', theme: 'Direção', link: '' },
    { title: 'Os Sonhos de Deus', artist: 'Ludmila Ferber', theme: 'Propósito', link: '' },
    { title: 'Tua Vontade', artist: 'Ministério Morada', theme: 'Entrega', link: '' },
    { title: 'Caminho no Deserto', artist: 'Soraya Moraes', theme: 'Provisão', link: '' },
  ],
  'Portas abertas': [
    { title: 'Vai Valer a Pena', artist: 'Livres para Adorar', theme: 'Esperança', link: '' },
    { title: 'Deus Proverá', artist: 'Gabriela Gomes', theme: 'Provisão', link: '' },
    { title: 'Abra os Céus', artist: 'Soraya Moraes', theme: 'Portas abertas', link: '' },
    { title: 'Uma Nova História', artist: 'Fernandinho', theme: 'Recomeço', link: '' },
  ],
  Finanças: [
    { title: 'Deus Proverá', artist: 'Gabriela Gomes', theme: 'Provisão', link: '' },
    { title: 'Fidelidade', artist: 'Danielle Cristina', theme: 'Confiança', link: '' },
    { title: 'Ele Vem', artist: 'Gabriela Rocha', theme: 'Esperança', link: '' },
    { title: 'A Vitória Chegou', artist: 'Aurelina Dourado', theme: 'Vitória', link: '' },
  ],
  Igreja: [
    { title: 'Somos Um', artist: 'Paulo César Baruk', theme: 'Unidade', link: '' },
    { title: 'Tu És Santo', artist: 'Diante do Trono', theme: 'Adoração', link: '' },
    { title: 'Yeshua', artist: 'Heloisa Rosa', theme: 'Cristo', link: '' },
    { title: 'Aviva-nos', artist: 'Aline Barros', theme: 'Avivamento', link: '' },
  ],
  Liderança: [
    { title: 'Servo', artist: 'Kleber Lucas', theme: 'Serviço', link: '' },
    { title: 'Me Derramar', artist: 'Vineyard Brasil', theme: 'Entrega', link: '' },
    { title: 'Eu Vou Construir', artist: 'Livres para Adorar', theme: 'Chamado', link: '' },
    { title: 'Pra Onde Eu Irei?', artist: 'Morada', theme: 'Dependência', link: '' },
  ],
  Cura: [
    { title: 'Sobre as Águas', artist: 'Diante do Trono', theme: 'Fé', link: '' },
    { title: 'Ele Continua Sendo Bom', artist: 'Paulo César Baruk', theme: 'Esperança', link: '' },
    { title: 'Deus Cuida de Mim', artist: 'Kleber Lucas', theme: 'Cuidado', link: '' },
    { title: 'Sonda-me, Usa-me', artist: 'Aline Barros', theme: 'Entrega', link: '' },
  ],
  Libertação: [
    { title: 'Eu Sou Livre', artist: 'David Quinlan', theme: 'Liberdade', link: '' },
    { title: 'Cadeias Quebrar', artist: 'Nívea Soares', theme: 'Libertação', link: '' },
    { title: 'Nada Além do Sangue', artist: 'Fernandinho', theme: 'Redenção', link: '' },
    { title: 'Liberdade', artist: 'Livres para Adorar', theme: 'Liberdade', link: '' },
  ],
  Gratidão: [
    { title: 'Bondade de Deus', artist: 'Isaías Saad', theme: 'Gratidão', link: '' },
    { title: 'Gratidão', artist: 'Kemuel', theme: 'Gratidão', link: '' },
    { title: 'Sou Casa', artist: 'Elizeu Alves', theme: 'Presença', link: '' },
    { title: 'Obrigado Jesus', artist: 'André Valadão', theme: 'Gratidão', link: '' },
  ],
  Chamado: [
    { title: 'Ousado Amor', artist: 'Isaias Saad', theme: 'Amor', link: '' },
    { title: 'Me Usa', artist: 'Aline Barros', theme: 'Chamado', link: '' },
    { title: 'Quem Dizes Que Eu Sou', artist: 'Hillsong em Português', theme: 'Identidade', link: '' },
    { title: 'Quero Conhecer Jesus', artist: 'Cia Salt', theme: 'Intimidade', link: '' },
  ],
  Outro: [
    { title: 'Nada Mais', artist: 'Gabriel Guedes', theme: 'Adoração', link: '' },
    { title: 'Todavia Me Alegrarei', artist: 'Samuel Messias', theme: 'Confiança', link: '' },
    { title: 'Ele É Exaltado', artist: 'Adhemar de Campos', theme: 'Adoração', link: '' },
    { title: 'A Casa É Sua', artist: 'Casa Worship', theme: 'Presença', link: '' },
  ],
};

export function createInitialPurposes() {
  return [
    {
      id: 'sample-ministerio-365',
      nome: '365 dias pelo meu ministério',
      tema: 'Ministério',
      tipo: 'Oração',
      duracao: 365,
      dataInicio: '2026-06-14',
      diaInicialRegistro: 12,
      status: 'em_andamento',
      configuracaoVersiculos: 'auto',
      configuracaoLouvores: 'auto',
      versiculosPredefinidos: {},
      louvoresPredefinidos: {},
      observacoes:
        'Propósito de oração pelo ministério, direção de Deus, portas abertas, crescimento, maturidade, agendas, autoridade espiritual e frutos.',
      jejum: {
        tipoJejum: '',
        horarioInicio: '',
        horarioTermino: '',
        evitando: '',
      },
      registros: [],
      criadoEm: '2026-06-25T00:00:00.000Z',
    },
  ];
}
