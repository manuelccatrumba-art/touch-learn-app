import { CEFRLevel } from '../types';

export type CultureType = 'idiom' | 'slang' | 'movie' | 'music' | 'pronunciation' | 'usage';

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
  pronunciation: { title: 'Pronúncia', emoji: '👄', color: '#F87171' },
  usage: { title: 'Americano vs Britânico', emoji: '🌎', color: '#A78BFA' },
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

  // === PRONÚNCIA — pares mínimos e erros comuns de lusófonos ===
  { id: 'pr1', type: 'pronunciation', level: 'A1', phrase: 'Think vs Sink', translation: 'Pensar vs Afundar', explanation: 'O som "th" /θ/ não existe em português — a língua toca de leve nos dentes da frente. Trocar por "s" muda a palavra completamente. Toca em "ouvir" e repete devagar.' },
  { id: 'pr2', type: 'pronunciation', level: 'A2', phrase: 'Ship vs Sheep', translation: 'Navio vs Ovelha', explanation: 'Vogal curta /ɪ/ em "ship" vs vogal longa /iː/ em "sheep". Para lusófonos ambas soam como "i", mas em inglês a duração da vogal muda o significado.' },
  { id: 'pr3', type: 'pronunciation', level: 'A2', phrase: 'Live vs Leave', translation: 'Viver/Morar vs Partir', explanation: 'O mesmo padrão de "ship/sheep": vogal curta vs vogal longa. "I live here" (moro aqui) e "I leave now" (parto agora) parecem iguais mas não são.' },
  { id: 'pr4', type: 'pronunciation', level: 'A2', phrase: 'Very vs Berry', translation: 'Muito vs Baga (fruta)', explanation: 'O som /v/ em inglês usa os dentes de cima a tocar o lábio inferior; em português muitas vezes soa como "b". Sente a vibração dos dentes ao dizer "very".' },
  { id: 'pr5', type: 'pronunciation', level: 'A2', phrase: 'Right vs Light', translation: 'Direita vs Luz', explanation: 'O "r" inglês não vibra como em português — a língua não toca em lado nenhum. O "l" é mais suave, com a ponta da língua atrás dos dentes. Trocar os dois é um erro clássico de lusófonos.' },
  { id: 'pr6', type: 'pronunciation', level: 'B1', phrase: 'Work vs Walk', translation: 'Trabalhar vs Caminhar', explanation: 'O "r" de "work" curva a língua para trás (som retroflexo); "walk" não tem esse "r" — o "l" é seguido de um "w" quase mudo. Sons e significados completamente diferentes.' },
  { id: 'pr7', type: 'pronunciation', level: 'B1', phrase: 'World vs Word', translation: 'Mundo vs Palavra', explanation: '"World" tem um "l" antes do "d" que se sente na língua; "word" não tem esse "l". Duas palavras muito confundidas por lusófonos ao ouvir.' },
  { id: 'pr8', type: 'pronunciation', level: 'B1', phrase: 'Comfortable', translation: 'Confortável', explanation: 'Pronuncia-se "KUMF-ta-bul" (só 3 sílabas faladas), não "com-for-ta-ble" letra por letra — um dos erros mais comuns de lusófonos por seguirem a escrita em vez do som.' },
  { id: 'pr9', type: 'pronunciation', level: 'B1', phrase: 'The Silent H: hour, honest', translation: 'A hora / Honesto', explanation: 'Em palavras como "hour" e "honest", o "h" é mudo — soa como se começasse por vogal. Por isso dizemos "an hour" (não "a hour") e "an honest man".' },
  { id: 'pr10', type: 'pronunciation', level: 'B2', phrase: 'PREsent (noun) vs preSENT (verb)', translation: 'Presente (substantivo) vs Apresentar (verbo)', explanation: 'Muitos pares palavra mudam de significado só pela sílaba tónica: substantivo tem ênfase na 1ª sílaba, verbo na 2ª. Não existe algo assim em português — treina ouvir a diferença.' },

  // === AMERICANO vs BRITÂNICO ===
  { id: 'us1', type: 'usage', level: 'A1', phrase: 'Elevator (AmE) vs Lift (BrE)', translation: 'Elevador', explanation: 'Duas palavras completamente diferentes para a mesma coisa. Inglês americano usa "elevator"; inglês britânico usa "lift".' },
  { id: 'us2', type: 'usage', level: 'A1', phrase: 'Apartment (AmE) vs Flat (BrE)', translation: 'Apartamento', explanation: 'Nos EUA diz-se "apartment"; no Reino Unido diz-se "flat". Ambas corretas, dependem de qual inglês estás a aprender/usar.' },
  { id: 'us3', type: 'usage', level: 'A1', phrase: 'Color (AmE) vs Colour (BrE)', translation: 'Cor', explanation: 'A ortografia muda: o inglês americano remove o "u" em várias palavras (color, favorite, organize) que o britânico mantém (colour, favourite, organise).' },
  { id: 'us4', type: 'usage', level: 'A1', phrase: 'Trash (AmE) vs Rubbish (BrE)', translation: 'Lixo', explanation: '"Trash" é a palavra americana; "rubbish" é a britânica — em BrE, "rubbish" também é gíria para "algo mau/sem sentido".' },
  { id: 'us5', type: 'usage', level: 'A2', phrase: 'Vacation (AmE) vs Holiday (BrE)', translation: 'Férias', explanation: 'Nos EUA usa-se "vacation" para férias; no Reino Unido, "holiday" — cuidado que "holiday" em AmE normalmente significa só um feriado específico.' },
  { id: 'us6', type: 'usage', level: 'A1', phrase: 'Cookie (AmE) vs Biscuit (BrE)', translation: 'Biscoito / Bolacha', explanation: 'Atenção: "biscuit" em inglês americano é outra coisa (tipo um pãozinho salgado) — não confundas os dois sistemas.' },
  { id: 'us7', type: 'usage', level: 'A1', phrase: 'Fall (AmE) vs Autumn (BrE)', translation: 'Outono', explanation: '"Fall" é a forma americana (vem de "the leaves fall"); "autumn" é usada nos dois, mas é a preferida no Reino Unido.' },
  { id: 'us8', type: 'usage', level: 'A1', phrase: 'Movie (AmE) vs Film (BrE)', translation: 'Filme', explanation: 'Nos EUA vai-se "to the movies"; no Reino Unido vai-se "to the cinema to watch a film".' },
];
