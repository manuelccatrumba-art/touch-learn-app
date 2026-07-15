import { CEFRLevel, GrammarExercise } from '../types';

export const GRAMMAR_EXERCISES: GrammarExercise[] = [
  // NL1 — Pergunta Embutida
  {
    id: 'nl1_1', noteId: 'NL1', noteTitle: 'Pergunta Embutida',
    type: 'multiple_choice',
    question: 'Qual é a forma correta?',
    options: [
      'Can you tell me where is the bank?',
      'Can you tell me where the bank is?',
      'Can you tell me where does the bank is?',
    ],
    correctAnswer: 'Can you tell me where the bank is?',
    explanation: 'Em perguntas indiretas, o sujeito vem antes do verbo (ordem normal de frase afirmativa).',
    tip: 'Regra: ...onde + SUJEITO + VERBO (sem inversão)',
  },
  {
    id: 'nl1_2', noteId: 'NL1', noteTitle: 'Pergunta Embutida',
    type: 'correction',
    question: 'Corrija a frase: "Do you know what time is it?"',
    correctAnswer: 'Do you know what time it is?',
    explanation: 'Após "do you know", o sujeito (it) vem antes do verbo (is).',
    tip: 'Sempre que uma pergunta vier dentro de outra frase, inverta de volta para a ordem normal.',
  },
  {
    id: 'nl1_3', noteId: 'NL1', noteTitle: 'Pergunta Embutida',
    type: 'fill_blank',
    question: 'Complete: "I was wondering if you could tell me where ___ the nearest hospital."',
    correctAnswer: 'is',
    explanation: 'Ordem normal: "where [subject] [verb]". O sujeito "the nearest hospital" vem, e depois "is".',
  },
  {
    id: 'nl1_4', noteId: 'NL1', noteTitle: 'Pergunta Embutida',
    type: 'multiple_choice',
    question: 'Escolha a forma correta:',
    options: [
      'Can I ask how old are you?',
      'Can I ask how old you are?',
      'Can I ask what is your age?',
    ],
    correctAnswer: 'Can I ask how old you are?',
    explanation: '"How old you are" — sujeito (you) antes do verbo (are).',
  },
  {
    id: 'nl1_5', noteId: 'NL1', noteTitle: 'Pergunta Embutida',
    type: 'correction',
    question: 'Corrija: "She asked me what time does the store close."',
    correctAnswer: 'She asked me what time the store closes.',
    explanation: 'Em discurso indireto/pergunta embutida: sujeito + verbo na ordem normal, sem auxiliar "does".',
  },

  // NL2 — Irmãos
  {
    id: 'nl2_1', noteId: 'NL2', noteTitle: 'Irmãos em Inglês',
    type: 'multiple_choice',
    question: 'Você tem 1 irmão e 2 irmãs. Como diz em inglês?',
    options: [
      'I have 3 brothers.',
      'I have 1 brother and 2 sisters.',
      'I have 3 siblings of different genders.',
    ],
    correctAnswer: 'I have 1 brother and 2 sisters.',
    explanation: '"Brothers" em inglês refere-se APENAS a irmãos do sexo masculino. Especifique cada um.',
    tip: '"Siblings" é o termo neutro para todos os irmãos (mais formal/genérico).',
  },
  {
    id: 'nl2_2', noteId: 'NL2', noteTitle: 'Irmãos em Inglês',
    type: 'translation',
    question: 'Traduza: "Somos quatro irmãos — dois meninos e duas meninas."',
    correctAnswer: 'There are four of us — two brothers and two sisters. / We\'re four siblings — two boys and two girls.',
    explanation: 'Nunca use "four brothers" para um grupo misto. Separe por gênero.',
  },
  {
    id: 'nl2_3', noteId: 'NL2', noteTitle: 'Irmãos em Inglês',
    type: 'multiple_choice',
    question: '"Siblings" em inglês significa:',
    options: [
      'Apenas irmãos (masculino)',
      'Irmãos e irmãs (neutro)',
      'Primos e primas',
    ],
    correctAnswer: 'Irmãos e irmãs (neutro)',
    explanation: '"Siblings" é o termo neutro para todos os irmãos, independente do gênero.',
  },

  // NL3 — Artigo antes de Profissão
  {
    id: 'nl3_1', noteId: 'NL3', noteTitle: 'Artigo antes de Profissão',
    type: 'correction',
    question: 'Corrija a frase: "My father is engineer."',
    correctAnswer: 'My father is an engineer.',
    explanation: 'Em inglês, profissão sempre precisa de artigo indefinido (a/an) após o verbo "to be".',
    tip: '"An" antes de sons vocálicos: an engineer, an actor. "A" antes de consoantes: a doctor, a teacher.',
  },
  {
    id: 'nl3_2', noteId: 'NL3', noteTitle: 'Artigo antes de Profissão',
    type: 'fill_blank',
    question: 'Complete: "She wants to become ___ nurse."',
    correctAnswer: 'a',
    explanation: 'Profissão precisa de artigo. "Nurse" começa com consoante, então usa "a".',
  },
  {
    id: 'nl3_3', noteId: 'NL3', noteTitle: 'Artigo antes de Profissão',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'He is lawyer.',
      'He is the lawyer.',
      'He is a lawyer.',
    ],
    correctAnswer: 'He is a lawyer.',
    explanation: 'Com profissões após "to be", use artigo indefinido (a/an), não artigo definido (the).',
  },

  // NL4 — Gerúndio
  {
    id: 'nl4_1', noteId: 'NL4', noteTitle: 'Gerúndio após Verbos',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'I enjoy to swim.',
      'I enjoy swimming.',
      'I enjoy swim.',
    ],
    correctAnswer: 'I enjoy swimming.',
    explanation: '"Enjoy" sempre requer gerúndio (-ing). Nunca infinitivo com "to".',
    tip: 'Verbos que pedem gerúndio: enjoy, finish, stop, keep, mind, avoid, consider, suggest, practice',
  },
  {
    id: 'nl4_2', noteId: 'NL4', noteTitle: 'Gerúndio após Verbos',
    type: 'correction',
    question: 'Corrija: "She stopped to smoke." (com o sentido de: ela parou de fumar)',
    correctAnswer: 'She stopped smoking.',
    explanation: '"Stopped smoking" = parou de fumar. "Stopped to smoke" = parou (o que estava fazendo) PARA fumar. São sentidos completamente diferentes!',
  },
  {
    id: 'nl4_3', noteId: 'NL4', noteTitle: 'Gerúndio após Verbos',
    type: 'fill_blank',
    question: 'Complete: "Would you mind ___ (open) the window?"',
    correctAnswer: 'opening',
    explanation: '"Mind" sempre requer gerúndio. "Would you mind opening..." = Você se importaria de abrir...',
  },
  {
    id: 'nl4_4', noteId: 'NL4', noteTitle: 'Gerúndio após Verbos',
    type: 'multiple_choice',
    question: '"I avoid ___" — qual forma usar?',
    options: [
      'to eat fast food',
      'eating fast food',
      'eat fast food',
    ],
    correctAnswer: 'eating fast food',
    explanation: '"Avoid" sempre requer gerúndio (-ing).',
  },

  // NL5 — Preposições AT, IN, ON
  {
    id: 'nl5_1', noteId: 'NL5', noteTitle: 'Preposições AT, IN, ON',
    type: 'fill_blank',
    question: 'Complete: "She works ___ a hospital."',
    correctAnswer: 'at',
    explanation: 'Usamos AT para locais públicos/instituições onde trabalhamos ou visitamos. "At a hospital, at school, at the bank"',
  },
  {
    id: 'nl5_2', noteId: 'NL5', noteTitle: 'Preposições AT, IN, ON',
    type: 'multiple_choice',
    question: '"___ the morning, I go for a run." Qual preposição?',
    options: ['At', 'In', 'On'],
    correctAnswer: 'In',
    explanation: 'Partes do dia (morning, afternoon, evening) usam IN. Exceção: "at night" (à noite).',
  },
  {
    id: 'nl5_3', noteId: 'NL5', noteTitle: 'Preposições AT, IN, ON',
    type: 'multiple_choice',
    question: '"We met ___ a conference." Qual preposição?',
    options: ['at', 'in', 'on'],
    correctAnswer: 'at',
    explanation: 'Eventos (conferências, festas, reuniões) usam AT. "At a conference, at the party, at a meeting"',
  },
  {
    id: 'nl5_4', noteId: 'NL5', noteTitle: 'Preposições AT, IN, ON',
    type: 'fill_blank',
    question: 'Complete: "I\'ll see you ___ Monday."',
    correctAnswer: 'on',
    explanation: 'Dias da semana e datas específicas usam ON. "On Monday, on Christmas Day, on the 15th"',
  },
  {
    id: 'nl5_5', noteId: 'NL5', noteTitle: 'Preposições AT, IN, ON',
    type: 'multiple_choice',
    question: '"She was born ___ Brazil." Qual preposição?',
    options: ['at', 'in', 'on'],
    correctAnswer: 'in',
    explanation: 'Países, cidades e outros lugares geográficos usam IN. "In Brazil, in São Paulo, in Angola"',
  },

  // NL6 — You / You Guys
  {
    id: 'nl6_1', noteId: 'NL6', noteTitle: 'You / You Guys',
    type: 'translation',
    question: 'Traduza informalmente: "De onde vocês são?"',
    correctAnswer: 'Where are you guys from?',
    explanation: '"You guys" é a forma informal de plural. "You" pode ser singular ou plural, mas "you guys" deixa claro que é plural.',
  },
  {
    id: 'nl6_2', noteId: 'NL6', noteTitle: 'You / You Guys',
    type: 'multiple_choice',
    question: 'Como dizer "Vocês são incríveis!" informalmente?',
    options: [
      'All of you are amazing!',
      "You guys are amazing!",
      'You all guys are amazing!',
    ],
    correctAnswer: 'You guys are amazing!',
    explanation: '"You guys" é natural e informal para se referir a um grupo.',
  },

  // NL7 — Present Perfect
  {
    id: 'nl7_1', noteId: 'NL7', noteTitle: 'Present Perfect',
    type: 'translation',
    question: 'Traduza: "Faz muito tempo que não te vejo!"',
    correctAnswer: "It's been a long time since I've seen you! / Long time no see!",
    explanation: '"It\'s been" + período + "since" = faz [tempo] que...',
  },
  {
    id: 'nl7_2', noteId: 'NL7', noteTitle: 'Present Perfect',
    type: 'multiple_choice',
    question: '"Já comi aqui antes." Como se diz?',
    options: [
      'I already ate here before.',
      "I've eaten here before.",
      'I eat here before.',
    ],
    correctAnswer: "I've eaten here before.",
    explanation: 'Para experiências no passado sem tempo definido, use o Present Perfect (have + particípio).',
  },
  {
    id: 'nl7_3', noteId: 'NL7', noteTitle: 'Present Perfect',
    type: 'fill_blank',
    question: 'Complete: "___ been a while since we last talked."',
    correctAnswer: "It's",
    explanation: '"It\'s been a while" = Faz um tempo. A estrutura é: It has been + período.',
  },

  // NL8 — Particípio Passado
  {
    id: 'nl8_1', noteId: 'NL8', noteTitle: 'Particípio Passado',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'I have never went to Japan.',
      'I have never gone to Japan.',
      'I have never go to Japan.',
    ],
    correctAnswer: 'I have never gone to Japan.',
    explanation: '"Have/has" sempre pede o particípio passado (gone), nunca o passado simples (went).',
    tip: 'Particípios irregulares essenciais: be→been, go→gone, take→taken, give→given, see→seen, know→known.',
  },
  {
    id: 'nl8_2', noteId: 'NL8', noteTitle: 'Particípio Passado',
    type: 'correction',
    question: 'Corrija a frase: "She has already went to the meeting."',
    correctAnswer: 'She has already gone to the meeting.',
    explanation: 'Depois de "has", usa-se o particípio (gone), não o passado simples (went).',
  },
  {
    id: 'nl8_3', noteId: 'NL8', noteTitle: 'Particípio Passado',
    type: 'fill_blank',
    question: 'Complete: "Have you ever ___ (see) a ghost?"',
    correctAnswer: 'seen',
    explanation: 'Particípio de "see" é "seen". "Have you ever seen...?" pergunta sobre experiência de vida.',
  },

  // NL9 — Subjuntivo Condicional
  {
    id: 'nl9_1', noteId: 'NL9', noteTitle: 'Subjuntivo Condicional',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'If I am you, I would apologize.',
      'If I was you, I would apologize.',
      'If I were you, I would apologize.',
    ],
    correctAnswer: 'If I were you, I would apologize.',
    explanation: 'Em condições hipotéticas, o subjuntivo usa "were" para todas as pessoas, mesmo "I" e "he/she".',
    tip: '"If I were you..." é a forma clássica de dar conselhos em inglês.',
  },
  {
    id: 'nl9_2', noteId: 'NL9', noteTitle: 'Subjuntivo Condicional',
    type: 'correction',
    question: 'Corrija: "I wish I was taller."',
    correctAnswer: 'I wish I were taller.',
    explanation: '"Wish" + subjuntivo pede "were", mesmo com o sujeito "I".',
  },
  {
    id: 'nl9_3', noteId: 'NL9', noteTitle: 'Subjuntivo Condicional',
    type: 'fill_blank',
    question: 'Complete: "If she ___ (have) more time, she would travel more."',
    correctAnswer: 'had',
    explanation: 'Condição hipotética no presente: "if" + passado (had), resultado com "would".',
  },

  // NL10 — Forma Base do Verbo
  {
    id: 'nl10_1', noteId: 'NL10', noteTitle: 'Forma Base do Verbo',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'You should drinks more water.',
      'You should to drink more water.',
      'You should drink more water.',
    ],
    correctAnswer: 'You should drink more water.',
    explanation: 'Depois de modais (should, would, could, must, can), o verbo fica na forma base, sem "to" e sem -s.',
    tip: 'Modais + forma base: should go, could help, must finish, would like (exceção: "would like to").',
  },
  {
    id: 'nl10_2', noteId: 'NL10', noteTitle: 'Forma Base do Verbo',
    type: 'correction',
    question: 'Corrija: "She can speaks three languages."',
    correctAnswer: 'She can speak three languages.',
    explanation: 'Depois de "can", o verbo fica na forma base, sem -s, mesmo na 3ª pessoa.',
  },
  {
    id: 'nl10_3', noteId: 'NL10', noteTitle: 'Forma Base do Verbo',
    type: 'fill_blank',
    question: 'Complete: "We must ___ (finish) this by Friday."',
    correctAnswer: 'finish',
    explanation: 'Depois de "must", forma base do verbo, sem "to" e sem -s.',
  },

  // NL13 — Subjuntivo Presente
  {
    id: 'nl13_1', noteId: 'NL13', noteTitle: 'Subjuntivo Presente',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'I recommend that he goes early.',
      'I recommend that he go early.',
      'I recommend that he going early.',
    ],
    correctAnswer: 'I recommend that he go early.',
    explanation: 'Depois de "recommend/suggest/insist that", usa-se o subjuntivo presente: forma base, sem -s, mesmo na 3ª pessoa.',
    tip: 'Verbos que pedem subjuntivo presente: recommend, suggest, insist, demand, require + that.',
  },
  {
    id: 'nl13_2', noteId: 'NL13', noteTitle: 'Subjuntivo Presente',
    type: 'correction',
    question: 'Corrija: "The doctor suggested that she takes the medicine."',
    correctAnswer: 'The doctor suggested that she take the medicine.',
    explanation: 'Depois de "suggested that", forma base (take), não "takes".',
  },
  {
    id: 'nl13_3', noteId: 'NL13', noteTitle: 'Subjuntivo Presente',
    type: 'fill_blank',
    question: 'Complete: "It\'s important that he ___ (be) on time."',
    correctAnswer: 'be',
    explanation: 'Subjuntivo presente com "be": "It\'s important that he be..." (não "is").',
  },

  // NL11 — Comparativos
  {
    id: 'nl11_1', noteId: 'NL11', noteTitle: 'Comparativos',
    type: 'multiple_choice',
    question: 'Qual é o comparativo correto de "expensive"?',
    options: [
      'expensiver',
      'more expensive',
      'most expensive',
    ],
    correctAnswer: 'more expensive',
    explanation: '"Expensive" tem 3 sílabas → use "more". "This hotel is more expensive than that one."',
  },
  {
    id: 'nl11_2', noteId: 'NL11', noteTitle: 'Comparativos',
    type: 'correction',
    question: 'Corrija: "She is more tall than her sister."',
    correctAnswer: 'She is taller than her sister.',
    explanation: '"Tall" tem 1 sílaba → adiciona -er. Não use "more" com adjetivos curtos.',
  },
  {
    id: 'nl11_3', noteId: 'NL11', noteTitle: 'Comparativos',
    type: 'fill_blank',
    question: 'Complete com o superlativo: "This is the ___ (good) restaurant I\'ve ever been to."',
    correctAnswer: 'best',
    explanation: '"Good" tem superlativo irregular: good → better → the best.',
  },

  // NL12 — Títulos de Tratamento
  {
    id: 'nl12_1', noteId: 'NL12', noteTitle: 'Títulos de Tratamento',
    type: 'multiple_choice',
    question: 'Para uma mulher cujo estado civil você não sabe, qual título usar?',
    options: ['Mrs.', 'Miss', 'Ms.'],
    correctAnswer: 'Ms.',
    explanation: '"Ms." é o título neutro para mulheres quando o estado civil é desconhecido ou irrelevante.',
    tip: 'Mrs. = casada | Miss = jovem/solteira | Ms. = estado civil irrelevante',
  },
  {
    id: 'nl12_2', noteId: 'NL12', noteTitle: 'Títulos de Tratamento',
    type: 'correction',
    question: 'Corrija o uso: "Good morning, Mr. John."',
    correctAnswer: 'Good morning, Mr. Smith. (usar sobrenome)',
    explanation: 'Mr., Mrs., Ms. e Miss são SEMPRE seguidos do SOBRENOME, nunca do primeiro nome.',
  },

  // NL14 — Datas
  {
    id: 'nl14_1', noteId: 'NL14', noteTitle: 'Datas com Ordinais',
    type: 'multiple_choice',
    question: 'Como se diz "O dia 4 de julho"?',
    options: [
      'The 4 of July',
      'The 4th of July',
      'The fourth July',
    ],
    correctAnswer: 'The 4th of July',
    explanation: 'Datas usam números ordinais: 1st, 2nd, 3rd, 4th, 5th...',
  },
  {
    id: 'nl14_2', noteId: 'NL14', noteTitle: 'Datas com Ordinais',
    type: 'translation',
    question: 'Diga "Nasci no dia 15 de agosto."',
    correctAnswer: 'I was born on August 15th. / I was born on the 15th of August.',
    explanation: 'Use ordinal (15th) e preposição ON com datas específicas.',
  },

  // NL15 — "Please"
  {
    id: 'nl15_1', noteId: 'NL15', noteTitle: 'Posição de "Please"',
    type: 'multiple_choice',
    question: 'Como pedir a conta educadamente?',
    options: [
      'Please the check.',
      'The check, please.',
      'Please bring check.',
    ],
    correctAnswer: 'The check, please.',
    explanation: '"Please" no FINAL de pedido soa educado e natural. "Please" no início pode soar exigente.',
  },
  {
    id: 'nl15_2', noteId: 'NL15', noteTitle: 'Posição de "Please"',
    type: 'multiple_choice',
    question: 'Ao oferecer um assento para alguém, qual é o correto?',
    options: [
      'Have a seat, please.',
      'Please, have a seat.',
      'Sit please.',
    ],
    correctAnswer: 'Please, have a seat.',
    explanation: '"Please" no INÍCIO é usado quando você está OFERECENDO algo, não pedindo.',
  },

  // NL16 — Present Perfect vs Passado Simples
  {
    id: 'nl16_1', noteId: 'NL16', noteTitle: 'Present Perfect vs Passado Simples',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'Yesterday, I have finished my homework.',
      'Yesterday, I finished my homework.',
      'Yesterday, I have finish my homework.',
    ],
    correctAnswer: 'Yesterday, I finished my homework.',
    explanation: 'Com tempo específico e terminado no passado (yesterday), usa-se Passado Simples, nunca Present Perfect.',
    tip: 'Present Perfect é para experiências sem tempo definido; Passado Simples é para quando o "quando" é claro.',
  },
  {
    id: 'nl16_2', noteId: 'NL16', noteTitle: 'Present Perfect vs Passado Simples',
    type: 'correction',
    question: 'Corrija: "I have seen that movie last week."',
    correctAnswer: 'I saw that movie last week.',
    explanation: '"Last week" é um tempo específico e terminado — não combina com Present Perfect, use Passado Simples (saw).',
  },
  {
    id: 'nl16_3', noteId: 'NL16', noteTitle: 'Present Perfect vs Passado Simples',
    type: 'fill_blank',
    question: 'Complete: "I ___ (never / be) to Paris."',
    correctAnswer: 'have never been',
    explanation: 'Experiência de vida sem tempo definido usa Present Perfect: "have/has + particípio".',
  },

  // NL17 — Voz Passiva
  {
    id: 'nl17_1', noteId: 'NL17', noteTitle: 'Voz Passiva',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'The book read by millions of people.',
      'The book is read by millions of people.',
      'The book reads by millions of people.',
    ],
    correctAnswer: 'The book is read by millions of people.',
    explanation: 'Voz passiva = to be + particípio. "is read" é o presente passivo.',
    tip: 'Use voz passiva quando o foco está na ação ou em quem a recebe, não em quem a faz.',
  },
  {
    id: 'nl17_2', noteId: 'NL17', noteTitle: 'Voz Passiva',
    type: 'correction',
    question: 'Corrija: "The email was send yesterday."',
    correctAnswer: 'The email was sent yesterday.',
    explanation: 'O particípio de "send" é "sent", não "send". Voz passiva no passado: was/were + particípio.',
  },
  {
    id: 'nl17_3', noteId: 'NL17', noteTitle: 'Voz Passiva',
    type: 'fill_blank',
    question: 'Complete: "This house ___ (build) in 1990."',
    correctAnswer: 'was built',
    explanation: 'Voz passiva no passado: was + particípio (built).',
  },

  // NL18 — Phrasal Verbs Essenciais
  {
    id: 'nl18_1', noteId: 'NL18', noteTitle: 'Phrasal Verbs Essenciais',
    type: 'multiple_choice',
    question: '"I need to ___ my keys, I can\'t find them." Qual completa?',
    options: ['look for', 'look at', 'look up'],
    correctAnswer: 'look for',
    explanation: '"Look for" = procurar algo que se perdeu.',
    tip: 'Phrasal verbs essenciais: give up (desistir), look for (procurar), find out (descobrir), get along with (dar-se bem), run into (encontrar por acaso).',
  },
  {
    id: 'nl18_2', noteId: 'NL18', noteTitle: 'Phrasal Verbs Essenciais',
    type: 'multiple_choice',
    question: '"She decided to ___ smoking." Qual completa?',
    options: ['give up', 'give in', 'give away'],
    correctAnswer: 'give up',
    explanation: '"Give up" = desistir de algo / parar de fazer algo.',
  },
  {
    id: 'nl18_3', noteId: 'NL18', noteTitle: 'Phrasal Verbs Essenciais',
    type: 'fill_blank',
    question: 'Complete: "Can you ___ (descobrir) what time the store closes?"',
    correctAnswer: 'find out',
    explanation: '"Find out" = descobrir uma informação.',
  },

  // NL19 — Condicionais (If Clauses)
  {
    id: 'nl19_1', noteId: 'NL19', noteTitle: 'Condicionais (If Clauses)',
    type: 'multiple_choice',
    question: '"If it rains tomorrow, I ___ stay home." Qual completa?',
    options: ['would', 'will', 'am'],
    correctAnswer: 'will',
    explanation: 'Condicional tipo 1 (situação real/possível no futuro): if + presente, will + forma base.',
    tip: 'Tipo 1 = real (if + presente, will). Tipo 2 = hipotético (if + passado, would).',
  },
  {
    id: 'nl19_2', noteId: 'NL19', noteTitle: 'Condicionais (If Clauses)',
    type: 'correction',
    question: 'Corrija: "If I would have more money, I would travel."',
    correctAnswer: 'If I had more money, I would travel.',
    explanation: 'Condicional tipo 2 (hipotético) usa passado simples depois de "if" (had), nunca "would have" na parte do "if".',
  },
  {
    id: 'nl19_3', noteId: 'NL19', noteTitle: 'Condicionais (If Clauses)',
    type: 'fill_blank',
    question: 'Complete: "If she ___ (study) harder, she would pass the exam."',
    correctAnswer: 'studied',
    explanation: 'Condicional tipo 2: if + passado simples (studied), resultado com would.',
  },

  // NL20 — Contáveis e Incontáveis
  {
    id: 'nl20_1', noteId: 'NL20', noteTitle: 'Contáveis e Incontáveis',
    type: 'multiple_choice',
    question: '"How ___ money do you have?" Qual completa?',
    options: ['many', 'much', 'a lot'],
    correctAnswer: 'much',
    explanation: '"Money" é incontável — usa-se "much" em perguntas e negativas.',
    tip: 'Contáveis: many/a few (money, water e advice são incontáveis, cuidado!). Incontáveis: much/a little.',
  },
  {
    id: 'nl20_2', noteId: 'NL20', noteTitle: 'Contáveis e Incontáveis',
    type: 'correction',
    question: 'Corrija: "I have many money in my pocket."',
    correctAnswer: 'I have a lot of money in my pocket.',
    explanation: '"Money" é incontável — não usa "many" (para contáveis); use "much" ou "a lot of".',
  },
  {
    id: 'nl20_3', noteId: 'NL20', noteTitle: 'Contáveis e Incontáveis',
    type: 'fill_blank',
    question: 'Complete: "There aren\'t ___ apples left."',
    correctAnswer: 'many',
    explanation: '"Apples" é contável e está no plural — em negativas, usa-se "many".',
  },
  // NL21 — Present Continuous vs Simple Present
  {
    id: 'nl21_1', noteId: 'NL21', noteTitle: 'Present Continuous vs Simple Present',
    type: 'multiple_choice',
    question: 'Qual é correto? (Está a acontecer agora)',
    options: [
      'I work on a report right now.',
      "I'm working on a report right now.",
      'I working on a report right now.',
    ],
    correctAnswer: "I'm working on a report right now.",
    explanation: 'Ações acontecendo neste momento usam Present Continuous (to be + -ing), não Simple Present.',
    tip: 'Simple Present = hábitos/rotinas/factos. Present Continuous = agora, neste momento, algo temporário.',
  },
  {
    id: 'nl21_2', noteId: 'NL21', noteTitle: 'Present Continuous vs Simple Present',
    type: 'correction',
    question: 'Corrija: "I am knowing the answer."',
    correctAnswer: 'I know the answer.',
    explanation: 'Verbos de estado (know, like, want, believe, need, love) normalmente NÃO usam -ing, mesmo falando do presente.',
  },
  {
    id: 'nl21_3', noteId: 'NL21', noteTitle: 'Present Continuous vs Simple Present',
    type: 'fill_blank',
    question: 'Complete: "She usually ___ (drive) to work, but today she ___ (walk)."',
    correctAnswer: 'drives / is walking',
    explanation: '"Usually" pede rotina (Simple Present: drives). "Today" pede algo pontual/atual (Present Continuous: is walking).',
  },

  // NL22 — Artigos (a / an / the / sem artigo)
  {
    id: 'nl22_1', noteId: 'NL22', noteTitle: 'Artigos: A, AN, THE ou nenhum',
    type: 'multiple_choice',
    question: 'Qual é correto?',
    options: [
      'I love the music.',
      'I love music.',
      'I love a music.',
    ],
    correctAnswer: 'I love music.',
    explanation: 'Falando de algo em geral (música em geral, não uma música específica), não se usa artigo nenhum.',
    tip: 'THE = algo específico/já mencionado. A/AN = um exemplo qualquer (contável singular). Sem artigo = generalizações e incontáveis.',
  },
  {
    id: 'nl22_2', noteId: 'NL22', noteTitle: 'Artigos: A, AN, THE ou nenhum',
    type: 'correction',
    question: 'Corrija: "I saw a movie last night. A movie was amazing."',
    correctAnswer: 'I saw a movie last night. The movie was amazing.',
    explanation: 'Na segunda menção, já sabemos qual filme é (específico) — usa-se THE, não A.',
  },
  {
    id: 'nl22_3', noteId: 'NL22', noteTitle: 'Artigos: A, AN, THE ou nenhum',
    type: 'fill_blank',
    question: 'Complete: "___ Amazon river is in Brazil." (nome de rio)',
    correctAnswer: 'The',
    explanation: 'Rios, oceanos, cordilheiras e países no plural usam THE: the Amazon, the Pacific, the Andes, the Netherlands.',
  },

  // NL23 — Question Tags
  {
    id: 'nl23_1', noteId: 'NL23', noteTitle: 'Question Tags',
    type: 'multiple_choice',
    question: 'Complete: "You speak English, ___?"',
    options: ["don't you", "isn't it", "aren't you"],
    correctAnswer: "don't you",
    explanation: 'Frase afirmativa com verbo comum (speak) → question tag negativa com o auxiliar correspondente (do → don\'t).',
    tip: 'Afirmativa → tag negativa. Negativa → tag afirmativa. O auxiliar da tag "copia" o tempo verbal da frase.',
  },
  {
    id: 'nl23_2', noteId: 'NL23', noteTitle: 'Question Tags',
    type: 'correction',
    question: 'Corrija: "She isn\'t coming, is it?"',
    correctAnswer: "She isn't coming, is she?",
    explanation: 'A tag deve concordar com o sujeito da frase (she), não usar "it" genérico.',
  },
  {
    id: 'nl23_3', noteId: 'NL23', noteTitle: 'Question Tags',
    type: 'fill_blank',
    question: 'Complete: "They have finished the project, ___ they?"',
    correctAnswer: "haven't",
    explanation: 'Frase afirmativa no Present Perfect (have finished) → tag negativa com "haven\'t".',
  },

  // NL24 — Discurso Indireto (Reported Speech)
  {
    id: 'nl24_1', noteId: 'NL24', noteTitle: 'Discurso Indireto',
    type: 'multiple_choice',
    question: 'Ele disse: "I am tired." Como relatar isso?',
    options: [
      'He said that I am tired.',
      'He said that he was tired.',
      'He said that he is tired.',
    ],
    correctAnswer: 'He said that he was tired.',
    explanation: 'No discurso indireto, o tempo verbal geralmente "recua" um passo: presente (am) → passado (was). O pronome também muda (I → he).',
    tip: 'Recuo verbal: present → past, past → past perfect, will → would, can → could.',
  },
  {
    id: 'nl24_2', noteId: 'NL24', noteTitle: 'Discurso Indireto',
    type: 'correction',
    question: 'Corrija: "She told me that she will call me later." (relatado bem depois)',
    correctAnswer: 'She told me that she would call me later.',
    explanation: 'No discurso indireto, "will" recua para "would".',
  },
  {
    id: 'nl24_3', noteId: 'NL24', noteTitle: 'Discurso Indireto',
    type: 'fill_blank',
    question: 'Ele perguntou: "Where do you live?" → He asked me where ___.',
    correctAnswer: 'I lived',
    explanation: 'Em pergunta indireta relatada: ordem normal (sujeito + verbo) e o verbo recua (do live → lived).',
  },

  // NL25 — Modais de Probabilidade
  {
    id: 'nl25_1', noteId: 'NL25', noteTitle: 'Modais de Probabilidade',
    type: 'multiple_choice',
    question: 'A luz está acesa. Ele provavelmente está em casa. Qual frase expressa isso melhor?',
    options: [
      'He can be at home.',
      'He must be at home.',
      'He must to be at home.',
    ],
    correctAnswer: 'He must be at home.',
    explanation: '"Must" expressa uma conclusão lógica quase certa a partir de evidências. "Must + forma base", sem "to".',
    tip: 'must (quase certeza) > might/could (possibilidade) > can\'t (quase certeza de que não).',
  },
  {
    id: 'nl25_2', noteId: 'NL25', noteTitle: 'Modais de Probabilidade',
    type: 'correction',
    question: 'Corrija: "She might comes to the party."',
    correctAnswer: 'She might come to the party.',
    explanation: 'Depois de modais (might, could, must, can), o verbo fica na forma base, sem -s.',
  },
  {
    id: 'nl25_3', noteId: 'NL25', noteTitle: 'Modais de Probabilidade',
    type: 'fill_blank',
    question: 'Ele mora num apartamento pequeno. Não é possível que seja rico. "He ___ be rich."',
    correctAnswer: "can't",
    explanation: '"Can\'t" expressa quase certeza NEGATIVA — que algo é impossível dado o contexto.',
  },

  // NL26 — Used To / Would (hábitos passados)
  {
    id: 'nl26_1', noteId: 'NL26', noteTitle: 'Used To / Would',
    type: 'multiple_choice',
    question: 'Qual é correto para descrever um hábito antigo que não existe mais?',
    options: [
      'I used to play soccer every weekend.',
      'I use to play soccer every weekend.',
      'I am used to play soccer every weekend.',
    ],
    correctAnswer: 'I used to play soccer every weekend.',
    explanation: '"Used to + forma base" descreve hábitos ou estados do passado que já terminaram.',
    tip: 'Não confunda "used to" (hábito passado) com "be used to" (estar acostumado a algo).',
  },
  {
    id: 'nl26_2', noteId: 'NL26', noteTitle: 'Used To / Would',
    type: 'correction',
    question: 'Corrija: "When I was a kid, I would have a bicycle."',
    correctAnswer: 'When I was a kid, I used to have a bicycle.',
    explanation: '"Would" só funciona para AÇÕES repetidas no passado, não para ESTADOS (have, be, like). Para estados, use "used to".',
  },
  {
    id: 'nl26_3', noteId: 'NL26', noteTitle: 'Used To / Would',
    type: 'fill_blank',
    question: 'Complete: "Every summer, we ___ (go) to my grandparents\' house." (ação repetida no passado)',
    correctAnswer: 'would go / used to go',
    explanation: 'Para ações repetidas no passado, "would" e "used to" são intercambiáveis.',
  },

  // NL27 — Ordem dos Adjetivos
  {
    id: 'nl27_1', noteId: 'NL27', noteTitle: 'Ordem dos Adjetivos',
    type: 'multiple_choice',
    question: 'Qual é a ordem correta?',
    options: [
      'a red big house',
      'a big red house',
      'a house big red',
    ],
    correctAnswer: 'a big red house',
    explanation: 'Ordem dos adjetivos em inglês: opinião, tamanho, idade, forma, cor, origem, material + substantivo. Tamanho (big) vem antes de cor (red).',
    tip: 'Regra prática: Opinion-Size-Age-Shape-Color-Origin-Material (OSASCOM).',
  },
  {
    id: 'nl27_2', noteId: 'NL27', noteTitle: 'Ordem dos Adjetivos',
    type: 'correction',
    question: 'Corrija: "She bought a wooden beautiful old table."',
    correctAnswer: 'She bought a beautiful old wooden table.',
    explanation: 'Ordem correta: opinião (beautiful) → idade (old) → material (wooden) + substantivo.',
  },
  {
    id: 'nl27_3', noteId: 'NL27', noteTitle: 'Ordem dos Adjetivos',
    type: 'fill_blank',
    question: 'Complete na ordem certa: "I bought ___ ___ ___ car." (small / new / red)',
    correctAnswer: 'a nice small new red car / a small new red car',
    explanation: 'Tamanho antes de cor: "a small new red car" segue a ordem tamanho → idade → cor.',
  },

  // NL28 — Orações Relativas (who / which / that / whose)
  {
    id: 'nl28_1', noteId: 'NL28', noteTitle: 'Orações Relativas',
    type: 'multiple_choice',
    question: 'Qual pronome relativo é correto? "The man ___ called you is my brother."',
    options: ['which', 'who', 'whose'],
    correctAnswer: 'who',
    explanation: '"Who" refere-se a pessoas. "Which" refere-se a coisas/animais. "Whose" indica posse.',
    tip: 'WHO (pessoas) | WHICH (coisas) | THAT (pessoas ou coisas, informal) | WHOSE (posse)',
  },
  {
    id: 'nl28_2', noteId: 'NL28', noteTitle: 'Orações Relativas',
    type: 'correction',
    question: 'Corrija: "This is the book who changed my life."',
    correctAnswer: 'This is the book that/which changed my life.',
    explanation: '"Book" é uma coisa, não uma pessoa — use "that" ou "which", nunca "who".',
  },
  {
    id: 'nl28_3', noteId: 'NL28', noteTitle: 'Orações Relativas',
    type: 'fill_blank',
    question: 'Complete: "That\'s the woman ___ car was stolen." (indicando posse)',
    correctAnswer: 'whose',
    explanation: '"Whose" indica posse: "a mulher CUJO carro foi roubado".',
  },

  // NL29 — Falsos Cognatos (False Friends)
  {
    id: 'nl29_1', noteId: 'NL29', noteTitle: 'Falsos Cognatos',
    type: 'multiple_choice',
    question: 'Como se diz "Eu pretendo viajar ano que vem" (no sentido de "planejo")?',
    options: [
      'I pretend to travel next year.',
      'I intend to travel next year.',
      'I pretender to travel next year.',
    ],
    correctAnswer: 'I intend to travel next year.',
    explanation: '"Pretend" significa FINGIR, não "pretender/planejar". Para planos, use "intend" ou "plan to".',
    tip: 'Falsos amigos comuns: pretend≠pretender(fingir), actually≠atualmente(na verdade), parents≠parentes(pais), college≠colégio(faculdade), pull≠pular(puxar).',
  },
  {
    id: 'nl29_2', noteId: 'NL29', noteTitle: 'Falsos Cognatos',
    type: 'correction',
    question: 'Corrija: "Actually, I live in São Paulo." (querendo dizer "Atualmente")',
    correctAnswer: 'Currently, I live in São Paulo.',
    explanation: '"Actually" significa "na verdade" (para corrigir/esclarecer algo), não "atualmente". "Atualmente" = currently / nowadays.',
  },
  {
    id: 'nl29_3', noteId: 'NL29', noteTitle: 'Falsos Cognatos',
    type: 'fill_blank',
    question: 'Complete corretamente: "My ___ are coming to visit for the holidays." (meus PAIS)',
    correctAnswer: 'parents',
    explanation: '"Parents" = pais (mãe e pai). "Relatives" = parentes em geral. Não confunda!',
  },

  // NL30 — Terceiro Condicional
  {
    id: 'nl30_1', noteId: 'NL30', noteTitle: 'Terceiro Condicional',
    type: 'multiple_choice',
    question: 'Qual é correto para falar de uma situação hipotética no PASSADO que não aconteceu?',
    options: [
      'If I studied harder, I would pass the exam.',
      'If I had studied harder, I would have passed the exam.',
      'If I would study harder, I would pass the exam.',
    ],
    correctAnswer: 'If I had studied harder, I would have passed the exam.',
    explanation: 'Terceiro condicional (arrependimento/situação impossível no passado): if + had + particípio, would have + particípio.',
    tip: 'Type 3 = passado que não pode mudar. "If I had known, I would have called you" (mas eu não sabia, então não liguei).',
  },
  {
    id: 'nl30_2', noteId: 'NL30', noteTitle: 'Terceiro Condicional',
    type: 'correction',
    question: 'Corrija: "If she would have known, she would have come."',
    correctAnswer: 'If she had known, she would have come.',
    explanation: 'A parte do "if" no terceiro condicional nunca usa "would have" — usa "had + particípio".',
  },
  {
    id: 'nl30_3', noteId: 'NL30', noteTitle: 'Terceiro Condicional',
    type: 'fill_blank',
    question: 'Complete: "If I ___ (know) about the traffic, I would have left earlier."',
    correctAnswer: 'had known',
    explanation: 'Terceiro condicional: if + had + particípio (had known), resultado com would have + particípio.',
  },
];

