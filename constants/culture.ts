import { CEFRLevel } from '../types';

export type CultureType = 'idiom' | 'slang' | 'movie' | 'music';

export interface CultureNugget {
  id: string;
  type: CultureType;
  level: CEFRLevel;
  phrase: string;
  source?: string; // filme/artista/contexto de origem
  translation: string;
  explanation: string;
}

export const CULTURE_TYPE_LABELS: Record<CultureType, { title: string; emoji: string; color: string }> = {
  idiom: { title: 'Expressões Idiomáticas', emoji: '💡', color: '#E8A94C' },
  slang: { title: 'Gírias Modernas', emoji: '🔥', color: '#EC4899' },
  movie: { title: 'Frases de Filmes', emoji: '🎬', color: '#5FA8D3' },
  music: { title: 'Música', emoji: '🎵', color: '#6FCF97' },
};

export const CULTURE_NUGGETS: CultureNugget[] = [
  // === EXPRESSÕES IDIOMÁTICAS ===
  { id: 'idm1', type: 'idiom', level: 'A1', phrase: 'Piece of cake', translation: 'Moleza / Muito fácil', explanation: 'Usado para dizer que algo foi extremamente fácil de fazer. "The test was a piece of cake."' },
  { id: 'idm2', type: 'idiom', level: 'A2', phrase: 'Break a leg', translation: 'Boa sorte!', explanation: 'Forma tradicional de desejar boa sorte antes de uma apresentação ou evento importante — nunca literal.' },
  { id: 'idm3', type: 'idiom', level: 'A2', phrase: 'Hit the sack', translation: 'Ir dormir', explanation: '"I\'m so tired, I\'m going to hit the sack." — forma informal e comum de dizer que vai deitar-se.' },
  { id: 'idm4', type: 'idiom', level: 'A2', phrase: 'My bad', translation: 'Foi mal / Culpa minha', explanation: 'Forma curta e informal de assumir um erro pequeno, muito usada entre amigos.' },
  { id: 'idm5', type: 'idiom', level: 'B1', phrase: 'Cost an arm and a leg', translation: 'Custar os olhos da cara', explanation: 'Usado quando algo é extremamente caro. "That new phone cost me an arm and a leg."' },
  { id: 'idm6', type: 'idiom', level: 'B1', phrase: 'Once in a blue moon', translation: 'Muito raramente', explanation: 'Descreve algo que acontece muito raramente. "I only eat fast food once in a blue moon."' },
  { id: 'idm7', type: 'idiom', level: 'B1', phrase: 'Under the weather', translation: 'Um pouco doente / em baixo', explanation: '"I\'m feeling a bit under the weather today" — forma suave de dizer que não se sente bem.' },
  { id: 'idm8', type: 'idiom', level: 'B1', phrase: 'Spill the beans', translation: 'Contar um segredo', explanation: 'Revelar informação secreta, geralmente sem querer ou antes da hora. "Who spilled the beans about the party?"' },
  { id: 'idm9', type: 'idiom', level: 'B1', phrase: 'Actions speak louder than words', translation: 'As ações falam mais alto que as palavras', explanation: 'Provérbio clássico — o que fazes importa mais do que o que dizes.' },
  { id: 'idm10', type: 'idiom', level: 'B2', phrase: 'Let the cat out of the bag', translation: 'Deixar escapar um segredo', explanation: 'Muito parecido com "spill the beans", mas com ênfase em ser um deslize acidental.' },
  { id: 'idm11', type: 'idiom', level: 'B2', phrase: 'Bite the bullet', translation: 'Encarar a situação / Aguentar firme', explanation: "Decidir enfrentar algo difícil ou desconfortável em vez de o evitar. \"I hate the dentist, but I'll just bite the bullet.\"" },
  { id: 'idm12', type: 'idiom', level: 'B2', phrase: 'The ball is in your court', translation: 'A decisão agora é tua', explanation: 'Usado quando é a vez de outra pessoa agir ou decidir depois de tu já teres feito a tua parte.' },
  { id: 'idm13', type: 'idiom', level: 'B2', phrase: 'Beat around the bush', translation: 'Enrolar / Não ir direto ao assunto', explanation: '"Stop beating around the bush and tell me what happened." — evitar dizer algo diretamente.' },
  { id: 'idm14', type: 'idiom', level: 'B2', phrase: 'Hit the nail on the head', translation: 'Acertar em cheio', explanation: 'Descrever ou identificar algo com exatidão perfeita. "You hit the nail on the head with that explanation."' },

  // === GÍRIAS MODERNAS ===
  { id: 'sl1', type: 'slang', level: 'A2', phrase: 'Chill out', translation: 'Relaxa / Acalma-te', explanation: 'Pedido informal para alguém se acalmar ou não se preocupar tanto.' },
  { id: 'sl2', type: 'slang', level: 'B1', phrase: "That's lit!", translation: 'Isso é incrível!', explanation: 'Gíria para dizer que algo está muito bom, animado ou divertido — comum em festas e eventos.' },
  { id: 'sl3', type: 'slang', level: 'B1', phrase: 'No cap', translation: 'Sem mentira / A sério', explanation: 'Usado para enfatizar que estás a dizer a verdade. "This is the best pizza in town, no cap."' },
  { id: 'sl4', type: 'slang', level: 'B1', phrase: "I'm dead 💀", translation: 'Morri de rir', explanation: 'Reação exagerada e informal a algo extremamente engraçado — muito usada em mensagens de texto.' },
  { id: 'sl5', type: 'slang', level: 'B2', phrase: 'Ghosting someone', translation: 'Desaparecer sem explicação de alguém', explanation: 'Cortar contacto com alguém repentinamente e sem aviso, sobretudo em relações ou conversas online.' },
  { id: 'sl6', type: 'slang', level: 'B2', phrase: 'Salty', translation: 'Ressentido(a) / Chateado(a) à toa', explanation: '"Why are you so salty about losing a board game?" — irritação ou ressentimento por algo pequeno.' },
  { id: 'sl7', type: 'slang', level: 'B2', phrase: 'Extra', translation: 'Exagerado(a) / Dramático(a)', explanation: 'Descreve alguém que reage de forma exagerada ou chama demasiada atenção. "He\'s so extra about everything."' },
  { id: 'sl8', type: 'slang', level: 'B2', phrase: 'Low-key / High-key', translation: 'Discretamente / Abertamente', explanation: '"Low-key" = secretamente/um pouco. "High-key" = abertamente/muito. "I low-key love this song."' },

  // === FRASES DE FILMES ===
  { id: 'mv1', type: 'movie', level: 'A1', phrase: 'To infinity and beyond!', source: 'Toy Story', translation: 'Até ao infinito e mais além!', explanation: 'A preposição "to" indica destino/direção, "beyond" significa "além de". Estrutura simples e muito citada.' },
  { id: 'mv2', type: 'movie', level: 'A2', phrase: "I'll be back.", source: 'O Exterminador Implacável', translation: 'Eu vou voltar.', explanation: 'Futuro simples com "will" contraído ("I\'ll"). Uma das frases mais imitadas do cinema.' },
  { id: 'mv3', type: 'movie', level: 'A2', phrase: 'Life is like a box of chocolates.', source: 'Forrest Gump', translation: 'A vida é como uma caixa de chocolates.', explanation: 'Símile usando "like" para comparar duas coisas — "A é como B".' },
  { id: 'mv4', type: 'movie', level: 'B1', phrase: 'Houston, we have a problem.', source: 'Apollo 13', translation: 'Houston, temos um problema.', explanation: 'Tornou-se expressão idiomática do dia a dia para anunciar qualquer problema, mesmo fora do contexto espacial.' },
  { id: 'mv5', type: 'movie', level: 'B1', phrase: "You can't handle the truth!", source: 'Poucas Palavras', translation: 'Você não aguenta a verdade!', explanation: '"Can\'t" + "handle" (aguentar/lidar com) — modal de capacidade na negativa.' },
  { id: 'mv6', type: 'movie', level: 'B1', phrase: 'May the Force be with you.', source: 'Star Wars', translation: 'Que a Força esteja contigo.', explanation: '"May" + sujeito + verbo é uma estrutura formal para desejos e bênçãos — bem diferente do "may" de possibilidade.' },
  { id: 'mv7', type: 'movie', level: 'B2', phrase: "Here's looking at you, kid.", source: 'Casablanca', translation: 'Aos teus olhos, querida.', explanation: 'Expressão idiomática de brinde/despedida afetuosa — não se traduz literalmente palavra por palavra.' },
  { id: 'mv8', type: 'movie', level: 'B2', phrase: 'With great power comes great responsibility.', source: 'Homem-Aranha', translation: 'Com grande poder vem grande responsabilidade.', explanation: 'Estrutura paralela e inversão ("comes" antes do sujeito "great responsibility") para dar ênfase poética.' },

  // === MÚSICA ===
  { id: 'mu1', type: 'music', level: 'A1', phrase: 'What a Wonderful World', source: 'Louis Armstrong', translation: 'Que Mundo Maravilhoso', explanation: 'Estrutura de exclamação "What a + adjetivo + substantivo!" para expressar admiração.' },
  { id: 'mu2', type: 'music', level: 'A1', phrase: "Don't Worry, Be Happy", source: 'Bobby McFerrin', translation: 'Não te Preocupes, Sê Feliz', explanation: 'Dois imperativos seguidos — forma direta de dar um conselho ou instrução em inglês.' },
  { id: 'mu3', type: 'music', level: 'A1', phrase: 'We Are the Champions', source: 'Queen', translation: 'Nós Somos os Campeões', explanation: 'Presente simples usado para afirmar uma identidade ou estado permanente com orgulho.' },
  { id: 'mu4', type: 'music', level: 'A2', phrase: 'I Will Survive', source: 'Gloria Gaynor', translation: 'Eu Vou Sobreviver', explanation: 'Futuro simples com "will" para expressar determinação e resiliência.' },
  { id: 'mu5', type: 'music', level: 'A2', phrase: 'Here Comes the Sun', source: 'The Beatles', translation: 'Aqui Vem o Sol', explanation: 'Inversão poética: "here comes + sujeito" em vez de "the sun comes here" — comum em títulos e anúncios.' },
  { id: 'mu6', type: 'music', level: 'A2', phrase: 'Imagine', source: 'John Lennon', translation: 'Imagina', explanation: 'Imperativo simples usado para convidar o ouvinte a visualizar algo — uma das formas mais diretas de pedir algo em inglês.' },
  { id: 'mu7', type: 'music', level: 'B1', phrase: "Don't Stop Believin'", source: 'Journey', translation: 'Não Pares de Acreditar', explanation: '"Believin\'" é a forma informal/cantada de "believing" — comum em letras de música, mas evita-se na escrita formal.' },
  { id: 'mu8', type: 'music', level: 'B1', phrase: 'Bridge Over Troubled Water', source: 'Simon & Garfunkel', translation: 'Ponte Sobre Águas Turbulentas', explanation: 'Metáfora com substantivo composto ("troubled water") — "troubled" descreve algo agitado/difícil, não só a água.' },
];
