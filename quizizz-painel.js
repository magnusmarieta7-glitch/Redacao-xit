// ================================================================
// PAINEL QUIZIZZ - Auto Resposta
// (c) 2026 - Senha: hack123
// ================================================================

(function() {
    'use strict';

    const CONFIG = {
        password: 'hack123',
        panelTitle: '📝 Quizizz Hack',
        panelSubtitle: 'auto-resposta'
    };

    // ---------- ESTILOS (mesmo do painel anterior, só adaptei as cores) ----------
    const style = document.createElement('style');
    style.textContent = `
        #pwdOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.3s;
        }
        #pwdOverlay.hidden { opacity: 0; pointer-events: none; }
        .pwd-box {
            background: #1e1e2f;
            padding: 40px 50px;
            border-radius: 20px;
            border: 1px solid #ffcc00;
            box-shadow: 0 0 40px rgba(255,204,0,0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
            color: #fff;
        }
        .pwd-box h1 { color: #ffcc00; font-weight: 600; font-size: 1.8rem; margin-bottom: 8px; }
        .pwd-box p { color: #aaa; margin-bottom: 25px; font-size: 0.9rem; }
        .pwd-box input {
            width: 100%;
            padding: 14px 18px;
            border-radius: 12px;
            border: 1px solid #444;
            background: #2a2a3a;
            color: #fff;
            font-size: 1rem;
            outline: none;
            text-align: center;
            letter-spacing: 4px;
        }
        .pwd-box input:focus { border-color: #ffcc00; box-shadow: 0 0 15px rgba(255,204,0,0.15); }
        .pwd-box button {
            margin-top: 20px;
            width: 100%;
            padding: 14px;
            background: #ffcc00;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            color: #0b0b15;
            cursor: pointer;
            transition: 0.2s;
        }
        .pwd-box button:hover { background: #e6b800; transform: scale(1.02); }
        .pwd-box .err-msg { color: #ff4757; font-size: 0.85rem; margin-top: 12px; min-height: 20px; }

        #hackPanel {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 400px;
            max-width: calc(100vw - 40px);
            background: #14141d;
            border-radius: 18px;
            border: 1px solid #2a2a40;
            box-shadow: 0 15px 50px rgba(0,0,0,0.8);
            z-index: 99998;
            display: none;
            backdrop-filter: blur(4px);
            color: #e0e0e0;
            font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        }
        #hackPanel.active { display: block; }
        #panelHeader {
            padding: 14px 20px;
            background: #1a1a2e;
            border-radius: 18px 18px 0 0;
            border-bottom: 1px solid #2a2a40;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }
        #panelHeader h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #ffcc00;
            letter-spacing: 1px;
            margin: 0;
        }
        #panelHeader h2 small { font-weight: 400; font-size: 0.7rem; color: #888; margin-left: 8px; }
        .header-actions button {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0 4px;
            transition: 0.2s;
        }
        .header-actions button:hover { color: #fff; }
        .header-actions #closePanelBtn { color: #ff4757; }
        #panelBody {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .info-box {
            background: #0e0e17;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #2a2a40;
            font-size: 0.85rem;
            word-break: break-word;
        }
        .info-box .label { color: #888; }
        .info-box .value { color: #ffcc00; font-weight: 500; }
        .action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .action-buttons button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            transition: 0.2s;
            min-width: 70px;
        }
        #startBtn { background: #ffcc00; color: #0b0b15; }
        #startBtn:hover { background: #e6b800; transform: scale(1.02); }
        #stopBtn { background: #2a2a44; color: #fff; }
        #stopBtn:hover { background: #3d3d66; }
        #statusText {
            font-size: 0.75rem;
            color: #777;
            text-align: right;
            border-top: 1px solid #1e1e2e;
            padding-top: 10px;
            margin-top: 4px;
        }
        #reopenFloater {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #ffcc00;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 20px rgba(255,204,0,0.3);
            color: #0b0b15;
            font-size: 1.8rem;
            font-weight: 700;
            cursor: pointer;
            z-index: 99997;
            display: none;
            transition: 0.2s;
            align-items: center;
            justify-content: center;
        }
        #reopenFloater:hover { transform: scale(1.1); background: #e6b800; }
        #reopenFloater.show { display: flex; }
        @media (max-width: 500px) {
            #hackPanel { right: 10px; bottom: 10px; width: calc(100vw - 20px); }
        }
    `;
    document.head.appendChild(style);

    // ---------- HTML DO PAINEL ----------
    const overlay = document.createElement('div');
    overlay.id = 'pwdOverlay';
    overlay.innerHTML = `
        <div class="pwd-box">
            <h1>🔐 ${CONFIG.panelTitle}</h1>
            <p>${CONFIG.panelSubtitle} • Acesso restrito</p>
            <input type="password" id="pwdInput" placeholder="Digite a senha" autofocus>
            <button id="pwdBtn">Acessar Painel</button>
            <div class="err-msg" id="pwdError"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const panel = document.createElement('div');
    panel.id = 'hackPanel';
    panel.innerHTML = `
        <div id="panelHeader">
            <h2>${CONFIG.panelTitle} <small>${CONFIG.panelSubtitle}</small></h2>
            <div class="header-actions">
                <button id="minimizePanelBtn" title="Minimizar">─</button>
                <button id="closePanelBtn" title="Fechar">✕</button>
            </div>
        </div>
        <div id="panelBody">
            <div class="info-box">
                <span class="label">📌 Status: </span>
                <span class="value" id="statusDisplay">Aguardando</span>
            </div>
            <div class="info-box">
                <span class="label">📝 Pergunta atual: </span>
                <span class="value" id="questionDisplay">Nenhuma</span>
            </div>
            <div class="action-buttons">
                <button id="startBtn">▶ Iniciar Auto-Reply</button>
                <button id="stopBtn">⏹ Parar</button>
            </div>
            <div id="statusText">Status: <span id="statusMessage">Pronto</span></div>
        </div>
    `;
    document.body.appendChild(panel);

    const floater = document.createElement('button');
    floater.id = 'reopenFloater';
    floater.textContent = '📝';
    floater.title = 'Abrir Painel';
    document.body.appendChild(floater);

    // ---------- REFERÊNCIAS ----------
    const pwdOverlay = document.getElementById('pwdOverlay');
    const pwdInput = document.getElementById('pwdInput');
    const pwdBtn = document.getElementById('pwdBtn');
    const pwdError = document.getElementById('pwdError');

    const panelEl = document.getElementById('hackPanel');
    const closeBtn = document.getElementById('closePanelBtn');
    const minimizeBtn = document.getElementById('minimizePanelBtn');
    const floaterEl = document.getElementById('reopenFloater');

    const statusDisplay = document.getElementById('statusDisplay');
    const questionDisplay = document.getElementById('questionDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    let isRunning = false;
    let autoInterval = null;

    // ---------- FUNÇÃO PARA OBTER A RESPOSTA CORRETA ----------
    function getCorrectAnswer() {
        // Procura as alternativas
        const options = document.querySelectorAll('.option, .answer, [data-cy="answer"]');
        for (let opt of options) {
            // Verifica se tem a classe 'correct' (indicador comum no Quizizz)
            if (opt.classList.contains('correct') || opt.classList.contains('selected') || opt.getAttribute('data-correct') === 'true') {
                return opt;
            }
        }
        // Se não encontrar, tenta por texto comparando com o atributo data-answer (se houver)
        // Ou procura por algo que pareça destacado
        return null;
    }

    // ---------- FUNÇÃO PARA RESPONDER ----------
    function answerQuestion() {
        const correct = getCorrectAnswer();
        if (correct) {
            correct.click();
            statusDisplay.textContent = '✅ Respondido!';
            statusMessage.textContent = 'Resposta correta enviada.';
            // Avança automaticamente (se houver botão "Próxima")
            const nextBtn = document.querySelector('.next-button, .continue-button, [data-cy="next"]');
            if (nextBtn) {
                setTimeout(() => nextBtn.click(), 500);
            }
            return true;
        } else {
            statusDisplay.textContent = '❌ Não encontrei a resposta';
            statusMessage.textContent = 'Tente novamente.';
            return false;
        }
    }

    // ---------- FUNÇÃO PRINCIPAL DE AUTO-RESPOSTA ----------
    function autoReply() {
        if (!isRunning) return;
        // Verifica se há uma pergunta ativa
        const questionElement = document.querySelector('.question-text, .question, [data-cy="question"]');
        if (questionElement) {
            const qText = questionElement.innerText.trim();
            questionDisplay.textContent = qText.substring(0, 50) + (qText.length > 50 ? '...' : '');
            // Tenta responder
            answerQuestion();
        } else {
            questionDisplay.textContent = 'Aguardando pergunta...';
        }
        // Agenda a próxima verificação (a cada 2 segundos)
        if (isRunning) {
            clearTimeout(autoInterval);
            autoInterval = setTimeout(autoReply, 2000);
        }
    }

    // ---------- CONTROLES ----------
    startBtn.addEventListener('click', function() {
        if (isRunning) {
            statusMessage.textContent = 'Já está em execução.';
            return;
        }
        isRunning = true;
        statusDisplay.textContent = '🔄 Ativo';
        statusMessage.textContent = 'Monitorando perguntas...';
        autoReply();
    });

    stopBtn.addEventListener('click', function() {
        isRunning = false;
        clearTimeout(autoInterval);
        statusDisplay.textContent = '⏹ Parado';
        statusMessage.textContent = 'Interrompido manualmente.';
    });

    // ---------- SENHA ----------
    function checkPassword() {
        const pass = pwdInput.value.trim();
        if (pass === CONFIG.password) {
            pwdOverlay.classList.add('hidden');
            panelEl.classList.add('active');
            floaterEl.classList.remove('show');
            pwdError.textContent = '';
            pwdInput.value = '';
            statusMessage.textContent = 'Painel ativo. Clique em "Iniciar" para começar.';
        } else {
            pwdError.textContent = '❌ Senha incorreta.';
            pwdInput.value = '';
            pwdInput.focus();
        }
    }
    pwdBtn.addEventListener('click', checkPassword);
    pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPassword(); });

    // ---------- FECHAR/REABRIR ----------
    closeBtn.addEventListener('click', function() {
        panelEl.classList.remove('active');
        isRunning = false;
        clearTimeout(autoInterval);
        floaterEl.classList.add('show');
    });
    floaterEl.addEventListener('click', function() {
        pwdOverlay.classList.remove('hidden');
        floaterEl.classList.remove('show');
        panelEl.classList.remove('active');
        pwdInput.value = '';
        pwdInput.focus();
        pwdError.textContent = '';
    });

    // ---------- MINIMIZAR ----------
    let minimized = false;
    minimizeBtn.addEventListener('click', function() {
        const body = document.getElementById('panelBody');
        minimized = !minimized;
        body.style.display = minimized ? 'none' : 'flex';
        minimizeBtn.textContent = minimized ? '⬜' : '─';
    });

    // ---------- ARRASTAR (igual ao anterior) ----------
    const header = document.getElementById('panelHeader');
    let dragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', function(e) {
        if (e.target.closest('button')) return;
        dragging = true;
        const rect = panelEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        panelEl.style.cursor = 'grabbing';
    });
    function onDrag(e) {
        if (!dragging) return;
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;
        left = Math.max(0, Math.min(window.innerWidth - panelEl.offsetWidth, left));
        top = Math.max(0, Math.min(window.innerHeight - panelEl.offsetHeight, top));
        panelEl.style.left = left + 'px';
        panelEl.style.top = top + 'px';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
    }
    function stopDrag() {
        dragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        panelEl.style.cursor = '';
    }

    // ---------- INICIALIZAÇÃO ----------
    console.log('📝 Painel Quizizz carregado. Senha: hack123');
    pwdInput.focus();
})();