export const GRAMMAR_NOTES: { id: string; title: string; icon: string; description: string; level: CEFRLevel }[] = [
  { id: 'NL1', title: 'Pergunta Embutida', icon: '❓', description: 'Como fazer perguntas indiretas sem inverter o sujeito e o verbo', level: 'B1' },
  { id: 'NL2', title: 'Irmãos em Inglês', icon: '👨‍👩‍👧', description: 'Por que "brothers" nem sempre funciona para irmãos e irmãs', level: 'A1' },
  { id: 'NL3', title: 'Artigo + Profissão', icon: '👨‍💼', description: 'Por que precisamos de "a/an" antes de profissões', level: 'A1' },
  { id: 'NL4', title: 'Gerúndio', icon: '🎭', description: 'Verbos que exigem -ing depois deles (enjoy, stop, avoid...)', level: 'A2' },
  { id: 'NL5', title: 'AT, IN, ON', icon: '📍', description: 'As três preposições de lugar e tempo mais usadas do inglês', level: 'A1' },
  { id: 'NL6', title: 'You / You Guys', icon: '👥', description: 'Como distinguir "você" e "vocês" em inglês', level: 'A1' },
  { id: 'NL7', title: 'Present Perfect', icon: '⏰', description: 'Como dizer que "faz tempo que" em inglês', level: 'A2' },
  { id: 'NL8', title: 'Particípio Passado', icon: '📚', description: 'As formas irregulares essenciais do inglês', level: 'A2' },
  { id: 'NL9', title: 'Subjuntivo Condicional', icon: '🤔', description: 'Usando o passado para condições hipotéticas', level: 'B1' },
  { id: 'NL10', title: 'Forma Base do Verbo', icon: '⚡', description: 'Verbos após modais (would, could, should) sem "to"', level: 'A2' },
  { id: 'NL11', title: 'Comparativos', icon: '📊', description: 'Como comparar coisas em inglês (-er vs. more)', level: 'A2' },
  { id: 'NL12', title: 'Títulos (Mr/Mrs/Ms)', icon: '🎩', description: 'O uso correto dos títulos de tratamento', level: 'A1' },
  { id: 'NL13', title: 'Subjuntivo Presente', icon: '💡', description: 'Construção "I recommend that he go" (sem -s)', level: 'B2' },
  { id: 'NL14', title: 'Datas com Ordinais', icon: '📅', description: 'Por que usamos 4th, 15th etc. em datas', level: 'A1' },
  { id: 'NL15', title: 'Posição de "Please"', icon: '🙏', description: 'Onde colocar "please" para soar educado, não exigente', level: 'A1' },
  { id: 'NL16', title: 'Present Perfect vs Passado Simples', icon: '⏳', description: 'Quando usar "have done" vs "did" — o maior ponto de confusão para lusófonos', level: 'B1' },
  { id: 'NL17', title: 'Voz Passiva', icon: '🔄', description: 'Estrutura "to be + particípio" — quando o foco é a ação, não quem a faz', level: 'B1' },
  { id: 'NL18', title: 'Phrasal Verbs Essenciais', icon: '🧩', description: 'Verbo + preposição que muda completamente o significado (give up, look for...)', level: 'B1' },
  { id: 'NL19', title: 'Condicionais (If Clauses)', icon: '🔀', description: 'Type 1 (real/futuro) vs Type 2 (hipotético) — vai além do NL9', level: 'B1' },
  { id: 'NL20', title: 'Contáveis e Incontáveis', icon: '🔢', description: '"much/many", "a lot of", "some/any" — quando usar cada um', level: 'A2' },
  { id: 'NL21', title: 'Present Continuous vs Simple Present', icon: '🎬', description: 'Ação agora (-ing) vs hábito/rotina — outro grande ponto de confusão', level: 'A1' },
  { id: 'NL22', title: 'Artigos: A, AN, THE', icon: '🔤', description: 'Quando usar artigo indefinido, definido ou nenhum artigo', level: 'A2' },
  { id: 'NL23', title: 'Question Tags', icon: '❔', description: 'As perguntinhas no fim da frase: "..., isn\'t it?" "..., don\'t you?"', level: 'B1' },
  { id: 'NL24', title: 'Discurso Indireto', icon: '🗨️', description: 'Como relatar o que alguém disse, com o recuo dos tempos verbais', level: 'B2' },
  { id: 'NL25', title: 'Modais de Probabilidade', icon: '🎲', description: 'must, might, could, can\'t — expressando certeza e possibilidade', level: 'B2' },
  { id: 'NL26', title: 'Used To / Would', icon: '🕰️', description: 'Como falar de hábitos e estados do passado que já acabaram', level: 'B1' },
  { id: 'NL27', title: 'Ordem dos Adjetivos', icon: '🎨', description: 'Por que dizemos "a big red house" e não "a red big house"', level: 'B1' },
  { id: 'NL28', title: 'Orações Relativas', icon: '🔗', description: 'who, which, that, whose — conectando ideias sobre pessoas e coisas', level: 'B2' },
  { id: 'NL29', title: 'Falsos Cognatos', icon: '⚠️', description: 'Palavras traiçoeiras: pretend, actually, parents, college...', level: 'B1' },
  { id: 'NL30', title: 'Terceiro Condicional', icon: '⏮️', description: 'Falando de arrependimentos: "If I had known, I would have..."', level: 'C1' },
];
