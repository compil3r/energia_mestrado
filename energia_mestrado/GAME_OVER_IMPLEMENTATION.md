# Implementação da Modal de Game Over - Fase 2

## Resumo das Modificações

Foi implementada uma modal específica de **Game Over** para a Fase 2 do jogo, substituindo o comportamento anterior que reiniciava automaticamente o jogo quando todas as vidas eram perdidas.

### Mudanças Implementadas

#### 1. **HTML** (`fase2.html`)
- Adicionada nova modal de game over com:
  - Ícone animado de raio cortado (`fa-bolt-slash`)
  - Mensagem explicativa sobre a perda de energia
  - Dois botões de ação: "Tentar Novamente" e "Voltar ao Menu"

#### 2. **CSS** (`fase2.css`)
- Novos estilos para a modal de game over:
  - `.modal-game-over` - Container principal
  - `.game-over-icon` - Ícone animado com efeito pulse vermelho
  - `.modal-game-over-botoes` - Layout flexível para os botões
  - Animação `pulse-danger` para o ícone
  - Estilos específicos para os botões

#### 3. **JavaScript** (`fase2.js`)

##### Novas Funções:
- **`mostrarGameOver()`**: Exibe a modal de game over
  - Limpa timers ativos
  - Oculta feedback de erro
  - Exibe a modal

- **`reiniciarFase()`**: Reinicia a fase atual
  - Restaura vidas para 3
  - Reseta o desafio atual
  - Atualiza sessionStorage
  - Oculta modal e reinicia o jogo

- **`voltarAoMenu()`**: Retorna ao menu principal
  - Reseta vidas no sessionStorage
  - Redireciona para index.html

##### Modificações:
- **`perderVida()`**: Agora chama `mostrarGameOver()` em vez de reiniciar automaticamente
- **Sistema de vidas**: Migrado de `window.vidasGlobais` para variável local `vidasGlobais` com integração ao sessionStorage
- **Event listeners**: Adicionados para os botões da modal de game over

### Funcionalidades

1. **Ao perder todas as vidas**:
   - Aguarda 1.2 segundos (para feedback visual)
   - Exibe a modal de game over com animação

2. **Botão "Tentar Novamente"**:
   - Reinicia a fase atual
   - Restaura todas as vidas
   - Mantém o jogador na mesma fase

3. **Botão "Voltar ao Menu"**:
   - Reseta o estado do jogo
   - Redireciona para o menu principal

### Melhorias de UX

- **Visual atrativo**: Ícone animado e cores vermelhas para indicar falha
- **Mensagem motivacional**: Encoraja o jogador a tentar novamente
- **Flexibilidade**: Permite escolher entre reiniciar ou voltar ao menu
- **Integração**: Mantém compatibilidade com o sistema de vidas entre fases

### Integração com sessionStorage

O sistema agora utiliza `sessionStorage` para persistir as vidas entre as fases:
- Salva automaticamente quando vidas são perdidas
- Restaura vidas ao reiniciar
- Reseta ao voltar ao menu

### Arquivos Modificados

1. `fase2.html` - Adicionada modal de game over
2. `fase2.css` - Novos estilos e animações
3. `fase2.js` - Lógica de game over e gerenciamento de vidas

A implementação mantém a consistência visual com o resto do jogo e oferece uma experiência mais polida ao jogador quando todas as vidas são perdidas.