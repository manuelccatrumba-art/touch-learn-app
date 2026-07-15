import { FlashCard, FlashCardCategory } from '../types';

type FlashCardData = Omit<FlashCard, 'interval' | 'repetitions' | 'easeFactor' | 'nextReview'>;

export const FLASHCARD_DATA: FlashCardData[] = [
  // === SAUDAÇÕES E ENCONTROS ===
  { id: 'g1', category: 'greetings', portuguese: 'Muito prazer.', english: 'Nice to meet you.', usage: 'Ao ser apresentado a alguém pela primeira vez' },
  { id: 'g2', category: 'greetings', portuguese: 'Quanto tempo!', english: 'Long time no see!', usage: 'Ao encontrar alguém depois de muito tempo' },
  { id: 'g3', category: 'greetings', portuguese: 'Já ouvi muito falar de você.', english: "I've heard a lot about you.", usage: 'Ao conhecer alguém de quem você já ouviu falar' },
  { id: 'g4', category: 'greetings', portuguese: 'Como você se chama?', english: "What's your name?", usage: 'Perguntando o nome de alguém' },
  { id: 'g5', category: 'greetings', portuguese: 'Como vai? / Tudo bem?', english: "How are you doing? / What's up?", usage: 'Saudação informal do dia a dia' },
  { id: 'g6', category: 'greetings', portuguese: 'O que você faz (da vida)?', english: 'What do you do?', usage: 'Perguntando a profissão de alguém' },
  { id: 'g7', category: 'greetings', portuguese: 'O que você faz nas horas vagas?', english: 'What do you do for fun? / What are your hobbies?', usage: 'Perguntando sobre passatempos' },
  { id: 'g8', category: 'greetings', portuguese: 'De onde você é?', english: 'Where are you from?', usage: 'Perguntando a origem de alguém' },
  { id: 'g9', category: 'greetings', portuguese: 'Com licença / Com sua permissão', english: 'Excuse me', usage: 'Para passar por alguém ou chamar atenção' },
  { id: 'g10', category: 'greetings', portuguese: 'Foi um prazer conversar com você.', english: 'It was great talking to you.', usage: 'Ao se despedir de alguém com quem conversou' },

  // === ELOGIOS ===
  { id: 'c1', category: 'compliments', portuguese: 'Você está ótimo(a)!', english: 'You look great!', usage: 'Elogio sobre aparência física' },
  { id: 'c2', category: 'compliments', portuguese: 'Que ideia incrível!', english: "That's a brilliant idea!", usage: 'Elogiando uma sugestão ou ideia' },
  { id: 'c3', category: 'compliments', portuguese: 'Fiquei impressionado(a)!', english: "I'm impressed!", usage: 'Ao ser surpreendido positivamente' },
  { id: 'c4', category: 'compliments', portuguese: 'Você está arrasando!', english: "You're killing it!", usage: 'Elogio informal para alguém indo muito bem' },
  { id: 'c5', category: 'compliments', portuguese: 'Bom trabalho!', english: 'Nice work! / Well done!', usage: 'Elogiar um trabalho bem feito' },
  { id: 'c6', category: 'compliments', portuguese: 'Você tem muito estilo.', english: 'You have great taste / You have great style.', usage: 'Elogiar o gosto de alguém' },
  { id: 'c7', category: 'compliments', portuguese: 'Sua roupa está linda.', english: 'Your outfit looks amazing.', usage: 'Elogiar a roupa de alguém' },

  // === FAMÍLIA ===
  { id: 'f1', category: 'family', portuguese: 'Tenho um irmão e duas irmãs.', english: 'I have one brother and two sisters.', usage: 'Descrevendo seus irmãos (NL2 - não dizer "three brothers")' },
  { id: 'f2', category: 'family', portuguese: 'Sou filho único / filha única.', english: "I'm an only child.", usage: 'Quando não tem irmãos' },
  { id: 'f3', category: 'family', portuguese: 'Meus avós maternos / paternos', english: 'My maternal / paternal grandparents', usage: 'Distinguindo os avós' },
  { id: 'f4', category: 'family', portuguese: 'Minha sogra / sogro', english: 'My mother-in-law / father-in-law', usage: 'Familiares do cônjuge' },
  { id: 'f5', category: 'family', portuguese: 'Minha cunhada / cunhado', english: 'My sister-in-law / brother-in-law', usage: 'Irmãos do cônjuge ou cônjuge dos irmãos' },
  { id: 'f6', category: 'family', portuguese: 'Ela está grávida.', english: "She's expecting / She's pregnant.", usage: 'Informando gravidez' },
  { id: 'f7', category: 'family', portuguese: 'Criamos os filhos juntos.', english: 'We raise our kids together.', usage: 'Falar sobre criação dos filhos' },

  // === AMOR E RELACIONAMENTOS ===
  { id: 'r1', category: 'relationships', portuguese: 'Estou namorando.', english: "I'm in a relationship. / I'm seeing someone.", usage: 'Informar que tem um relacionamento' },
  { id: 'r2', category: 'relationships', portuguese: 'Estamos ficando.', english: "We're casually dating. / We're seeing each other.", usage: 'Relacionamento informal' },
  { id: 'r3', category: 'relationships', portuguese: 'Estou solteiro(a).', english: "I'm single.", usage: 'Informar que está solteiro' },
  { id: 'r4', category: 'relationships', portuguese: 'A gente se separou.', english: "We split up. / We broke up.", usage: 'Falar sobre separação' },
  { id: 'r5', category: 'relationships', portuguese: 'Tô com ciúme.', english: "I'm jealous.", usage: 'Expressar ciúme' },
  { id: 'r6', category: 'relationships', portuguese: 'Eu me apaixonei por você.', english: "I fell for you. / I've fallen for you.", usage: 'Confissão de amor' },
  { id: 'r7', category: 'relationships', portuguese: 'Meu coração está partido.', english: 'My heart is broken. / I\'m heartbroken.', usage: 'Após uma separação dolorosa' },

  // === NEGÓCIOS / PROFISSIONAL ===
  { id: 'b1', category: 'business', portuguese: 'Posso te dar uma resposta depois?', english: 'Can I get back to you on that?', usage: 'Quando precisa de tempo para responder' },
  { id: 'b2', category: 'business', portuguese: 'Vamos manter contato.', english: "Let's stay in touch. / Let's keep in touch.", usage: 'Ao se despedir de um contato profissional' },
  { id: 'b3', category: 'business', portuguese: 'Vou te mantendo informado(a).', english: "I'll keep you posted.", usage: 'Prometendo dar atualizações' },
  { id: 'b4', category: 'business', portuguese: 'Qual é o prazo?', english: "What's the deadline?", usage: 'Perguntando sobre prazo de entrega' },
  { id: 'b5', category: 'business', portuguese: 'Podemos marcar uma reunião?', english: 'Can we set up a meeting? / Can we schedule a call?', usage: 'Propondo uma reunião' },
  { id: 'b6', category: 'business', portuguese: 'Estou fora do escritório.', english: "I'm out of the office.", usage: 'Informar ausência no trabalho' },
  { id: 'b7', category: 'business', portuguese: 'Vou cuidar disso.', english: "I'll take care of it. / I'll handle it.", usage: 'Assumindo responsabilidade por uma tarefa' },
  { id: 'b8', category: 'business', portuguese: 'Podemos voltar a esse ponto?', english: 'Can we circle back to this?', usage: 'Retomando um assunto em reunião' },
  { id: 'b9', category: 'business', portuguese: 'Qual é a sua posição sobre isso?', english: "What's your take on this?", usage: 'Pedindo opinião de alguém em reunião' },
  { id: 'b10', category: 'business', portuguese: 'Fui demitido(a) / despedido(a).', english: 'I was laid off. / I was let go.', usage: 'Informar demissão (mais suave que "fired")' },

  // === VIAGENS ===
  { id: 't1', category: 'travel', portuguese: 'Gostaria de fazer o check-in.', english: "I'd like to check in.", usage: 'No hotel ou aeroporto' },
  { id: 't2', category: 'travel', portuguese: 'Meu voo atrasou / foi cancelado.', english: 'My flight was delayed / cancelled.', usage: 'Informando problemas com o voo' },
  { id: 't3', category: 'travel', portuguese: 'Gostaria de um assento na janela.', english: "I'd like a window seat.", usage: 'Preferência de assento no avião' },
  { id: 't4', category: 'travel', portuguese: 'Onde posso trocar dinheiro?', english: 'Where can I exchange money?', usage: 'Procurando casa de câmbio' },
  { id: 't5', category: 'travel', portuguese: 'A gorjeta está incluída?', english: 'Is the tip included?', usage: 'Perguntando sobre gorjeta no restaurante' },
  { id: 't6', category: 'travel', portuguese: 'Pode me chamar um táxi?', english: 'Could you call a cab for me?', usage: 'Pedindo táxi' },
  { id: 't7', category: 'travel', portuguese: 'Tem quartos disponíveis?', english: 'Do you have any rooms available?', usage: 'Verificando disponibilidade no hotel' },
  { id: 't8', category: 'travel', portuguese: 'Qual a distância até...?', english: 'How far is it to...?', usage: 'Perguntando distância até um local' },
  { id: 't9', category: 'travel', portuguese: 'Estou perdido(a).', english: "I'm lost.", usage: 'Quando não sabe onde está' },
  { id: 't10', category: 'travel', portuguese: 'Posso ver o cardápio?', english: 'May I see the menu?', usage: 'No restaurante' },

  // === EMOÇÕES ===
  { id: 'e1', category: 'emotions', portuguese: 'Estou animado(a)!', english: "I'm excited!", usage: 'Expressar entusiasmo' },
  { id: 'e2', category: 'emotions', portuguese: 'Estou nervoso(a).', english: "I'm nervous. / I have butterflies in my stomach.", usage: 'Expressar nervosismo' },
  { id: 'e3', category: 'emotions', portuguese: 'Estou com saudade de você.', english: 'I miss you.', usage: 'Saudade de alguém (não existe tradução exata)' },
  { id: 'e4', category: 'emotions', portuguese: 'Estou exausto(a).', english: "I'm exhausted. / I'm worn out.", usage: 'Expressar cansaço extremo' },
  { id: 'e5', category: 'emotions', portuguese: 'Estou com raiva!', english: "I'm so angry! / I'm furious!", usage: 'Expressar raiva' },
  { id: 'e6', category: 'emotions', portuguese: 'Fiquei decepcionado(a).', english: "I'm disappointed.", usage: 'Expressar decepção' },
  { id: 'e7', category: 'emotions', portuguese: 'Estou orgulhoso(a) de você.', english: "I'm proud of you.", usage: 'Expressar orgulho' },
  { id: 'e8', category: 'emotions', portuguese: 'Estou arrasado(a).', english: "I'm devastated.", usage: 'Expressar tristeza profunda' },

  // === EXPRESSÕES COMUNS ===
  { id: 'com1', category: 'common', portuguese: 'Vale a pena.', english: "It's worth it.", usage: 'Para dizer que algo compensa o esforço/custo' },
  { id: 'com2', category: 'common', portuguese: 'Você que decide / Depende de você.', english: "It's up to you.", usage: 'Deixar a decisão para outro' },
  { id: 'com3', category: 'common', portuguese: 'Não é grande coisa.', english: "No big deal.", usage: 'Minimizando algo' },
  { id: 'com4', category: 'common', portuguese: 'Não estou a fim.', english: "I don't feel like it.", usage: 'Quando não tem vontade de fazer algo' },
  { id: 'com5', category: 'common', portuguese: 'Faz sentido.', english: "It makes sense.", usage: 'Confirmando que algo é lógico' },
  { id: 'com6', category: 'common', portuguese: 'Nunca se sabe.', english: 'You never know.', usage: 'Quando há incerteza sobre o futuro' },
  { id: 'com7', category: 'common', portuguese: 'Não é o fim do mundo.', english: "It's not the end of the world.", usage: 'Para confortar alguém ou minimizar um problema' },
  { id: 'com8', category: 'common', portuguese: 'Pega leve.', english: 'Take it easy.', usage: 'Pedindo para alguém relaxar' },
  { id: 'com9', category: 'common', portuguese: 'Pensando bem...', english: 'Come to think of it...', usage: 'Reconsiderando algo' },
  { id: 'com10', category: 'common', portuguese: 'É o seguinte...', english: "Here's the thing... / That's the thing...", usage: 'Para explicar uma situação ou fazer um ponto importante' },
  { id: 'com11', category: 'common', portuguese: 'Até onde eu sei...', english: 'As far as I know...', usage: 'Expressando incerteza baseada no conhecimento atual' },
  { id: 'com12', category: 'common', portuguese: 'Concordo completamente.', english: "I couldn't agree more.", usage: 'Concordância total' },
  { id: 'com13', category: 'common', portuguese: 'Não vejo assim.', english: "I don't see it that way. / I beg to differ.", usage: 'Discordância educada' },
  { id: 'com14', category: 'common', portuguese: 'Mais ou menos.', english: 'More or less. / Kind of. / Sort of.', usage: 'Para resposta parcialmente afirmativa' },
  { id: 'com15', category: 'common', portuguese: 'Não me importo.', english: "I don't mind.", usage: 'Indiferença / sem objeção' },
  { id: 'com16', category: 'common', portuguese: 'Tanto faz.', english: "It doesn't matter. / Either way.", usage: 'Quando não tem preferência' },
  { id: 'com17', category: 'common', portuguese: 'Isso foi sem querer.', english: "It was an accident. / I didn't mean to.", usage: 'Quando algo aconteceu por acidente' },
  { id: 'com18', category: 'common', portuguese: 'Depende.', english: 'It depends.', usage: 'Resposta que varia conforme o contexto' },
  { id: 'com19', category: 'common', portuguese: 'Com razão!', english: 'Fair enough! / Fair point!', usage: 'Concordando com a lógica do argumento' },
  { id: 'com20', category: 'common', portuguese: 'Não consigo evitar.', english: "I can't help it.", usage: 'Quando algo é incontrolável' },

  // === COMIDA E RESTAURANTE ===
  { id: 'food1', category: 'food', portuguese: 'Estou com fome.', english: "I'm hungry.", usage: 'Expressar fome' },
  { id: 'food2', category: 'food', portuguese: 'Já me satisfiz / Estou satisfeito(a).', english: "I'm full.", usage: 'Após comer suficientemente' },
  { id: 'food3', category: 'food', portuguese: 'Posso pedir agora?', english: 'Can I order now? / Are you ready to take my order?', usage: 'No restaurante, quando quer pedir' },
  { id: 'food4', category: 'food', portuguese: 'A conta, por favor.', english: 'Check, please. / The bill, please.', usage: 'Pedindo a conta (EUA usa "check"; Reino Unido usa "bill")' },
  { id: 'food5', category: 'food', portuguese: 'Vocês dividem a conta?', english: 'Do you do split checks?', usage: 'Perguntando se podem pagar separado' },
  { id: 'food6', category: 'food', portuguese: 'Sou vegetariano(a) / vegano(a).', english: "I'm vegetarian / vegan.", usage: 'Informando restrição alimentar' },
  { id: 'food7', category: 'food', portuguese: 'Tenho alergia a...', english: "I'm allergic to... / I have a ... allergy.", usage: 'Informando alergia alimentar' },

  // === VIDA NOTURNA ===
  { id: 'n1', category: 'nightlife', portuguese: 'Quer sair hoje à noite?', english: 'Do you want to go out tonight?', usage: 'Convidando alguém para sair' },
  { id: 'n2', category: 'nightlife', portuguese: 'Vamos dar uma volta?', english: "Let's go for a walk. / Want to hang out?", usage: 'Propondo sair sem destino fixo' },
  { id: 'n3', category: 'nightlife', portuguese: 'Pode me trazer mais uma?', english: 'Can I get another one?', usage: 'Pedindo mais uma bebida' },
  { id: 'n4', category: 'nightlife', portuguese: 'Essa rodada é por minha conta.', english: "This round is on me.", usage: 'Oferecendo pagar por todos' },
  { id: 'n5', category: 'nightlife', portuguese: 'Vou deixar para amanhã.', english: "I'll take a rain check.", usage: 'Recusando educadamente mas sugerindo outra vez' },

  // === CORRESPONDÊNCIA / COMUNICAÇÃO FORMAL ===
  { id: 'cor1', category: 'correspondence', portuguese: 'Conforme combinado...', english: 'As agreed... / As discussed...', usage: 'Referindo ao que foi acordado' },
  { id: 'cor2', category: 'correspondence', portuguese: 'Em anexo / Em seguida', english: 'Attached / Please find attached', usage: 'Ao enviar arquivo em email' },
  { id: 'cor3', category: 'correspondence', portuguese: 'Aguardo seu retorno.', english: 'I look forward to hearing from you.', usage: 'Fechamento formal de email' },
  { id: 'cor4', category: 'correspondence', portuguese: 'Sem mais, atenciosamente,', english: 'Best regards, / Sincerely,', usage: 'Fechamento de email formal' },
  { id: 'cor5', category: 'correspondence', portuguese: 'Obrigado(a) pela atenção.', english: 'Thank you for your time.', usage: 'Agradecimento em contexto profissional' },
  { id: 'cor6', category: 'correspondence', portuguese: 'Poderia me encaminhar para...?', english: 'Could you direct me to...? / Could you connect me with...?', usage: 'Pedindo para ser redirecionado' },
  { id: 'cor7', category: 'correspondence', portuguese: 'Peço desculpas pela demora na resposta.', english: 'I apologize for the delayed response.', usage: 'Ao responder um email com atraso' },
  { id: 'cor8', category: 'correspondence', portuguese: 'Segue anexo o documento solicitado.', english: 'Please find the requested document attached.', usage: 'Ao enviar um anexo formal' },
  { id: 'cor9', category: 'correspondence', portuguese: 'Fico à disposição para esclarecimentos.', english: "Please don't hesitate to reach out with any questions.", usage: 'Encerramento formal, oferecendo ajuda' },
  { id: 'cor10', category: 'correspondence', portuguese: 'Gostaria de agendar uma chamada.', english: "I'd like to schedule a call.", usage: 'Propondo uma chamada por email' },

  // === COMPLIMENTS (continuação) ===
  { id: 'c8', category: 'compliments', portuguese: 'Você é muito talentoso(a).', english: "You're very talented.", usage: 'Elogiar uma habilidade de alguém' },
  { id: 'c9', category: 'compliments', portuguese: 'Isso te caiu muito bem.', english: 'That looks great on you.', usage: 'Elogiar uma roupa/acessório' },
  { id: 'c10', category: 'compliments', portuguese: 'Você tem um ótimo senso de humor.', english: 'You have a great sense of humor.', usage: 'Elogiar o humor de alguém' },

  // === FAMÍLIA (continuação) ===
  { id: 'f8', category: 'family', portuguese: 'Fomos criados pelos meus avós.', english: 'We were raised by my grandparents.', usage: 'Descrever quem criou a pessoa' },
  { id: 'f9', category: 'family', portuguese: 'Somos uma família muito unida.', english: "We're a very close-knit family.", usage: 'Descrever proximidade familiar' },
  { id: 'f10', category: 'family', portuguese: 'Ele puxou ao pai.', english: 'He takes after his father.', usage: 'Dizer que alguém se parece com um familiar' },

  // === RELACIONAMENTOS (continuação) ===
  { id: 'r8', category: 'relationships', portuguese: 'Estamos noivos.', english: "We're engaged.", usage: 'Anunciar noivado' },
  { id: 'r9', category: 'relationships', portuguese: 'Ele me deu um bolo (não apareceu).', english: 'He stood me up.', usage: 'Quando alguém falta a um encontro combinado' },
  { id: 'r10', category: 'relationships', portuguese: 'Estamos dando um tempo.', english: "We're on a break / taking some space.", usage: 'Pausa temporária num relacionamento' },

  // === COMIDA (continuação) ===
  { id: 'food8', category: 'food', portuguese: 'Está delicioso!', english: "This is delicious! / This tastes amazing!", usage: 'Elogiar a comida' },
  { id: 'food9', category: 'food', portuguese: 'Pode ser sem cebola?', english: 'Can I get that without onions?', usage: 'Pedindo para retirar um ingrediente' },
  { id: 'food10', category: 'food', portuguese: 'Para levar, por favor.', english: 'To go, please. / For here or to go?', usage: 'Pedindo comida para levar' },

  // === VIDA NOTURNA (continuação) ===
  { id: 'n6', category: 'nightlife', portuguese: 'Qual é o plano para hoje à noite?', english: "What's the plan for tonight?", usage: 'Perguntando sobre planos noturnos' },
  { id: 'n7', category: 'nightlife', portuguese: 'Já é a minha hora de ir.', english: "It's about time for me to head out.", usage: 'Anunciar que vai embora' },
  { id: 'n8', category: 'nightlife', portuguese: 'Bebi demais ontem à noite.', english: 'I had one too many last night.', usage: 'Admitir que bebeu demais' },

  // === PROFISSIONAL (carreira / entrevistas) ===
  { id: 'p1', category: 'professional', portuguese: 'Fale um pouco sobre você.', english: 'Tell me a little about yourself.', usage: 'Pergunta clássica de entrevista' },
  { id: 'p2', category: 'professional', portuguese: 'Quais são os seus pontos fortes?', english: 'What are your strengths?', usage: 'Pergunta comum em entrevistas' },
  { id: 'p3', category: 'professional', portuguese: 'Onde você se vê em 5 anos?', english: 'Where do you see yourself in five years?', usage: 'Pergunta sobre planos de carreira' },
  { id: 'p4', category: 'professional', portuguese: 'Tenho experiência nessa área.', english: 'I have experience in this field.', usage: 'Falar sobre experiência profissional' },
  { id: 'p5', category: 'professional', portuguese: 'Estou à procura de novas oportunidades.', english: "I'm looking for new opportunities.", usage: 'Explicar que está a procurar emprego' },
  { id: 'p6', category: 'professional', portuguese: 'Qual é a faixa salarial para esta vaga?', english: "What's the salary range for this position?", usage: 'Perguntar sobre remuneração' },
  { id: 'p7', category: 'professional', portuguese: 'Fui promovido(a) recentemente.', english: 'I was recently promoted.', usage: 'Anunciar uma promoção' },
  { id: 'p8', category: 'professional', portuguese: 'Trabalho bem sob pressão.', english: 'I work well under pressure.', usage: 'Descrever uma qualidade profissional' },

  // === COMPRAS ===
  { id: 'sh1', category: 'shopping', portuguese: 'Só estou olhando, obrigado(a).', english: "I'm just browsing/looking, thanks.", usage: 'Quando um vendedor pergunta se precisa de ajuda' },
  { id: 'sh2', category: 'shopping', portuguese: 'Quanto custa isso?', english: 'How much does this cost? / How much is this?', usage: 'Perguntando o preço' },
  { id: 'sh3', category: 'shopping', portuguese: 'Tem em outro tamanho?', english: 'Do you have this in a different size?', usage: 'Pedindo outro tamanho' },
  { id: 'sh4', category: 'shopping', portuguese: 'Posso experimentar?', english: 'Can I try this on?', usage: 'Pedindo para provar roupa' },
  { id: 'sh5', category: 'shopping', portuguese: 'Está com desconto?', english: 'Is this on sale?', usage: 'Perguntando sobre promoção' },
  { id: 'sh6', category: 'shopping', portuguese: 'Aceita cartão?', english: 'Do you take cards? / Do you accept card payments?', usage: 'Perguntando forma de pagamento' },
  { id: 'sh7', category: 'shopping', portuguese: 'Gostaria de devolver isto.', english: "I'd like to return this.", usage: 'Devolvendo um produto' },
  { id: 'sh8', category: 'shopping', portuguese: 'Não é bem o que eu procurava.', english: "It's not quite what I was looking for.", usage: 'Recusar educadamente um produto' },

  // === SAÚDE ===
  { id: 'h1', category: 'health', portuguese: 'Não estou me sentindo bem.', english: "I'm not feeling well.", usage: 'Informar que está doente' },
  { id: 'h2', category: 'health', portuguese: 'Estou com dor de cabeça.', english: 'I have a headache.', usage: 'Descrever um sintoma' },
  { id: 'h3', category: 'health', portuguese: 'Preciso marcar uma consulta.', english: 'I need to make an appointment.', usage: 'Marcando consulta médica' },
  { id: 'h4', category: 'health', portuguese: 'Você toma algum medicamento?', english: 'Are you taking any medication?', usage: 'Pergunta comum do médico' },
  { id: 'h5', category: 'health', portuguese: 'Estou com febre.', english: 'I have a fever.', usage: 'Descrever sintoma' },
  { id: 'h6', category: 'health', portuguese: 'Ele torceu o tornozelo.', english: 'He twisted his ankle. / He sprained his ankle.', usage: 'Descrever lesão' },
  { id: 'h7', category: 'health', portuguese: 'Estou tomando o remédio certinho.', english: "I'm taking the medicine as prescribed.", usage: 'Confirmar adesão ao tratamento' },
  { id: 'h8', category: 'health', portuguese: 'Isso é urgente, preciso ir ao pronto-socorro.', english: 'This is urgent, I need to go to the ER.', usage: 'Situação de emergência médica' },

  // === TECNOLOGIA ===
  { id: 'tec1', category: 'technology', portuguese: 'Meu telemóvel/celular ficou sem bateria.', english: 'My phone died. / My phone is out of battery.', usage: 'Informar que o telefone desligou' },
  { id: 'tec2', category: 'technology', portuguese: 'Você pode me enviar por WhatsApp?', english: 'Can you send it to me on WhatsApp?', usage: 'Pedindo para enviar algo digitalmente' },
  { id: 'tec3', category: 'technology', portuguese: 'A internet está lenta.', english: 'The internet is slow / down.', usage: 'Reclamar da conexão' },
  { id: 'tec4', category: 'technology', portuguese: 'Esqueci minha senha.', english: 'I forgot my password.', usage: 'Ao tentar acessar uma conta' },
  { id: 'tec5', category: 'technology', portuguese: 'Pode partilhar o ecrã?', english: 'Can you share your screen?', usage: 'Em reuniões online' },
  { id: 'tec6', category: 'technology', portuguese: 'O sistema travou.', english: 'The system crashed. / It froze.', usage: 'Descrever falha técnica' },
  { id: 'tec7', category: 'technology', portuguese: 'Você está a ver-me bem? Estou sem áudio.', english: "Can you see me okay? I don't have audio.", usage: 'Chamada de vídeo com problemas técnicos' },
  { id: 'tec8', category: 'technology', portuguese: 'Já atualizei o aplicativo.', english: "I've already updated the app.", usage: 'Informar que atualizou o software' },
];

