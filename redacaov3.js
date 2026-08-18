// ============================================================
// PAINEL DE DIGITAÇÃO AUTOMÁTICA - REDAÇÃO PARANÁ
// Versão Bookmarklet - (c) 2026
// Instrução: copie este código e crie um bookmark com o link:
// javascript:(function(){...})();
// ============================================================

(function() {
    'use strict';

    // ---------- ESTILOS CSS (injetados dinamicamente) ----------
    const style = document.createElement('style');
    style.textContent = `
        /* ---- Overlay de senha ---- */
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
        #pwdOverlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        .pwd-box {
            background: #1e1e2f;
            padding: 40px 50px;
            border-radius: 20px;
            border: 1px solid #00ff88;
            box-shadow: 0 0 40px rgba(0,255,136,0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
            color: #fff;
        }
        .pwd-box h1 { color: #00ff88; font-weight: 600; font-size: 1.8rem; margin-bottom: 8px; }
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
        .pwd-box input:focus { border-color: #00ff88; box-shadow: 0 0 15px rgba(0,255,136,0.15); }
        .pwd-box button {
            margin-top: 20px;
            width: 100%;
            padding: 14px;
            background: #00ff88;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            color: #0b0b15;
            cursor: pointer;
            transition: 0.2s;
        }
        .pwd-box button:hover { background: #00cc6a; transform: scale(1.02); }
        .pwd-box .err-msg { color: #ff4757; font-size: 0.85rem; margin-top: 12px; min-height: 20px; }

        /* ---- Painel principal ---- */
        #hackPanel {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 420px;
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
        #panelHeader:active { cursor: grabbing; }
        #panelHeader h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #00ff88;
            letter-spacing: 1px;
            margin: 0;
        }
        #panelHeader h2 small { font-weight: 400; font-size: 0.7rem; color: #777; margin-left: 8px; }
        .header-actions { display: flex; gap: 10px; }
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
        .header-actions #closePanelBtn:hover { color: #ff6b81; }

        #panelBody {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        #panelBody label {
            font-size: 0.85rem;
            font-weight: 500;
            color: #aaa;
            display: block;
            margin-bottom: 4px;
        }
        #panelBody textarea {
            width: 100%;
            height: 100px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #2e2e44;
            background: #0e0e17;
            color: #f0f0f0;
            font-size: 0.9rem;
            resize: vertical;
            outline: none;
            transition: 0.2s;
        }
        #panelBody textarea:focus { border-color: #00ff88; }

        .field-selector {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            background: #0e0e17;
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid #2a2a40;
        }
        .field-selector #targetDisplay {
            flex: 1;
            font-size: 0.85rem;
            color: #aaa;
            word-break: break-all;
            min-width: 80px;
        }
        .field-selector #targetDisplay.active-target { color: #00ff88; font-weight: 500; }
        .field-selector button {
            background: #2a2a44;
            border: none;
            color: #fff;
            padding: 8px 18px;
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
            white-space: nowrap;
        }
        .field-selector button:hover { background: #3d3d66; }
        .field-selector button.selecting {
            background: #ffa502;
            color: #0b0b15;
            animation: pulse 1s infinite;
        }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }

        .speed-group {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            background: #0e0e17;
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid #2a2a40;
            align-items: center;
        }
        .speed-group label { margin-bottom: 0; color: #ccc; font-size: 0.85rem; }
        .speed-group .radio-option {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            color: #bbb;
            font-size: 0.85rem;
        }
        .speed-group .radio-option input[type="radio"] { accent-color: #00ff88; width: 16px; height: 16px; cursor: pointer; }
        .speed-group .radio-option input[type="radio"]:checked + span { color: #00ff88; font-weight: 600; }

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
            min-width: 80px;
        }
        #startBtn { background: #00ff88; color: #0b0b15; }
        #startBtn:hover { background: #00cc6a; transform: scale(1.02); }
        #stopBtn { background: #2a2a44; color: #fff; }
        #stopBtn:hover { background: #3d3d66; }
        #clearBtn { background: transparent; border: 1px solid #444; color: #aaa; flex: 0.5; }
        #clearBtn:hover { border-color: #ff4757; color: #ff4757; }

        .status-bar {
            font-size: 0.75rem;
            color: #555;
            text-align: right;
            border-top: 1px solid #1e1e2e;
            padding-top: 12px;
            margin-top: 4px;
        }
        .status-bar #statusText { color: #777; }
        .status-bar #statusText.typing { color: #00ff88; }
        .status-bar #statusText.stopped { color: #ff4757; }

        #reopenFloater {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #00ff88;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 20px rgba(0,255,136,0.3);
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
        #reopenFloater:hover { transform: scale(1.1); background: #00cc6a; }
        #reopenFloater.show { display: flex; }

        @media (max-width: 500px) {
            #hackPanel { right: 10px; bottom: 10px; width: calc(100vw - 20px); border-radius: 14px; }
            #panelBody { padding: 14px; }
            .pwd-box { padding: 30px 25px; }
            .field-selector { flex-direction: column; align-items: stretch; }
            .action-buttons button { flex: 1 1 100%; }
        }
    `;
    document.head.appendChild(style);

    // ---------- CRIAÇÃO DOS ELEMENTOS HTML ----------
    // Overlay de senha
    const overlay = document.createElement('div');
    overlay.id = 'pwdOverlay';
    overlay.innerHTML = `
        <div class="pwd-box">
            <h1>🔐 PAINEL</h1>
            <p>Redação Paraná • Acesso restrito</p>
            <input type="password" id="pwdInput" placeholder="Digite a senha" autofocus>
            <button id="pwdBtn">Acessar Painel</button>
            <div class="err-msg" id="pwdError"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Painel principal
    const panel = document.createElement('div');
    panel.id = 'hackPanel';
    panel.innerHTML = `
        <div id="panelHeader">
            <h2>⌨️ Redação PR <small>autotyper</small></h2>
            <div class="header-actions">
                <button id="minimizePanelBtn" title="Minimizar">─</button>
                <button id="closePanelBtn" title="Fechar painel">✕</button>
            </div>
        </div>
        <div id="panelBody">
            <div>
                <label for="textToType">📝 Texto para digitar:</label>
                <textarea id="textToType" placeholder="Cole ou digite o texto aqui..."></textarea>
            </div>
            <div class="field-selector">
                <span style="color:#888; font-size:0.8rem;">🎯 Alvo:</span>
                <span id="targetDisplay">Nenhum campo selecionado</span>
                <button id="selectFieldBtn">Selecionar Campo</button>
            </div>
            <div class="speed-group">
                <label>⚡ Velocidade:</label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="normal" checked> <span>Normal</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="rapido"> <span>Rápido</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="extremo"> <span>Extremo</span>
                </label>
            </div>
            <div class="action-buttons">
                <button id="startBtn">▶ Iniciar</button>
                <button id="stopBtn">⏹ Parar</button>
                <button id="clearBtn">🗑 Limpar</button>
            </div>
            <div class="status-bar">
                Status: <span id="statusText">Aguardando...</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // Botão flutuante de reabrir
    const floater = document.createElement('button');
    floater.id = 'reopenFloater';
    floater.textContent = '🔓';
    floater.title = 'Abrir Painel';
    document.body.appendChild(floater);

    // ---------- REFERÊNCIAS DOS ELEMENTOS ----------
    const pwdOverlay = document.getElementById('pwdOverlay');
    const pwdInput = document.getElementById('pwdInput');
    const pwdBtn = document.getElementById('pwdBtn');
    const pwdError = document.getElementById('pwdError');

    const panelEl = document.getElementById('hackPanel');
    const panelHeader = document.getElementById('panelHeader');
    const closeBtn = document.getElementById('closePanelBtn');
    const minimizeBtn = document.getElementById('minimizePanelBtn');
    const floaterEl = document.getElementById('reopenFloater');

    const textToType = document.getElementById('textToType');
    const targetDisplay = document.getElementById('targetDisplay');
    const selectFieldBtn = document.getElementById('selectFieldBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusText = document.getElementById('statusText');

    // ---------- ESTADO ----------
    let targetElement = null;
    let isSelecting = false;
    let typingTimer = null;
    let stopFlag = false;
    let isPanelMinimized = false;

    function setStatus(msg, type = 'idle') {
        statusText.textContent = msg;
        statusText.className = type;
    }

    // ---------- SENHA ----------
    function checkPassword() {
        const pass = pwdInput.value.trim();
        if (pass === 'hack123') {
            pwdOverlay.classList.add('hidden');
            panelEl.classList.add('active');
            floaterEl.classList.remove('show');
            pwdError.textContent = '';
            pwdInput.value = '';
            setStatus('Pronto');
        } else {
            pwdError.textContent = '❌ Senha incorreta. Tente novamente.';
            pwdInput.value = '';
            pwdInput.focus();
        }
    }

    pwdBtn.addEventListener('click', checkPassword);
    pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPassword(); });

    // ---------- FECHAR / REABRIR ----------
    function closePanel() {
        panelEl.classList.remove('active');
        if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
        stopFlag = true;
        floaterEl.classList.add('show');
        setStatus('Painel fechado');
    }

    closeBtn.addEventListener('click', closePanel);
    floaterEl.addEventListener('click', function() {
        pwdOverlay.classList.remove('hidden');
        floaterEl.classList.remove('show');
        panelEl.classList.remove('active');
        pwdInput.value = '';
        pwdInput.focus();
        pwdError.textContent = '';
    });

    // ---------- MINIMIZAR ----------
    minimizeBtn.addEventListener('click', function() {
        const body = document.getElementById('panelBody');
        if (isPanelMinimized) {
            body.style.display = 'flex';
            minimizeBtn.textContent = '─';
            isPanelMinimized = false;
        } else {
            body.style.display = 'none';
            minimizeBtn.textContent = '⬜';
            isPanelMinimized = true;
        }
    });

    // ---------- ARRASTAR ----------
    let isDragging = false;
    let dragOffsetX = 0, dragOffsetY = 0;
    panelHeader.addEventListener('mousedown', function(e) {
        if (e.target.closest('button')) return;
        isDragging = true;
        const rect = panelEl.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        panelEl.style.cursor = 'grabbing';
    });

    function onDragMove(e) {
        if (!isDragging) return;
        let left = e.clientX - dragOffsetX;
        let top = e.clientY - dragOffsetY;
        left = Math.max(0, Math.min(window.innerWidth - panelEl.offsetWidth, left));
        top = Math.max(0, Math.min(window.innerHeight - panelEl.offsetHeight, top));
        panelEl.style.left = left + 'px';
        panelEl.style.top = top + 'px';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
    }

    function onDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        panelEl.style.cursor = '';
    }

    // ---------- SELEÇÃO DE CAMPO ----------
    function enableFieldSelection() {
        if (isSelecting) {
            isSelecting = false;
            selectFieldBtn.classList.remove('selecting');
            document.body.style.cursor = 'default';
            setStatus('Seleção cancelada');
            return;
        }
        isSelecting = true;
        selectFieldBtn.classList.add('selecting');
        document.body.style.cursor = 'crosshair';
        setStatus('Clique em um campo de texto na página...', 'idle');
    }

    selectFieldBtn.addEventListener('click', enableFieldSelection);

    document.addEventListener('click', function(e) {
        if (!isSelecting) return;
        if (e.target.closest('#hackPanel')) return;

        const el = e.target;
        const isInput = el.tagName === 'INPUT' && el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button';
        const isTextarea = el.tagName === 'TEXTAREA';
        const isContentEditable = el.getAttribute('contenteditable') === 'true';

        if (isInput || isTextarea || isContentEditable) {
            targetElement = el;
            let info = el.tagName.toLowerCase();
            if (el.id) info += '#' + el.id;
            if (el.name) info += ' [name="' + el.name + '"]';
            if (el.placeholder) info += ' (placeholder: "' + el.placeholder + '")';
            targetDisplay.textContent = info;
            targetDisplay.className = 'active-target';
            setStatus('Campo selecionado: ' + info, 'idle');

            isSelecting = false;
            selectFieldBtn.classList.remove('selecting');
            document.body.style.cursor = 'default';
            e.preventDefault();
            e.stopPropagation();
        } else {
            setStatus('❌ Clique em um INPUT, TEXTAREA ou contenteditable.', 'stopped');
        }
    });

    // ---------- LIMPAR ----------
    clearBtn.addEventListener('click', function() {
        textToType.value = '';
        setStatus('Texto limpo');
    });

    // ---------- INICIAR DIGITAÇÃO ----------
    startBtn.addEventListener('click', function() {
        if (!targetElement) {
            setStatus('❌ Selecione um campo primeiro!', 'stopped');
            return;
        }
        const text = textToType.value;
        if (!text || text.trim().length === 0) {
            setStatus('❌ Cole ou digite o texto no painel!', 'stopped');
            return;
        }

        if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
        stopFlag = false;

        const speedRadios = document.querySelectorAll('input[name="speed"]');
        let speedMs = 100;
        for (const r of speedRadios) {
            if (r.checked) {
                if (r.value === 'normal') speedMs = 100;
                else if (r.value === 'rapido') speedMs = 25;
                else if (r.value === 'extremo') speedMs = 3;
                break;
            }
        }

        targetElement.focus();
        if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
            targetElement.value = '';
        } else if (targetElement.getAttribute('contenteditable') === 'true') {
            targetElement.innerText = '';
        }

        let index = 0;
        const totalLength = text.length;
        setStatus(`▶ Digitando... (${speedMs}ms/char)`, 'typing');

        function typeNextChar() {
            if (stopFlag) {
                clearInterval(typingTimer);
                typingTimer = null;
                setStatus('⏹ Parado pelo usuário', 'stopped');
                return;
            }
            if (index > totalLength) {
                clearInterval(typingTimer);
                typingTimer = null;
                setStatus('✅ Digitação concluída!', 'idle');
                if (targetElement) {
                    targetElement.dispatchEvent(new Event('change', { bubbles: true }));
                    targetElement.dispatchEvent(new Event('blur', { bubbles: true }));
                }
                return;
            }

            const currentText = text.substring(0, index);
            if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
                targetElement.value = currentText;
            } else if (targetElement.getAttribute('contenteditable') === 'true') {
                targetElement.innerText = currentText;
                try {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(targetElement);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } catch (e) {}
            }

            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            targetElement.dispatchEvent(new Event('keydown', { bubbles: true }));
            targetElement.dispatchEvent(new Event('keypress', { bubbles: true }));
            targetElement.dispatchEvent(new Event('keyup', { bubbles: true }));

            if (targetElement.setSelectionRange && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
                try { targetElement.setSelectionRange(index, index); } catch (e) {}
            }

            index++;
        }

        typingTimer = setInterval(typeNextChar, speedMs);
    });

    // ---------- PARAR ----------
    stopBtn.addEventListener('click', function() {
        if (typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
        stopFlag = true;
        setStatus('⏹ Digitação interrompida', 'stopped');
    });

    // ---------- LIMPAR CAMPO SELECIONADO (duplo clique) ----------
    targetDisplay.addEventListener('dblclick', function() {
        targetElement = null;
        targetDisplay.textContent = 'Nenhum campo selecionado';
        targetDisplay.className = '';
        setStatus('Campo removido');
    });

    // ---------- CANCELAR SELEÇÃO COM ESC ----------
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isSelecting) {
            isSelecting = false;
            selectFieldBtn.classList.remove('selecting');
            document.body.style.cursor = 'default';
            setStatus('Seleção cancelada');
        }
    });

    // ---------- INÍCIO ----------
    setStatus('Aguardando ação');
    pwdInput.focus();
    console.log('🟢 Painel Redação Paraná carregado. Senha: hack123');
})();
