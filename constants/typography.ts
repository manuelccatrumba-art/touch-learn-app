// Escala de tamanho de texto global da app — mesmo mecanismo A-/A+ do Touch
// Bíblia, mas aplicado como multiplicador global (a app não é um ecrã único
// de leitura, é dezenas de ecrãs com texto, por isso faz mais sentido um
// ajuste na Perfil que afeta tudo, em vez de um controlo por ecrã).
export const FONT_SCALE_STEPS = [0.85, 0.92, 1.0, 1.1, 1.2, 1.32] as const;

// Índice 2 (escala 1.0) é o tamanho original de sempre da app — mudar a
// escala nunca desloca quem não mexer no controlo.
export const DEFAULT_FONT_SCALE_INDEX = 2;

export const FONT_SCALE_LABELS = ['Muito pequeno', 'Pequeno', 'Normal', 'Grande', 'Muito grande', 'Máximo'] as const;