export const CATEGORY_LABELS: Record<FlashCardCategory, { title: string; emoji: string; color: string }> = {
  greetings: { title: 'Saudações', emoji: '👋', color: '#4F9CF9' },
  compliments: { title: 'Elogios', emoji: '✨', color: '#A78BFA' },
  family: { title: 'Família', emoji: '👨‍👩‍👧‍👦', color: '#F59E0B' },
  relationships: { title: 'Relacionamentos', emoji: '❤️', color: '#EF4444' },
  business: { title: 'Negócios', emoji: '💼', color: '#22C55E' },
  travel: { title: 'Viagens', emoji: '✈️', color: '#06B6D4' },
  emotions: { title: 'Emoções', emoji: '😊', color: '#F472B6' },
  common: { title: 'Cotidiano', emoji: '💬', color: '#94A3B8' },
  food: { title: 'Comida', emoji: '🍽️', color: '#FB923C' },
  nightlife: { title: 'Vida Noturna', emoji: '🌙', color: '#8B5CF6' },
  professional: { title: 'Profissional', emoji: '🎯', color: '#10B981' },
  correspondence: { title: 'Correspondência', emoji: '✉️', color: '#64748B' },
  shopping: { title: 'Compras', emoji: '🛍️', color: '#EC4899' },
  health: { title: 'Saúde', emoji: '🏥', color: '#F87171' },
  technology: { title: 'Tecnologia', emoji: '💻', color: '#38BDF8' },
};

export const QUICK_REPLIES = [
  'Me ensina uma expressão nova',
  'Corrija meu inglês',
  'Quero praticar conversação',
  'Explica essa regra gramatical',
  'Como se diz em inglês?',
  'Vamos fazer um roleplay',
  'Fala sobre erros comuns',
  'Me dá um exercício',
];
