// ================================================================
// QUIZIZZ HACK PANEL - Compras + Mudança de Nome
// Senha: hack123
// (c) 2026
// ================================================================

(function() {
    'use strict';

    const CONFIG = {
        password: 'hack123',
        panelTitle: '🛒 Quizizz Shop Hack',
        panelSubtitle: 'auto-buy + rename'
    };

    // ---------- ESTILOS (mesmo padrão) ----------
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
            z-index: 999999;
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
        .pwd-box h1 { color: #ffcc00; font-size: 1.8rem; margin-bottom: 8px; }
        .pwd-box p { color: #aaa; margin-bottom: 25px; font-size: 0.9rem; }
        .pwd-box input {
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            border: 1px solid #444;
            background: #2a2a3a;
            color: #fff;
            font-size: 1rem;
            text-align: center;
            letter-spacing: 4px;
            outline: none;
        }
        .pwd-box input:focus { border-color: #ffcc00; }
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
            width: 420px;
            max-width: calc(100vw - 40px);
            background: #14141d;
            border-radius: 18px;
            border: 1px solid #2a2a40;
            box-shadow: 0 15px 50px rgba(0,0,0,0.8);
            z-index: 999998;
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
            font-size: 0.9rem;
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
            min-width: 120px;
        }
        #buyBtn { background: #ffcc00; color: #0b0b15; }
        #buyBtn:hover { background: #e6b800; transform: scale(1.02); }
        #renameBtn { background: #2a2a44; color: #fff; }
        #renameBtn:hover { background: #3d3d66; }
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
            z-index: 999997;
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
                <span class="label">💰 Dinheiro atual: </span>
                <span class="value" id="moneyDisplay">--</span>
            </div>
            <div class="info-box">
                <span class="label">👤 Nome atual: </span>
                <span class="value" id="nameDisplay">--</span>
            </div>
            <div class="action-buttons">
                <button id="buyBtn">🛒 Comprar Itens Caros</button>
                <button id="renameBtn">✏️ Mudar Nome</button>
            </div>
            <div id="statusText">Status: <span id="statusMessage">Pronto</span></div>
        </div>
    `;
    document.body.appendChild(panel);

    const floater = document.createElement('button');
    floater.id = 'reopenFloater';
    floater.textContent = '🛒';
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

    const moneyDisplay = document.getElementById('moneyDisplay');
    const nameDisplay = document.getElementById('nameDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const buyBtn = document.getElementById('buyBtn');
    const renameBtn = document.getElementById('renameBtn');

    // ---------- UTILITÁRIOS ----------
    function setStatus(msg) {
        statusMessage.textContent = msg;
    }

    // ---------- FUNÇÃO PARA PEGAR DINHEIRO ----------
    function getMoney() {
        // Tenta encontrar o elemento que mostra o dinheiro
        const selectors = [
            '.coins-amount',
            '.money-amount',
            '[data-cy="coins"]',
            '.currency-amount',
            '.balance'
        ];
        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                const txt = el.innerText.replace(/[^0-9]/g, '');
                if (txt) return parseInt(txt, 10) || 0;
            }
        }
        // Se não achar, tenta procurar por qualquer elemento com "coins" no texto
        const all = document.querySelectorAll('*');
        for (let el of all) {
            if (el.innerText && el.innerText.match(/\d+/) && el.innerText.toLowerCase().includes('coin')) {
                const num = parseInt(el.innerText.replace(/[^0-9]/g, ''), 10);
                if (num > 0) return num;
            }
        }
        return 0;
    }

    // ---------- FUNÇÃO PARA PEGAR NOME ATUAL ----------
    function getCurrentName() {
        const selectors = [
            '.profile-name',
            '.user-name',
            '[data-cy="username"]',
            '.username'
        ];
        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el.innerText.trim();
        }
        return 'Desconhecido';
    }

    // ---------- FUNÇÃO PARA ATUALIZAR DISPLAY ----------
    function updateDisplay() {
        const money = getMoney();
        moneyDisplay.textContent = money !== undefined ? money : '--';
        const name = getCurrentName();
        nameDisplay.textContent = name || '--';
    }

    // ---------- FUNÇÃO PARA ABRIR A LOJA ----------
    function openShop() {
        // Tenta clicar no botão da loja
        const shopSelectors = [
            '.shop-button',
            '.store-button',
            '[data-cy="shop"]',
            'a[href*="shop"]',
            'button:contains("Loja")',
            'button:contains("Shop")'
        ];
        for (let sel of shopSelectors) {
            let el;
            if (sel.includes(':contains')) {
                const text = sel.match(/:contains\("(.+?)"\)/)[1];
                const buttons = document.querySelectorAll('button, a');
                for (let b of buttons) {
                    if (b.innerText.toLowerCase().includes(text.toLowerCase())) {
                        el = b;
                        break;
                    }
                }
            } else {
                el = document.querySelector(sel);
            }
            if (el) {
                el.click();
                setStatus('🛒 Loja aberta');
                return true;
            }
        }
        // Se não achar, tenta navegar pela URL
        if (window.location.href.includes('quizizz.com')) {
            // Tenta ir para a loja mudando a URL (ex: /shop)
            // Mas é melhor não fazer isso para não perder o estado.
        }
        setStatus('❌ Não foi possível abrir a loja.');
        return false;
    }

    // ---------- FUNÇÃO PARA COMPRAR ITENS CAROS ----------
    function buyExpensiveItems() {
        setStatus('🔄 Iniciando compras...');

        // Abre a loja se necessário
        if (!document.querySelector('.shop-container, .store-container, [data-cy="shop-container"]')) {
            if (!openShop()) {
                setStatus('❌ Não foi possível acessar a loja.');
                return;
            }
            // Espera a loja carregar
            setTimeout(() => buyExpensiveItems(), 2000);
            return;
        }

        // Encontra todos os itens da loja
        const items = [];
        const itemElements = document.querySelectorAll('.shop-item, .store-item, .item-card, [data-cy="shop-item"]');
        for (let el of itemElements) {
            // Tenta extrair nome e preço
            const nameEl = el.querySelector('.item-name, .name, [data-cy="item-name"]');
            const priceEl = el.querySelector('.item-price, .price, [data-cy="item-price"]');
            const buyBtnEl = el.querySelector('button:contains("Comprar"), button:contains("Buy"), [data-cy="buy-button"]');

            if (nameEl && priceEl && buyBtnEl) {
                const name = nameEl.innerText.trim();
                const priceText = priceEl.innerText.replace(/[^0-9]/g, '');
                const price = parseInt(priceText, 10);
                if (price > 0) {
                    items.push({ element: el, name, price, buyButton: buyBtnEl });
                }
            }
        }

        // Se não encontrou itens com seletores, tenta uma abordagem mais ampla
        if (items.length === 0) {
            // Procura qualquer elemento que tenha um número (preço) e um botão de comprar
            const allElements = document.querySelectorAll('*');
            const potentialItems = [];
            for (let el of allElements) {
                // Verifica se o elemento tem um preço (texto com número)
                const text = el.innerText || '';
                const priceMatch = text.match(/(\d+)/);
                if (priceMatch) {
                    const price = parseInt(priceMatch[1], 10);
                    // Verifica se tem um botão de comprar dentro ou próximo
                    const buyBtn = el.querySelector('button') || el.closest('div')?.querySelector('button');
                    if (buyBtn && buyBtn.innerText.toLowerCase().includes('comprar') || buyBtn.innerText.toLowerCase().includes('buy')) {
                        // Tenta extrair nome do elemento
                        const nameEl = el.querySelector('.name') || el;
                        const name = nameEl.innerText.trim().substring(0, 30);
                        items.push({ element: el, name, price, buyButton: buyBtn });
                    }
                }
            }
        }

        if (items.length === 0) {
            setStatus('❌ Nenhum item encontrado na loja.');
            return;
        }

        // Ordena do mais caro para o mais barato
        items.sort((a, b) => b.price - a.price);

        let totalSpent = 0;
        let boughtCount = 0;
        let currentMoney = getMoney();

        // Função para comprar um item
        function buyItem(index) {
            if (index >= items.length) {
                setStatus(`✅ Compra finalizada! ${boughtCount} itens comprados. Total gasto: ${totalSpent}`);
                updateDisplay();
                return;
            }

            const item = items[index];
            currentMoney = getMoney();

            if (currentMoney < item.price) {
                setStatus(`⏹ Dinheiro insuficiente para ${item.name} (preço: ${item.price}). Encerrando.`);
                updateDisplay();
                return;
            }

            // Clica no botão de comprar
            item.buyButton.click();
            totalSpent += item.price;
            boughtCount++;
            setStatus(`🛒 Comprou: ${item.name} por ${item.price}. Saldo: ${currentMoney - item.price}`);

            // Aguarda um pouco e compra o próximo
            setTimeout(() => {
                buyItem(index + 1);
            }, 1500);
        }

        // Inicia a compra do primeiro item
        buyItem(0);
    }

    // ---------- FUNÇÃO PARA MUDAR NOME ----------
    function changeName() {
        setStatus('✏️ Tentando mudar nome...');

        // Abre o perfil/edição de nome
        const profileBtn = document.querySelector('.profile-button, .avatar-button, [data-cy="profile"]');
        if (profileBtn) profileBtn.click();

        // Espera o modal de edição abrir
        setTimeout(() => {
            // Procura o campo de nome
            const nameInput = document.querySelector('input[name="name"], input[placeholder*="name"], input[placeholder*="Nome"], [data-cy="username-input"]');
            if (!nameInput) {
                setStatus('❌ Campo de nome não encontrado.');
                return;
            }

            // Gera o próximo nome baseado em um contador salvo no localStorage
            let counter = parseInt(localStorage.getItem('quizizz_name_counter') || '0', 10);
            counter++;
            localStorage.setItem('quizizz_name_counter', counter);
            const newName = `hackedbeta${counter}`;

            // Altera o valor
            nameInput.value = newName;
            // Dispara eventos para garantir que o site perceba a mudança
            nameInput.dispatchEvent(new Event('input', { bubbles: true }));
            nameInput.dispatchEvent(new Event('change', { bubbles: true }));

            // Procura o botão de salvar/confirmar
            const saveBtn = document.querySelector('button:contains("Salvar"), button:contains("Save"), button:contains("Confirmar"), [data-cy="save-button"]');
            if (saveBtn) {
                saveBtn.click();
                setStatus(`✅ Nome alterado para ${newName}!`);
            } else {
                // Tenta enviar com Enter
                nameInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                setStatus(`⚠️ Nome alterado para ${newName} (sem confirmação visual).`);
            }

            updateDisplay();
        }, 1500);
    }

    // ---------- EVENTOS DOS BOTÕES ----------
    buyBtn.addEventListener('click', buyExpensiveItems);
    renameBtn.addEventListener('click', changeName);

    // ---------- SENHA ----------
    function checkPassword() {
        const pass = pwdInput.value.trim();
        if (pass === CONFIG.password) {
            pwdOverlay.classList.add('hidden');
            panelEl.classList.add('active');
            floaterEl.classList.remove('show');
            pwdError.textContent = '';
            pwdInput.value = '';
            setStatus('Painel ativo.');
            updateDisplay();
            // Atualiza a cada 5 segundos
            setInterval(updateDisplay, 5000);
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
        floaterEl.classList.add('show');
        setStatus('Painel fechado.');
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

    // ---------- ARRASTAR ----------
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
    console.log('🛒 Painel Quizizz Shop carregado. Senha: hack123');
    pwdInput.focus();
})();
